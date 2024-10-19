module.exports = (client) => {
    client.handleCommands = async () => {
        const fs = require('fs');
        const { REST } = require('@discordjs/rest');
        const { Routes } = require('discord-api-types/v9');
        const { TOKEN, GUILD_ID, CLIENT_ID} = require(`../../settings/config.js`);
        const commandFolders = fs.readdirSync('./commands');
        let names = [];


        for (const folder of commandFolders) {
            const commandFiles = fs
                .readdirSync(`./commands/${folder}`)
                .filter((file) => file.endsWith(".js"));

            const { commands, commandArray } = client;
            for (const file of commandFiles) {
                const command = require(`../../commands/${folder}/${file}`);
                commands.set(command.data.name, command,);


                commandArray.push(command.data.toJSON());


                names.push(`${command.data.name}`);
            }
        }
        //logger.debug(`ALLCommand: load`.bgCyan);
        //console.log(createBox(names));

        const rest = new REST({ version: '9' }).setToken(TOKEN);
        try {
            //console.log("Started load applicationGuidCommands (/) commands.".yellow);

            await rest.put(Routes.applicationCommands(CLIENT_ID, GUILD_ID), {
                body: client.commandArray,
            });
            console.log(`[INFORMATION] Loading (/) commands`)
        } catch (error) {
            console.error(error);
        }
    };
};