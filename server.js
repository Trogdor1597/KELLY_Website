require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const path = require('path'); // Node.js module for working with file paths
const sqlite3 = require('sqlite3').verbose(); // Use .verbose() for more detailed error logging

const app = express();
const port = process.env.PORT || 3000;

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Middleware to parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));
// Middleware to parse JSON bodies
app.use(express.json());

// Make a baseURL variable available in all EJS templates
app.use((req, res, next) => {
  res.locals.baseURL = ''; // Use an empty string for root-relative paths
  next();
});

// Serve all static files (CSS, JS, images, etc.) from the 'public' directory.
// This should be placed BEFORE your route definitions.
app.use(express.static(path.join(__dirname, 'public')));

// --- Authentication Middleware ---
const basicAuth = (req, res, next) => {
  const user = process.env.ADMIN_USERNAME || 'admin';
  const pass = process.env.ADMIN_PASSWORD;

  if (!pass) {
    console.error("ADMIN_PASSWORD environment variable not set.");
    return res.status(500).send("Server configuration error.");
  }

  const auth = { login: user, password: pass };

  const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
  const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':');

  if (login && password && login === auth.login && password === auth.password) {
    // Access granted
    return next();
  }

  // Access denied
  res.set('WWW-Authenticate', 'Basic realm="401"');
  res.status(401).send('Authentication required.');
};


// --- Database Setup ---
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the SQLite database.');
});

// Create the contacts table if it doesn't already exist
db.run(`CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT,
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

// Define a route for the homepage
app.get('/', (req, res) => {
  // Render the index.ejs template
  res.render('index', { title: 'Home', currentPage: 'home' });
});

// Define a route for the music page
app.get('/music', (req, res) => {
  const masterStreamLink = '/links';
  const songs = [
    {
      title: 'DFD (Danger-Fighting Demons)',
      releaseDate: '2025-10-31', // Standardized date format for sorting
      description: "Danger-Fighting Demons is KELLY's debut single. The song synthesizes the band's influences into one cohesive sound: a hardcore, fast, emo track that serves as an ode to the originals who inspired them to become the musicians they are today.",
      coverArtUrl: '/content/photos/dfd_cover.jpg'
    }
    // Add more song objects here in the future
  ];

  // Sort songs by release date, newest first
  songs.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));

  res.render('music', { title: 'Music', currentPage: 'music', songs: songs, masterStreamLink: masterStreamLink });
});

// Define a route for the tour page
app.get('/tour', (req, res) => {
  const shows = [
    {
      date: '2025-11-29',
      title: 'NoodleFest 2025',
      location: '707 Coffee House',
      address: '707 S Alamo Rd, Alamo, Texas 78516',
      description: 'Noodlefest is a food festival that not only brings the most prestigious noodle eaters, but pair it with some of the best of up-and-coming musicians from across the state, and you got yourself one extraordinary festival. We are honored to be bringing back to the Rio Grande Valley, the 8th annual Noodlefest to 707 Coffeehouse, Saturday, November 29th, 2025. Come for the food but stay for the music.',
      imageUrl: '/content/photos/flyers/noodlefest2025.png',
      ticketLink: 'https://www.abunnyproduct.com/',
    }
  ];

  const now = new Date();
  const upcomingShows = shows.filter(show => show.date && new Date(show.date) >= now).sort((a, b) => new Date(a.date) - new Date(b.date));
  const pastShows = shows.filter(show => new Date(show.date) < now).sort((a, b) => new Date(b.date) - new Date(a.date));

  res.render('tour', { title: 'Tour', currentPage: 'tour', upcomingShows, pastShows });
});

// Define a route for the merch page
app.get('/merch', (req, res) => {
  res.render('merch', { title: 'Merch', currentPage: 'merch' });
});

// Define a route for the linktree-style page
app.get('/links', (req, res) => {
  const links = [
    { title: 'Spotify', url: 'https://open.spotify.com/artist/3Q0VxGoMBBlnZHU8qAh1Gz' },
    { title: 'Apple Music', url: 'https://music.apple.com/us/artist/kelly/1848358617' },
    { title: 'YouTube Music', url: 'https://music.youtube.com/channel/UCJhhAqydDfMhzAZRELFOawA' },
    { title: 'Amazon Music', url: 'https://music.amazon.com/albums/B0FXN797R6' },
  ];

  const socials = [
    { 
      name: 'Instagram', 
      url: 'https://instagram.com/__kelly.tx',
      svg: '<svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fill-rule="evenodd" d="M12.315 2c-4.013 0-4.51.017-6.08.087a5.93 5.93 0 00-4.14 1.48A5.93 5.93 0 00.615 7.71C.547 9.28.53 9.778.53 13.79s.017 4.51.085 6.08a5.93 5.93 0 001.48 4.14 5.93 5.93 0 004.14 1.48c1.57.07 2.067.087 6.08.087s4.51-.017 6.08-.087a5.93 5.93 0 004.14-1.48 5.93 5.93 0 001.48-4.14c.07-1.57.087-2.067.087-6.08s-.017-4.51-.087-6.08a5.93 5.93 0 00-1.48-4.14A5.93 5.93 0 0019.875 2.087C18.305 2.017 17.808 2 13.79 2h-1.475zM12 4.867c4.022 0 4.48.017 6.06.087a3.91 3.91 0 012.75 2.75c.07 1.58.087 2.038.087 6.06s-.017 4.48-.087 6.06a3.91 3.91 0 01-2.75 2.75c-1.58.07-2.038.087-6.06.087s-4.48-.017-6.06-.087a3.91 3.91 0 01-2.75-2.75c-.07-1.58-.087-2.038-.087-6.06s.017-4.48.087-6.06a3.91 3.91 0 012.75-2.75c1.58-.07 2.038-.087 6.06-.087zM12 8.25a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM12 17a3.5 3.5 0 110-7 3.5 3.5 0 010 7zM18.75 6.5a1.25 1.25 0 100-2.5 1.25 1.25 0 000 2.5z" clip-rule="evenodd" /></svg>'
    },
    { 
      name: 'TikTok', 
      url: 'https://tiktok.com/@__kelly.tx',
      svg: '<svg class="w-8 h-8" fill="currentColor" viewBox="0 0 448 512"><path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z"/></svg>'
    },
    { 
      name: 'X/Twitter', 
      url: 'https://x.com/__kellydottx',
      svg: '<svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>'
    },
    {
      name: 'Facebook',
      url: 'https://facebook.com/thebandkelly',
      svg: '<svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fill-rule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clip-rule="evenodd" /></svg>'
    }
  ];

  res.render('links', { title: 'Links', currentPage: 'links', links: links, socials: socials });
});

// Define a route for the contact page
app.get('/contact', (req, res) => {
  // Pass the status query parameter to the view
  res.render('contact', { title: 'Contact', currentPage: 'contact', status: req.query.status });
});

// Define a POST route to handle contact form submissions
app.post('/contact', (req, res) => {
  const { name, email, message } = req.body;

  const sql = `INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)`;
  
  db.run(sql, [name, email, message], function(err) {
    if (err) {
      console.error(err.message);
      // Redirect with an error status
      return res.redirect('/contact?status=error');
    }
    console.log(`A new contact has been added with ID ${this.lastID}`);
    // Redirect with a success status
    res.redirect('/contact?status=success');
  });
});

// --- Admin Route to View Contacts ---
// NOTE: In a real application, this route should be protected by a login system.
app.get('/admin/contacts', basicAuth, (req, res) => { // Apply the auth middleware here
  const sql = "SELECT id, name, email, message, submitted_at FROM contacts ORDER BY submitted_at DESC";

  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).send("Error retrieving contacts from database.");
      return console.error(err.message);
    }
    res.render('admin-contacts', { title: 'Admin - Contacts', currentPage: 'admin', contacts: rows });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});