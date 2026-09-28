const { updateMemberCount } = require('../utils/memberCounter');
const { MEMBER_ROLE_ID } = require('../config/env');

async function guildMemberAddHandler(member) {
  try {
    await member.roles.add(MEMBER_ROLE_ID);
  } catch (error) {
    console.error('Fehler beim Vergeben der Rolle:', error);
  }

  setTimeout(() => {
    updateMemberCount(member.guild);
  }, 2000);
}

module.exports = guildMemberAddHandler;