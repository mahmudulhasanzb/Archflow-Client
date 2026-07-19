import { betterAuth } from 'better-auth';
import { MongoClient } from 'mongodb';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { jwt } from 'better-auth/plugins';

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable');
}
const client = new MongoClient(uri);

const db = client.db();

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: 'string',
        defaultValue: 'user',
      },
      plan: {
        type: 'string',
        defaultValue: 'free',
      },
    },
  },
  plugins: [jwt()],
});
