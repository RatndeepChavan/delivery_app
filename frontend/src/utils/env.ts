export const ENV = process.env.ENV;

export const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;
export const SERVER_PATH = ENV === "prod" ? process.env.PROD_SERVER : process.env.DEV_SERVER
export const CALLBACK_URL = ENV === "prod" ? process.env.PROD_CALLBACK_URL : process.env.DEV_CALLBACK_URL
