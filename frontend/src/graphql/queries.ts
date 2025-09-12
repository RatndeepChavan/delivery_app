import { gql } from "@apollo/client";

export const GET_CUSTOMER_ORDERS = gql`
	query GetCustomerOrders {
		getCustomerOrders {
			id
			location
			product
			quantity
			status
		}
	}
`;

export const GET_ORDER_BY_ID = gql`
	query GetOrderById($id: ID!) {
		getOrderById(id: $id) {
			id
			product
			quantity
			location
			status
      createdAt
      updatedAt
		}
	}
`;

export const GET_PENDING_ORDERS = gql`
  query GetPendingOrders {
    getPendingOrders {
      id
      location
      product
      quantity
      status
    }
  }
`

export const GET_DELIVERY_ORDERS = gql`
  query GetDeliveryOrders {
    getDeliveryOrders {
      id
      customerId
      deliveryPartnerId
      product
      quantity
      location
      status
    }
  }
`
