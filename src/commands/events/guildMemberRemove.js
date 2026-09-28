const { updateMemberCount } = require('../utils/memberCounter');

async function guildMemberRemoveHandler(member) {
  setTimeout(() => {
    updateMemberCount(member.guild);
  }, 2000);
}

module.exports = guildMemberRemoveHandler;