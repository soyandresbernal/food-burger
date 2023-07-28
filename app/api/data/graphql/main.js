import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { getUsersTask, getUserByIdTask, createUserTask, updateUserByIdTask, deleteUserByIdTask } from './users/users';

const graphql = require('graphql');

const queryType = new graphql.GraphQLObjectType({
	name: 'Query',
	fields: {
		users: getUsersTask,
		user: getUserByIdTask
	}
});

const mutationType = new graphql.GraphQLObjectType({
	name: 'Mutation',
	fields: {
		createUser: createUserTask,
		updateUser: updateUserByIdTask,
		deleteUser: deleteUserByIdTask
	}
});

const schema = new graphql.GraphQLSchema({
	query: queryType,
	mutation: mutationType
});

const server = new ApolloServer({
	schema
});

export const graphqlHandler = startServerAndCreateNextHandler(server);