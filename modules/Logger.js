const moment = require("moment");
const colors = require("colors")

class Logger {
  static async log(content, type = "log") {
    const timestamp = `[${moment().format("YYYY-MM-DD HH:mm:ss")}]:`.bold;
    switch (type) {
      case "log": {
        return console.log(`${timestamp} ${colors.blue.bold(type.toUpperCase())} ${content} `);
      }
      case "warn": {
        return console.log(`${timestamp} ${colors.yellow.bold(type.toUpperCase())} ${content} `);
      }
      case "error": {
        return console.log(`${timestamp} ${colors.white.bold.bgRed(type.toUpperCase())} ${content} `);
      }
      case "cmd": {
        return console.log(`${timestamp} ${colors.magenta.bold(type.toUpperCase())} ${content}`);
      }
      case "ready": {
        return console.log(`${timestamp} ${colors.green.bold(type.toUpperCase())} ${content}`);
      }
      default:
        throw new TypeError("The type of logger must be warn, debug, log, ready, cmd or error.");
    }
  }
  static async perm(type = "permission") {
    const timestamp = `[${moment().format("YYYY-MM-DD HH:mm:ss")}]:`.bold;
    switch (type) {
      case "permission": {
        return console.log(`${timestamp} ${colors.yellow.bold(type.toUpperCase())} Permission missing from bot.`);
      }
      default:
        throw new TypeError("The type of logger must be permission.");
    }
  }

  static error(content) {
    return this.log(content, "error");
  }
  static warn(content) {
    return this.log(content, "warn");
  }
  static debug(content) {
    return this.log(content, "debug");
  }
  static cmd(content) {
    return this.log(content, "cmd");
  }
}

module.exports = Logger;