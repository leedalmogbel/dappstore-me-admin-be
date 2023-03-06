const express = require('express');
const auth = require('../middleware/auth');
const { signin, signup, forgotPassword, resetPassword, verifyToken } = require('../controller/user');
//const { projectCreate, projectList } = require('../controller/project');
const { fetchMarket, fetchNews } = require('../controller/rss');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, './upload');
   },
  filename: function (req, file, cb) {
      cb(null , file.originalname);
  }
});
let upload = multer();
const uploads = multer({ storage: storage });
module.exports = async app => {
  // AUTH
  app.post('/signup', signup);
  app.post('/login', signin);
  app.post('/forgot-password', forgotPassword);
  app.post('/reset-password', resetPassword);
  app.get('/verify-token', verifyToken);

  // Project Management
  // app.get('/project/:projectType/list', projectList);
  // app.post('/project/:projectType/create', projectCreate);

  // fetch for coin gecko
  app.get('/crypto/market', fetchMarket);
  app.get('/crypto/news', fetchNews);
}