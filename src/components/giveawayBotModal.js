const {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder
} = require('discord.js');

function createGiveawayBotModal() {
  const modal = new ModalBuilder()
    .setCustomId('GiveawayBot_kaufen_modal')
    .setTitle('Standard Discord Bot bestellen');

  const hosting = new TextInputBuilder()
    .setCustomId('hosting_yes_or_no')
    .setLabel('Möchtest du deinen Bot direkt bei uns Hosten?')
    .setPlaceholder('Ja oder Nein')
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  const duration = new TextInputBuilder()
    .setCustomId('hosting_duration')
    .setLabel('Wie lange möchtest du dein Bot Hosten lassen?')
    .setPlaceholder('z.B. 3 Monate, 1 Jahr')
    .setStyle(TextInputStyle.Short)
    .setRequired(false);

  const wishesInput = new TextInputBuilder()
    .setCustomId('discord_bot_wishes')
    .setLabel('Was soll der Discord Bot noch extra können?')
    .setPlaceholder('Beschreibe hier möglichst genau deine Wünsche...')
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true)
    .setMinLength(0)
    .setMaxLength(4000);

  modal.addComponents(
    new ActionRowBuilder().addComponents(hosting),
    new ActionRowBuilder().addComponents(duration),
    new ActionRowBuilder().addComponents(wishesInput)
  );

  return modal;
}

module.exports = { createGiveawayBotModal };