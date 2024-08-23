const { SlashCommandBuilder, ChatInputCommandInteraction } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set-avatar')
        .setDescription('Set bots avatar')
        .addAttachmentOption(x => x.setRequired(true).setName('pic').setDescription('.gif or .png of the pfp')),

        /**
         * 
         * @param {ChatInputCommandInteraction} interaction 
         * @param {import('../../structures/extendedClient')} client 
         */
    async execute(interaction, client) {
        if(!interaction.user.id == '926189991082729522') return interaction.reply({ephemeral:true, content: "You cannot use this command"});
        const url = interaction.options.getAttachment('pic').url
        await client.user.setAvatar(url).catch(e => interaction.reply(`Something went wrong...\n\n\n\`\`\`${e}\`\`\``));
        interaction.reply("Set avatar!")
    }
}
