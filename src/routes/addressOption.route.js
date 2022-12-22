const AddressOption = require('../services/addressOption.service')
const express = require('express');
const router = express.Router();


router.get("/province/get", async function (req, res, next) {
    try {
        //* comments
        res.json(await AddressOption.findAllProvinces())
        
    }
    catch (err) { 
        res.json(err)
    }
});

router.get("/province/detail/get/:province", async function (req, res, next) {
    try {
        province = req.params.province;
        res.json(await AddressOption.find(province))
    }
    catch (err) { 
        res.json(err)
    }
});

router.get("/warehouses/get", async function (req, res, next) {
    try {
        res.json(await AddressOption.findAllWarehouses())
    }
    catch (err) { 
        res.json(err)
    }
});



module.exports = {
    router,
  };