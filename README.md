#######################################################
#           Welcome of the open source bot            #
#######################################################


**Install the bot**

To install the bot go to your bo folder (D:\bot-discord).
Launch your command prompt in the bot folder.
Then execute the command `npm install --save` (the operation may last a few seconds or minutes depending on your connection)


**Launch the bot**

To launch the bot you-must fill in the fields in the file `config.js`.
Once the file is completed, return to your command prompt.
Then execute the command `node index.js` (Version de nodejs v14)


**Let the bot start**

For the bot to stop working when you close your console, you need to host it.
If you own a vps or any other form of machine, you can launch it with pm2.
In your console execute the command `pm2 start index.js`, to restart it run the command `pm2 restart index.js`; and to stop run the command `pm2 stop index.js`.
If you want to follow the bot logs you can via the `pm2 logs`.
For more information you can go to the link `https://pm2.keymetrics.io/`


By CAREDAS#2501
