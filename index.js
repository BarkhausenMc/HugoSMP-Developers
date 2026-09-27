require('dotenv').config();

const {
  Client,
  GatewayIntentBits,
  ChannelType,
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  MessageFlags
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
  if (interaction.isChatInputCommand()) {
    if (interaction.commandName === 'bot-shop') {

      const botShopContainer = new ContainerBuilder()

        // ═══════════════════════════════════════
        // 📖 ANLEITUNG
        // ═══════════════════════════════════════

        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(
            [
              '# 🛒 HugoSMP Developers — Bot Shop\n\n', +
              '## 📖 So funktioniert der Bot Shop\n', +
              '**1. Bot-Typ auswählen**\n\n', +
              '> Wähle zuerst aus, ob du einen **Discord Bot** oder einen **Mineflayer Bot** möchtest.\n', +
              '**2. Bestellung konfigurieren**\n\n', +
              '> Schreibe nun deine Wünsche für dein Bot in das Feld.\n> ||Tipp: Sei sehr Genau bei der Beschreinug deiner Wünsche.||\n', 
            ]
          )
        )

        .addSeparatorComponents(
          new SeparatorBuilder()
            .setDivider(true)
            .setSpacing(1)
        )

        // // ═══════════════════════════════════════
        // // 🤖 BOT TYP
        // // ═══════════════════════════════════════

        // .addTextDisplayComponents(
        //   new TextDisplayBuilder().setContent(
        //     [
        //       '## 🤖 1. Bot-Typ auswählen',
        //       '',
        //       'Welche Art von Bot möchtest du bestellen?',
        //       '',
        //       '💬 **Discord Bot**',
        //       '› Für Discord Server, Communities und Automatisierung.',
        //       '',
        //       '⛏️ **Mineflayer Bot**',
        //       '› Für Minecraft, AFK-Systeme, Automatisierung und mehr.'
        //     ].join('\n')
        //   )
        // )

        // .addActionRowComponents(
        //   new ActionRowBuilder().addComponents(

        //     new ButtonBuilder()
        //       .setCustomId('shop_bot_discord')
        //       .setLabel('Discord Bot')
        //       .setEmoji('💬')
        //       .setStyle(ButtonStyle.Primary),

        //     new ButtonBuilder()
        //       .setCustomId('shop_bot_mineflayer')
        //       .setLabel('Mineflayer Bot')
        //       .setEmoji('⛏️')
        //       .setStyle(ButtonStyle.Secondary)
        //   )
        // )

        // .addSeparatorComponents(
        //   new SeparatorBuilder()
        //     .setDivider(true)
        //     .setSpacing(1)
        // )

        // // ═══════════════════════════════════════
        // // ⭐ TIERS
        // // ═══════════════════════════════════════

        // .addTextDisplayComponents(
        //   new TextDisplayBuilder().setContent(
        //     [
        //       '## ⭐ 2. Tiers & Features',
        //       '',
        //       'Wähle zuerst oben deinen Bot-Typ aus.',
        //       'Die verfügbaren Features werden anschließend entsprechend angepasst.',
        //       '',
        //       '### 🥉 Tier 1 — Basic',
        //       '› Grundlegende Funktionen',
        //       '› Geeignet für kleinere Projekte',
        //       '',
        //       '### 🥈 Tier 2 — Advanced',
        //       '› Erweiterte Funktionen',
        //       '› Mehr Anpassungsmöglichkeiten',
        //       '› Für größere Projekte',
        //       '',
        //       '### 🥇 Tier 3 — Premium',
        //       '› Umfangreiches Feature-Paket',
        //       '› Maximale Anpassbarkeit',
        //       '› Für professionelle Projekte'
        //     ].join('\n')
        //   )
        // )

        // .addSeparatorComponents(
        //   new SeparatorBuilder()
        //     .setDivider(true)
        //     .setSpacing(1)
        // )

        // // ═══════════════════════════════════════
        // // 🛒 TIER AUSWAHL
        // // ═══════════════════════════════════════

        // .addTextDisplayComponents(
        //   new TextDisplayBuilder().setContent(
        //     [
        //       '## 🛒 3. Tier auswählen',
        //       '',
        //       'Wähle dein gewünschtes Tier aus dem Menü.'
        //     ].join('\n')
        //   )
        // )

        // .addActionRowComponents(
        //   new ActionRowBuilder().addComponents(

        //     new StringSelectMenuBuilder()
        //       .setCustomId('shop_bot_tier')
        //       .setPlaceholder('⭐ Wähle dein Bot-Tier')
        //       .addOptions(
        //         {
        //           label: 'Tier 1 — Basic',
        //           description: 'Grundlegende Bot-Funktionen',
        //           value: 'tier_1',
        //           emoji: '🥉'
        //         },
        //         {
        //           label: 'Tier 2 — Advanced',
        //           description: 'Erweiterte Bot-Funktionen',
        //           value: 'tier_2',
        //           emoji: '🥈'
        //         },
        //         {
        //           label: 'Tier 3 — Premium',
        //           description: 'Maximales Feature-Paket',
        //           value: 'tier_3',
        //           emoji: '🥇'
        //         }
        //       )
        //   )
        // )

        // .addSeparatorComponents(
        //   new SeparatorBuilder()
        //     .setDivider(false)
        //     .setSpacing(2)
        // )

        // .addTextDisplayComponents(
        //   new TextDisplayBuilder().setContent(
        //     [
        //       '### 💎 HugoSMP Developers',
        //       'Individuelle Bots. Professionelle Lösungen.',
        //       '',
        //       '-# Wähle deinen Bot-Typ und anschließend dein gewünschtes Tier.'
        //     ].join('\n')
        //   )
        // );

      await interaction.reply({
        components: [botShopContainer],
        flags: MessageFlags.IsComponentsV2
      });
    }

    return;
  }
});


client.login(process.env.DISCORD_BOT_TOKEN);
