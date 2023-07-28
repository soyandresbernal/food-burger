import { NextResponse } from 'next/server';
import { getUserByEmail } from '../data/mongodb/users/users';
import { createToken } from '../common';

const bcrypt = require('bcryptjs');

export async function POST(req, res) {
	const body = await req.json();
	const { email, password } = body;
	const user = await getUserByEmail(email);
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