import express from "express";
import dotenv from "dotenv";
import { sql } from "./config/db.js";

dotenv.config();

const app = express();

//middleware
app.use(express.json());

const PORT = process.env.PORT || 5001;

async function initDB() {
  try {
    await sql`CREATE TABLE IF NOT EXISTS transactions(
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    category VARCHAR(255) NOT NULL,
    created_at DATE NOT NULL DEFAULT CURRENT_DATE
    )`;
    console.log("Table created successfully");
  } catch (error) {
    console.log("Error creating table:", error);
    process.exit(1); // status code 1 means failure, 0 means success
  }
}

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/api/transactions/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;

    const transactions =
      await sql`SELECT * FROM transactions WHERE user_id = ${user_id} ORDER BY created_at DESC`;

    res.status(200).json(transactions);
  } catch (error) {
    console.log("Error getting transactions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/transactions", async (req, res) => {
  try {
    const { title, amount, category, user_id } = req.body;

    if (!title || !category || !user_id || amount === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const transactions = await sql`
    INSERT INTO transactions (user_id,title,amount,category)
    VALUES (${user_id}, ${title}, ${amount}, ${category}) RETURNING *`;

    console.log(transactions);

    res.status(201).json(transactions[0]);
  } catch (error) {
    console.log("Error creating transaction:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/api/transactions/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;

    if (isNaN(parseInt(user_id))) {
      return res.status(400).json({ message: "Invalid transaction ID" });
    }

    const result =
      await sql`DELETE FROM transactions WHERE user_id = ${user_id} RETURNING *`;
    console.log(result);

    if (result.length === 0) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.log("Error deleting transaction:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

initDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
  });
});

//52:45
