const { ContainerBuilder, TextDisplayBuilder, SeparatorBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags, ModalBuilder, TextInputBuilder, TextInputStyle, ChannelType } = require('discord.js');

module.exports = {
  execute: async (interaction) => {
    const ticketSupportBotContainer = new ContainerBuilder()
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          '# 🎁 Giveaway Bot'
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
          '- mit `/giveaway` start eines normalen Giveaways\n' +
          '- mit `/giveaway-hugosmp` start eines HugoSMP Money Giveaways \n' +
          '- standard embeds, die z.B. anzeigen wie viele Teilnehemer usw.\n' +
          '- nach command eingabe öffnet sich modal, indem man alle angaben macht\n' 
        )
      )

      .addSeparatorComponents(
        new SeparatorBuilder()
          .setDivider(true)
          .setSpacing(1)
      )

      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          '### 💵 Preise: `5M`\n' +
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
            .setCustomId('buy_GiveawayBot')
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
  
  buyButtonHandler: async (interaction) => {
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
  
  modalSubmitHandler: async (interaction) => {
    const duration =
      interaction.fields.getTextInputValue('hosting_duration') || 'Kein Hosting Duration angegeben.';


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
          '**🤖 Bot:** `Standard Giveaway Bot`'
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
          `> ${duration}\n` +

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
          `> ||<@&${process.env.DISCORD_BOT_ROLE_ID}>,\n> \`${interaction.user.username}\` hat einene neuen Discord Bot angefordert!||`
        )
      )
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
  }
};