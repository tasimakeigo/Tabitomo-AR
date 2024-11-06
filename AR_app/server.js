const express = require('express');
const path = require('path');
const { Client } = require('pg');

const app = express();
const PORT = process.env.PORT || 8080;  // RenderのPORT環境変数を使用

// Use Render's environment variable for the connection string
const client = new Client({
  connectionString: process.env.DATABASE_URL, // Uses the DATABASE_URL environment variable
  ssl: {
    rejectUnauthorized: false, // SSL is required by Render for PostgreSQL
  }
});

// Connect to PostgreSQL
client.connect()
  .then(() => console.log('Connected to the PostgreSQL database'))
  .catch(err => console.error('Error connecting to the database', err.stack));

// Serve static files
app.use(express.static(path.join(__dirname)));

// Start server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
