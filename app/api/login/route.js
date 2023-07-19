import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

const jwt = require ('jwt-simple');
const moment = require('moment');
const sqlite3 = require('sqlite3').verbose();
const database = new sqlite3.Database("db/my.db");

export async function POST(req, res) {
  const body = await req.json(); 
  const {username, password} = body;
  const user = await getUser(username, password)
  if (user){
    user.token = createToken(user);
    return NextResponse.json(user)
  } else {
    return NextResponse.json({"error": "User not found"}, { status: 404 });
  }
}

const createToken = (user) => {
  const payload = {
      userId: user.id,
      createdAt: moment().unix(),
      expiredAt: moment().add(5, 'minutes').unix()
  }

  return jwt.encode(payload, 'secret string')
}

function getUser(username, password){
  return new Promise((resolve, reject) => {
    database.all("SELECT * FROM users WHERE username = (?) AND password = (?);", [username, password], function (err, rows) {
      if (err) {
        reject({});
      }
      resolve(rows[0]);
    });
  });
}