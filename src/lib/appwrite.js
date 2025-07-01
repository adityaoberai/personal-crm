// src/lib/appwrite.js
import { Account, Client } from 'node-appwrite';
import { env } from '$env/dynamic/private';

const client = new Client()
	.setEndpoint(env.APPWRITE_ENDPOINT)
	.setProject(env.APPWRITE_PROJECT_ID)
	.setKey(env.APPWRITE_API_KEY);

export const account = new Account(client);