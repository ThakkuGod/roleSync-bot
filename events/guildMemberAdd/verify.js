const schema = require("../../models/verify");
const { GuildMember, InteractionType } = require("discord.js");
const ExtendedClient = require("../../index");

/**
 *
 * @param {GuildMember} member
 * @param {ExtendedClient} client
 */
module.exports = async (member, client) => {
  const { guild } = member;
  const data = await schema.findOne({ guildId: guild.id });
  if (!data) return;
  const role = guild.roles.cache.get(data.role);
  if (!role) return await data.delete();
  try {
    member.roles.add(role);
  } catch (e) {
    console.log("Invalid Perms");
  }
};
