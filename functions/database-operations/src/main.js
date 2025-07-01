import { Client } from 'node-appwrite';
import DatabaseService from './db.js';

export default async ({ req, res, log, error }) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(req.headers['x-appwrite-key'] ?? '');

  const dbService = new DatabaseService(client, log, error);

  if (req.method === 'OPTIONS') {
    // Set CORS headers for preflight requests
		return res.send(null, 204, {
			'Access-Control-Allow-Origin': process.env.CORS_ORIGIN,
			'Access-Control-Allow-Methods': 'POST, GET, DELETE, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type'
		});
  }
  if(req.path === "/contacts") {
    if (req.method === "POST") {
      try {
        const { contacts } = req.bodyJson;
        if (!contacts || !Array.isArray(contacts)) {
          return res.json({ error: 'Invalid contacts data' }, 400);
        }

        const response = await dbService.upsertDocuments(contacts);
        return res.json(response, 200, {
          'Access-Control-Allow-Origin': process.env.CORS_ORIGIN
        });
      } catch (err) {
        return res.json({ error: err.message }, 500, {
          'Access-Control-Allow-Origin': process.env.CORS_ORIGIN
        });
      }
    }
    else if (req.method === "GET") {
      try {
        const response = await dbService.listDocuments();
        return res.json(response, 200, {
          'Access-Control-Allow-Origin': process.env.CORS_ORIGIN
        });
      } catch (err) {
        return res.json({ error: err.message }, 500, {
          'Access-Control-Allow-Origin': process.env.CORS_ORIGIN
        });
      }
    }
    else if (req.method === "DELETE") {
      try {
        if (req.query.id) {
          const response = await dbService.deleteDocument(req.query.id);
          return res.json(response, 200, {
            'Access-Control-Allow-Origin': process.env.CORS_ORIGIN
          });
        } else {
          const response = await dbService.deleteAllDocuments();
          return res.json(response, 200, {
            'Access-Control-Allow-Origin': process.env.CORS_ORIGIN
          });
        }
      } catch (err) {
        return res.json({ error: err.message }, 500, {
          'Access-Control-Allow-Origin': process.env.CORS_ORIGIN
        });
      }
    }
    else {
      return res.json({ error: 'Method Not Allowed' }, 405, {
        'Access-Control-Allow-Origin': process.env.CORS_ORIGIN
      });
    }
  }
  else {
    return res.json({ error: 'Not Found' }, 404, {
      'Access-Control-Allow-Origin': process.env.CORS_ORIGIN
    });
  }
};
