import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";

// This ensures variables are loaded the MOMENT this file is imported
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("MONGO_URI is undefined. Check your .env file.");
}

const client = new MongoClient(MONGO_URI);
const db = client.db();

export const auth = betterAuth({
  database: mongodbAdapter(db),
  baseURL: "http://localhost:3000",
  emailAndPassword: {
    enabled: true,
  },
});
