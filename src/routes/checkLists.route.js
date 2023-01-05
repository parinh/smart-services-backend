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

router.get("/get/by/time", async function (req, res, next) {
    try {
        var toid = req.query.toid;
        var times = req.query.times;
        var wlid = req.query.wlid;
        console.log(wlid);
        res.json(await checkLists.findByTimes(toid,times,wlid))
    }
    catch (err) { 
        console.log(err);
        res.json(err)
    }
});
router.get("/get/by/toid", async function (req, res, next) {
    try {
        var toid = req.query.toid;
        res.json(await checkLists.findWaitingPutOut(toid))
    }
    catch (err) { 
        console.log(err);
        res.json(err)
    }
});
router.get("/get/by/oid", async function (req, res, next) {
    try {
        var wlid = req.query.wlid;
        res.json(await checkLists.findCheckListForPickOutForm(wlid))
    }
    catch (err) { 
        console.log(err);
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

router.patch("/update", async function (req, res, next) {
    try {
        res.json(await checkLists.updateCheckLists(req.body))
    }
    catch (err) { 
        res.json(err)
    }
});
router.patch("/wso-goods/update", async function (req, res, next) {
    try {
        res.json(await checkLists.updateWSOGoodWareHouse(req.body))
    }
    catch (err) { 
        res.json(err)
    }
});

router.patch("/update/out-number", async function (req, res, next) {
    try {
        res.json(await checkLists.updateCheckListsOutNumber(req.body))
    }
    catch (err) { 
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
        res.json(await checkLists.createChecklists(req.body))
    }
    catch (err) { 
        res.json(err)
    }
});



router.patch("/missing-quantity/update", async function (req, res, next) {
    try {
        res.json(await checkLists.updateMissingQuantity(req.body))
    }
    catch (err) { 
        res.json(err)
    }
});

router.patch("/missing-quantity/update", async function (req, res, next) {
    try {
        res.json(await checkLists.updateMissingQuantity(req.body))
    }
    catch (err) { 
        res.json(err)
    }
});


router.patch("/status/update", async function (req, res, next) {
    try {
        res.json(await checkLists.updateWSOListStatus(req.body))
    }
    catch (err) { 
        res.json(err)
    }
});

router.delete("/delete", async function (req, res, next) {
    try {
        var toid = req.query.toid;
        var times = req.query.times;
        res.json(await checkLists.destroyCheckList(toid,times))
    }
    catch (err) { 
        res.json(err)
    }
});







module.exports = {
    router,
  };