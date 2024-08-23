const { Interaction, InteractionType } = require("discord.js");
const ExtendedClient = require("../../index");

/**
 *
 * @param {Interaction} interaction
 * @param {ExtendedClient} client
 */
module.exports = async (interaction, client) => {
  if (interaction.type != InteractionType.ApplicationCommand) return;

  if (!interaction.guild) {
    return await interaction.reply({
      embeds: [
        client
          .embed(interaction)
          .setColor(client.config.errorColor)
          .setDescription("```Slash commands can only be used in servers.```"),
      ],
    });
  }
  const command = client.commands.get(interaction.commandName);
  if (!command) client.application.commands.delete(interaction.commandName);

  try {
    await command.execute(interaction, client);
  } catch (error) {
    await interaction.deferReply({ ephemeral: true }).catch(() => {});
    await interaction.editReply({
      content: `Error: \`\`\`js\n${error.stack}\`\`\``,
    });
  }
};
