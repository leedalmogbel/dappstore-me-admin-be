const mongoose = require('mongoose');
const { Schema } = mongoose;

const historyProjectSchema = new Schema({
  name: {
    type: String,
  },
  category: {
    type: String,
  },
  action: {
    type: String,
  },
  item: {
    type: String
  },
  oldValue: {
    type: String
  },
  newValue: {
    type: String
  }
},
{ strict: true,
  timestampe: true
});

module.exports = mongoose.model('HistoryProjects', historyProjectSchema); 
