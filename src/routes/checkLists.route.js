const checkLists = require('../services/checkLists.service')
const express = require('express');
const router = express.Router();


router.get("/get", async function (req, res, next) {
    try {
        res.json(await checkLists.findAllOrderWithWSO())
    }
    catch (err) { 
        res.json(err)
    }
});



module.exports = {
    router,
  };