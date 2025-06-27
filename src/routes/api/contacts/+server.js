import { databases } from '$lib/appwrite.js';
import { ID } from 'node-appwrite';
import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

const databaseId = env.APPWRITE_DATABASE_ID || 'db';
const collectionId = env.APPWRITE_COLLECTION_ID || 'crm';

// GET - List all contacts
export async function GET() {
	try {
		const response = await databases.listDocuments(databaseId, collectionId);
		return json(response.documents);
	} catch (error) {
		console.error('Error fetching contacts:', error);
		return json({ error: 'Failed to fetch contacts' }, { status: 500 });
	}
}

// POST - Upsert multiple contacts (create or update)
export async function POST({ request }) {
	try {
		const { contacts } = await request.json();

		// Prepare documents for upsert
		const documents = contacts.map((contact) => ({
			$id: contact.$id || ID.unique(),
			name: contact.name,
			email: contact.email,
			phone: contact.phone,
			notes: contact.notes
		}));

		const response = await databases.upsertDocuments(databaseId, collectionId, documents);
		return json(response);
	} catch (error) {
		console.error('Error upserting contacts:', error);
		return json({ error: 'Failed to upsert contacts' }, { status: 500 });
	}
}

// DELETE - Delete a contact
export async function DELETE({ request }) {
	try {
		const { id } = await request.json();
		await databases.deleteDocument(databaseId, collectionId, id);
		return json({ success: true });
	} catch (error) {
		console.error('Error deleting contact:', error);
		return json({ error: 'Failed to delete contact' }, { status: 500 });
	}
}
