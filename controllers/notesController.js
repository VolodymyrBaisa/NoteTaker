// Dependencies
// =============================================================
const db = require("../model/db/db");
const uuid = require("uuid");

module.exports.save = (req, res) => {
    const body = req.body;
    if (body) {
        body.id = uuid.v4();
        db.save(body);
        res.status(200).json({
            status: "success",
            body,
        });
    }
};

module.exports.notes = (req, res) => {
    const data = db.readAll();
    if (data) {
        res.send(data);
    }
};

module.exports.remove = (req, res) => {
    const id = req.body.id;
    if (id) {
        db.remove(id);
        res.status(200).json({
            status: "success",
            id,
        });
    }
};

module.exports.update = (req, res) => {
    const id = req.body.id;
    if (id) {
        db.update(req.body);
        res.status(200).json({
            status: "success",
            id,
        });
    }
};

module.exports.found = (req, res) => {
    const id = req.params.id;
    if (id) {
        const data = db.found(id);
        if (data) {
            res.send(data);
        }
    }
};
