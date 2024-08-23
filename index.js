const {
  Client,
  GatewayIntentBits: Intents,
  Collection,
  Partials,
  EmbedBuilder,
} = require("discord.js");
const db = require("mongoose");
const client = new Client({
  intents: [Intents.Guilds, Intents.GuildMembers, Intents.GuildMessages],
  partials: [Partials.User, Partials.Message],
});
const path = require("node:path");
const fs = require("node:fs");

const { getAllFiles, cleanObject } = require("./utils.js");

const config = require("./config.json");

client.commandsArray = [];
client.commands = new Collection();
client.selectMenus = {
  string: new Collection(),
  user: new Collection(),
  channel: new Collection(),
  role: new Collection(),
};

client.colors = {
  errorColor: 0xed4245,
  successColor: 0x57f287,
};

const eventFolders = getAllFiles(path.join(__dirname, "events"), true);

for (const eventFolder of eventFolders) {
  const eventFiles = getAllFiles(eventFolder);
  let eventName = eventFolder.replace(/\\/g, "/").split("/").pop();
  client.on(eventName, async (...arg) => {
    for (const eventFile of eventFiles) {
      const eventFunction = require(eventFile);
      await eventFunction(...arg, client);
    }
  });
}

client.commandsArray = [];
const commandFolders = fs.readdirSync(path.join(__dirname, "commands"));
for (const folder of commandFolders) {
  const commandFiles = fs
    .readdirSync(`./commands/${folder}`)
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const command = require(`./commands/${folder}/${file}`);
    if (!command.data || !command.execute)
      return console.log(`${file} is missing "data" or "execute".`);

    client.commands.set(command.data.name, Object.assign(command, { folder }));
    client.commandsArray.push(cleanObject(command.data.toJSON()));
  }
}

(async () => {
  await db.connect(config.srv).then(() => client.login(config.token));

  db.connection.on("connected", () => console.log("Connected to DB!"));
  db.connection.on("disconnected", () => console.log("Disconnected from DB."));
  db.connection.on("err", (e) => console.log(`Database Error: ${e}`));
})();

module.exports = client;
