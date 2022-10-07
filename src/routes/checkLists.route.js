const checkLists = require('../services/checkLists.service')
const express = require('express');
const router = express.Router();





router.patch("/getOne",async function (req, res,next){
    try{
        var wlid = req.body.wlid
        var toid = req.body.toid
        res.json(await checkLists.findWSOById(wlid,toid))
    }
    catch (err) {
        res.json(err)
    }
})


router.get("/get", async function (req, res, next) {
    try {
        res.json(await checkLists.findAllOrderWithWSO())
    }
    catch (err) { 
        res.json(err)
    }
});

router.get("/goods-status/get", async function (req, res, next) {
    try {
        console.log('goods');
        res.json(await checkLists.getGoodsStatus())
    }
    catch (err) { 
        console.log(err);
        res.json(err)
    }
});




router.patch("/update/shortage", async function (req, res, next) {
    try {
        res.json(await checkLists.updateShortageGoods(req.body))
    }
    catch (err) { 
        res.json(err)
    }
});

router.patch("/upsert", async function (req, res, next) {
    try {
        res.json(await checkLists.upsertChecklists(req.body))
    }
    catch (err) { 
        res.json(err)
    }
});







module.exports = {
    router,
  };