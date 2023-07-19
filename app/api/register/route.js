import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

const jwt = require ('jwt-simple');
const moment = require('moment');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const database = new sqlite3.Database("db/my.db");

const createUserTable = () => {
  const query = `
      CREATE TABLE IF NOT EXISTS users (
      id integer PRIMARY KEY,
      fullname text,
      password text,
      cellphone text,
      email text UNIQUE)`;
  return database.run(query);
}
createUserTable();

export async function POST(req, res) {
  const body = await req.json(); 
  const {fullname, cellphone, email, password} = body;
  const emailExists = await getUserEmail(email, password)
  if (emailExists){
    return NextResponse.json({"error": "Email already exists"}, { status: 401 });
  } else {
    const encryptedPassword = bcrypt.hashSync(password, 10);
    let user = await createUser(fullname, cellphone, email, encryptedPassword);
    if (user){
        console.log("User", user);
        user.token = createToken(user);
        return NextResponse.json(user)
    } else {
        return NextResponse.json({"error": "Error register user"}, { status: 403 });
    }
  }
}

function createToken(user){
  const payload = {
      userId: user.id,
      createdAt: moment().unix(),
      expiredAt: moment().add(5, 'minutes').unix()
  }

  return jwt.encode(payload, 'secret string')
}

function getUserEmail(email){
  return new Promise((resolve, reject) => {
    database.all("SELECT * FROM users WHERE email = (?);", [email], function (err, rows) {
      if (err) {
        reject({});
      }
      resolve(rows[0]);
    });
  });
}

function createUser(fullname, cellphone, email, password){
    return new Promise((resolve, reject) => {
        database.run('INSERT INTO users (fullname, password, cellphone, email) VALUES (?,?,?, ?);', [fullname, password, cellphone, email], (err) => {
            if (err) {
                reject(null);
            }
            database.get("SELECT last_insert_rowid() as id", (err, row) => {
                resolve({
                    id: row["id"],
                    fullname: fullname,
                    password: password,
                    cellphone: cellphone,
                    email: email
                });
            });
        });
    });
  }