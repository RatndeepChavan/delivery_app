import { gql } from "@apollo/client";

export const ORDER_WRITE_STATUS_FRAGMENT = gql`
    fragment UpdateStatus on Order {
        status
    }
`;

export const ORDER_WRITE_QUERY = gql`
    query writeOrder($id: ID!) {
        order(id: $id) {
            id
            location
            product
            quantity
            status
        }
    }
`;
