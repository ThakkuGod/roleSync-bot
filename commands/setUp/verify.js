const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionsBitField,
} = require("discord.js");
const schema = require("../../models/verify");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("verify")
    .setDescription("Setup the role verification system")
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
    .addSubcommand((sub) =>
      sub
        .setName("enable")
        .setDescription("Setup the verification system")
        .addRoleOption((option) =>
          option
            .setName("role")
            .setDescription("The verified role")
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub.setName("disable").setDescription("Disable the verification system")
    ),

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {import('../../index')} client
   */
  async execute(interaction, client) {
    const { options, guildId } = interaction;
    const role = options.getRole("role");
    const sub = options.getSubcommand();

    await interaction.deferReply({ ephemeral: true });

    let data = await schema.findOne({ guildId: guildId });

    if (sub == "enable") {
      if (
        role.position >= interaction.guild.members.me.roles.highest.position
      ) {
        return await interaction.editReply({
          embeds: [
            {
              description:
                "**<:Mod_Error:1175049241320751215> Unable to use this as verified role, as it is higher than my highest role - so I cannot manage it.**",
              color: client.colors.errorColor,
            },
          ],
        });
      }

      if (data) {
        data.role = role.id;
        await data.save();
        return await interaction.editReply({
          embeds: [
            {
              description:
                "**<:Mod_Check:1175049375383293962> Updated the verify role!**",
              color: client.colors.successColor,
            },
          ],
        });
      } else {
        data = schema.create({ guildId, role: role.id });
        return await interaction.editReply({
          embeds: [
            {
              description:
                "**<:Mod_Check:1175049375383293962> Set up the verification system!**",
              color: client.colors.successColor,
            },
          ],
        });
      }
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

      await schema.findOneAndDelete({ guildId });
      return await interaction.editReply({
        embeds: [
          {
            description:
              "**<:Mod_Check:1175049375383293962> Disabled the verification system!**",
            color: client.colors.successColor,
          },
        ],
      });
    }
  },
};
