const fs = require("fs");
const util = require("util");
readdir = util.promisify(fs.readdir);
const index = require("./modules/Client");
const bot = new index();

const init = async () => {
    let directories = await readdir("./commands/");
    directories.forEach(async (dir) => {
        let commands = await readdir("./commands/" + dir + "/");
        commands.filter((cmd) => cmd.split(".").pop() === "js").forEach((cmd) => {
            const response = bot.loadCommand("./commands/" + dir, cmd);
            if (response) {
                bot.logger.log(response, "error");
            }
        });
    });
    const evtFiles = await readdir("./events/");
    evtFiles.forEach((file) => {
        const eventName = file.split(".")[0];
        bot.logger.log(`Loaded event : ${(eventName).white}`);
        const event = new (require(`./events/${file}`))(bot);
        bot.on(eventName, (...args) => event.run(...args));
        delete require.cache[require.resolve(`./events/${file}`)];
    });
    bot.login(bot.config.token);
};
init();