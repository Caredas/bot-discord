const { Client, Collection } = require("discord.js");
const util = require("util");
const path = require("path");

class index extends Client {

    constructor (options) {
        super(options);
        this.config = require("../config");
        this.commands = new Collection();
        this.aliases = new Collection();
        this.logger = require("./Logger");
        this.wait = util.promisify(setTimeout);
        this.functions = require("./Functions");
    }

    loadCommand (commandPath, commandName) {
        try {
            const props = new (require(`.${commandPath}${path.sep}${commandName}`))(this);
            this.logger.log(`Loading the commands : ${(props.help.name).white.bold}.`, "log");
            props.conf.location = commandPath;
            if (props.init){
                props.init(this);
            }
            this.commands.set(props.help.name, props);
            props.conf.aliases.forEach((alias) => {
                this.aliases.set(alias, props.help.name);
            });
            return false;
        } catch (e) {
            return `Unable to load command ${commandName}: ${e}`;
        }
    }

    async unloadCommand (commandPath, commandName) {
        let command;
        if(this.commands.has(commandName)) {
            command = this.commands.get(commandName);
        } else if(this.aliases.has(commandName)){
            command = this.commands.get(this.aliases.get(commandName));
        }
        if(!command){
            return `The command \`${commandName}\` does not appear to exist, nor in aliases. Try again !`;
        }
        if(command.shutdown){
            await command.shutdown(this);
        }
        delete require.cache[require.resolve(`.${commandPath}${path.sep}${commandName}.js`)];
        return false;
    }
    
    async resolveUser(search){
        let user = null;
        if(!search || typeof search !== "string") return;
        if(search.match(/^<@!?(\d+)>$/)){
            let id = search.match(/^<@!?(\d+)>$/)[1];
            user = this.users.fetch(id).catch((err) => {});
            if(user) return user;
        }
        if(search.match(/^!?(\w+)#(\d+)$/)){
            let username = search.match(/^!?(\w+)#(\d+)$/)[0];
            let discriminator = search.match(/^!?(\w+)#(\d+)$/)[1];
            user = this.users.find((u) => u.username === username && u.discriminator === discriminator);
            if(user) return user;
        }
        user = await this.users.fetch(search).catch(() => {});
        return user;
    }

    async resolveMember(search, guild){
        let member = null;
        if(!search || typeof search !== "string") return;
        if(search.match(/^<@!?(\d+)>$/)){
            let id = search.match(/^<@!?(\d+)>$/)[1];
            member = await guild.members.fetch(id).catch(() => {});
            if(member) return member;
        }
        if(search.match(/^!?(\w+)#(\d+)$/)){
            guild = await guild.fetch();
            member = guild.members.find((m) => m.user.tag === search);
            if(member) return member;
        }
        member = await guild.members.fetch(search).catch(() => {});
        return member;
    }

    async resolveRole(search, guild){
        let role = null;
        if(!search || typeof search !== "string") return;
        if(search.match(/^<@&!?(\d+)>$/)){
            let id = search.match(/^<@&!?(\d+)>$/)[1];
            role = guild.roles.get(id);
            if(role) return role;
        }
        role = guild.roles.find((r) => search === r.name);
        if(role) return role;
        role = guild.roles.get(search);
        return role;
    }
}

module.exports = index;
