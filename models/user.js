const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  status: {
    type: Boolean,
    default: 1
  },
  role: {
    type: String,
    default: 'user'
  },
  reset_password_token: {
    type: String,
    default: ''
  },
  reset_password_expires: {
    type: Date,
    default: new Date()
  },
  auth_token: {
    type: String,
    default: ''
  },
},
{
  strict: true,
  timestamps: true
});

module.exports = mongoose.model('Users', userSchema);