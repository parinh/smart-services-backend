const MemberOptionsService = require('../services/memberOptions.service')
const express = require('express');
const router = express.Router();



router.get("/getByType/:type", async function (req, res, next) {
    try {
        var type = req.params.type
        res.json(await MemberOptionsService.findByType(type))
    }
    catch (err) { 
        res.json(err)
    }
});


router.get("/get/:id", async function(req, res, next) {
    try {
        
        let id = req.params.id;
        res.json(await MemberOptionsService.findByID(id))
    }
    catch (err) {
        res.json(err)
    }

})

router.get("/get/vehicle-type/:type", async function (req, res, next) {
    try {
        let type = req.params.type;
        res.json(await MemberOptionsService.findByVehicle(type))
    }
    catch (err) { 
        res.json(err)
    }
});

// router.get("/get/:id", async function(req, res, next) {
//     try {
        
//         let id = req.params.id;
//         console.log(id)
//         res.json(await BranchesService.findById(id))
//     }
//     catch (err) {
//         console.error(` `, err.message);
//         next(err);
//     }

// })

// router.post("/create",async function (req, res, next){
//     try{
//         res.json(await TruckOrdersService.create(req.body))
//     }
//     catch (err) {
//         console.error(` `, err.message);
//         next(err);
//     }
// })







module.exports = {
    router,
  };