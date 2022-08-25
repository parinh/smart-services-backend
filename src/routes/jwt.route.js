const express = require('express');
const jwtRouter = express.Router();
const jwt = require('../services/jwt.service');

jwtRouter.get('/sign', async function (req, res, next) {
    try {
        var user = JSON.parse(req.query.user)
        res.json(jwt.signToken(user));
    } catch (err) {
        console.error(`Error while signing `, err.message);
        next(err);
    }
});

jwtRouter.get('/verify', async function (req, res, next) {
    try {
        var token = req.query.token;
        var decoded = jwt.verifyToken(token)
        var user = {
            id: decoded.data.id,
            name: decoded.data.name,
            tel: decoded.data.tel,
            role_id: decoded.data.role_id,
            username: decoded.data.username,

        }
        res.json(user);
    } catch (err) {
        console.error(`Error while verifying `, err.message);
        next(err);
    }
});
jwtRouter.get('/decode', async function (req, res, next) {
    try {
        var token = req.query.token;

        var decoded = jwt.decodeToken(token)
 
        res.json(decoded);
    } catch (err) {
        console.error(`Error while verifying `, err.message);
        next(err);
    }
});

module.exports = { jwtRouter }