// src/lib/appwrite.js
import { Client, Databases, ID } from 'node-appwrite';
import { env } from '$env/dynamic/private';

const client = new Client()
	.setEndpoint(env.APPWRITE_ENDPOINT)
	.setProject(env.APPWRITE_PROJECT_ID)
	.setKey(env.APPWRITE_API_KEY);

const databases = new Databases(client);

const databaseId = env.APPWRITE_DATABASE_ID || 'db';
const collectionId = env.APPWRITE_COLLECTION_ID || 'crm';

async function upsertDocuments(contacts) {
	try {
		const documents = contacts.map((contact) => ({
			$id: contact.$id || ID.unique(),
			name: contact.name,
			email: contact.email,
			phone: contact.phone,
			notes: contact.notes
		}));

		return await databases.upsertDocuments(databaseId, collectionId, documents);
	} catch (error) {
		console.error('Error upserting documents:', error);
		throw new Error('Failed to upsert documents');
	}
}

async function deleteDocument(id) {
	try {
		return await databases.deleteDocument(databaseId, collectionId, id);
	} catch (error) {
		console.error('Error deleting document:', error);
		throw new Error('Failed to delete document');
	}
}

async function deleteDocuments() {
	try {
		return await databases.deleteDocuments(databaseId, collectionId, []);
	} catch (error) {
		console.error('Error deleting documents:', error);
		throw new Error('Failed to delete documents');
	}
}

async function listDocuments() {
	try {
		return await databases.listDocuments(databaseId, collectionId);
	} catch (error) {
		console.error('Error fetching documents:', error);
		throw new Error('Failed to fetch documents');
	}
}

export const db = { upsertDocuments, deleteDocument, deleteDocuments, listDocuments };