
  import express from 'express';
  import open from 'open';
  import mysql from 'mysql2';
  import dotenv from 'dotenv';
  dotenv.config();
  const app = express();
  const port = 3000;

  app.use(express.static('public'));
  app.use(express.json()); // Parse JSON in requests

  // Create MySQL connection
  const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  // Connect and check
  db.connect((err) => {
    if (err) {
      console.error('❌ MySQL connection failed:', err);
    } else {
      console.log('✅ Connected to MySQL database.');
    }
  });

  // Sample route to test connection
  app.get('/', (req, res) => {
    res.send('API is running');
  });

  // 🚩 NEW: API endpoint to get all users for the admin panel
  app.get('/api/users', (req, res) => {
    db.query('SELECT id, name, email, created_at as joined, active FROM users', (err, results) => {
      if (err) {
        console.error('❌ Error fetching users:', err);
        return res.status(500).json({ error: "Database error" });
      }
      res.json(results);
    });
  });

  // 🚩 Registration route for your registration.html, now with step-by-step logs!
  app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    console.log("➡️ Received /register request with:", { name, email, password });

    // Simple validation
    if (!name || !email || !password) {
      console.log("❌ Missing one or more required fields.");
      return res.status(400).json({ error: "All fields are required." });
    }

    // Check if email already exists
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
      if (err) {
        console.log("❌ Error checking existing email:", err);
        return res.status(500).json({ error: "Database error at email check." });
      }
      if (results.length > 0) {
        console.log("⚠️ Email already registered:", email);
        return res.status(400).json({ error: "This email is already registered!" });
      }

      // Insert new user
      db.query(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name, email, password],
        (err, result) => {
          if (err) {
            console.log("❌ Error inserting user:", err);
            return res.status(500).json({ error: "Database error at insert." });
          }
          console.log("✅ User registered successfully:", { name, email });
          res.status(201).json({ message: "User registered!" });
        }
      );
    });
  });

  // 🚩 Login route for login.html
  app.post('/login', (req, res) => {
    const { email, password } = req.body;
    console.log("➡️ Login attempt:", email);

    if (!email || !password) {
      return res.status(400).json({ error: "Both fields are required." });
    }

    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
      if (err) {
        console.log("❌ Error during login:", err);
        return res.status(500).json({ error: "Database error" });
      }
      if (results.length === 0) {
        return res.status(401).json({ error: "Invalid email or password." });
      }
      const user = results[0];
      if (user.password !== password) {
        return res.status(401).json({ error: "Invalid email or password." });
      }
      // Login success!
      res.status(200).json({ message: "Login successful!", name: user.name });
    });
  });

  // Existing career recommendation route
  app.post('/recommend', (req, res) => {
    const { interests_skills, education_level } = req.body;

    if (!interests_skills || !education_level) {
      return res.status(400).json({ error: "Missing interests or education level" });
    }

    const interestsArray = interests_skills.split(',').map(s => s.trim());

    if (interestsArray.length === 0) {
      return res.status(400).json({ error: "No interests provided" });
    }

    let whereClause = 'education_level = ? AND (';
    const queryParams = [education_level];

    interestsArray.forEach((interest, index) => {
      if (index > 0) whereClause += ' OR ';
      whereClause += 'r.interests_skills LIKE ?';
      queryParams.push(`%${interest}%`);
    });
    whereClause += ')';

    const query = `
      SELECT r.preferred_career, c.description, c.average_salary, c.resources
      FROM recommendations r
      JOIN career_info c ON r.preferred_career = c.career_name
      WHERE ${whereClause}
    `;

    db.query(query, queryParams, (err, results) => {
      if (err) {
        console.error("❌ Error fetching recommendation:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (results.length > 0) {
        res.json({ recommendations: results });
      } else {
        res.json({ recommendations: [] });
      }
    });
  });

  // Optional: route to get all recommendations (testing)
  app.get('/api/recommendations', (req, res) => {
    db.query('SELECT * FROM recommendations', (err, results) => {
      if (err) {
        console.error('Query error:', err);
        return res.status(500).json({ error: 'Database query failed' });
      }
      res.json(results);
    });
  });

  // Start server
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(` Server running at http://localhost:${PORT}`);
    open(`http://localhost:${PORT}/index.html`); // Automatically open browser
  });