const { success, fail, validation } = require('../common/response');
const config = require('../config/config.js');
const HistoryProject = require('../models/history_project.js');

exports.escapeRegex = async (data) => {
  return await data.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

exports.logHistory = async (data, action) => {
  try {
    await HistoryProject.create({
      name: data.name,
      category: data.type,
      action,
      item: null,
      oldValue: null,
      newValue: null });
  } catch (error) {
    console.log('error', error)
  }
};