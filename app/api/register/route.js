import { NextResponse } from 'next/server'
import { createUser, getUserByEmail } from '../data/mongodb/users/users';
import { createToken } from '../common';

const bcrypt = require('bcryptjs');

export async function POST(req, res) {
  const body = await req.json(); 
  const {fullname, cellphone, email, password} = body;
  const emailExists = await getUserByEmail(email, password)
  if (emailExists){
    return NextResponse.json({"error": "Email already exists"}, { status: 401 });
  } else {
    const encryptedPassword = bcrypt.hashSync(password, 10);
    let user = await createUser(fullname, email, encryptedPassword, cellphone);
    if (user){
        user.token = createToken(user);
        return NextResponse.json(user)
    } else {
        return NextResponse.json({"error": "Error register user"}, { status: 403 });
    }
  }
}
