import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { NextResponse } from 'next/server'

const jwt = require ('jwt-simple');
const sqlite3 = require('sqlite3').verbose();
const moment = require('moment');
const graphql = require("graphql");
const database = new sqlite3.Database("db/my.db");

const createUserTable = () => {
    const query = `
        CREATE TABLE IF NOT EXISTS users (
        id integer PRIMARY KEY,
        username text,
        password text,
        email text UNIQUE)`;
    return database.run(query);
}
createUserTable();

const UserType = new graphql.GraphQLObjectType({
    name: "User",
    fields: {
        id: { type: graphql.GraphQLID },
        username: { type: graphql.GraphQLString },
        password: { type: graphql.GraphQLString },
        email: { type: graphql.GraphQLString }   
    }
});

var queryType = new graphql.GraphQLObjectType({
    name: 'Query',
    fields: {
        users: {
            type: new graphql.GraphQLList(UserType),
            resolve: (root, args, context, info) => {
                return new Promise((resolve, reject) => {

                    database.all("SELECT * FROM users;", function (err, rows) {
                        if (err) {
                            reject([]);
                        }
                        resolve(rows);
                    });
                });

            }
        },
        user: {
            type: UserType,
            args: {
                id: {
                    type: new graphql.GraphQLNonNull(graphql.GraphQLID)
                }
            },
            resolve: (root, {
                id
            }, context, info) => {
                return new Promise((resolve, reject) => {

                    database.all("SELECT * FROM users WHERE id = (?);", [id], function (err, rows) {
                        if (err) {
                            reject(null);
                        }
                        resolve(rows[0]);
                    });
                });
            }
        }
    }
});

var mutationType = new graphql.GraphQLObjectType({
    name: 'Mutation',
    fields: {
        createUser: {
            type: UserType,
            args: {
                username: {
                    type: new graphql.GraphQLNonNull(graphql.GraphQLString)
                },
                password: {
                    type: new graphql.GraphQLNonNull(graphql.GraphQLString)
                },
                email: {
                    type: new graphql.GraphQLNonNull(graphql.GraphQLString)
                }
            },
            resolve: (root, {
                username,
                password,
                email
            }) => {
                return new Promise((resolve, reject) => {
                    database.run('INSERT INTO users (username, password, email) VALUES (?,?,?);', [username, password, email], (err) => {
                        if (err) {
                            reject(null);
                        }
                        database.get("SELECT last_insert_rowid() as id", (err, row) => {

                            resolve({
                                id: row["id"],
                                username: username,
                                password: password,
                                email: email
                            });
                        });
                    });
                })

            }
        },
        updateUser: {
            type: graphql.GraphQLString,
            args: {
                id: {
                    type: new graphql.GraphQLNonNull(graphql.GraphQLID)
                },
                username: {
                    type: new graphql.GraphQLNonNull(graphql.GraphQLString)
                },
                password: {
                    type: new graphql.GraphQLNonNull(graphql.GraphQLString)
                },
                email: {
                    type: new graphql.GraphQLNonNull(graphql.GraphQLString)
                }
            },
            resolve: (root, {
                id,
                username,
                password,
                email
            }) => {
                return new Promise((resolve, reject) => {
                    database.run('UPDATE users SET username = (?), password = (?), email = (?) WHERE id = (?);', [username, password, email, id], (err) => {
                        if (err) {
                            reject(err);
                        }
                        resolve(`User #${id} updated`);

                    });
                })
            }
        },
        deleteUser: {
            type: graphql.GraphQLString,
            args: {
                id: {
                    type: new graphql.GraphQLNonNull(graphql.GraphQLID)
                }
            },
            resolve: (root, {
                id
            }) => {
                return new Promise((resolve, reject) => {
                    database.run('DELETE from users WHERE id =(?);', [id], (err) => {
                        if (err) {
                            reject(err);
                        }
                        resolve(`User #${id} deleted`);

                    });
                })

            }
        }
    }
});

const schema = new graphql.GraphQLSchema({
    query: queryType,
    mutation: mutationType
});


const server = new ApolloServer({
    schema
});

const handler = startServerAndCreateNextHandler(server);

export async function GET(request) {
    return handler(request);
}

export async function POST(req) {
    if (validateToken(req)){
        return handler(req);
    } else {
        return NextResponse.json({error: 'Validate your token'}, { status: 401 })
    }

}

function validateToken(req) {
    const userToken = req.headers.get('user-token');
    if (!userToken) {
        return false;
    }

    let payload = {}
    try {
        payload = jwt.decode(userToken, 'secret string');
    }
    catch (err) {
        return false;
    };
  
    if (payload.expiredAt < moment().unix()){
        return false;
    };

    return true
  }