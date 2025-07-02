# Database Operations Function

## 🧰 Usage

This Appwrite function handles CRUD operations for the Personal CRM contacts database.

### GET /contacts

- Returns all contacts from the CRM database.

**Response**

Sample `200` Response:

```json
[
  {
    "$id": "contact_id",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1-555-0123",
    "notes": "Important client"
  }
]
```

### PUT /contacts

- Creates a new contact or updates an existing one (upsert operation).
- If a contact with the same email exists, it will be updated. Otherwise, a new contact is created.

**Request Body**

```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "+1-555-0456",
  "notes": "New lead from conference"
}
```

**Response**

Sample `201` Response (new contact):

```json
{
  "$id": "new_contact_id",
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "+1-555-0456",
  "notes": "New lead from conference"
}
```

Sample `200` Response (updated contact):

```json
{
  "$id": "existing_contact_id",
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "+1-555-0456",
  "notes": "Updated contact info"
}
```

### DELETE /contacts?id=:id

- Deletes a contact by ID.

**Response**

Sample `200` Response:

```json
{
  "$id": "contact_id",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1-555-0123",
  "notes": "Important client"
}
```

## ⚙️ Configuration

| Setting           | Value         |
| ----------------- | ------------- |
| Runtime           | Node (18.0)   |
| Entrypoint        | `src/main.js` |
| Build Commands    | `npm install` |
| Permissions       | `any`         |
| Timeout (Seconds) | 15            |

## 🔒 Environment Variables

| Variable | Description |
| -------- | ----------- |
| `DATABASE_ID` | CRM database ID |
| `COLLECTION_ID` | Contacts collection ID |
| `CORS_ORIGIN` | Pre-flight request URL origin |
