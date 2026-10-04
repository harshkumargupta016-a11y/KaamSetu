# KaamSetu backend

KaamSetu now includes an Express API, MySQL JSON storage, browser-side offline submission queueing, Gemini risk screening, and a protected admin review/export interface.

## Requirements

- Node.js 20 or newer
- MySQL 5.7.8+ (or a compatible MySQL release with the native `JSON` column type)
- A Gemini API key

## Run locally

1. Create the database and a least-privilege database user:

   ```sql
   CREATE DATABASE kaamsetu CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   CREATE USER 'kaamsetu'@'localhost' IDENTIFIED BY 'use-a-strong-password';
   GRANT SELECT, INSERT, UPDATE, CREATE ON kaamsetu.* TO 'kaamsetu'@'localhost';
   ```

2. Copy `.env.example` to `.env`. Set the MySQL credentials, admin ID/password, a random `SESSION_SECRET` of at least 32 bytes, and `GEMINI_API_KEY`. Keep `.env` private and out of source control.
3. Install dependencies and start the server:

   ```sh
   npm install
   npm start
   ```

4. Open `http://localhost:3000`. The service worker caches the app shell; browser submissions are stored in IndexedDB and retried when connectivity returns.

## Data flow

- Profile saves, job posts, applications, complaints, and scanner summaries are queued locally with a UUID. The queue is deleted only after the API confirms receipt; duplicate retries are idempotent.
- The server screens each new record with Gemini before storing it. A Gemini/API failure leaves the browser copy queued for retry; it is not represented as verified.
- MySQL `submissions.payload` and `submissions.verification` are native JSON columns. Each accepted or reviewed record is also written as an individual JSON file under `DATA_DIR/records/` (default: `./data/records/`).
- After screening, a record enters the admin portal as **awaiting admin review** with Gemini risk, flags, and summary. Gemini is advisory—not identity or factual verification—and only an authenticated human admin can approve or reject.
- The **Gemini reviews** admin tab provides a JSON download of all records at `/api/admin/export.json`.

The JSON files are additional exports, not a replacement for MySQL. For production, put `DATA_DIR` on durable, access-controlled storage, back up MySQL and the JSON exports, use HTTPS, and rotate admin/Gemini credentials. Company and job-seeker login remain prototype-only; add real user authentication and authorization before handling real user accounts or publishing jobs.

## API overview

- `GET /api/health` — database connectivity status.
- `GET /api/jobs` — jobs approved by an admin.
- `POST /api/submissions` — validate, Gemini-screen, persist, and archive an offline submission.
- `POST /api/admin/session` — exchange configured admin credentials for an 8-hour signed bearer token.
- `GET /api/admin/submissions` — list submissions (admin bearer token required).
- `PATCH /api/admin/submissions/:id` — set `status` to `approved` or `rejected`, with an optional review note.
- `GET /api/admin/export.json` — download all submissions as JSON (admin bearer token required).

The Gemini API key is used only by the server and is never shipped to the browser.

## Tests

Run `npm test` for backend validation and admin-token tests.
