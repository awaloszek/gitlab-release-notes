const INFO = 2;
const ERROR = 1;

let level = ERROR;

function setLevel(newLevel) {
    level = newLevel;
}

function info(message) {
    if (level >= INFO)
        console.log(message);
}

function error(message) {
    console.error(message)
}

module.exports.setLevel = setLevel;
module.exports.LEVEL_INFO = INFO;
module.exports.LEVEL_ERROR = ERROR;
module.exports.error = error;
module.exports.info = info;