const MappingArea = require('../services/mappingArea.service')
const express = require('express');
const router = express.Router();

router.use(function(req, res, next) {
    // console.log(req)
    next()
})

router.get("/get/area-number", async function (req, res, next) {
    try {
        res.json(await MappingArea.getAllAreaNumber())
        
    }
    catch (err) { 
        res.json(err)
    }
});

router.get("/mapping", async function (req, res, next) {
    try {
        
        // console.log("asdfasdf",JSON.parse(req.query.address))
        res.json(await MappingArea.mappingAreaNumber(JSON.parse(req.query.address)))
    }
    catch (err) { 
        res.json(err)
    }
});

router.get("/mapping/by/zone/:zone", async function (req, res, next) {
    try {
        // console.log("asdfasdf",JSON.parse(req.query.address))
        res.json(await MappingArea.mappingByZone(req.params.zone)) 
    }
    catch (err) { 
        res.json(err)
    }
});



module.exports = {
    router,
  };