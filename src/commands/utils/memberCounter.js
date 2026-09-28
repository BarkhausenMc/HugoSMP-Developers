const { ChannelType } = require('discord.js');
const { MEMBER_COUNT_CHANNEL_ID, MEMBER_ROLE_ID } = require('../config/env');

async function updateMemberCount(guild) {
  try {
    if (!guild) return;

    const channel = await guild.channels.fetch(MEMBER_COUNT_CHANNEL_ID);

    if (!channel) return;

    const isVoice =
      channel.type === ChannelType.GuildVoice ||
      channel.type === ChannelType.GuildStageVoice;

    if (!isVoice) return;

    const name = `👥・Members: ${guild.memberCount}`;

    if (channel.name !== name) {
      await channel.setName(name);
    }
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Member Counters:', error);
  }
}

module.exports = { updateMemberCount };