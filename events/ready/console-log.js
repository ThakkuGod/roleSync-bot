const ExtendedClient = require("../../index");

/**
 *
 * @param {ExtendedClient} client
 */
module.exports = async (client) => {
  await loadCommands(client);
  console.log(`${client.user.username} Connected To Discord!`);

  const channel = client.channels.cache.get("1050366454479982623");
  
  process.on("unhandledRejection", async (reason, promise) => {
    console.log(`Unhandled Rejection at: ${promise}\n\nReason: ${reason}`);
    channel.send(`Unhandled Rejection at: ${promise}\n\nReason: ${reason}`)
  });
  
  process.on("uncaughtException", async (error) => {
    console.log(`Uncaught Exception at: ${error.stack}`);
    channel.send(`Uncaught Exception at: ${error.stack}`)
  });
  
  process.on("uncaughtExceptionMonitor", (err, origin) => {
    console.log(`Uncaught Exception Monitor: ${err.stack} ${origin}`);
    channel.send(`Uncaught Exception Monitor: ${err.stack} ${origin}`);
  });
  
};

async function loadCommands(client) {
  try {
    await client.application.commands.set(client.commandsArray).then(() => {
      console.log(
        `Loaded ${client.commandsArray.length} slash commands!`
      );
    });
  } catch (error) {
   console.log(error.stack);
  }
}
