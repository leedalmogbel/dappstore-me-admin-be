const mongoose = require('mongoose');
const { Schema } = mongoose;

const projectSchema = new Schema({
  name: {
    type: String,
  },
  url: {
    type: String
  },
  nft: {
    type: String
  },
  desc: {
    type: String
  },
  active: {
    type: Boolean,
    default: 1
  },
  stars: {
    type: Number,
    default: 5
  },
  assets: {
    type: Array
  },
  type: {
    type: String
  },
  duration_start: {
    type: Date,
    default: new Date()
  },
  duration_end: {
    type: Date,
    default: new Date()
  }
},
{ strict: true,
  timestampe: true
});

projectSchema.index({ 'name': 'text', 'url': 'text' });

module.exports = mongoose.model('Projects', projectSchema);