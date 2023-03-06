const fs = require('fs');

const { success, fail, validation } = require('../common/response');
const config = require('../config/config.js');
const Project = require('../models/project.js');
const helper = require('../utils/helper');

exports.projectCreate = async (req, res) => {
  const { name, url, nft, desc, type } = req.body;

  console.log(req.body)
  try {
    // const proj = await Project.findOne({ email });
    // if (!proj) return res.status(404).json(fail('Project already exists', res.statusCode));
    const proj  = await Project.create({ name, url, nft, desc, type });


    helper.logHistory(req.body, 'add')
    res.status(200).json(success('OK', { data: proj }, res.statusCode));
  } catch (error) {
    res.status(500).json(fail('Something went wrong', res.statusCode));
  }
};

exports.projectList = async (req, res) => {
  const type = req.query.projectType || 'main-banner-rolling';
  let perPage = parseInt(req.query.limit) || 10; // page size
  let page = parseInt(req.query.page) || 1;
  let sortBy = req.query.sort || 'createdAt';
  let orderBy = req.query.orderBy || 'asc';
  let search = req.query.search || {};

  console.log('perPage', perPage)
  console.log('page', page)

  try {
    const proj  = await Project.find({ 
      '$and': [{
        '$or': [
          { 'name': { '$regex': '.*' + search + '.*' } },
          { 'url': { '$regex': '.*' + search + '.*' } },
        ]
      },
      { 'type': new RegExp('^' + type + '$', "i") }
    ]
   })
   .skip((perPage * page) - perPage)
   .limit(perPage);
   
    const projTotal = await Project.count({ 
      '$and': [{
        '$or': [
          { 'name': { '$regex': '.*' + search + '.*' } },
          { 'url': { '$regex': '.*' + search + '.*' } },
        ]
      },
      { 'type': new RegExp('^' + type + '$', "i") }]
    });

    const totalPages = Math.ceil(projTotal / perPage)
    const currentPage = Math.ceil(projTotal % page)
    console.log('totalPages',totalPages);
    console.log('currentPage', currentPage)
    console.log('total', projTotal);

    res.status(200).json(success('OK', { data: proj, total: projTotal, page }, res.statusCode));
  } catch (error) {
    console.log(error)
    res.status(500).json(fail('Something went wrong', res.statusCode));
  }
};