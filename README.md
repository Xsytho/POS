# Point Of Sale

Professional offline-first Point of Sale for small businesses.

## Main modules

- **Dashboard**: today sales, today expenses, professional net summary, product count, low stock, out of stock, inventory watchlist, and recent transactions.
- **Point of Sale**: product images, product cards, cart, quantity controls, total quantity, total items, and total amount.
- **Products**: add product with image, category, price, stock quantity, and low-stock alert level.
- **Expenses**: daily expense records with date, description, and price.
- **Reports**: calendar from-to filters, daily sales, daily expenses, net, running sales, running expenses, sales records, and Excel export.
- **Settings**: password security, offline data storage notice, wipe local data, POS logo upload/remove, business name, accent color, and dark mode toggle in the top bar.

## Offline behavior

This project is a PWA. After the owner opens it once while online, the service worker caches the app files. The app can then open and run without internet.

Data is saved on the device using browser local storage:

- Products
- Product images
- Cart
- Sales
- Expenses
- Reports data
- Password hash
- Design settings

Important: because data is stored on the device, do not clear browser site data unless you intentionally want to reset the POS.

## Stock behavior

When a sale is completed from the Point of Sale screen:

1. The sale is recorded.
2. Product stock is automatically deducted by the quantity sold.
3. Dashboard and reports update immediately.
4. If a sale record is deleted, the product stock is restored.

## Deployment on Hostinger

1. Extract the ZIP file.
2. Upload the contents of the `offline-pos-pro` folder to `public_html` or to a subdomain folder.
3. Open your domain once online, for example `https://yourdomain.com`.
4. On mobile, use **Add to Home Screen** to install it like an app.

## Login

First launch: create your own password. No owner-created password is included.

Change it immediately in **Settings > Security**.

## Security notes

This is a client-only offline PWA. It includes:

- Content Security Policy in `index.html`
- Safe DOM rendering for user data
- No SQL database, so SQL injection is not applicable in this offline-only version
- No external scripts or CDN dependencies
- Local SHA-256 password hash
- Modal-based confirmations instead of browser alerts

For stronger production protection on Hostinger, enable HTTPS, strong hosting password, file permissions, backups, and Cloudflare or Hostinger firewall/rate limiting.


## V3 UI Update
- Removed Daily Sales Trend and Category Performance charts from Reports.
- Reports now focus on the requested table: Date, Daily Sales, Daily Expenses, Running Sales, and Running Expenses.
- Desktop and tablet layouts keep the sidebar visible; the burger menu appears only on small mobile screens.
- Data remains saved locally on the device for offline use after the app is opened once online.


## V4/V6 Professional Update
- Added calendar-style From and To date filters in Reports.
- Added Net to report summary and report table.
- Removed unnecessary report charts so the report focuses on the owner-requested daily sales/expenses/running totals.
- Added POS logo control in Settings so the owner can update branding without editing code.
- Design controls remain owner-friendly: logo, business/app name, and accent color.


## V5 Inventory Notification Update

- Added a professional inventory notification button beside the dark mode toggle.
- Notification badge shows the combined count of low stock and out of stock products.
- Clicking the notification opens a modal with grouped Low Stock and Out of Stock details.
- No browser alerts are used; all notices remain modal-based.


## V6 Update
- Inventory notification is now a clean dropdown beside Dark Mode.
- Low stock appears in yellow; out of stock appears in red.
- Dropdown works offline and updates live from local device data.


## V12 update
All displayed report, sales, expense, and exported Excel dates are shown in full readable format, for example May 3, 2026. Date inputs still use calendar controls for accurate filtering.
