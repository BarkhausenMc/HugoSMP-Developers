const {
  ContainerBuilder,
  TextDisplayBuilder,
  MessageFlags
} = require('discord.js');

async function ourTeamHandler(interaction) {
  const ourTeamContainer = new ContainerBuilder()
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent('Our Team')
    );

  await interaction.reply({
    components: [ourTeamContainer],
    flags: MessageFlags.IsComponentsV2
  });
}

module.exports = ourTeamHandler;