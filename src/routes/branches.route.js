const BranchesService = require('../services/branches.service')
const express = require('express');
const router = express.Router();



router.get("/get", async function (req, res, next) {
    try {
        res.json(await BranchesService.findAll())
    }
    catch (err) { 
        res.json(err)
    }
});

router.get("/get/:id", async function(req, res, next) {
    try {
        
        let id = req.params.id;
        res.json(await BranchesService.findById(id))
    }
    catch (err) {
        res.json(err)
    }

})



router.get("/test", async function(req, res, next) {
    try {
        res.json(await BranchesService.test())
    }
    catch (err) {
        res.json(err)
        console.log(err)
    }

})







module.exports = {
    router,
  };