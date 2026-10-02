require('dotenv').config();

const {
  MessageFlags,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType
} = require('discord.js');

const { client } = require('./src/client-setup');
const { updateMemberCount } = require('./src/member-counter');

const rulesHandler = require('./src/commands/rules-handler');
const ourTeamHandler = require('./src/commands/our-team-handler');
const botShopHandler = require('./src/commands/bot-shop-handler');
const ticketSupportHandler = require('./src/commands/ticket-support-handler');
const giveawayHandler = require('./src/commands/giveaway-handler');


// =====================================================
// Bot Ready
// =====================================================

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


// =====================================================
// Member Join
// =====================================================

client.on('guildMemberAdd', async (member) => {

  try {

    await member.roles.add(
      process.env.MEMBER_ROLE_ID
    );

  } catch (error) {

    console.error(
      'Fehler beim Vergeben der Rolle:',
      error
    );

  }

  setTimeout(() => {

    updateMemberCount(member.guild);

  }, 2000);

});


// =====================================================
// Member Leave
// =====================================================

client.on('guildMemberRemove', async (member) => {

  setTimeout(() => {

    updateMemberCount(member.guild);

  }, 2000);

});


// =====================================================
// EIN EINZIGER Interaction Handler
// =====================================================

client.on('interactionCreate', async (interaction) => {

  try {

    // =================================================
    // Slash Commands
    // =================================================

    if (interaction.isChatInputCommand()) {

      // /our-team
      if (interaction.commandName === 'our-team') {

        await ourTeamHandler(interaction);
        return;

      }


      // /rules
      if (interaction.commandName === 'rules') {

        await rulesHandler(interaction);
        return;

      }


      // /bot-shop
      if (interaction.commandName === 'bot-shop') {

        await botShopHandler(interaction);
        return;

      }


      // /ticket-support-bot
      if (interaction.commandName === 'ticket-support-bot') {

        await ticketSupportHandler.execute(interaction);
        return;

      }


      // /giveaway-bot
      if (interaction.commandName === 'giveaway-bot') {

        await giveawayHandler.execute(interaction);
        return;

      }

      return;
    }


    // =================================================
    // Buttons
    // =================================================

    if (interaction.isButton()) {


      // =================================================
      // Custom Discord Bot
      // =================================================

      if (
        interaction.customId === 'discord_bot'
      ) {

        const modal = new ModalBuilder()
          .setCustomId('discord_bot_modal')
          .setTitle('Discord Bot bestellen');


        const hosting = new TextInputBuilder()
          .setCustomId('hosting_yes_or_no')
          .setLabel(
            'Möchtest du deinen Bot direkt bei uns Hosten?'
          )
          .setPlaceholder('Ja oder Nein')
          .setStyle(TextInputStyle.Short)
          .setRequired(true);


        const duration = new TextInputBuilder()
          .setCustomId('hosting_duration')
          .setLabel(
            'Wie lange soll der Bot gehostet werden?'
          )
          .setPlaceholder(
            'z.B. 3 Monate, 1 Jahr'
          )
          .setStyle(TextInputStyle.Short)
          .setRequired(false);


        const wishesInput = new TextInputBuilder()
          .setCustomId('discord_bot_wishes')
          .setLabel(
            'Was soll dein Discord Bot können?'
          )
          .setPlaceholder(
            'Beschreibe hier möglichst genau deine Wünsche...'
          )
          .setStyle(TextInputStyle.Paragraph)
          .setRequired(true)
          .setMaxLength(4000);


        modal.addComponents(

          new ActionRowBuilder()
            .addComponents(hosting),

          new ActionRowBuilder()
            .addComponents(duration),

          new ActionRowBuilder()
            .addComponents(wishesInput)

        );


        await interaction.showModal(modal);

        return;
      }


      // =================================================
      // Ticket Support - Kaufen
      // =================================================

      if (
        interaction.customId ===
        'buy_ticketSupportBot'
      ) {

        await ticketSupportHandler.buyButtonHandler(
          interaction
        );

        return;
      }


      // =================================================
      // Ticket Support - Ticket schließen
      // =================================================

      if (
        interaction.customId ===
        'request_ticket_close'
      ) {

        await ticketSupportHandler.requestTicketCloseHandler(
          interaction
        );

        return;
      }


      // =================================================
      // Ticket Support - Schließen bestätigen
      // =================================================

      if (
        interaction.customId ===
        'confirmed_ticket_close'
      ) {

        await ticketSupportHandler.confirmedTicketCloseHandler(
          interaction
        );

        return;
      }


      // =================================================
      // Ticket Support - endgültig löschen
      // =================================================

      if (
        interaction.customId ===
        'final_ticket_close'
      ) {

        await ticketSupportHandler.finalTicketCloseHandler(
          interaction
        );

        return;
      }


      // =================================================
      // Giveaway - Kaufen
      // =================================================

      if (
        interaction.customId ===
        'buy_GiveawayBot'
      ) {

        await giveawayHandler.buyButtonHandler(
          interaction
        );

        return;
      }


      // =================================================
      // Giveaway - Ticket schließen
      // =================================================

      if (
        interaction.customId ===
        'giveaway_request_ticket_close'
      ) {

        await giveawayHandler.requestTicketCloseHandler(
          interaction
        );

        return;
      }


      // =================================================
      // Giveaway - Schließen bestätigen
      // =================================================

      if (
        interaction.customId ===
        'giveaway_confirmed_ticket_close'
      ) {

        await giveawayHandler.confirmedTicketCloseHandler(
          interaction
        );

        return;
      }


      // =================================================
      // Giveaway - endgültig löschen
      // =================================================

      if (
        interaction.customId ===
        'giveaway_final_ticket_close'
      ) {

        await giveawayHandler.finalTicketCloseHandler(
          interaction
        );

        return;
      }


      // =================================================
      // Custom Discord Bot - Ticket schließen
      // =================================================

      if (
        interaction.customId ===
        'discord_bot_request_ticket_close'
      ) {

        await discordBotRequestTicketCloseHandler(
          interaction
        );

        return;
      }


      // =================================================
      // Custom Discord Bot - Schließen bestätigen
      // =================================================

      if (
        interaction.customId ===
        'discord_bot_confirmed_ticket_close'
      ) {

        await discordBotConfirmedTicketCloseHandler(
          interaction
        );

        return;
      }


      // =================================================
      // Custom Discord Bot - endgültig löschen
      // =================================================

      if (
        interaction.customId ===
        'discord_bot_final_ticket_close'
      ) {

        await discordBotFinalTicketCloseHandler(
          interaction
        );

        return;
      }


      return;
    }


    // =================================================
    // Modal Submits
    // =================================================

    if (interaction.isModalSubmit()) {


      // =================================================
      // Custom Discord Bot Modal
      // =================================================

      if (
        interaction.customId ===
        'discord_bot_modal'
      ) {

        const duration =
          interaction.fields.getTextInputValue(
            'hosting_duration'
          ) ||
          'Kein Hosting Duration angegeben.';


        const hosting =
          interaction.fields.getTextInputValue(
            'hosting_yes_or_no'
          );


        const wishes =
          interaction.fields.getTextInputValue(
            'discord_bot_wishes'
          ) ||
          'Keine weiteren Wünsche angegeben.';


        const ticketChannel =
          interaction.guild.channels.cache.get(
            process.env.DISCORD_BOT_CHANNEL_ID
          );


        if (!ticketChannel) {

          return interaction.reply({

            content:
              '❌ Der Ticket-Channel wurde nicht gefunden.',

            flags:
              MessageFlags.Ephemeral

          });

        }


        // =================================================
        // Private Ticket Thread erstellen
        // =================================================

        const thread =
          await ticketChannel.threads.create({

            name:
              `🤖 Discord Bot・${interaction.user.username}・${interaction.user.id}`,

            autoArchiveDuration: 10080,

            type:
              ChannelType.PrivateThread,

            reason:
              `Discord Bot Bestellung von ${interaction.user.tag}`

          });


        // =================================================
        // Kunden hinzufügen
        // =================================================

        await thread.members.add(
          interaction.user.id
        );


        // =================================================
        // Support-Team hinzufügen
        // =================================================

        const supportRole =
          interaction.guild.roles.cache.get(
            process.env.DISCORD_BOT_ROLE_ID
          );


        if (supportRole) {

          for (
            const member of supportRole.members.values()
          ) {

            try {

              await thread.members.add(
                member.id
              );

            } catch (error) {

              console.error(
                `Fehler beim Hinzufügen von ${member.user.tag}:`,
                error
              );

            }

          }

        }


        // =================================================
        // Ticket Container
        // =================================================

        const ticketContainer =
          new ContainerBuilder()

            .addTextDisplayComponents(

              new TextDisplayBuilder()
                .setContent(
                  '# 🤖 Custom Discord Bot Bestellung'
                )

            )

            .addSeparatorComponents(

              new SeparatorBuilder()
                .setDivider(true)
                .setSpacing(1)

            )

            .addTextDisplayComponents(

              new TextDisplayBuilder()
                .setContent(
                  '**🤖 Bot:** `Custom Discord Bot`'
                )

            )

            .addSeparatorComponents(

              new SeparatorBuilder()
                .setDivider(true)
                .setSpacing(1)

            )

            .addTextDisplayComponents(

              new TextDisplayBuilder()
                .setContent(

                  `**👤 Kunde:** \`${interaction.user.username}\`\n` +
                  `**🆔 User-ID:** \`${interaction.user.id}\``

                )

            )

            .addSeparatorComponents(

              new SeparatorBuilder()
                .setDivider(true)
                .setSpacing(1)

            )

            .addTextDisplayComponents(

              new TextDisplayBuilder()
                .setContent(

                  '### 🖥️ Hosting\n' +
                  `> ${hosting}\n` +
                  `> ${duration}\n\n` +

                  '### 📝 Wünsche\n' +
                  `> ${wishes}`

                )

            )

            .addSeparatorComponents(

              new SeparatorBuilder()
                .setDivider(true)
                .setSpacing(1)

            )

            .addTextDisplayComponents(

              new TextDisplayBuilder()
                .setContent(

                  `> ||<@&${process.env.DISCORD_BOT_ROLE_ID}>,\n` +
                  `> \`${interaction.user.username}\` hat einen neuen Custom Discord Bot angefordert!||`

                )

            )

            .addSeparatorComponents(

              new SeparatorBuilder()
                .setDivider(true)
                .setSpacing(1)

            )

            .addActionRowComponents(

              new ActionRowBuilder()
                .addComponents(

                  new ButtonBuilder()
                    .setCustomId(
                      'discord_bot_request_ticket_close'
                    )
                    .setLabel(
                      'Ticket Schließen'
                    )
                    .setEmoji('🔒')
                    .setStyle(
                      ButtonStyle.Secondary
                    )

                )

            );


        // =================================================
        // Container senden
        // =================================================

        await thread.send({

          components:
            [ticketContainer],

          flags:
            MessageFlags.IsComponentsV2

        });


        // =================================================
        // User informieren
        // =================================================

        await interaction.reply({

          content:
            `✅ **Deine Bestellung wurde erfolgreich erstellt!**\n\n` +
            `🎫 Dein Ticket: <#${thread.id}>`,

          flags:
            MessageFlags.Ephemeral

        });


        return;
      }


      // =================================================
      // Ticket Support Bestellung
      // =================================================

      if (
        interaction.customId ===
        'ticketSupportBot_kaufen_modal'
      ) {

        await ticketSupportHandler.modalSubmitHandler(
          interaction
        );

        return;
      }


      // =================================================
      // Giveaway Bestellung
      // =================================================

      if (
        interaction.customId ===
        'GiveawayBot_kaufen_modal'
      ) {

        await giveawayHandler.modalSubmitHandler(
          interaction
        );

        return;
      }


      return;
    }

  } catch (error) {

    console.error(
      '❌ Fehler bei Interaction:',
      error
    );


    // =================================================
    // Fehlerantwort nur senden,
    // wenn die Interaction noch offen ist
    // =================================================

    if (
      !interaction.replied &&
      !interaction.deferred
    ) {

      try {

        await interaction.reply({

          content:
            '❌ Bei der Verarbeitung dieser Aktion ist ein Fehler aufgetreten.',

          flags:
            MessageFlags.Ephemeral

        });

      } catch (replyError) {

        console.error(
          '❌ Fehler beim Senden der Fehlerantwort:',
          replyError
        );

      }

    }

  }

});


// =====================================================
// Custom Discord Bot
// Ticket schließen - Bestätigung
// =====================================================

async function discordBotRequestTicketCloseHandler(
  interaction
) {

  const requestTicketCloseContainer =
    new ContainerBuilder()

      .addTextDisplayComponents(

        new TextDisplayBuilder()
          .setContent(

            '# 🔒 Ticket schließen\n\n' +
            'Willst du das Ticket wirklich schließen?\n\n' +
            'Wenn du fortfährst, kannst du danach nicht mehr in diesem Ticket schreiben.'

          )

      )

      .addActionRowComponents(

        new ActionRowBuilder()
          .addComponents(

            new ButtonBuilder()
              .setCustomId(
                'discord_bot_confirmed_ticket_close'
              )
              .setLabel(
                'Bestätigen'
              )
              .setEmoji('✅')
              .setStyle(
                ButtonStyle.Success
              )

          )

      );


  await interaction.reply({

    components:
      [requestTicketCloseContainer],

    flags:
      MessageFlags.IsComponentsV2 |
      MessageFlags.Ephemeral

  });

}


// =====================================================
// Custom Discord Bot
// Ticket schließen - bestätigt
// =====================================================

async function discordBotConfirmedTicketCloseHandler(
  interaction
) {

  const thread =
    interaction.channel;


  // ===================================================
  // Thread prüfen
  // ===================================================

  if (
    !thread ||
    !thread.isThread()
  ) {

    return interaction.reply({

      content:
        '❌ Dieser Button kann nur in einem Ticket verwendet werden.',

      flags:
        MessageFlags.Ephemeral

    });

  }


  try {

    // =================================================
    // Ticket-Ersteller aus Thread-Namen auslesen
    // =================================================

    const nameParts =
      thread.name.split('・');


    const ticketOwnerId =
      nameParts[nameParts.length - 1];


    if (
      !ticketOwnerId ||
      !/^\d+$/.test(ticketOwnerId)
    ) {

      return interaction.reply({

        content:
          '❌ Der Ersteller des Tickets konnte nicht gefunden werden.',

        flags:
          MessageFlags.Ephemeral

      });

    }


    // =================================================
    // Prüfen, ob User der Ersteller ist
    // =================================================

    if (
      interaction.user.id !==
      ticketOwnerId
    ) {

      return interaction.reply({

        content:
          '❌ Nur der Ersteller dieses Tickets kann es schließen.',

        flags:
          MessageFlags.Ephemeral

      });

    }


    // =================================================
    // User aus Private Thread entfernen
    // =================================================

    try {

      await thread.members.remove(
        ticketOwnerId
      );

    } catch (error) {

      console.error(
        'Fehler beim Entfernen des Ticket-Erstellers:',
        error
      );

    }


    // =================================================
    // Bestätigung an User
    // =================================================

    const confirmedTicketCloseContainer =
      new ContainerBuilder()

        .addTextDisplayComponents(

          new TextDisplayBuilder()
            .setContent(

              '# 🔒 Ticket geschlossen\n\n' +
              'Du hast das Ticket erfolgreich geschlossen.\n\n' +
              'Du kannst in diesem Ticket nun nicht mehr schreiben.\n' +
              'Das Support-Team kann das Ticket weiterhin bearbeiten.'

            )

        );


    await interaction.reply({

      components:
        [confirmedTicketCloseContainer],

      flags:
        MessageFlags.IsComponentsV2 |
        MessageFlags.Ephemeral

    });


    // =================================================
    // Support-Benachrichtigung
    // =================================================

    const supportCloseContainer =
      new ContainerBuilder()

        .addTextDisplayComponents(

          new TextDisplayBuilder()
            .setContent(

              '# 🛑 Ticket wartet auf endgültige Schließung\n\n' +
              'Der Ticket-Ersteller hat das Ticket geschlossen.\n\n' +
              'Das Ticket kann nun von einem autorisierten Support-Mitglied endgültig gelöscht werden.'

            )

        )

        .addSeparatorComponents(

          new SeparatorBuilder()
            .setDivider(true)
            .setSpacing(1)

        )

        .addActionRowComponents(

          new ActionRowBuilder()
            .addComponents(

              new ButtonBuilder()
                .setCustomId(
                  'discord_bot_final_ticket_close'
                )
                .setLabel(
                  'Ticket endgültig schließen'
                )
                .setEmoji('🗑️')
                .setStyle(
                  ButtonStyle.Danger
                )

            )

        );


    await thread.send({

      components:
        [supportCloseContainer],

      flags:
        MessageFlags.IsComponentsV2

    });

  } catch (error) {

    console.error(
      'Fehler beim Schließen des Discord Bot Tickets:',
      error
    );


    if (!interaction.replied) {

      await interaction.reply({

        content:
          '❌ Beim Schließen des Tickets ist ein Fehler aufgetreten.',

        flags:
          MessageFlags.Ephemeral

      });

    }

  }

}


// =====================================================
// Custom Discord Bot
// Ticket endgültig löschen
// =====================================================

async function discordBotFinalTicketCloseHandler(
  interaction
) {

  const thread =
    interaction.channel;


  // =================================================
  // Thread prüfen
  // =================================================

  if (
    !thread ||
    !thread.isThread()
  ) {

    return interaction.reply({

      content:
        '❌ Dieser Button kann nur in einem Ticket verwendet werden.',

      flags:
        MessageFlags.Ephemeral

    });

  }


  // =================================================
  // Support-Rolle prüfen
  // =================================================

  const supportRoleId =
    process.env.DISCORD_BOT_ROLE_ID;


  if (!supportRoleId) {

    return interaction.reply({

      content:
        '❌ DISCORD_BOT_ROLE_ID ist nicht konfiguriert.',

      flags:
        MessageFlags.Ephemeral

    });

  }


  const hasSupportRole =
    interaction.member.roles.cache.has(
      supportRoleId
    );


  if (!hasSupportRole) {

    return interaction.reply({

      content:
        '❌ Nur autorisierte Support-Mitglieder können dieses Ticket endgültig schließen.',

      flags:
        MessageFlags.Ephemeral

    });

  }


  // =================================================
  // Ticket löschen
  // =================================================

  try {

    await interaction.reply({

      content:
        '🗑️ Das Ticket wird endgültig geschlossen...',

      flags:
        MessageFlags.Ephemeral

    });


    await new Promise(
      resolve =>
        setTimeout(resolve, 1500)
    );


    await thread.delete(
      'Custom Discord Bot Ticket wurde von einem autorisierten Support-Mitglied endgültig geschlossen'
    );

  } catch (error) {

    console.error(
      'Fehler beim endgültigen Löschen des Discord Bot Tickets:',
      error
    );

  }

}


// =====================================================
// Login
// =====================================================

client.login(
  process.env.DISCORD_BOT_TOKEN
);
