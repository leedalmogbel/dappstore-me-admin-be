const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const fs = require('fs');
const nodemailer = require('nodemailer');
const mandrillTransport = require('nodemailer-mandrill-transport');

const { success, fail, validation } = require('../common/response');
const config = require('../config/config.js');
const User = require('../models/user.js');

exports.signin = async (req, res) => {
  const { email, password, remember_me } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json(fail('Invalid credentials', res.statusCode));

    const isPwdCorrect = await bcrypt.compare(password, user.password);
    if (!isPwdCorrect) return res.status(400).json(fail('Invalid credentials', res.statusCode));

    const currentDate = new Date();
    let rememberMe = true;

    if (!remember_me) {
      rememberMe = false;
      currentDate.setHours( currentDate.getHours() + 1 );
    } else {
      currentDate.setHours( currentDate.getHours() + 24 );
    }

    const token = jwt.sign(
      { email: user.email, id: user._id },
      config.secret,
      { expiresIn: '24h' });

    delete user.auth_token;
    delete user.password;

    await User.updateOne({_id: user._id}, { auth_token:token }, { upsert:true });

    res.status(200).json(success('OK', {
      data: user,
      token,
      remember_me: rememberMe,
      expires_at: new Date(currentDate.getTime() - (currentDate.getTimezoneOffset() * 60000)).toISOString()
    }, res.statusCode));
  } catch (error) {
    console.log(error)
    res.status(500).json(fail('Something went wrong', res.statusCode));
  }
};

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const exist = await User.findOne({ email });
    if (exist) return res.status(404).json(fail('User already exists', res.statusCode));

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ email, name, password: hashedPassword });

    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.SECRET,
      { expiresIn: '24h' });

    await User.updateOne({_id: user._id}, { auth_token:token }, { upsert:true });

    delete user.auth_token;
    delete user.password;

    res.status(201).json(success('OK', { data: user, token }, res.statusCode));
  } catch (error) {
    console.log(error);
    res.status(500).json(fail('Something went wrong', res.statusCode));
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  const transporter = nodemailer.createTransport({
    name: config.email.host,
    host: config.email.host,
    port: config.email.port,
    secure: config.email.secure,
    auth: {
      user: config.email.auth.user,
      pass: config.email.auth.pass
    },
    logger: true,
    debugger: true
  });

  const smtpTransport = nodemailer.createTransport(mandrillTransport({
    host: config.email.host,
    port: config.email.port,
    secure: config.email.secure,
    auth: {
      user: config.email.auth.user,
      pass: config.email.auth.pass
    },
    logger: true,
    debugger: true
  }));

  try {
    const user = await User.findOne({ email });
    if (!user) res.status(400).json(fail('Unknown email', res.statusCode));
    const currentDate = new Date();
    const dt = new Date(currentDate);
    const tzCountry = 9; // 9; 8 + 1 add for 1 hour expiration

    dt.setTime(dt.getTime() + (tzCountry * 60 * 60 * 1000));
    console.log('dt', dt)

    const token = crypto.randomBytes(16).toString('hex');
    user.reset_password_token = token
    user.reset_password_expires = dt;

    user.save();

    const mailTemplate = './templates/reset-password-email.html';
    fs.readFile(mailTemplate, 'utf8', async (error, data) => {
      if(error){
        console.log('Error reading email template file');
        return;
      }

      let mailInfo = {
        from: 'info@dappstore.me',
        to: email,
        subject: 'Dappstore New Password Request',
        html: data.replace('{{link}}', `${config.uri}/reset-password?token=${token}`)
      };

      console.log(config.email.host)
      console.log(config.email.port)
      console.log(config.email.secure)
      console.log(config.email.auth.user)
      console.log(config.email.auth.pass)

      smtpTransport.verify(function(error, success) {
        if (error) {
          console.log(error);
        } else {
          console.log('Server is ready to take our messages');
        }
      });

      let info = await transporter.sendMail(mailInfo, (error, response) => {
        if(error){
          console.log('Error sending email' + error);
          return;
        } else {
          console.log(`Email sent to ${email}`);
          console.log(response);
          return;
        }
      });
    });
    res.status(201).json(success('OK', { data: user }, res.statusCode));
  } catch (error) {
    res.status(500).json(fail('Something went wrong', res.statusCode));
  }
};

exports.resetPassword = async (req, res) => {
  const { password } = req.body;
  let rememberToken = req.query.token;

  console.log('rememberToken', rememberToken);
  console.log('password', password);

  try {
    const user = await User.findOne({ reset_password_token: rememberToken });
    const currentDate = new Date(new Date());
    currentDate.setTime(currentDate.getTime() + (8 * 60 * 60 * 1000));

    if (currentDate > user.reset_password_expires) return res.status(400).json(fail('Request Already Expired', res.statusCode));
    if (!user) res.status(400).json(fail('Credentials does not match', res.statusCode));

    const hashedPassword = await bcrypt.hash(password, 12);
    user.password = hashedPassword;
    user.save();

    res.status(201).json(success('OK', { data: user }, res.statusCode));
  } catch (error) {
    console.log(error);
    res.status(500).json(fail('Something went wrong', res.statusCode));
  }
};

exports.verifyToken = async (req, res) => {
  let auth_token = req.query.token;

  try {
    const user = await User.findOne({ auth_token });
    if (!user) res.status(400).json(fail('token not found', res.statusCode));

    res.status(201).json(success('OK', { data: user }, res.statusCode));
  } catch (error) {
    console.log(error);
    res.status(500).json(fail('Something went wrong', res.statusCode));
  }
};