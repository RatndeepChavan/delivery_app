import { gql } from "@apollo/client";

export const SIGNUP_MUTATION = gql`
	mutation Signup($input: signupInput!) {
		signup(input: $input) {
			user {
				id
			}
		}
	}
`;

export const LOGIN_MUTATION = gql`
	mutation Login($input: loginInput!) {
		login(input: $input) {
			token {
				accessToken
				refreshToken
			}
			user {
				email
				id
				name
				role
			}
		}
	}
`;

export const REFRESH_TOKEN_MUTATION = gql`
	mutation RefreshToken($refreshToken: String!) {
		refresh(refreshToken: $refreshToken) {
			token {
				accessToken
				refreshToken
			}
			user {
				email
				id
				name
				role
			}
		}
	}
`;

export const CREATE_ORDER_MUTATION = gql`
	mutation CreateOrder($input: createOrder) {
		createOrder(input: $input) {
			customerId
			deliveryPartnerId
			id
			location
			product
			quantity
			status
		}
	}
`;

export const UPDATE_ORDER_STATUS = gql`
	mutation UpdateOrderStatus($input: updateOrder) {
		updateOrderStatus(input: $input) {
			deliveryPartnerId
			id
			location
			customerId
			product
			quantity
			status
		}
	}
`;
