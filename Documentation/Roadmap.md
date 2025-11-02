======================================
KELLY BAND WEBSITE - PROJECT ROADMAP
======================================

### Current Technology Stack

*   **Frontend:**
    *   HTML5 & EJS (Embedded JavaScript Templating): For dynamic page rendering.
    *   Tailwind CSS: For styling and layout.
    *   Vanilla JavaScript: For client-side interactivity (e.g., mobile menu).

*   **Backend:**
    *   Node.js: JavaScript runtime environment.
    *   Express.js: Web framework for Node.js, handling routing and middleware.

*   **Database:**
    *   SQLite: For the contact form submission storage.

*   **Deployment & Server Environment:**
    *   OS: Linux (Arch Linux).
    *   Networking: Cloudflare Tunnel (`cloudflared`) for secure, outbound-only connections.
    *   Process Manager: PM2.
    *   SSL/TLS: Handled automatically by Cloudflare.

*   **Version Control:**
    *   Git & GitHub.

---

### Phase 1: Core Application Architecture & Build (Completed)

1.  **Project Initialization:**
    *   **1.1 [✓]** Set up Git repository and Node.js project (`npm init`).
    *   **1.2 [✓]** Installed core dependencies: `express`, `ejs`, `sqlite3`, `dotenv`.
    *   **1.3 [✓]** Installed development dependencies: `tailwindcss`, `postcss`, `autoprefixer`, `@tailwindcss/aspect-ratio`.
    *   **1.4 [✓]** Initialized Tailwind CSS configuration.

2.  **Backend & Server Structure:**
    *   **2.1 [✓]** Created `server.js` as the main application entry point.
    *   **2.2 [✓]** Implemented EJS as the view engine for dynamic HTML rendering.
    *   **2.3 [✓]** Established a robust routing system for all pages (Home, Music, Tour, Contact, Links).
    *   **2.4 [✓]** Configured middleware for serving static assets (`express.static`), parsing request bodies, and managing environment variables.
    *   **2.5 [✓]** Corrected middleware order to ensure static assets are served efficiently before dynamic routes.

3.  **Dynamic Features & Data Management:**
    *   **3.1 [✓]** Integrated `dotenv` to manage environment variables (`.env`) for sensitive data like admin credentials and server port.
    *   **3.2 [✓]** Implemented a SQLite database for persistent data storage.
    *   **3.3 [✓]** Created a fully functional contact form that saves submissions to the database.
    *   **3.4 [✓]** Built a password-protected `/admin/contacts` route using Basic Authentication to securely view form submissions.

3.  **Frontend Development with Tailwind:**
    *   **4.1 [✓]** Developed a templating structure using EJS partials (`header.ejs`, `navbar.ejs`, `footer.ejs`) for reusable components.
    *   **4.2 [✓]** Styled all pages using Tailwind CSS utility classes.
    *   **4.3 [✓]** Created an npm script (`watch:tailwind`) to automatically compile CSS during development.
    *   **4.4 [✓]** Implemented a new "Links" page with a full-screen video background.
    *   **4.5 [✓]** Implemented robust asset pathing by creating a global `baseURL` variable in Express, ensuring all images, videos, and stylesheets load correctly across different environments.

4.  **Local Testing:**
    *   **5.1 [✓]** Thoroughly tested all pages and functionality in a local development environment.

---

### Phase 2: Server Preparation & Deployment (Completed)

1.  **Linux Server Setup:**
    *   **1.1 [✓]** Set up Linux server environment.
    *   **1.2 [✓]** Hardened security and configured firewall.

2.  **Install Core Technologies:**
    *   **2.1 [✓]** Installed Node.js (via NVM) and PM2.

3.  **Networking & Security with Cloudflare:**
    *   **3.1 [✓]** Purchased a custom domain name.
    *   **3.2 [✓]** Created a Cloudflare account and configured the domain's nameservers to point to Cloudflare.
    *   **3.3 [✓]** Installed the `cloudflared` daemon on the Linux server.
    *   **3.4 [✓]** Created a persistent Cloudflare Tunnel, which establishes a secure outbound connection from the server to Cloudflare's network. This eliminates the need for port forwarding and protects the server's IP address.
    *   **3.5 [✓]** Configured the tunnel to route traffic for the domain to the local Node.js application (e.g., `localhost:3000`).
    *   **3.6 [✓]** Enabled Cloudflare's "Full (Strict)" SSL/TLS mode, ensuring end-to-end encryption for all traffic.

4.  **Production Deployment:**
    *   **4.1 [✓]** Cloned the Git repository onto the server.
    *   **4.2 [✓]** Installed production dependencies with `npm install`.
    *   **4.3 [✓]** Set up PM2 to manage the Node.js process and enable auto-start on server reboot.

5.  **Final Testing:**
    *   **5.1 [✓]** Accessed the live site via its domain and verified all functionality.
    *   **5.2 [✓]** Diagnosed and resolved environment-specific browser caching issues.

---

### Phase 3: Ongoing Maintenance & Updates

1.  **Regular Updates:**
    *   **1.1** Periodically update the OS, Node.js, and npm packages to maintain security and performance.

2.  **Backups:**
    *   **2.1** Implement a strategy to back up the application code and the SQLite database file.

3.  **Content Updates:**
    *   **3.1 [✓]** Established a deployment workflow:
        *   Push new changes to the GitHub repository from the local development machine.
        *   SSH into the live server.
        *   Navigate to the project directory.
        *   Run `git pull` to fetch the latest changes.
        *   Run `pm2 restart server` to apply the updates with zero downtime.
