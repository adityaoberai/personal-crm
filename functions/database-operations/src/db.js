import { Databases, ID, Query } from 'node-appwrite';

class DatabaseService {
    constructor(client, log, error) {
        this.client = client;
        this.databases = new Databases(client);
        this.databaseId = process.env.APPWRITE_DATABASE_ID || 'db';
        this.collectionId = process.env.APPWRITE_COLLECTION_ID || 'crm';
        this.log = log;
        this.error = error;
    }
    
    async upsertDocuments(contacts) {
        try {
            const documents = contacts.map((contact) => ({
                $id: contact.$id || ID.unique(),
                name: contact.name,
                email: contact.email,
                phone: contact.phone,
                notes: contact.notes
            }));

            const response = await this.databases.upsertDocuments(this.databaseId, this.collectionId, documents);
            this.log('Documents upserted successfully:', response.documents.map(doc => doc.$id));
            return response;
        } catch (error) {
            this.error('Error upserting documents:', error);
            throw new Error('Failed to upsert documents');
        }
    }
    
    async deleteDocument(documentId) {
        try {
            const response = await this.databases.deleteDocument(this.databaseId, this.collectionId, documentId);
            this.log('Document deleted successfully:', documentId);
            return response;
        } catch (error) {
            this.error('Error deleting document:', error);
            throw new Error('Failed to delete document');
        }
    }
    
    async deleteAllDocuments() {
        try {
            const response = await this.databases.deleteDocuments(this.databaseId, this.collectionId);
            this.log('All documents deleted successfully.');
            return response;
        } catch (error) {
            this.error('Error deleting documents:', error);
            throw new Error('Failed to delete documents');
        }
    }
    
    async listDocuments() {
        try {
            const response = await this.databases.listDocuments(this.databaseId, this.collectionId, [ Query.limit(100) ]);
            this.log('Documents listed successfully.');
            return response;
        } catch (error) {
            this.error('Error listing documents:', error);
            throw new Error('Failed to list documents');
        }
    }
}

export default DatabaseService;