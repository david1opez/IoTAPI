"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var cors_1 = require("cors");
var app_1 = require("firebase/app");
var database_1 = require("firebase/database");
var app = (0, express_1.default)();
var port = 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
var firebaseConfig = {
    apiKey: "AIzaSyBclDs5GhHaouQ4YgDb3Xmd7p-dLI8IBAY",
    authDomain: "iotdb-e823a.firebaseapp.com",
    projectId: "iotdb-e823a",
    storageBucket: "iotdb-e823a.appspot.com",
    messagingSenderId: "841356106534",
    appId: "1:841356106534:web:5316ca365c6a646503bfe7",
    databaseURL: "https://iotdb-e823a-default-rtdb.firebaseio.com",
};
var fireApp = (0, app_1.initializeApp)(firebaseConfig);
app.get('/sensors', function (req, res) {
    var db = (0, database_1.getDatabase)();
    var starCountRef = (0, database_1.ref)(db);
    (0, database_1.onValue)(starCountRef, function (snapshot) {
        var data = snapshot.val();
        res.status(200);
        res.send(data);
    });
});
app.post('/sensors', function (req, res) {
    var db = (0, database_1.getDatabase)();
    var data = req.body;
    (0, database_1.update)((0, database_1.ref)(db), {
        alt: data.alt,
        x: data.x,
        y: data.y,
        tilt: data.tilt
    }).then(function () {
        res.status(200);
        res.send('Data Received: ' + JSON.stringify(data));
    });
});
app.listen(port, function () {
    console.log("Server is listening on port ".concat(port));
});
