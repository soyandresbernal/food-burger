import {getUsers, getUserById, createUser, updateUserById, deleteUserById} from "../../mongodb/users/users";

const graphql = require('graphql');

export const UserType = new graphql.GraphQLObjectType({
	name: 'User',
	fields: {
		_id: { type: graphql.GraphQLID },
		fullname: { type: graphql.GraphQLString },
		password: { type: graphql.GraphQLString },
		cellphone: { type: graphql.GraphQLString },
		email: { type: graphql.GraphQLString }
	}
});

export const getUsersTask = {
    type: new graphql.GraphQLList(UserType),
    resolve: async (root, args, context, info) => {
        return getUsers();
    }
}

export const getUserByIdTask = {
    type: UserType,
    args: {
        _id: {
            type: new graphql.GraphQLNonNull(graphql.GraphQLID)
        }
    },
    resolve: async (root, { _id }, context, info) => {
        return getUserById(_id);
    }
}

export const createUserTask = {
    type: UserType,
    args: {
        fullname: {
            type: new graphql.GraphQLNonNull(graphql.GraphQLString)
        },
        password: {
            type: new graphql.GraphQLNonNull(graphql.GraphQLString)
        },
        cellphone: {
            type: new graphql.GraphQLNonNull(graphql.GraphQLString)
        },
        email: {
            type: new graphql.GraphQLNonNull(graphql.GraphQLString)
        }
    },
    resolve: async (root, { fullname, email, password, cellphone }) => {
        return createUser(fullname, email, password, cellphone);
    }
}

export const updateUserByIdTask = {
    type: UserType,
    args: {
        _id: {
            type: new graphql.GraphQLNonNull(graphql.GraphQLID)
        },
        fullname: {
            type: new graphql.GraphQLNonNull(graphql.GraphQLString)
        },
        password: {
            type: new graphql.GraphQLNonNull(graphql.GraphQLString)
        },
        cellphone: {
            type: new graphql.GraphQLNonNull(graphql.GraphQLString)
        },
        email: {
            type: new graphql.GraphQLNonNull(graphql.GraphQLString)
        }
    },
    resolve: async (root, { _id, fullname, password, cellphone, email }) => {
        return updateUserById(_id, fullname, email, password, cellphone);
    }
}

export const deleteUserByIdTask ={
    type: graphql.GraphQLString,
    args: {
        _id: {
            type: new graphql.GraphQLNonNull(graphql.GraphQLID)
        }
    },
    resolve: async (root, { _id }) => {
        return deleteUserById(_id);
    }
}