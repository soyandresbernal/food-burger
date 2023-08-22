import {getProducts, getProductById, createProduct, updateProductById, deleteProductById} from "../../mongodb/products/products";

const graphql = require('graphql');

export const ProductType = new graphql.GraphQLObjectType({
	name: 'Product',
	fields: {
		_id: { type: graphql.GraphQLID },
        title: { type: graphql.GraphQLString },
        description: { type: graphql.GraphQLString },
        img_url: { type: graphql.GraphQLString },
        price: { type: graphql.GraphQLFloat },
        featured: { type: graphql.GraphQLBoolean }
	}
});

export const getProductsTask = {
    type: new graphql.GraphQLList(ProductType),
    resolve: async (root, args, context, info) => {
        return getProducts();
    }
}

export const getProductByIdTask = {
    type: ProductType,
    args: {
        _id: {
            type: new graphql.GraphQLNonNull(graphql.GraphQLID)
        }
    },
    resolve: async (root, { _id }, context, info) => {
        return getProductById(_id);
    }
}

export const createProductTask = {
    type: ProductType,
    args: {
        title: {
            type: new graphql.GraphQLNonNull(graphql.GraphQLString)
        },
        description: {
            type: new graphql.GraphQLNonNull(graphql.GraphQLString)
        },
        img_url: {
            type: new graphql.GraphQLNonNull(graphql.GraphQLString)
        },
        price: {
            type: new graphql.GraphQLNonNull(graphql.GraphQLFloat)
        },
        featured: {
            type: new graphql.GraphQLNonNull(graphql.GraphQLBoolean)
        }
    },
    resolve: async (root, { title, description, img_url, price, featured }) => {
        return createProduct(title, description, img_url, price, featured);
    }
}

export const updateProductByIdTask = {
    type: ProductType,
    args: {
        _id: {
            type: new graphql.GraphQLNonNull(graphql.GraphQLID)
        },
        title: {
            type: new graphql.GraphQLNonNull(graphql.GraphQLString)
        },
        description: {
            type: new graphql.GraphQLNonNull(graphql.GraphQLString)
        },
        img_url: {
            type: new graphql.GraphQLNonNull(graphql.GraphQLString)
        },
        price: {
            type: new graphql.GraphQLNonNull(graphql.GraphQLFloat)
        },
        featured: {
            type: new graphql.GraphQLNonNull(graphql.GraphQLBoolean)
        }
    },
    resolve: async (root, { _id, title, description, img_url, price, featured }) => {
        return updateProductById(_id, title, description, img_url, price, featured);
    }
}

export const deleteProductByIdTask ={
    type: graphql.GraphQLString,
    args: {
        _id: {
            type: new graphql.GraphQLNonNull(graphql.GraphQLID)
        }
    },
    resolve: async (root, { _id }) => {
        return deleteProductById(_id);
    }
}