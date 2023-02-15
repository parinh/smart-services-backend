const TruckOrdersService = require('../services/truckOrders.service')
const express = require('express');
const router = express.Router();

router.use(function (req, res, next) {
    TruckOrdersService.setLNo(req.headers)
    next()
})

router.get("/get", async function (req, res, next) {
    try {
        res.json(await TruckOrdersService.findAll())
    }
    catch (err) { 
        res.json(err)
    }
});

router.get("/get/status", async function (req, res, next) {
    try {
        res.json(await TruckOrdersService.findAll(req.query))
    }
    catch (err) { 
        res.json(err)
    }
});

//*todo : search truck-orders ----------------------------------------------------------------
router.get("/get/searchTruckOrders", async function (req, res, next) {
    try {
        res.json(await TruckOrdersService.searchTruckOrdersBySearchObjects(req.query))
    }
    catch (err) { 
        res.json(err)
    }
});
//*todo : search truck-orders ----------------------------------------------------------------

router.get("/get/daily/:date", async function (req, res, next) {
    try {
        res.json(await TruckOrdersService.getDaily(req.params.date))
    }
    catch (err) { 
        res.json(err)
    }
});

router.get("/get/cost/detail/:toid", async function (req, res, next) {
    try {
        res.json(await TruckOrdersService.getCostDetail(req.params.toid))
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

router.patch("/status/multiple/update", async function (req, res, next) {
    try {
        let status_target = req.body.status_target
        let toid_lists = req.body.toid_lists
        res.json(await TruckOrdersService.updateMultipleStatus(status_target, toid_lists ))
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
        
        es.json(err)
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

router.get("/cost", async function (req, res, next) {
    try {
        let vehicle_type = req.query.vehicle_type
        let province = req.query.province
        let district = req.query.district
        let warehouse_id = req.query.warehouse_id
        

        res.json(await TruckOrdersService.getCost(vehicle_type,province,district,warehouse_id))
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

router.get("/search", async function (req, res, next) {
    try{
        res.json(await TruckOrdersService.searchByTruckCode(req.query))
    }
    catch (err) { 
        res.json(err)
        
    }
})










module.exports = {
    router,
  };