const {
  ChannelType,
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  MessageFlags
} = require('discord.js');
const { DISCORD_BOT_CHANNEL_ID, DISCORD_BOT_ROLE_ID } = require('../config/env');

async function createTicket(interaction, botType = 'Custom Discord Bot') {
  const duration = interaction.fields.getTextInputValue('hosting_duration');
  const hosting = interaction.fields.getTextInputValue('hosting_yes_or_no');
  const wishes = interaction.fields.getTextInputValue('discord_bot_wishes') || 'Keine weiteren Wünsche angegeben.';

  const ticketChannel = interaction.guild.channels.cache.get(DISCORD_BOT_CHANNEL_ID);

  if (!ticketChannel) {
    return interaction.reply({
      content: '❌ Der Ticket-Channel wurde nicht gefunden.',
      flags: MessageFlags.Ephemeral
    });
  }

  const thread = await ticketChannel.threads.create({
    name: `🤖 Discord Bot・${interaction.user.username}`,
    autoArchiveDuration: 10080,
    type: ChannelType.PrivateThread,
    reason: `Discord Bot Bestellung von ${interaction.user.tag}`
  });

  await thread.members.add(interaction.user.id);

  const supportRole = interaction.guild.roles.cache.get(DISCORD_BOT_ROLE_ID);

  if (supportRole) {
    for (const member of supportRole.members.values()) {
      try {
        await thread.members.add(member.id);
      } catch (error) {
        console.error(`Fehler beim Hinzufügen von ${member.user.tag}:`, error);
      }
    }
  }

  const ticketContainer = new ContainerBuilder()
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(`# ✅ ${botType} Bestellung`)
    )
    .addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1))
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        '**🤖 Bot:** `' + botType + '`\n' +
        `**👤 Kunde:** \`${interaction.user.username}\`\n` +
        `**🆔 User-ID:** \`${interaction.user.id}\``
      )
    )
    .addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1))
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        '### 🖥️ Hosting\n' +
        `> ${hosting}\n` +
        `> ${duration}\n\n` +
        '### 📝 Wünsche\n' +
        `> ${wishes}`
      )
    )
    .addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1))
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `> ||<@&${DISCORD_BOT_ROLE_ID}>,\n> \`${interaction.user.username}\` hat einene neuen Discord Bot angefordert!||`
      )
    );

  await thread.send({
    components: [ticketContainer],
    flags: MessageFlags.IsComponentsV2
  });

  await interaction.reply({
    content: `✅ **Deine Bestellung wurde erfolgreich erstellt!**\n\n🎫 Dein Ticket: <#${thread.id}>`,
    flags: MessageFlags.Ephemeral
  });
}

module.exports = { createTicket };