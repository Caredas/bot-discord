const fetch = require("node-fetch");

module.exports = {

    sortByKey(array, key) {
        return array.sort(function (a, b) {
            let x = a[key];
            let y = b[key];
            return ((x < y) ? 1 : ((x > y) ? -1 : 0));
        });
    },

    shuffle(pArray) {
        let array = [];
        pArray.forEach(element => array.push(element));
        let currentIndex = array.length, temporaryValue, randomIndex;
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    },

    randomNum(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    },

    hexToDecimal(hex) {
        return parseInt(hex.replace("#", ""), 16)
    },

    async request(url, auth) {
        if (!url) return "Url not provided.";
        if (!auth) return "Credentials not provided.";

        const authParams = {
            headers: {
                'Authorization': "Bearer " + auth
            }
        }

        return new Promise(async resolve => {
            fetch(url, authParams).then(res => {
                resolve(res.json())
            })
        })
    },

    getUptime(seconds) {
        const months = Math.floor(seconds / (2592000));
        seconds -= months * (2592000);

        const weeks = Math.floor(seconds / (604800));
        seconds -= weeks * (604800);

        const days = Math.floor(seconds / (86400));
        seconds -= days * (86400);

        const hours = Math.floor(seconds / (3600));
        seconds -= hours * (3600);

        const minutes = Math.floor(seconds / (60));
        seconds -= minutes * (60);

        const months_string = (0 < months) ? `${months} months, ` : '';
        const weeks_string = (0 < weeks) ? `${weeks} week${weeks > 2 ? "s" : ""}, ` : '';
        const day_string = (0 < days) ? `${days} day${days > 2 ? "s" : ""}, ` : '';
        const hours_string = (0 < hours) ? `${hours} hour${hours > 2 ? "s" : ""}, ` : '';
        const minutes_string = (0 < minutes || 0 < hours) ? `${minutes} minute${minutes > 1 ? "s" : ""}, ` : '';
        const seconds_string = `${Math.floor(seconds)} second${seconds > 2 ? "s" : ""}.`;

        return months_string + weeks_string + day_string + hours_string + minutes_string + seconds_string;
    },

    requestURL(url, options) {
        if (options) {
            return new Promise(async resolve => {
                fetch(url, options).then(res => {
                    resolve(res.json());
                });
            });
        } else {
            return new Promise(async resolve => {
                fetch(url).then(res => {
                    resolve(res.json());
                });
            });
        }
    }
};