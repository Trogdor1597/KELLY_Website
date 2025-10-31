======================================
KELLY BAND WEBSITE - PROJECT ROADMAP
======================================

### Full Development Stack

*   **Frontend:**
    *   HTML5: For structuring the content.
    *   Tailwind CSS: For styling and layout.
    *   JavaScript: For interactive elements.

*   **Backend:**
    *   Node.js: JavaScript runtime environment.
    *   Express.js: Web framework for Node.js.

*   **Database (Optional):**
    *   MongoDB (NoSQL) or SQLite (File-based SQL) for dynamic content like event listings or a blog.

*   **Deployment & Server Environment:**
    *   OS: Linux (e.g., Ubuntu Server).
    *   Web Server/Reverse Proxy: Nginx.
    *   Process Manager: PM2.
    *   DDNS Client: No-IP DUC (Dynamic Update Client).
    *   SSL/TLS: Let's Encrypt with Certbot.

*   **Version Control:**
    *   Git & GitHub/GitLab.

---

### Phase 1: Local Development & Core Website Build

1.  **Project Initialization:**
    *   1.1 Set up Git repository.
    *   1.2 Initialize Node.js project (`npm init`).
    *   1.3 Install dev dependencies: Express and Tailwind CSS (`npm install express` and `npm install -D tailwindcss postcss autoprefixer`).
    *   1.4 Initialize Tailwind CSS (`npx tailwindcss init -p`). This creates `tailwind.config.js` and `postcss.config.js`.

2.  **Basic Express Server:**
    *   2.1 Create `server.js` to run the Express app.
    *   2.2 Define routes for pages (Home, About, Music, etc.).
    *   2.3 Configure Express to serve static files (HTML, CSS, JS, images) from a `public` folder.

3.  **Frontend Development with Tailwind:**
    *   3.1 Configure `tailwind.config.js` to watch your HTML/JS files for classes.
    *   3.2 Create a source CSS file (e.g., `src/input.css`) and add the Tailwind directives.
    *   3.3 Add an npm script in `package.json` to run the Tailwind CLI, which will watch `input.css` and build your `public/output.css` file automatically as you make changes.
    *   3.4 Create your HTML files inside the `public` folder (or a source folder that gets processed).
    *   3.5 Style your HTML using Tailwind's utility classes.
    *   3.6 Add client-side JavaScript for interactivity.

4.  **Database Integration (If Needed):**
    *   4.1 Install database driver (e.g., `mongoose`, `sqlite3`).
    *   4.2 Create API endpoints in Express to manage data.
    *   4.3 Use `fetch` in frontend JS to get data from the API.

5.  **Local Testing:**
    *   5.1 Test all pages and functionality on `localhost`.

---

### Phase 2: Server Preparation & DDNS Setup

1.  **Linux Server Setup:**
    *   1.1 Install Linux OS and perform system updates.
    *   1.2 Harden security (new user, SSH keys, firewall `ufw`).

2.  **Install Node.js on Server:**
    *   2.1 Use NVM (Node Version Manager) to install the latest LTS version of Node.js.

3.  **DDNS Client Setup (No-IP):**
    *   3.1 Register a hostname with No-IP.
    *   3.2 Install and configure the No-IP Dynamic Update Client (DUC) on the server.
    *   3.3 Ensure the DUC runs on boot.

4.  **Router Port Forwarding:**
    *   4.1 Log in to your router.
    *   4.2 Forward incoming traffic on Port 80 (HTTP) and Port 443 (HTTPS) to your Linux server's internal IP address.

---

### Phase 3: Deployment & Production Setup

1.  **Code Transfer:**
    *   1.1 Clone your Git repository onto the server.

2.  **Install Dependencies:**
    *   2.1 Run `npm install` in the project directory on the server.

3.  **Process Management with PM2:**
    *   3.1 Install PM2 globally (`sudo npm install -g pm2`).
    *   3.2 Start the app with `pm2 start server.js`.
    *   3.3 Configure PM2 to auto-start on server reboot (`pm2 startup`).

4.  **Reverse Proxy Setup (Nginx):**
    *   4.1 Install Nginx.
    *   4.2 Create an Nginx server block to proxy requests from port 80 to your Node.js app (e.g., port 3000).
    *   4.3 Enable the new site configuration and restart Nginx.

5.  **SSL Certificate with Let's Encrypt (HTTPS):**
    *   5.1 Install Certbot and the Nginx plugin.
    *   5.2 Run Certbot to automatically obtain an SSL certificate and configure Nginx for HTTPS.
    *   5.3 Verify the certificate auto-renewal is active.

6.  **Final Testing:**
    *   6.1 Access your site via `https://yourband.ddns.net` and verify everything works.

---

### Phase 4: Maintenance & Updates

1.  **Regular Updates:**
    *   Periodically update the OS, Node.js, and npm packages.

2.  **Backups:**
    *   Implement a strategy to back up code and data.

3.  **Content Updates:**
    *   Use a `git pull` workflow on the server to deploy new changes.
    *   Restart the app with `pm2 restart <app_name>`.
