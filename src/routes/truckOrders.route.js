const TruckOrdersService = require('../services/truckOrders.service')
const express = require('express');
const router = express.Router();



router.get("/get", async function (req, res, next) {
    try {
        res.json(await TruckOrdersService.findAll())
    }
    catch (err) { 
        res.json(err)
    }
});

router.get("/get/:id", async function (req, res, next) {
    try {
        let id = req.params.id;
        res.json(await TruckOrdersService.findById(id))
    }
    catch (err) { 
        res.json(err)
    }
});

router.get("/vehicle-type/get", async function (req, res, next) {
    try {
        res.json(await TruckOrdersService.getVehicleTypes())
    }
    catch (err) { 
        res.json(err)
    }
});


router.post("/create",async function (req, res, next){
    try{
        res.json(await TruckOrdersService.create(req.body))
    }
    catch (err) {
        res.json(err)
    }
})

router.delete("/delete/:id",async function (req, res, next){
    try{
        let id = req.params.id;
        res.json(await TruckOrdersService.destroy(id))
    }
    catch (err) {
        res.json(err)
    }
})

router.patch("/status/update/:toid", async function (req, res, next) {
    try {
        let toid = req.params.toid
        let status_target = req.body.status_target
        res.json(await TruckOrdersService.updateStatus(status_target, toid ))
    }
    catch (err) {
        console.log(err)
        res.json(err)
    }
})

router.patch("/upsert",async function (req, res, next){
    try{
        let toid = req.body.toid
        let form = req.body.form
        if(toid){
            res.json(await TruckOrdersService.update(toid,form))
        }
        else{
            res.json(await TruckOrdersService.createByForm(form))
        }
    }
    catch (err) {
        res.json(err)
    }
})

router.patch("/remove/order",async function (req, res, next){
    try{
        let toid = req.body.toid
        let oid = req.body.oid
        res.json(await TruckOrdersService.removeOrder(toid,oid))
    }
    catch (err){
        res.json(err)
    }
})









module.exports = {
    router,
  };