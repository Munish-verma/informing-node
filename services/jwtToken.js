"use strict"

const jwt = require("jsonwebtoken");
const config = require("config");

const jwtSecretKey = config.get("jwtPrivateKey");

function generateAuthToken(userId, email, role) {
    return jwt.sign({ userId: userId, email: email, role: role }, jwtSecretKey, { expiresIn: '14d' });
}

const verifyToken = (token) => {
    try {
        return jwt.verify(token, jwtSecretKey);
    } catch (err) {
        throw err;
    }
}

module.exports = {
    generateAuthToken,
    verifyToken
};
