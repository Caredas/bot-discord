const Discord = require('discord.js');
const Command = require("../../modules/Command.js");

class help extends Command {
        constructor(bot) {
                super(bot, {
                        name: "help", //Name of the command
                        description: "To display this message", //Description of the command
                        usage: "{prefix}help", //Usage of the command
                        examples: "{prefix}help", //Exemple to use command
                        dirname: __dirname, //Name of the file
                        enabled: true, //Command enable (true|false)
                        nsfw: false, //Command NSFW (true|false)
                        guildOnly: false, //Only server in config
                        aliases: ["h"], //Aliases of the command
                        botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"], //Bot permission needed
                        memberPermissions: ["SEND_MESSAGES"], //Member permission needed
                        ownerOnly: false, //Command for only owner of the bot
                        supportOnly: false, //Command to server support only
                        cooldown: 1000 //Cooldown to execute command
                });
        }
        async run(message, args) {
                const cmd = this.bot.commands
                const utilCMD = cmd.filter((cmd) => cmd.help.category.toLowerCase() === 'utils').filter(r => r.conf.enabled !== false && r.conf.guildOnly !== true && r.conf.ownerOnly !== true);
                const embed = new Discord.MessageEmbed()
                        .setColor(message.guild.me.roles.highest.hexColor)
                        .setTitle(`Help menu of ${this.bot.user.username}`)
                        .addField(`Utils (${utilCMD.size})`, `${utilCMD.map((cmd) => "`" + cmd.help.name.slice(0, 1).toUpperCase() + cmd.help.name.slice(1, cmd.help.name.length) + "` - " + cmd.help.description).join("\n")}`)
                message.channel.send(embed).catch(error => this.bot.logger.log(`Erreur : ${error.message}`, "error"))
        }
}

module.exports = help;