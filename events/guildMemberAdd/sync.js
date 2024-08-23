const schema = require("../../models/roleSync");
const { GuildMember, InteractionType } = require("discord.js");
const ExtendedClient = require("../../index");

/**
 *
 * @param {GuildMember} member
 * @param {ExtendedClient} client
 */
module.exports = async (member, client) => {
  const { guild } = member;
  const data = await schema.findOne({ toGuild: guild.id });
  if (!data) return;
  console.log(data.initGuild, data.toGuild);
  const init = await client.guilds.fetch(data.initGuild);
  console.log(init.name);
  const memberOld = await init.members.fetch(member.id);
  const rolesPrev = memberOld.roles.cache
    .filter(
      (f) =>
        f.name.toLowerCase().startsWith("gang") ||
        f.name == "Whitelisted"
    )
    .map((r) => r.name);
  const toAdd = rolesPrev.forEach((role) => {
    const r = guild.roles.cache.find((f) => f.name == role);
    member.roles.add(r).catch((e) => console.log(e));
  });

  console.log(rolesPrev, toAdd);
};
