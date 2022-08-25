const JobTypeOptions = require('../services/jobTypeOptions.service')
const express = require('express');
const router = express.Router();


router.get("/get", async function (req, res, next) {
    try {
        res.json(await JobTypeOptions.findAll())
        
    }
    catch (err) { 
        res.json(err)
    }
});


module.exports = {
    router,
  };