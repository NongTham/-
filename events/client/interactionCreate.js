const { Collection, PermissionBitField } = require('discord.js');
const ms = require('ms');
const client = require('discord.js');


module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (interaction.isChatInputCommand()) {
            const { commands } = client;
            const { commandName } = interaction;
            const command = commands.get(commandName);
            if (!command) return;

            try {
                await command.execute(interaction, client);
            } catch (error) {
                console.error(error)
                
                const channel = interaction.channel;
                await channel.send(`มี ERROR เกิดขึ้นในระบบโปรดลองอีกครั้ง หลังจาก Reboot เสร็จสิ้น (โปรดแจ้ง Support เพื่อแก้ไขปัญหา)`,
                );
                process.exit(1);
            }
        } else if (interaction.isButton()) {
            const { buttons } = client;
            const { customId } = interaction;
            const button = buttons.get(customId);
            if (!button) return new Error('No Buttons');

            try {
                await button.execute(interaction, client);

            } catch (err) {
                console.error(err);
            }
        }
    },
}