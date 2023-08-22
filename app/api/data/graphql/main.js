import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { getUsersTask, getUserByIdTask, createUserTask, updateUserByIdTask, deleteUserByIdTask } from './users/users';
import { getProductsTask, getProductByIdTask, createProductTask, updateProductByIdTask, deleteProductByIdTask } from './products/products';

const graphql = require('graphql');

const queryType = new graphql.GraphQLObjectType({
	name: 'Query',
	fields: {
		products: getProductsTask,
		product: getProductByIdTask,
		users: getUsersTask,
		user: getUserByIdTask
	}
});

const mutationType = new graphql.GraphQLObjectType({
	name: 'Mutation',
	fields: {
		createProduct: createProductTask,
		updateProduct: updateProductByIdTask,
		deleteProduct: deleteProductByIdTask,
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