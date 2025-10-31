# KELLY Website Startup Instructions

To run the website locally for development, you need to have two processes running at the same time:

1.  The Node.js/Express server.
2.  The Tailwind CSS watcher that compiles your styles.

Open two separate terminal windows in the project's root directory (`KELLYWebsite`) and run the following commands.

---

### Terminal 1: Start the Web Server

```bash
npm start
```

### Terminal 2: Start the Tailwind CSS Watcher

```bash
npm run watch:tailwind
```