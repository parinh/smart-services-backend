const jwt = require('jsonwebtoken');
// const { jwt_secret } = require('../../global');

const jwt_secret = 'sMartSERviCe-MVRBS'

function signToken(data) {
    return jwt.sign({data}, jwt_secret, { expiresIn: '5d' });
}

function verifyToken(token) {
    return jwt.verify(token, jwt_secret)
}

function decodeToken(token) {
    return jwt.decode(token, jwt_secret)
}

module.exports = {
    signToken,
    verifyToken,
    decodeToken
}
