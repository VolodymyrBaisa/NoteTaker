// Dependencies
// =============================================================
const fs = require("fs");
const path = require("path");
//Variables
// =============================================================
const filePath = path.resolve(__dirname, "db.json");

module.exports.save = (body) => {
    const note = JSON.stringify(body);
    try {
        const fd = fs.openSync(filePath, "r+");
        const stats = fs.statSync(filePath);
        if (stats["size"] > 2) {
            const buf = Buffer.from("," + note + "]");
            fs.writeSync(fd, buf, 0, buf.length, stats["size"] - 1);
        } else {
            const buf = Buffer.from("[" + note + "]");
            fs.writeSync(fd, buf, 0, buf.length);
        }
    } catch (err) {
        console.error(err);
    }
};

module.exports.remove = (id) => {
    try {
        const stats = fs.statSync(filePath);
        if (stats["size"] > 2) {
            const rf = fs.readFileSync(filePath, "utf-8");
            const json = JSON.parse(rf);
            const filtered = json.filter((item) => item.id !== id);
            fs.writeFileSync(filePath, JSON.stringify(filtered));
        }
    } catch (err) {
        console.error(err);
    }
};

module.exports.update = (body) => {
    try {
        const stats = fs.statSync(filePath);
        if (stats["size"] > 2) {
            const rf = fs.readFileSync(filePath, "utf-8");
            const json = JSON.parse(rf);
            const index = json.findIndex((el) => el.id === body.id);
            const obj = json[index];

            obj.header = body.header;
            obj.note = body.note;
            json[index] = obj;
            fs.writeFileSync(filePath, JSON.stringify(json));
        }
    } catch (err) {
        console.error(err);
    }
};

module.exports.readAll = () => {
    try {
        return fs.readFileSync(filePath, { encoding: "utf8", flag: "r" });
    } catch (err) {
        console.error(err);
    }
};

module.exports.found = (id) => {
    try {
        const rf = fs.readFileSync(filePath, {
            encoding: "utf8",
            flag: "r",
        });
        const json = JSON.parse(rf);
        return json.filter((item) => item.id === id);
    } catch (err) {
        console.error(err);
    }
};
