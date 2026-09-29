require('dotenv').config();

const {
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ButtonStyle,
  MessageFlags,
  ChannelType
} = require('discord.js');

const { client } = require('./src/client-setup');
const { updateMemberCount } = require('./src/member-counter');
const rulesHandler = require('./src/commands/rules-handler');
const ourTeamHandler = require('./src/commands/our-team-handler');
const botShopHandler = require('./src/commands/bot-shop-handler');
const ticketSupportHandler = require('./src/commands/ticket-support-handler');
const giveawayHandler = require('./src/commands/giveaway-handler');

client.once('clientReady', async () => {
  console.log(`Logged in as ${client.user.tag}`);

  const guild = client.guilds.cache.first();

  if (guild) {
    await updateMemberCount(guild);
  }

  setInterval(() => {
    if (guild) {
      updateMemberCount(guild);
    }
  }, 60000);
});

client.on('guildMemberAdd', async (member) => {

  try {
    await member.roles.add(process.env.MEMBER_ROLE_ID);
  } catch (error) {
    console.error('Fehler beim Vergeben der Rolle:', error);
  }

  setTimeout(() => {
    updateMemberCount(member.guild);
  }, 2000);
});

client.on('guildMemberRemove', async (member) => {
  setTimeout(() => {
    updateMemberCount(member.guild);
  }, 2000);
});


  // =========================
  // /our-team
   // =========================

client.on('interactionCreate', async (interaction) =>{
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'our-team')  {
    await ourTeamHandler(interaction);
  }
});

  // =========================
  // /rules
   // =========================

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'rules') {
    await rulesHandler(interaction);
  }
});




client.on('interactionCreate', async (interaction) => {
  if (interaction.isChatInputCommand()) {

    if (interaction.commandName === 'bot-shop') {
      await botShopHandler(interaction);

      return;
    }

    return;
  }

  // =========================
  // Discord Bot Button
  // =========================

  if (
    interaction.isButton() &&
    interaction.customId === 'discord_bot'
  ) {
    const modal = new ModalBuilder()
      .setCustomId('discord_bot_modal')
      .setTitle('Discord Bot bestellen');

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
      .setLabel('Was soll dein Discord Bot können?')
      .setPlaceholder(
        'Beschreibe hier möglichst genau deine Wünsche...'
      )
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true)
      .setMinLength(0)
      .setMaxLength(4000);

    modal.addComponents(
      new ActionRowBuilder().addComponents(hosting),
      new ActionRowBuilder().addComponents(duration),
      new ActionRowBuilder().addComponents(wishesInput)
    );

    await interaction.showModal(modal);

    return;
  }

// =========================
// Discord Bot Modal
// =========================

if (
  interaction.isModalSubmit() &&
  interaction.customId === 'discord_bot_modal'
) {
  const duration =
    interaction.fields.getTextInputValue('hosting_duration') || 'Keine Dauer angegeben.';

  const hosting =
    interaction.fields.getTextInputValue('hosting_yes_or_no');
  
  const wishes =
    interaction.fields.getTextInputValue('discord_bot_wishes') || 'Keine weiteren Wünsche angegeben.';

  const ticketChannel =
    interaction.guild.channels.cache.get(
      process.env.DISCORD_BOT_CHANNEL_ID
    );

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

  const supportRole = interaction.guild.roles.cache.get(
    process.env.DISCORD_BOT_ROLE_ID
  );

  if (supportRole) {
    for (const member of supportRole.members.values()) {
      try {
        await thread.members.add(member.id);
      } catch (error) {
        console.error(
          `Fehler beim Hinzufügen von ${member.user.tag}:`,
          error
        );
      }
    }
  }

  await thread.send({
    content: `# ✅ Custom Discord Bot Bestellung

**👤 Kunde:** \`${interaction.user.username}\`
**🆔 User-ID:** \`${interaction.user.id}\`

### 🖥️ Hosting
> ${hosting}
> ${duration}

### 📝 Wünsche
> ${wishes}

> ||<@&${process.env.DISCORD_BOT_ROLE_ID}> \`${interaction.user.username}\` hat einen neuen Discord Bot angefordert!||`,
    flags: MessageFlags.Ephemeral
  });

  await interaction.reply({
    content:
      `✅ **Deine Bestellung wurde erfolgreich erstellt!**\n\n` +
      `🎫 Dein Ticket: <#${thread.id}>`,
    flags: MessageFlags.Ephemeral
  });

  return;
}

  if (
    interaction.isButton() &&
    interaction.customId === 'request_ticket_close'
  ) {
    const requestTicketCloseContainer = new ContainerBuilder()
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          'Willst du das ticket wirklich schließen?\n' +
          'Wenn ja dann drücke den `Bestätigen` Button'
        )
      )

      .addActionRowComponents(
        new ActionRowBuilder().addComponents(

          new ButtonBuilder()
            .setCustomId('confirmed_ticket_close')
            .setLabel('Bestätigen')
            .setEmoji('✅')
            .setStyle(ButtonStyle.Success)
        )
      )

    await interaction.update({
      components: [requestTicketCloseContainer],
      flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral
    });

    const collector = interaction.channel.createMessageComponentCollector({
      time: 60000,
      filter: i => i.customId === 'confirmed_ticket_close' && i.user.id === interaction.user.id
    });

    collector.on('collect', async (buttonInteraction) => {
      const confirmedTicketCloseContainer = new ContainerBuilder()
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(
            'Das Ticket wird in 5 sek gelöscht'
          )
        )

      await buttonInteraction.update({
        components: [confirmedTicketCloseContainer],
        flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral
      });

      await new Promise(resolve => setTimeout(resolve, 5000));
      await interaction.channel.delete();
      collector.stop();
    });

    collector.on('end', (collected, reason) => {
      if (reason === 'time') {
        interaction.editReply({
          content: '❌ Zeitüberschreitung. Schließung abgebrochen.',
          components: []
        }).catch(console.error);
      }
    });

    return;
  }

});

  
// =========================
// /ticket/support-bot
// =========================

client.on('interactionCreate', async (interaction) => {
  if (interaction.isChatInputCommand()) {
  if (interaction.commandName === 'ticket-support-bot') {

    await ticketSupportHandler.execute(interaction);

    return;
  }
}


// =========================
// Kaufen Button
// =========================

  if (
    interaction.isButton() &&
    interaction.customId === 'buy_ticketSupportBot'
  ) {
    await ticketSupportHandler.buyButtonHandler(interaction);
    return;
  }
// =========================
// Discord Bot Modal
// =========================

if (
  interaction.isModalSubmit() &&
  interaction.customId === 'ticketSupportBot_kaufen_modal'
) {
  await ticketSupportHandler.modalSubmitHandler(interaction);
  return;
}
});

// =========================
// /giveaway-bot
// =========================

client.on('interactionCreate', async (interaction) => {
  if (interaction.isChatInputCommand()) {
  if (interaction.commandName === 'giveaway-bot') {

    await giveawayHandler.execute(interaction);

    return;
  }
}


// =========================
// Kaufen Button
// =========================

  if (
    interaction.isButton() &&
    interaction.customId === 'buy_GiveawayBot'
  ) {
    await giveawayHandler.buyButtonHandler(interaction);
    return;
  }
// =========================
// Discord Bot Modal
// =========================

if (
  interaction.isModalSubmit() &&
  interaction.customId === 'GiveawayBot_kaufen_modal'
) {
  await giveawayHandler.modalSubmitHandler(interaction);
  return;
}
});

client.login(process.env.DISCORD_BOT_TOKEN);