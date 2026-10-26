require('dotenv').config();

const express = require('express');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');

const app = express();

app.use(express.json());
app.use(express.static('public'));

const client = new MongoClient(process.env.MONGODB_URI);

let users;

async function start() {
  await client.connect();

  const db = client.db('UserLoginDB');
  users = db.collection('users');

  await users.createIndex(
    { email: 1 },
    { unique: true }
  );

  app.listen(process.env.PORT || 3000, () => {
    console.log('Server running at http://localhost:3000');
  });
}

app.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      password.length < 12 ||
      Buffer.byteLength(password, 'utf8') > 72
    ) {
      return res.status(400).json({
        message: 'Enter a valid email and a password of 12–72 bytes.'
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const passwordHash = await bcrypt.hash(password, 12);

    await users.insertOne({
      email: normalizedEmail,
      passwordHash,
      createdAt: new Date()
    });

    res.status(201).json({
      message: 'Account created successfully!'
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: 'Email already registered.'
      });
    }

    res.status(500).json({
      message: 'Server error.'
    });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== 'string' ||
      typeof password !== 'string'
    ) {
      return res.status(400).json({
        message: 'Invalid input.'
      });
    }

    const user = await users.findOne({
      email: email.trim().toLowerCase()
    });

    const valid = user
      ? await bcrypt.compare(password, user.passwordHash)
      : false;

    if (!valid) {
      return res.status(401).json({
        message: 'Invalid email or password.'
      });
    }

    res.json({
      message: 'Login successful!'
    });

  } catch (error) {
    res.status(500).json({
      message: 'Server error.'
    });
  }
});

start().catch(error => {
  console.error('Failed to start server:', error.message);
  process.exit(1);
});