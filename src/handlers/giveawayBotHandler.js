const {
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  MessageFlags
} = require('discord.js');

async function giveawayBotHandler(interaction) {
  const giveawayBotContainer = new ContainerBuilder()
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent('# 🎁 Giveaway Bot')
    )
    .addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1))
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        '## Was kann der Bot?\n' +
        '- mit `/giveaway` start eines normalen Giveaways\n' +
        '- mit `/giveaway-hugosmp` start eines HugoSMP Money Giveaways\n' +
        '- standard embeds, die z.B. anzeigen wie viele Teilnehemer usw.\n' +
        '- nach command eingabe öffnet sich modal, indem man alle angaben macht'
      )
    )
    .addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1))
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        '### 💵 Preise: `5M`\n' +
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
          .setCustomId('buy_GiveawayBot')
          .setLabel('Kaufen')
          .setEmoji('🛒')
          .setStyle(ButtonStyle.Success)
      )
    );

  await interaction.reply({
    components: [giveawayBotContainer],
    flags: MessageFlags.IsComponentsV2
  });
}

module.exports = giveawayBotHandler;