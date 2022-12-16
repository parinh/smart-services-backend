const express = require('express');
const router = express.Router();

const users = require("../services/users.service")

router.get("/get", async function (req, res, next) {
    try {
        res.json(await users.find())
    }
    catch (err) {
        res.json(err)
    }
});

router.get("/get/user-roles", async function (req, res, next) {
    try {
        res.json(await users.getUserRoles())
    }
    catch (err) {
        res.json(err)
    }
});

router.patch("/gen/password", async function (req, res, next) {
    try {
        res.json(await users.genPassWord(req.body))
    }
    catch (err) {
        res.json(err)
    }
});

router.get("/get/:id", async function (req, res, next) {
    try {
        id = req.params.id
        res.json(await users.findById(id))
    }
    catch (err) {
        res.json(err)
    }
});

router.post("/create" ,async function (req, res, next) {
    try{
        res.json(await users.create(req.body))
    }
    catch(err){
        
    }
})

router.post("/auth", async function (req, res, next) {
    try {
        res.json(await users.authenticated(req.body))
    }
    catch (err) {
        res.json(err)
    }
});

router.put("/update/:id", async function (req, res, next) {
    try {
        id = req.params.id
        res.json(await users.update(req.body,id))
    }
    catch (err) {
        res.json(err)
    }
});

router.delete("/delete/:id" , async function (req, res, next) {
    try{
        id = req.params.id
        res.json(await users.destroy(id))
    }
    catch (err){
        res.json(err)
    }
})


module.exports = {
    router,
  };

  var obj = {
    origin:{
        cus_po_id: "เลข booking gen จาก table booking",
        ship_date: "เวลาที่กรอกใน move",
        branch:{
            address: "ที่อยู่ string",
            lat:"lat",
            lng:"lng",
            province:"province",
            district_name:"district",
            sub_district_name:"sub_district_name",
            zip_code:"zip_code",
            address:"อธิบายที่อยู่ ถ้ามี",
            cont_name: "ชื่อลูกค้า",
            cont_tel: "tel",
            branch_code: "email"

        } 
        
    },
    destination:{
        cus_po_id: "เลข booking gen จาก table booking",
        ship_date: "null",
        branch:{
            address: "ที่อยู่ string",
            lat:"lat",
            lng:"lng",
            province:"province",
            district_name:"district",
            sub_district_name:"sub_district_name",
            zip_code:"zip_code",
            address:"อธิบายที่อยู่ ถ้ามี",
            cont_name: "ชื่อลูกค้า",
            cont_tel: "tel",
            branch_code: "email"
        }
    },
    boxes:{}

  }