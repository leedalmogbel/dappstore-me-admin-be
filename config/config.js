require('dotenv').config();
const path = require("path");
const rootPath = path.normalize(__dirname + '/..');
const NODE_ENV = process.env.NODE_ENV || 'dev';
const NODE_HOST = process.env.NODE_HOST || 'localhost';
const NODE_PORT = process.env.NODE_PORT || 5000;
const MAIL_HOST = process.env.MAIL_HOST || 'smtp.mandrillapp.com';
const MAIL_PORT = process.env.MAIL_PORT || 587;
const MAIL_USER = process.env.MAIL_USER || 'Dappatoz';
const MAIL_PASS = process.env.MAIL_PASS || 'Ej9AeUTONCSos04VXqqIJQ';
const MONGO_HOST = process.env.MONGO_HOST || 'localhost';
const MONGO_PORT = process.env.MONGO_PORT || 27017;
const MONGO_USER = process.env.MONGO_USER || 'dappstore';
const MONGO_PASS = process.env.MONGO_PASS || 'dappstore!@#$%^';
const SUPER_ADMIN_EMAIL_ADDRESS = 'info@dappstore.me';

const APP_NAME = 'dappStore';

const config = {
  dev: {
    env: NODE_ENV,
    uri: `http://${NODE_HOST}:${NODE_PORT}`,
    app: {
      name: APP_NAME + NODE_ENV,
      address: NODE_HOST,
      port: NODE_PORT,
    },
    db: {
      host: MONGO_HOST,
      port: MONGO_PORT,
      user: MONGO_USER,
      pass: MONGO_PASS,
      name: APP_NAME + NODE_ENV,
    },
    email: {
      host: MAIL_HOST,
      port: MAIL_PORT,
      secure: false,
      auth: {
        user: MAIL_USER,
        pass: MAIL_PASS,
      },
    },
    secret: 'secret123'
  },
  sat: {
    env: NODE_ENV,
    uri: `https://${NODE_HOST}`,
    app: {
      name: APP_NAME + NODE_ENV,
      address: NODE_HOST,
      port: NODE_PORT,
    },
    db: {
      host: MONGO_HOST,
      port: MONGO_PORT,
      user: MONGO_USER,
      pass: MONGO_PASS,
      name: APP_NAME + NODE_ENV,
    },
    email: {
      host: MAIL_HOST,
      port: MAIL_PORT,
      secure: false,
      auth: {
        user: MAIL_USER,
        pass: MAIL_PASS,
      },
    },
    secret: 'secret123'
  },
  uat: {
    env: NODE_ENV,
    uri: `https://${NODE_HOST}`,
    app: {
      name: APP_NAME + NODE_ENV,
      address: NODE_HOST,
      port: NODE_PORT,
    },
    db: {
      host: MONGO_HOST,
      port: MONGO_PORT,
      user: MONGO_USER,
      pass: MONGO_PASS,
      name: APP_NAME + NODE_ENV,
    },
    email: {
      host: MAIL_HOST,
      port: MAIL_PORT,
      secure: false,
      auth: {
        user: MAIL_USER,
        pass: MAIL_PASS,
      },
    },
    secret: 'secret123'
  },
  production: {
    env: NODE_ENV,
    uri: `https://${NODE_HOST}`,
    app: {
      name: APP_NAME + NODE_ENV,
      address: NODE_HOST,
      port: NODE_PORT,
    },
    db: {
      host: MONGO_HOST,
      port: MONGO_PORT,
      user: MONGO_USER,
      pass: MONGO_PASS,
      name: APP_NAME + NODE_ENV,
    },
    email: {
      host: MAIL_HOST,
      port: MAIL_PORT,
      secure: false,
      auth: {
        user: MAIL_USER,
        pass: MAIL_PASS,
      },
    },
    secret: 'secret123'
  },
}

module.exports = config[NODE_ENV];