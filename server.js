// Dependencies
// =============================================================
const express = require("express");
const bodyParser = require("body-parser");
const routes = require("./routes");
const path = require("path");
// Sets up the Express App
// =============================================================
const app = express();
const PORT = process.env.PORT || 3000;

// Middelware
// =============================================================
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "/public")));
app.use(routes);
// Routes
// =============================================================

app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});
