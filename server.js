require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg");

const app = express();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static("public"));

(async () => {
  const client = await pool.connect();
  try {
    await client.query(
      "CREATE TABLE IF NOT EXISTS comments (id SERIAL PRIMARY KEY, content TEXT NOT NULL)"
    );
  } finally {
    client.release();
  }
})();

app.post("/comments", async (req, res) => {
  const { content } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO comments (content) VALUES ($1) RETURNING id",
      [content]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/comments", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM comments ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server uruchomiony na http://localhost:${port}`);
});
