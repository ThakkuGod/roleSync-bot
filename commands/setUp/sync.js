const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionsBitField,
} = require("discord.js");
const schema = require("../../models/roleSync");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("sync")
    .setDescription("Setup the role verification system")
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
    .addSubcommand((sub) =>
      sub
        .setName("enable")
        .setDescription("Setup the role sync system")
        .addStringOption((op) =>
          op
            .setName("guild")
            .setDescription("The ID of the other guild.")
            .setRequired(true)
            .setMinLength(18)
            .setMaxLength(20)
        )
    )
    .addSubcommand((sub) =>
      sub.setName("disable").setDescription("Disable the role sync system")
    ),

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {import('../../index')} client
   */
  async execute(interaction, client) {
    const { options, guildId } = interaction;
    const sub = options.getSubcommand();

    await interaction.deferReply({ ephemeral: true });

    let data = await schema.findOne({ initGuild: guildId });

    if (sub == "enable") {
      const toGuild = options.getString("guild");
      if (!client.guilds.cache.get(toGuild))
        return await interaction.editReply({
          embeds: [
            {
              description:
                "**<:Mod_Error:1175049241320751215> The provided guild ID may be wrong or the bot is not in that guild.**",
              color: client.colors.errorColor,
            },
          ],
        });
      if (data && data.toGuild == toGuild)
        return await interaction.editReply({
          embeds: [
            {
              description:
                "** <:sync:1221845943377203210> Sync system refreshed!**",
            },
          ],
        });
      if (data) {
        data.toGuild = toGuild;
        await data.save();
      } else {
        data = schema.create({ toGuild: toGuild, initGuild: guildId });
      }
      return await interaction.editReply({
        embeds: [
          {
            description:
              "** <:sync:1221845943377203210> Sync system refreshed!**",
          },
        ],
      });
    } else {
      if (!data)
        return await interaction.editReply({
          embeds: [
            {
              description:
                "**<:Mod_Error:1175049241320751215> The system must be setup in order to disable it.**",
              color: client.colors.errorColor,
            },
          ],
        });

      await schema.findOneAndDelete({ initGuild: guildId });
      return await interaction.editReply({
        embeds: [
          {
            description:
              "**<:Mod_Check:1175049375383293962> Disabled the sync system!**",
            color: client.colors.successColor,
          },
        ],
      });
    }
  },
};
