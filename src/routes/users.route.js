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
        console.error(` `, err.message);
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