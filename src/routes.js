const express = require('express');
const { hash, compare } = require('bcrypt');

const { fakeDB } = require('./fakeDB');
const { createAccessToken, createRefreshToken, sendAccessToken, sendRefreshToken } = require('./tokens');

const routes = express.Router();

routes.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = fakeDB.find(user => user.email === email)
    if (user) throw new Error('User already exists')

    const hashedPassword = await hash(password, 8)

    fakeDB.push({
      id: fakeDB.length + 1,
      email,
      password: hashedPassword
    })

    res.json({ msg: "User Created" })
    console.log(fakeDB)
  } catch (err) {
    res.status(400).send({ err: `${err.message}` })
  }
})

routes.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = fakeDB.find(user => user.email === email)
    if (!user) throw new Error('User does not exists')

    const valid = await compare(password, user.password);
    if (!valid) throw new Error('Wrong password')

    const accessToken = createAccessToken(user.id)
    const refreshToken = createRefreshToken(user.id)

    user.refreshToken = refreshToken;

    console.log(fakeDB)

    sendRefreshToken(res, refreshToken);
    sendAccessToken(res, req, accessToken);


  } catch (err) {
    res.status(401).send({ err: `${err.message}` })
  }
})

module.exports = routes;