// Dependencies
// =============================================================
var express = require("express");
var path = require("path");
// Sets up the Express App
// =============================================================
var app = express();
var PORT = 3000;

app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});
