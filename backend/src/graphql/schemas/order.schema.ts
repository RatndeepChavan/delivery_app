/**
 * * 📦 Order GraphQL Schema
 * ? Defines types, queries, mutations, and subscriptions for the order system.
 * ? Supports CRUD-like operations and real-time updates.
 * 
 * ! Keep schema aligned with resolvers & services.
 */
export const orderTypeDef = `#graphql
enum OrderStatus {
    Pending
    Accepted
    Out_for_delivery
    Delivered
}

type Order {
    id: ID!
    customerId: ID
    deliveryPartnerId: ID
    product: String
    quantity: Int
    location: String
    status: OrderStatus!
    createdAt: String
    updatedAt: String
}

input createOrder {
    product: String!
    quantity: Int!
    location: String!
}

input updateOrder {
    id: ID!
    status: OrderStatus!
}

# --- Queries ---
type Query {
    getCustomerOrders: [Order]!
    getDeliveryOrders: [Order]!
    getPendingOrders: [Order]!
    getOrderById(id: ID!): Order
}

# --- Mutations ---
type Mutation {
    createOrder(input: createOrder): Order!
    updateOrderStatus(input: updateOrder): Order!
}

# --- Subscriptions ---
type Subscription {
    orderCreated: Order
    orderUpdated: Order
}
`;
