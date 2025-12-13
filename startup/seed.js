"use strict"

const mongoose = require("mongoose");
const { Admin } = require("../models/admin.js");
const { generateHash } = require("../services/bcrypt.js");
const config = require("config");

const environment = config.get("environment");

module.exports = async function () {
    try {
        let query = { email: "admin1@support.com" }
        let admin = await Admin.findOne(query);

        if (!admin) {
            let defaultPassword = '12345678';
            let password = generateHash(defaultPassword);

            let newAdmin = {
                email: "admin1@support.com",
                password: password,
                admin: true,
            }
            await Admin.create(newAdmin);

        }

    } catch (err) {
        console.error("Error seeding database:", err);
    }
};



