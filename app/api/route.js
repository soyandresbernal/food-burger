import { NextResponse } from 'next/server';
import { graphqlHandler } from './data/graphql/main'

export async function GET(request) {
	return graphqlHandler(request);
}

export async function POST(req) {
	if (true) {//Add validateToken(req) to validate token
		return graphqlHandler(req);
	} else {
		return NextResponse.json({ error: 'Validate your token' }, { status: 401 });
	}
}
