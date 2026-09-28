const {
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  MessageFlags
} = require('discord.js');

async function ticketSupportBotHandler(interaction) {
  const ticketSupportBotContainer = new ContainerBuilder()
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent('# 🎫 Ticket/Support Bot')
    )
    .addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1))
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        '## Was kann der Bot?\n' +
        '- Ticket System über Threads\n' +
        '- fügt automatisch Ersteller sowie Ticket Rolle hinzu\n' +
        '- Bewertungs System\n' +
        '- bis zu 5 verschiedene Kategorien\n' +
        '- für jede Kategorie ein Modal (Fragen)'
      )
    )
    .addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1))
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        '### 💵 Preise: `15M`\n' +
        '> ||Die Zahlung erfolgt einmalig.||\n' +
        '### 🖥️ Hosting\n' +
        '> Du kannst deinen Bot auch direkt bei uns Hosten lassen.\n' +
        '> Die Preise dafür findest du im **#🛒 bot-shop** Channel.'
      )
    )
    .addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1))
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        '### Um den Bot zu kaufen, klicke den `🛒 Kaufen` Button.\n' +
        '> ||Du hast noch extra Wünsche? Kein Problem, schreib sie uns einfach dazu.||'
      )
    )
    .addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1))
    .addActionRowComponents(
      new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('buy_ticketSupportBot')
          .setLabel('Kaufen')
          .setEmoji('🛒')
          .setStyle(ButtonStyle.Success)
      )
    );

  await interaction.reply({
    components: [ticketSupportBotContainer],
    flags: MessageFlags.IsComponentsV2
  });
}

module.exports = ticketSupportBotHandler;