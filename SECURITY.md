# Security Notes

This project is a static offline-first PWA. It does not use SQL, cookies, server-side sessions, or remote APIs by default.

## Included Client-Side Protections

- Content Security Policy in `index.html`.
- Safe rendering using `textContent` for user-entered product names, categories, descriptions, and report rows.
- Product images are restricted to image files and limited to 2MB.
- Local password stored as SHA-256 hash instead of plain text.
- No browser `alert`, `confirm`, or prompt for normal workflows; all confirmations use custom modals.
- No SQL database in this static version, so SQL injection does not apply locally.
- No cookie-based auth in this static version, so CSRF does not apply locally.
- Offline assets are cached with a service worker.

## Production Recommendations

Frontend-only security cannot stop all attacks when deployed publicly. For a stronger production setup:

1. Serve only through HTTPS.
2. Use Cloudflare or Hostinger firewall and rate limiting for DDoS mitigation.
3. Restrict access with server-level Basic Auth or a backend login if possible.
4. Keep backups outside the browser.
5. If adding a backend, use prepared statements/ORM for SQL injection protection, CSRF tokens for cookie sessions, server-side input validation, authorization checks, audit logging, and rate limiting.
6. Do not put admin secrets or database credentials in frontend JavaScript.

## Data Storage

The app stores data in browser localStorage. Clearing browser data removes records. Use Backup JSON regularly or add a backend database for multi-device production use.
