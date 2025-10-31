require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const path = require('path'); // Node.js module for working with file paths
const sqlite3 = require('sqlite3').verbose(); // Use .verbose() for more detailed error logging

const app = express();
const port = 3000;

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Middleware to parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));
// Middleware to parse JSON bodies
app.use(express.json());

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
  const songs = [
    {
      title: 'DFD (Danger-Fighting Demons)',
      releaseDate: '2025-10-31', // Standardized date format for sorting
      description: "Danger-Fighting Demons is KELLY's debut single. The song synthesizes the band's influences into one cohesive sound: a hardcore, fast, emo track that serves as an ode to the originals who inspired them to become the musicians they are today.",
      coverArtUrl: '/content/photos/dfd_cover.jpg',
      streamLink: 'https://distrokid.com/hyperfollow/kellytx/dfd-danger-fighting-demons' // <-- Add your streaming link here
    }
    // Add more song objects here in the future
  ];

  // Sort songs by release date, newest first
  songs.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));

  res.render('music', { title: 'Music', currentPage: 'music', songs: songs });
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
    },
    {
      date: '',
      title: '',
      description: '',
      imageUrl: '/content/photos/flyers/',
    }
  ];

  const now = new Date();
  const upcomingShows = shows.filter(show => new Date(show.date) >= now).sort((a, b) => new Date(a.date) - new Date(b.date));
  const pastShows = shows.filter(show => new Date(show.date) < now).sort((a, b) => new Date(b.date) - new Date(a.date));

  res.render('tour', { title: 'Tour', currentPage: 'tour', upcomingShows, pastShows });
});

// Define a route for the merch page
app.get('/merch', (req, res) => {
  res.render('merch', { title: 'Merch', currentPage: 'merch' });
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

// Serve all static files (CSS, JS, images, etc.) from the 'public' directory.
// This makes files in `public/img` available at `/img/` and `public/photos` at `/photos/`.
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});