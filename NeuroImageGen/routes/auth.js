import express from 'express';
import config from 'config';
import mysql from 'mysql';
import OpenAI from 'openai';

const router = express.Router();
const connection = mysql.createConnection({
  host: config.get('DB_HOST'),
  user: config.get('DB_USER'),
  password: config.get('DB_PASSWORD'),
  database: config.get('DB_NAME')
});

const openai = new OpenAI({
  apiKey: config.get('OPENAI_KEY'),
});

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const query = "INSERT INTO users (username, password) VALUES (?, ?)";
  connection.query(query, [username, password], (err, result) => {
    if (err) {
      console.error("Error occurred while registering user:", err);
      res.render('index', { error: "Error occurred while registering user" });
    } else {
      console.log("User registered successfully:", result);
      res.redirect('/login');
    }
  });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const query = "SELECT * FROM users WHERE username = ? AND password = ?";
  connection.query(query, [username, password], (err, result) => {
    if (err) {
      console.error("Error occurred while logging in:", err);
      res.render('index', { error: "Error occurred while logging in" });
    } else {
      if (result.length > 0) {
        console.log("User logged in successfully:", result[0]);
        res.render('dashboard', { user: result[0] });
      } else {
        console.log("Invalid username or password");
        res.render('index', { error: "Invalid username or password" });
      }
    }
  });
});

router.post('/generate-image', async (req, res) => {
  const prompt = req.body.prompt;
  const size = req.body.size ?? '256×256';
  const number = req.body.number ?? 1;
  
  try {
    const response = await openai.createImage({
      prompt,
      size,
      n: Number(number)
    });
    console.log(response);
    res.render('index', { images: response.data.data });
  } catch (e) {
    console.error("Error generating image:", e);
    res.render('index', { error: "Error generating image" });
  }
});

export default router;