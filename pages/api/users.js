// pages/api/users.js
import pool from "../../lib/db";

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const result = await pool.query("SELECT * FROM users");
        res.status(200).json(result.rows);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
      break;

    case "POST":
      const { username, email } = req.body;
      try {
        const result = await pool.query(
          "INSERT INTO users (username, email) VALUES ($1, $2) RETURNING *",
          [username, email]
        );
        res.status(201).json(result.rows[0]);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
