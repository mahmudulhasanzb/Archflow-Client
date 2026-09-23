import { betterAuth } from 'better-auth';
import { MongoClient } from 'mongodb';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { jwt } from 'better-auth/plugins';
import { sendVerificationEmail } from './email';

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable');
}
const client = new MongoClient(uri);

export const db = client.db('archflow');

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins: [
    process.env.BETTER_AUTH_URL || '',
    process.env.NEXT_PUBLIC_APP_URL || '',
    'https://archflow-web-ai.vercel.app',
  ].filter(Boolean),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,
    autoSignInAfterVerification: true,
    async sendVerificationEmail({ user, url, token }) {
      await sendVerificationEmail(user.email, url);
      // console.log('\n============================');
      // console.log('Sending verification email to', user.email);
      // console.log('Verification URL:', url);
      // console.log('============================\n');
    },
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
