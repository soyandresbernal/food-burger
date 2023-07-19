import { NextResponse } from 'next/server';
const jwt = require('jwt-simple');
const moment = require('moment');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const database = new sqlite3.Database('db/my.db');

const createUserTable = () => {
	const query = `
      CREATE TABLE IF NOT EXISTS users (
      id integer PRIMARY KEY,
      fullname text,
      password text,
      cellphone text,
      email text UNIQUE)`;
	return database.run(query);
};
createUserTable();

export async function POST(req, res) {
	const body = await req.json();
	const { email, password } = body;
	const user = await getUserEmail(email);
	if (user) {
		const validatePassword = bcrypt.compareSync(password, user.password);
		if (validatePassword) {
			user.token = createToken(user);
			return NextResponse.json(user);
		} else {
			return NextResponse.json({ error: 'Wrong password' }, { status: 401 });
		}
	} else {
		return NextResponse.json(
			{ error: 'The email does not exists' },
			{ status: 404 }
		);
	}
}

const createToken = (user) => {
	const payload = {
		userId: user.id,
		createdAt: moment().unix(),
		expiredAt: moment().add(5, 'minutes').unix()
	};

	return jwt.encode(payload, 'secret string');
};

function getUserEmail(email) {
	return new Promise((resolve, reject) => {
		database.all(
			'SELECT * FROM users WHERE email = (?);',
			[email],
			function (err, rows) {
				if (err) {
					reject({});
				}
				resolve(rows[0]);
			}
		);
	});
}
