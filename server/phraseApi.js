var _ = require('lodash');
var fs = require("fs");

function getPhrases() {
    var file = fs.readFileSync(__dirname + '/phrases.json');
    return JSON.parse(file);
}

module.exports = {
    getPhrases: getPhrases
};
