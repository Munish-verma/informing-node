"use strict";

const { FcmLog } = require("../models/fcmLog");
const { formatter } = require("../services/commonFunctions.js");
const config = require('config');
const admin = require('firebase-admin');
const notifications = require("../config/notifications.js");

console.log(`\n "${config.get("environment")} environment" \n`);

const serviceAccount = require("../config/firebaseKeys/firebaseDev.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

async function sendFcmNotification(token, data, type) {
    if (!token) {
        console.error('No token provided');
        return;
    }

    const message = {
        token,
        notification: {},
        android: { notification: { sound: "default", priority: "high" }, ttl: 30 },
        apns: { payload: { aps: { sound: "default", contentAvailable: true, priority: "high" } } },
        data: { ...data, type, click_action: "FLUTTER_NOTIFICATION_CLICK" }
    };

    let fcmLog = new FcmLog({
        token,
        email: data.email,
        messageData: data,
        receiverId: data.receiverId,
        type,
    });

    switch (type) {
        case "welcomeMessage":
            message.notification.title = notifications.welcomeMessageTitle;
            message.notification.body = formatter(notifications.welcomeMessage, data);
            message.data = data;
            message.data.title = notifications.welcomeMessageTitle;
            message.data.body = formatter(notifications.welcomeMessage, data);
            message.data.type = type;
            message.data.click_action = "FLUTTER_NOTIFICATION_CLICK";
            fcmLog.type = type;
            fcmLog.title = notifications.welcomeMessageTitle;
            fcmLog.message = formatter(notifications.welcomeMessage, data);
            break;

        case "purchaseSuccess":
            message.notification.title = notifications.purchaseSuccessTitle;
            message.notification.body = formatter(notifications.purchaseSuccess, data);
            message.data = data;
            message.data.title = notifications.purchaseSuccessTitle;
            message.data.body = formatter(notifications.purchaseSuccess, data);
            message.data.type = type;
            message.data.click_action = "FLUTTER_NOTIFICATION_CLICK";
            fcmLog.type = type;
            fcmLog.title = notifications.purchaseSuccessTitle;
            fcmLog.message = formatter(notifications.purchaseSuccess, data);
            break;

        case "purchaseFailure":
            message.notification.title = notifications.purchaseFailureTitle || "Insurance Purchase Failed";
            message.notification.body = formatter(notifications.purchaseFailure || "Sorry, your {insuranceCategory} insurance purchase failed. Please try again.", data);
            message.data = data;
            message.data.title = notifications.purchaseFailureTitle || "Insurance Purchase Failed";
            message.data.body = formatter(notifications.purchaseFailure || "Sorry, your {insuranceCategory} insurance purchase failed. Please try again.", data);
            message.data.type = type;
            message.data.click_action = "FLUTTER_NOTIFICATION_CLICK";
            fcmLog.type = type;
            fcmLog.title = notifications.purchaseFailureTitle || "Insurance Purchase Failed";
            fcmLog.message = formatter(notifications.purchaseFailure || "Sorry, your {insuranceCategory} insurance purchase failed. Please try again.", data);
            break;

        case "insuranceExpiring":
            message.notification.title = notifications.insuranceExpiringTitle;
            message.notification.body = formatter(notifications.insuranceExpiring, data);
            message.data = data;
            message.data.title = notifications.insuranceExpiringTitle;
            message.data.body = formatter(notifications.insuranceExpiring, data);
            message.data.type = type;
            message.data.click_action = "FLUTTER_NOTIFICATION_CLICK";
            fcmLog.type = type;
            fcmLog.title = notifications.insuranceExpiringTitle;
            fcmLog.message = formatter(notifications.insuranceExpiring, data);
            break;

        case "promotional":
            message.notification.title = data.title;
            message.notification.body = data.body;
            message.data = data;
            message.data.title = data.title;
            message.data.body = data.body;
            message.data.type = type;
            message.data.click_action = "FLUTTER_NOTIFICATION_CLICK";
            fcmLog.type = type;
            fcmLog.title = data.title;
            fcmLog.message = data.body;
            break;
        case "communication":
            message.notification.title = notifications.communicationTitle;
            message.notification.body = formatter(notifications.communication, data);
            message.data = data;
            message.data.title = notifications.communicationTitle;
            message.data.body = formatter(notifications.communication, data);
            message.data.type = type;
            message.data.click_action = "FLUTTER_NOTIFICATION_CLICK";

            fcmLog.type = type;
            fcmLog.title = notifications.communicationTitle;
            fcmLog.message = formatter(notifications.communication, data);
            break;

        default:
            message.notification.title = data.title;
            message.notification.body = data.body;
            fcmLog.title = data.title;
            fcmLog.message = data.body;
            fcmLog.type = type;
            message.data = data;
            message.data.click_action = "FLUTTER_NOTIFICATION_CLICK";
    }

    console.log(message, "message")

    try {
        await admin.messaging().send(message).then(async (response) => {
            console.log("\n\n******* SUCCESS FCM NOTIFICATION: " + response + " |Type: " + type + " |DataType: " + data.type + " |RecId: " + data.receiverId + "*********\n");
            console.log("\nNotificationData......", data);

            fcmLog.status = "success";
            fcmLog.payload = message;
            fcmLog.response = response;
            await fcmLog.save();
        }).catch(async (error) => {
            console.log("Error sending message:", error);
            fcmLog.status = "failed";
            fcmLog.payload = message;
            fcmLog.response = error;
            await fcmLog.save();
        });
    } catch (ex) {
        console.error('Error sending message:', ex);
        fcmLog.payload = message;
        fcmLog.status = "failed";
        fcmLog.response = ex;
        await fcmLog.save();
    }
}

module.exports = {
    sendFcmNotification,
};