/*
    separate logging lib for external logging tools,
    in order to remove that dependency from the app-related
    files that will be unit tested
*/

const chalk = require('chalk');

function err(text) {
    console.log(chalk.red(text));
}

function info(text) {
    console.log(chalk.blue(text));
}

function fail(text) {
    console.log(chalk.bgRed(text));
}

module.exports = {
    "error": err,
    "info": info,
    "fail": fail
}
