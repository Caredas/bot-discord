const config = require("../config.js")

module.exports = class {
    constructor(bot) {
        this.bot = bot;
    }
    async run() {
        this.bot.logger.log(`${this.bot.user.tag} is ready.`, "ready");
        this.bot.setInterval(async () => {
            let i = 0;
            const toDisplay = config.status[parseInt(i, 10)].name
            this.bot.user.setActivity(toDisplay, {
                type: config.status[parseInt(i, 10)].type
            });
            if (config.status[parseInt(i + 1, 10)]) i++;
            else i = 0;
        }, 60 * 1000);
    }
}