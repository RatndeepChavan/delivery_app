import { gql } from "@apollo/client"

export const ORDER_CREATED = gql`
    subscription OrderCreated {
        orderCreated {
            id
            location
            product
            quantity
            status
        }
    }
`

export const ORDER_UPDATED = gql`
    subscription OrderUpdated {
        orderUpdated {
            id
            customerId
            deliveryPartnerId
            status
        }
    }
`