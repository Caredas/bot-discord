const path = require("path");

module.exports = class Command {
  constructor(bot, {
    name = null,
    description = "No description provided.",
    usage = "No use provided.",
    examples = "No example provided.",
    dirname = false,
    enabled = true,
    nsfw = false,
    guildOnly = false,
    aliases = new Array(),
    botPermissions = new Array(),
    memberPermissions = new Array(),
    ownerOnly = false,
    supportOnly = false,
    cooldown = 2000,
  }) {
    let category = (dirname ? dirname.split(path.sep)[parseInt(dirname.split(path.sep).length - 1, 10)] : "Other");
    this.bot = bot;
    this.conf = { enabled, nsfw, guildOnly, aliases, memberPermissions, botPermissions, ownerOnly, supportOnly, cooldown };
    this.help = { name, description, category, usage, examples };
  }
};