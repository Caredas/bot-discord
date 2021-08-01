const Command = require("../../modules/Command.js");

class ping extends Command {
        constructor(bot) {
                super(bot, {
                        name: "ping", //Name of the command
                        description: "To ping", //Description of the command
                        usage: "{prefix}ping", //Usage of the command
                        examples: "{prefix}ping", //Exemple to use command
                        dirname: __dirname, //Name of the file
                        enabled: true, //Command enable (true|false)
                        nsfw: false, //Command NSFW (true|false)
                        guildOnly: false, //Only server in config
                        aliases: ["p"], //Aliases of the command
                        botPermissions: ["SEND_MESSAGES"], //Bot permission needed
                        memberPermissions: ["SEND_MESSAGES"], //Member permission needed
                        ownerOnly: false, //Command for only owner of the bot
                        supportOnly: false, //Command to server support only
                        cooldown: 1000 //Cooldown to execute command
                });
        }
        async run(message, args) {
            message.channel.send("pong")
        }
}

module.exports = ping;