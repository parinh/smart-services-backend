const customerService = require('../services/customer.service')
const express = require('express');
const router = express.Router();

router.get("/get", async function (req, res, next) {
    try {
        res.json(await customerService.findAll())
       
    }
    catch (err) { 
        res.json(err)
    }
});

router.post("/branch/create",async function (req, res, next) {
    try{
        res.json(await customerService.createBranch(req.body))
    }
    catch(err){
        res.json(err)
    }
})

router.get("/search/:word", async function(req, res, next) {
    try {
        
        let word = req.params.word;
        res.json(await customerService.findLike(word))
    }
    catch (err) {
        res.json(err)
    }

})


module.exports = {
    router,
  };