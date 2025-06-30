import { db } from '$lib/appwrite.js';
import { ID, Query } from 'node-appwrite';
import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

// GET - List all contacts
export async function GET() {
	try {
		const response = await db.listDocuments();
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

		const response = await db.upsertDocuments(contacts);
		return json(response);
	} catch (error) {
		console.error('Error upserting contacts:', error);
		return json({ error: 'Failed to upsert contacts' }, { status: 500 });
	}
}

// DELETE - Delete contacts
export async function DELETE({ request }) {
	try {
		const { id } = await request.json();

		let response;
		if (id) {
			// Single contact ID provided - use deleteDocument
			response = await db.deleteDocument(id);
		} else {
			// No ID provided - delete all documents
			response = await db.deleteDocuments();
		}
		return json(response);
	} catch (error) {
		console.error('Error deleting contacts:', error);
		return json({ error: 'Failed to delete contacts' }, { status: 500 });
	}
}
