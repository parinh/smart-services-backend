const fuelPercentService = require('../services/fuelPercent.service')
const express = require('express');
const router = express.Router();

router.get("/get", async function (req, res, next) {
    try {
        res.json(await fuelPercentService.findOne())
    }
    catch (err) { 
        res.json(err)
    }
});

module.exports = {
    router,
  };