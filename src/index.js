require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const routes = require('./routes');

const app = express();

app.use(cookieParser());

app.use(cors({
  credentials: true,
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

app.listen(process.env.PORT, () => console.log(`Running on ${process.env.PORT}`))