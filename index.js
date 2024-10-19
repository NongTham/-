const { Client, GatewayIntentBits, Collection } = require("discord.js");
const fs = require("fs");
const { TOKEN } = require("./settings/config.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();
client.aliases = new Collection();
client.buttons = new Collection();
client.selectMenus = new Collection();
client.commandArray = [];

const functionFolders = fs.readdirSync(`./functions`);
for (const folder of functionFolders) {
  const functionFiles = fs
    .readdirSync(`./functions/${folder}`)
    .filter((file) => file.endsWith(".js"));
  for (const file of functionFiles)
    require(`./functions/${folder}/${file}`)(client);
  console.log(`[INFORMATION] Loading Functions`);
}

client.handleEvents();
client.handleCommands();
client.handleComponents();

client.login(TOKEN);
