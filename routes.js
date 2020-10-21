// Dependencies
// =============================================================
const express = require("express");
const path = require("path");
const notesController = require("./controllers/notesController");

const routes = express.Router();

// Middelware
// =============================================================
routes.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "public", "index.html"));
});

routes.get("/notes", (req, res) => {
    res.sendFile(path.resolve(__dirname, "public", "notes.html"));
});

routes.get("/api/notes", notesController.notes);

routes.get("/api/found/:id", notesController.found);

routes.post("/api/save", notesController.save);

routes.post("/api/update", notesController.update);

routes.post("/api/remove", notesController.remove);

module.exports = routes;
