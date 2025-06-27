# 🧾 Personal CRM — SvelteKit + Appwrite (No Auth)

A simple single-page personal CRM built with **SvelteKit** and **Appwrite**, with basic **CRUD** operations on a single collection. No login or auth required — ideal for personal or local use.

---

## 🚀 Tech Stack

- **Frontend:** SvelteKit
- **Backend SDK:** Appwrite Node.js SDK
- **Database:** Appwrite Cloud or Self-hosted

---

## 📦 Features

- ✅ List all contacts
- ✅ Add a new contact  
- ✅ Edit an existing contact
- ✅ Delete a contact
- ✅ Modern responsive UI
- ✅ No authentication required

---

## 📁 Project Structure

```
/src
├── /routes
│   ├── +page.svelte          # Main UI and CRUD logic
│   └── /api/contacts
│       └── +server.js        # API endpoints for CRUD operations
├── /lib
│   └── appwrite.js           # Appwrite client (Node.js SDK)
└── app.css                   # Global styles for the application
/.env                         # API credentials
```

---

## 🛠️ Appwrite Setup

1. **Create a project** on Appwrite Console.
2. **Create a Database** named `crm`.
3. **Create a Collection** named `contacts` with these attributes:
   - `name` → string (required)
   - `email` → string (required)
   - `phone` → string (optional)
   - `notes` → string (optional)
4. Under **Permissions**, set:
   - Read / Write / Update / Delete → `Role: Any` (for no-auth use)
5. **Create an API Key** with access to `crm` database and `contacts` collection.

---

## 🔐 Environment Setup

Create a `.env` file in the project root:

```env
APPWRITE_ENDPOINT=https://<REGION>.cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=your_project_id
APPWRITE_API_KEY=your_secret_api_key
APPWRITE_DATABASE_ID=db
APPWRITE_COLLECTION_ID=crm
```

---

## 🧪 Development

```bash
# Install dependencies
npm install

# Copy the environment template
cp .env.example .env

# Edit .env with your Appwrite credentials
# Then start the development server
npm run dev
```

The app will be available at `http://localhost:5173`

---

## 🌐 Deployment

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

---

## 📱 Screenshots

### Main Interface
- Clean, modern design with gradient background
- Responsive grid layout for contact cards
- Inline editing functionality
- Confirmation dialogs for deletions

### Features Demonstrated
- Add new contacts with required name/email fields
- Edit contacts inline with save/cancel options
- Delete contacts with confirmation
- Responsive design works on desktop and mobile

---

## 🔧 Configuration

### Appwrite Database Structure

**Database:** `db`
**Collection:** `crm`

**Attributes:**
```
name     | String  | Required | Size: 255
email    | Email   | Required |  
phone    | String  | Optional | Size: 25
notes    | String  | Optional | Size: 2000
```

**Permissions:**
- None (we use an API key instead)

### Environment Variables

| Variable | Description |
|----------|-------------|
| `APPWRITE_ENDPOINT` | Your Appwrite server endpoint |
| `APPWRITE_PROJECT_ID` | Your Appwrite project ID |
| `APPWRITE_API_KEY` | API key with database permissions |
| `APPWRITE_DATABASE_ID` | Database ID (default: "db") |
| `APPWRITE_COLLECTION_ID` | Collection ID (default: "crm") |

---

## 🚨 Security Note

This application is designed for **personal use only** and uses no authentication. All data is accessible to anyone with access to the application. For production use with multiple users, implement proper authentication and authorization.

---

## 📄 License

MIT License - feel free to use this for your personal CRM needs!
