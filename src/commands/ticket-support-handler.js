const {
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  MessageFlags,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ChannelType
} = require('discord.js');

module.exports = {

  // =====================================================
  // /ticket-support-bot
  // =====================================================

  execute: async (interaction) => {

    const ticketSupportBotContainer = new ContainerBuilder()

      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          '# 🎫 Ticket/Support Bot'
        )
      )

      .addSeparatorComponents(
        new SeparatorBuilder()
          .setDivider(true)
          .setSpacing(1)
      )

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

      .addSeparatorComponents(
        new SeparatorBuilder()
          .setDivider(true)
          .setSpacing(1)
      )

      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          '### 💵 Preise: `15M`\n' +
          '> ||Die Zahlung erfolgt einmalig.||\n' +
          '### 🖥️ Hosting\n' +
          '> Du kannst deinen Bot auch direkt bei uns Hosten lassen.\n' +
          '> Die Preise dafür findest du im **#🛒・bot-shop** Channel.'
        )
      )

      .addSeparatorComponents(
        new SeparatorBuilder()
          .setDivider(true)
          .setSpacing(1)
      )

      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          '### Um den Bot zu kaufen, klicke den `🛒 Kaufen` Button.\n' +
          '> ||Du hast noch extra Wünsche? Kein Problem, schreib sie uns einfach dazu.||'
        )
      )

      .addSeparatorComponents(
        new SeparatorBuilder()
          .setDivider(true)
          .setSpacing(1)
      )

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
  },


  // =====================================================
  // Kaufen Button
  // =====================================================

  buyButtonHandler: async (interaction) => {

    const modal = new ModalBuilder()
      .setCustomId('ticketSupportBot_kaufen_modal')
      .setTitle('Standard Discord Bot bestellen');

    const hosting = new TextInputBuilder()
      .setCustomId('hosting_yes_or_no')
      .setLabel('Möchtest du deinen Bot direkt bei uns Hosten?')
      .setPlaceholder('Ja oder Nein')
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const duration = new TextInputBuilder()
      .setCustomId('hosting_duration')
      .setLabel('Wie lange soll der Bot gehostet werden?')
      .setPlaceholder('z.B. 3 Monate, 1 Jahr')
      .setStyle(TextInputStyle.Short)
      .setRequired(false);

    const wishesInput = new TextInputBuilder()
      .setCustomId('discord_bot_wishes')
      .setLabel('Was soll der Discord Bot noch extra können?')
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
  },


  // =====================================================
  // Modal Submit
  // =====================================================

  modalSubmitHandler: async (interaction) => {

    const duration =
      interaction.fields.getTextInputValue('hosting_duration') ||
      'Kein Hosting Duration angegeben.';

    const hosting =
      interaction.fields.getTextInputValue('hosting_yes_or_no');

    const wishes =
      interaction.fields.getTextInputValue('discord_bot_wishes') ||
      'Keine weiteren Wünsche angegeben.';

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

    // =====================================================
    // Thread erstellen
    // =====================================================

    const thread = await ticketChannel.threads.create({

      // User-ID wird absichtlich in den Namen geschrieben,
      // damit wir später wissen, wem das Ticket gehört.
      name: `🤖 Discord Bot・${interaction.user.username}・${interaction.user.id}`,

      autoArchiveDuration: 10080,

      type: ChannelType.PrivateThread,

      reason:
        `Discord Bot Bestellung von ${interaction.user.tag}`

    });

    // =====================================================
    // User hinzufügen
    // =====================================================

    await thread.members.add(interaction.user.id);

    // =====================================================
    // Support-Team hinzufügen
    // =====================================================

    const supportRole =
      interaction.guild.roles.cache.get(
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

    // =====================================================
    // Ticket Nachricht
    // =====================================================

    const ticketContainer = new ContainerBuilder()

      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          '# ✅ Standard Discord Bot Bestellung'
        )
      )

      .addSeparatorComponents(
        new SeparatorBuilder()
          .setDivider(true)
          .setSpacing(1)
      )

      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          '**🤖 Bot:** `Standard Ticket/Support Bot`'
        )
      )

      .addSeparatorComponents(
        new SeparatorBuilder()
          .setDivider(true)
          .setSpacing(1)
      )

      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
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
        new TextDisplayBuilder().setContent(

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
        new TextDisplayBuilder().setContent(

          `> ||<@&${process.env.DISCORD_BOT_ROLE_ID}>,\n` +
          `> \`${interaction.user.username}\` hat einen neuen Discord Bot angefordert!||`

        )
      )

      .addSeparatorComponents(
        new SeparatorBuilder()
          .setDivider(true)
          .setSpacing(1)
      )

      .addActionRowComponents(

        new ActionRowBuilder().addComponents(

          new ButtonBuilder()
            .setCustomId('request_ticket_close')
            .setLabel('Ticket Schließen')
            .setEmoji('🔒')
            .setStyle(ButtonStyle.Secondary)

        )

      );

    await thread.send({

      components: [ticketContainer],

      flags: MessageFlags.IsComponentsV2

    });

    await interaction.reply({

      content:
        `✅ **Deine Bestellung wurde erfolgreich erstellt!**\n\n` +
        `🎫 Dein Ticket: <#${thread.id}>`,

      flags: MessageFlags.Ephemeral

    });

  },


  // =====================================================
  // Ticket schließen - Bestätigung anzeigen
  // =====================================================

  requestTicketCloseHandler: async (interaction) => {

    const requestTicketCloseContainer =
      new ContainerBuilder()

        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(

            '# 🔒 Ticket schließen\n\n' +
            'Willst du das Ticket wirklich schließen?\n\n' +
            'Wenn du fortfährst, kannst du danach nicht mehr in diesem Ticket schreiben.'

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

        );

    await interaction.reply({

      components: [requestTicketCloseContainer],

      flags:
        MessageFlags.IsComponentsV2 |
        MessageFlags.Ephemeral

    });

  },


  // =====================================================
  // Ticket schließen - bestätigt
  // =====================================================

  confirmedTicketCloseHandler: async (interaction) => {

    const thread = interaction.channel;

    // Prüfen, ob wir tatsächlich in einem Thread sind
    if (!thread || !thread.isThread()) {

      return interaction.reply({

        content:
          '❌ Dieser Button kann nur in einem Ticket verwendet werden.',

        flags: MessageFlags.Ephemeral

      });

    }

    try {

      // =================================================
      // Ticket-Ersteller aus Thread-Namen auslesen
      // =================================================

      const nameParts = thread.name.split('・');

      const ticketOwnerId =
        nameParts[nameParts.length - 1];

      if (
        !ticketOwnerId ||
        !/^\d+$/.test(ticketOwnerId)
      ) {

        return interaction.reply({

          content:
            '❌ Der Ersteller des Tickets konnte nicht gefunden werden.',

          flags: MessageFlags.Ephemeral

        });

      }

      // =================================================
      // Prüfen, ob User Ticket-Ersteller ist
      // =================================================

      if (interaction.user.id !== ticketOwnerId) {

        return interaction.reply({

          content:
            '❌ Nur der Ersteller dieses Tickets kann es schließen.',

          flags: MessageFlags.Ephemeral

        });

      }

      // =================================================
      // User aus Private Thread entfernen
      // =================================================

      try {

        await thread.members.remove(ticketOwnerId);

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
            new TextDisplayBuilder().setContent(

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
      // Support benachrichtigen
      // =================================================

      const supportCloseContainer =
        new ContainerBuilder()

          .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(

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

            new ActionRowBuilder().addComponents(

              new ButtonBuilder()
                .setCustomId('final_ticket_close')
                .setLabel('Ticket endgültig schließen')
                .setEmoji('🗑️')
                .setStyle(ButtonStyle.Danger)

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
        'Fehler beim Schließen des Tickets:',
        error
      );

      if (!interaction.replied) {

        await interaction.reply({

          content:
            '❌ Beim Schließen des Tickets ist ein Fehler aufgetreten.',

          flags: MessageFlags.Ephemeral

        });

      }

    }

  },


  // =====================================================
  // Ticket endgültig schließen
  // =====================================================

  finalTicketCloseHandler: async (interaction) => {

    const thread = interaction.channel;

    if (!thread || !thread.isThread()) {

      return interaction.reply({

        content:
          '❌ Dieser Button kann nur in einem Ticket verwendet werden.',

        flags: MessageFlags.Ephemeral

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

        flags: MessageFlags.Ephemeral

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

        flags: MessageFlags.Ephemeral

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
        resolve => setTimeout(resolve, 1500)
      );

      await thread.delete(
        'Ticket wurde von einem autorisierten Support-Mitglied endgültig geschlossen'
      );

    } catch (error) {

      console.error(
        'Fehler beim endgültigen Löschen des Tickets:',
        error
      );

    }

  }

};
