<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Personal CRM - SvelteKit + Appwrite

This is a Personal CRM application built with SvelteKit and Appwrite. The project uses JavaScript (not TypeScript) and implements a no-auth approach with server-side API routes.

## Project Structure

- Uses SvelteKit with Vite
- Appwrite Node.js SDK for backend operations
- Server-side API routes in `/src/routes/api/`
- Global CSS styles in `/src/app.css`
- No authentication required (personal use)

## Key Implementation Details

- All Appwrite operations are handled server-side through API routes
- Uses the Node.js SDK, not the web SDK
- Environment variables are used for Appwrite configuration
- CRUD operations: Create, Read, Update, Delete contacts
- Modern responsive UI with gradient backgrounds

## Database Schema

Collection: `crm`

- `name` (string, required)
- `email` (string, required)
- `phone` (string, optional)
- `notes` (string, optional)

## Development Guidelines

- Use JavaScript, not TypeScript
- Follow SvelteKit conventions for API routes
- Server-side operations only for Appwrite
- Maintain responsive design patterns
- Use modern CSS with flexbox/grid layouts
