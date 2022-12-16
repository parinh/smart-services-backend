const OrdersCost = require('../services/ordersCost.service')
const express = require('express');
const router = express.Router();


router.get("/get/daily/:date", async function (req, res, next) {
    try {
        
        
    }
    catch (err) { 
        res.json(err)
    }
});

router.patch("/upsert/orders_cost", async function (req, res, next) {
    try {
        res.json(await OrdersCost.AddOrdersCost(req.body))
    }
    catch (err) {
        res.json(err)
    }
})

router.patch("/update/orders_cost", async function (req, res, next) {
    try {
        res.json(await OrdersCost.UpdateOrdersCost(req.body))
    }
    catch (err) {
        res.json(err)
    }
})


router.get("/get/order-cost/:toid", async function (req, res, next) {
    try {
        res.json(await OrdersCost.FindOrderCostByTruckOrder(req.params.toid))
        
    }
    catch (err) { 
        res.json(err)
    }
});

router.patch("/recheck/order-cost", async function (req, res, next) {
    try {
        let toid = req.body.toid;
        res.json(await OrdersCost.resetOrderCostToSeqOne(toid));
    }
    catch (err) {
        res.json(err)
    }
})


module.exports = {
    router,
  };