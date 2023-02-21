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

router.get("/get/sub_contract", async function (req, res, next) {
    try {
        
        res.json(await MemberOptionsService.groupSubContract())
    }
    catch (err) { 
        res.json(err)
    }
});
//*=============================================================
router.get("/get/membersOptions", async function (req, res, next) {
    try {
        
        res.json(await MemberOptionsService.groupMemberOptions())
    }
    catch (err) { 
        res.json(err)
    }
});
//*=============================================================

router.get("/get/monthly", async function (req, res, next) {
    try {
        res.json(await MemberOptionsService.findMonthlyData(req.query))
        // res.json(await MemberOptionsService.findMonthlyData(req.query))
    }
    catch (err) { 
        res.json(err)
    }
});


router.get("/get/vehicle-type/:type", async function (req, res, next) {
    try {
        let type = req.params.type;
        res.json(await MemberOptionsService.findByVehicle(type))
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

// router.get("/get/:id", async function(req, res, next) {
//     try {
        
//         let id = req.params.id;
//         
//         res.json(await BranchesService.findById(id))
//     }
//     catch (err) {
//         
//         next(err);
//     }

// })

// router.post("/create",async function (req, res, next){
//     try{
//         res.json(await TruckOrdersService.create(req.body))
//     }
//     catch (err) {
//         
//         next(err);
//     }
// })







module.exports = {
    router,
  };