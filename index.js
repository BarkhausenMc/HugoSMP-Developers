require('dotenv').config();

const {
  Client,
  GatewayIntentBits,
  ChannelType,
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  MessageFlags,
  ActionRowBuilder,
  ButtonBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ButtonStyle,
  TextDisplayComponent
} = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
});

async function updateMemberCount(guild) {
  try {
    if (!guild) return;

    const channel = await guild.channels.fetch(
      process.env.MEMBER_COUNT_CHANNEL_ID
    );

    if (!channel) return;

    const isVoice =
      channel.type === ChannelType.GuildVoice ||
      channel.type === ChannelType.GuildStageVoice;

    if (!isVoice) return;

    const name = `👥・Members: ${guild.memberCount}`;

    if (channel.name !== name) {
      await channel.setName(name);
    }

  } catch (error) {
    console.error('Fehler beim Aktualisieren des Member Counters:', error);
  }
}

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

client.on('interactionCreate', async (interaction) =>{
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'our-team')  {
    const ourTeamContainer = new ContainerBuilder()
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          'Our Team'
        )
      )
    await interaction.reply({
    components: [ourTeamContainer],
    flags: MessageFlags.IsComponentsV2
    });
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'rules') {
    const rulesContainer = new ContainerBuilder()

      // 📚 General Server Rules
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          '# 📚 General Server Rules 📚\n\n' +

          '__**🔹 Behavior & Respect**__\n\n' +

          '• 🤝 **Be friendly and respectful** – Treat all members the way you would like to be treated.\n\n' +

          '• 🚫 **No bullying, hate, or discrimination** – Racism, sexism, homophobia, transphobia, or any other form of hate is strictly prohibited.\n\n' +

          '• 💬 **No spam or flooding** – Avoid sending repeated messages, excessive emojis, or meaningless content.'
        )
      )

      .addSeparatorComponents(
        new SeparatorBuilder()
          .setDivider(true)
          .setSpacing(1)
      )

      // 🔹 Content & Communication
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          '__**🔹 Content & Communication**__\n\n' +

          '• 🔞 **No NSFW content** – Pornographic, sexually explicit, or excessively violent content is prohibited.\n\n' +

          '• 🚨 **No illegal content** – Do not share links to pirated content, drugs, weapons, or other illegal activities.\n\n' +

          '• 📢 **No advertising without permission** – Server invites and advertisements are only allowed in designated channels.'
        )
      )

      .addSeparatorComponents(
        new SeparatorBuilder()
          .setDivider(true)
          .setSpacing(1)
      )

      // 🔹 Privacy & Security
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          '__**🔹 Privacy & Security**__\n\n' +

          '• 🔒 **Protect your personal information** – Do not share personal information such as your address, passwords, or other sensitive data.\n\n' +

          '• 🚫 **No doxxing** – Do not publish or share private information belonging to other people.\n\n' +

          '• 🤖 **Beware of phishing** – Do not click suspicious links and report them to the moderators.'
        )
      )

      .addSeparatorComponents(
        new SeparatorBuilder()
          .setDivider(true)
          .setSpacing(1)
      )

      // 🔹 Moderation & Consequences
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          '__**🔹 Moderation & Consequences**__\n\n' +

          '• ⚠️ **Warnings & Kicks** – Violations may initially result in a warning. Repeated violations may result in a kick.\n\n' +

          '• 🚪 **Bans** – Serious violations, such as hate speech or illegal content, may result in an immediate ban.\n\n' +

          '• 📩 **Report users** – Use the report channel to report inappropriate behavior or rule violations.'
        )
      )

      .addSeparatorComponents(
        new SeparatorBuilder()
          .setDivider(true)
          .setSpacing(1)
      )

      // 🔹 Other
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          '__**🔹 Other**__\n\n' +

          '• 🔄 **Ignorance of the rules is not an excuse.**\n\n' +

          '• 💙 **Discord ToS:** https://discord.com/terms\n\n' +

          '• 💙 **Discord Guidelines:** https://discord.com/guidelines'
        )
      )

      .addSeparatorComponents(
        new SeparatorBuilder()
          .setDivider(true)
          .setSpacing(1)
      )

      // ⚠️ Acceptance notice
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          '⚠️ **By joining this server, you agree to follow these rules.**'
        )
      );

    await interaction.reply({
      components: [rulesContainer],
      flags: MessageFlags.IsComponentsV2
    });
  }
});





client.on('interactionCreate', async (interaction) => {
  // =========================
  // Slash Commands
  // =========================

  if (interaction.isChatInputCommand()) {

    // =========================
    // /bot-shop
    // =========================

    if (interaction.commandName === 'bot-shop') {
      const botShopContainer = new ContainerBuilder()
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(
            '# 🛒 HugoSMP Developers — Bot Shop\n' +
            '## 📖 So funktioniert der Bot Shop\n' +
            '### 1. Bot-Typ auswählen\n' +
            '> Wähle zuerst aus, ob du einen **Discord Bot** oder einen **Mineflayer Bot** möchtest.\n' +
            '### 2. Bestellung konfigurieren\n' +
            '> Beschreibe nun deine Wünsche für deinen Bot.\n' +
            '> **Tipp:** Je genauer du deine Wünsche beschreibst, desto besser können wir deinen Bot nach deinen Vorstellungen entwickeln.'
          )
        )

        .addSeparatorComponents(
          new SeparatorBuilder()
            .setDivider(true)
            .setSpacing(2)
        )

        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(
            '## 🤖 Standard Bots\n' +
            '> Du möchtest einen Bot für einen Standard Bot, benötigst aber zusätzliche individuelle Features? Kein Problem!\n' +
            '> Wähle einfach die passende Kategorie für deinen **Discord Bot** und schreibe darunter deine individuellen Wünsche.\n' +
            '> Du kannst dir unsere Standard Bots über den `Standard Bots` Button anzeigen lassen.\n' +
            '> Falls dein Bot Wunsch dabei ist, schreibe ihn einfach mit beim erstellen deines Tickets den angegeben Namen dazu. Z.B. `ticket_bot`'
          )
        )

        .addActionRowComponents(
          new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId('standard_bots')
              .setLabel('Standard Bots')
              .setStyle(ButtonStyle.Secondary)
          )
        )

        .addSeparatorComponents(
          new SeparatorBuilder()
            .setDivider(true)
            .setSpacing(1)
        )

        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(
            '## ⛏️ Mineflayer/AFK Bots\n\n' +

            '> Du möchtest einen eigenen pro­fes­si­o­nellen Mineflayer-Bot, der auch direkt gehostet wird?\n' +
            '> Dann schau auf folgender Website vorbei: [hugosmp AFK](https://deine-webseite.de)'
          )
        )

        .addSeparatorComponents(
          new SeparatorBuilder()
            .setDivider(true)
            .setSpacing(1)
        )
        
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(
            '## Bot Typ Wählen:\n' +
            '> *||Wähle nun über die Buttons den passenden Bot Typ.||*'
          )
        )

        .addActionRowComponents(
          new ActionRowBuilder().addComponents(

            new ButtonBuilder()
              .setCustomId('discord_bot')
              .setLabel('Discord Bot')
              .setEmoji('🤖')
              .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
              .setLabel('hugosmp AFK')
              .setEmoji('⛏️')
              .setStyle(ButtonStyle.Link)
              .setURL('https://deine-webseite.de')

          )
        )

        .addSeparatorComponents(
          new SeparatorBuilder()
            .setDivider(true)
            .setSpacing(1)
        )

        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(
            '## ❓ Fragen\n\n' +
            '> Wenn du eine Frage zu den Discord Bots hast,\n> dann stelle sie einfach im **#❓・bot-questions** Channel.'
          )
        )

      await interaction.reply({
        components: [botShopContainer],
        flags: MessageFlags.IsComponentsV2
      });

      return;
    }

    return;
  }

  // =========================
  // Discord Bot Button
  // =========================

 if (
  interaction.isButton() &&
  interaction.customId === 'standard_bots'
) {
  const categoriesContainer = new ContainerBuilder()
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        '## 💬 Discord Bots\n' +

        '🎫 **Ticket / Support Bot** — `ticket_bot`\n' +
        '> Ticketsysteme, Support-Anfragen, Bewerbungen, Partnerschaften und individuelle Ticket-Funktionen.\n\n' +

        '🎁 **Giveaway Bot** — `giveaway_bot`\n' +
        '> Giveaways erstellen, Teilnahmebedingungen, automatische Gewinnerauslosung und Belohnungen.\n\n' +

        '👋 **Welcome Bot** — `welcome_bot`\n' +
        '> Willkommens- und Abschiedsnachrichten, automatische Rollen und individuelle Begrüßungssysteme.\n\n' +

        '🤖 **Custom Discord Bot** — `custom_discord_bot`\n' +
        '> Eine komplett eigene Idee für einen Discord Bot? Beschreibe einfach genau, was dein Bot können soll.\n\n' +

        '💡 **Beispiel für eine Bestellung:**\n' +
        '> `ticket_bot`\n' +
        '> Ich möchte einen Ticket-Bot mit den Kategorien Support, Bewerbung und Partnerschaften. Jedes Ticket soll automatisch einem zuständigen Teammitglied zugewiesen werden.'
      )
    );

  await interaction.reply({
    components: [categoriesContainer],
    flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral
  });
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

    const standard_bot = new TextInputBuilder()
      .setCustomId('standard_bots_modal')
      .setLabel('Wie lautet der Namen des Standard Bots?')
      .setPlaceholder('z.b. ticket_bot')

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

  const wishes =
    interaction.fields.getTextInputValue('discord_bot_wishes');

  const ticketChannel =
    interaction.guild.channels.cache.get(process.env.DISCORD_BOT_CHANNEL_ID);

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
  const supportRole = interaction.guild.roles.cache.get(process.env.DISCORD_BOT_ROLE_ID);

  if (supportRole) {
    for (const member of supportRole.members.values()) {
      await thread.members.add(member.id);
    }
  }

  await thread.send({
    content:
      `# 🤖 Discord Bot Bestellung\n\n` +
      `👤 **Kunde:** <@${interaction.user.id}>\n` +
      `🆔 **User-ID:** \`${interaction.user.id}\`\n\n` +
      `## 📝 Wünsche\n` +
      `> ${wishes}\n\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `📌 **Status:** Offen\n` +
      `👨‍💻 Ein Entwickler wird sich hier bald bei dir melden.`
  });

  await interaction.reply({
    content:
      `✅ **Deine Bestellung wurde erfolgreich erstellt!**\n\n` +
      `🎫 Dein Ticket: <#${thread.id}>`,
    flags: MessageFlags.Ephemeral
  });

  return;
}
});

client.login(process.env.DISCORD_BOT_TOKEN);
