const Discord = require("discord.js")
const cmdCooldown = {};
const moment = require("moment");

module.exports = class {
  constructor(bot) {
    this.bot = bot;
  }
  async run(message) {
    if (message.author.bot && message.channel.type === "dm") return;
    if (message.guild && !message.member) await message.guild.fetchMember(message.author);

    let prefix = this.bot.config.prefix;
    if (prefix === undefined) return prefix = this.bot.config.prefix;
    if (message.content.indexOf(prefix) !== 0 || message.content.startsWith(`${prefix} `)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    const cmd = this.bot.commands.get(command) || this.bot.commands.get(this.bot.aliases.get(command));
    if (!cmd) return;

    let neededPermission = [];
    if (!cmd.conf.botPermissions.includes("EMBED_LINKS")) {
      cmd.conf.botPermissions.push("EMBED_LINKS");
    }
    cmd.conf.botPermissions.forEach((perm) => {
      if (!message.channel.permissionsFor(message.guild.me).has(perm)) {
        neededPermission.push(perm);
      }
    });

    const owners = this.bot.config.owners;
    if (this.bot.config.maintenanceMode === true && !owners.includes(message.author.id)) {
      const embedmaintenance = new Discord.MessageEmbed()
        .setColor(message.guild.me.roles.highest.hexColor)
        .setTitle(":tools: Maintenance :tools:")
        .setDescription("Bot is currently in maintenance...")
      return message.channel.send(embedmaintenance).catch(error => this.bot.logger.perm("permission"))
    }

    if (cmd.conf.nsfw === true && !message.channel.nsfw) {
      var embednsfw = new Discord.MessageEmbed()
        .setColor(message.guild.me.roles.highest.hexColor)
        .setTitle(":x: Error :x:")
        .setDescription("You cannot place this command in this room.")
      message.channel.send(embednsfw).catch(error => this.bot.logger.perm("permission"))
    }

    if (neededPermission.length > 0) {
      var embedbotperm = new Discord.MessageEmbed()
        .setColor(message.guild.me.roles.highest.hexColor)
        .setTitle(":x: Permission error :x:")
        .setDescription(`I don’t have permission ${neededPermission.map((p) => `\`${p}\``).join(", ")}`)
      message.channel.send(embedbotperm).catch(error => this.bot.logger.perm("permission"))
    }

    neededPermission = [];
    cmd.conf.memberPermissions.forEach((perm) => {
      if (!message.channel.permissionsFor(message.member).has(perm)) {
        neededPermission.push(perm);
      }
    });

    if (neededPermission.length > 0) {
      const embedperm = new Discord.MessageEmbed()
        .setColor(message.guild.me.roles.highest.hexColor)
        .setTitle(":x: Permission error :x:")
        .setDescription(`You don’t have permission ${neededPermission.map((p) => `\`${p}\``).join(", ")}`)
      message.channel.send(embedperm).catch(error => this.bot.logger.perm("permission"))
    }

    if (cmd.conf.guildOnly && message.guild.id != this.bot.config.guildid) return;

    if (cmd.conf.supportOnly && message.guild.id != this.bot.config.guildsupport) {
      const embedsupportonly = new Discord.MessageEmbed()
        .setColor(message.guild.me.roles.highest.hexColor)
        .setTitle(":x: Error :x:")
        .setDescription(`This command can only be used on Discord Support.`)
      message.channel.send(embedsupportonly).catch(error => this.bot.logger.perm("permission"))
    }

    if (!cmd.conf.enabled && !owners.includes(message.author.id)) {
      const embedcmdon = new Discord.MessageEmbed()
        .setColor(message.guild.me.roles.highest.hexColor)
        .setTitle(":warning: Command not available :warning:")
        .setDescription("This command is temporarily in maintenance, try again later.")
      message.channel.send(embedcmdon);
    }

    if (cmd.conf.ownerOnly && !owners.includes(message.author.id)) {
      const embedowneronly = new Discord.MessageEmbed()
        .setColor(message.guild.me.roles.highest.hexColor)
        .setTitle(":man_police_officer: Command Admins :man_police_officer:")
        .setDescription("Cette commande est réservé aux administarteurs.")
      return message.channel.send(embedowneronly).catch(error => this.bot.logger.perm("permission"))
    }

    let uCooldown = cmdCooldown[message.author.id];
    if (!uCooldown) {
      cmdCooldown[message.author.id] = {};
      uCooldown = cmdCooldown[message.author.id];
    }

    const time = uCooldown[cmd.help.name] || 0;
    if (time && (time > Date.now()) && !owners.includes(message.author.id)) {
      const cooldown = moment.duration({ ms: time - Date.now() });
      const secondes = cooldown.seconds() < 10 ? `0${cooldown.seconds()}` : cooldown.seconds();
      const minutes = cooldown.minutes();
      let total = "";
      if (cooldown.hours() > 0) total += cooldown.hours() + "h ";
      if (minutes > 0) total += minutes + "m ";
      if (minutes <= 0 && cooldown.hours() > 0) total += "00m "
      total += secondes + "s"
      const embedcooldown = new Discord.MessageEmbed()
        .setColor(message.guild.me.roles.highest.hexColor)
        .setTitle(":clock1: Cooldown :clock1:")
        .setDescription("A cooldown is activated, you can use the commands all" + total)
      return message.channel.send(embedcooldown).catch(error => this.bot.logger.perm("permission"))
    }
    this.bot.logger.log(`${message.author.tag.underline} (${message.author.id}) starts the command : ${cmd.help.name.bold}`, "cmd");
    cmd.run(message, args)
  }
}