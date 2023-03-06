require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const db = require('./config/database.config');

const app = express();
const PORT = process.env.NODE_PORT|| 5000;
app.set('port', PORT);

app.use(cors());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'x-www-form-urlencoded, Origin, X-Requested-With, Content-Type, Accept, Authorization, *');
  if (req.method === 'OPTIONS'){
      res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Credentials', true);
      return res.status(200).json({});
  }
  next();
});
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// routes
app.get('/', (req, res) => {
  res.json({ message: 'this is a test'})
  console.log('this is a test')
});

// routes
require('./routes/index.js')(app);

mongoose.connect(db.mongodbURI,
  { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log(`SERVER RUNNING ON PORT: ${PORT}`)))
  .catch((error) => console.log( error.message ));

mongoose.set('useFindAndModify', false);
// app.options('*', cors());