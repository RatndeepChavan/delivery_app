/**
 * * 🔐 Authentication GraphQL Schema
 * ? Defines types, inputs, and mutations for authentication system.
 * ? Includes User model, JWT token handling, and signup/login/refresh mutations.
 * 
 * ! Keep schema in sync with resolvers & services.
 */
export const authTypeDef = `#graphql
enum UserRole {
    Customer
    Delivery
}

type User {
    id: ID!
    email: String!
    name: String!
    role: UserRole!
    createdAt: String!
    updatedAt: String!
}

type Token {
    accessToken: String!
    refreshToken: String!
}

type AuthPayload {
    token: Token!
    user: User!
}

input loginInput {
    email: String! 
    password: String!
}

input signupInput {
    email: String!
    name: String!
    password: String!
    role: UserRole!
    repeatPassword: String!
}

type Mutation {
    signup(input: signupInput): Token
    login(input: loginInput): AuthPayload!
    refresh(refreshToken: String!): AuthPayload!
}
`;
