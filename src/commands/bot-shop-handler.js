const { ContainerBuilder, TextDisplayBuilder, SeparatorBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags } = require('discord.js');

module.exports = async (interaction) => {
  const botShopContainer = new ContainerBuilder()
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        '# 🛒 HugoSMP Developers — Bot Shop\n' +
        '## 📖 So funktioniert der Bot Shop\n' +
        '### 1. Bot-Typ auswählen\n' +
        '> Du kannst hier auf dem Server Discord Bots kaufen, aber auf [hugosmp AFK](https://deine-webseite.de) kannst du dir AFK/Mineflayer Bots kaufen.\n' +
        '### 2. Bestellung konfigurieren\n' +
        '> Beschreibe nun deine Wünsche für deinen Bot.\n' +
        '> **Tipp:** Je genauer du deine Wünsche beschreibst, desto besser können wir deinen Bot nach deinen Vorstellungen entwickeln.\n' +
        '### 3. Hosting `Ja` oder `Nein`\n' +
        '> Wir bieten zudem die Möglichkeit, deinen Bot direkt bei uns zu hosten.\n' +
        '> Dabei übernehmen wir den kompletten Setup-Prozess für dich.'
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
        '> Du findest unsere Standard Bots im **#🤖・standard-bots** Channel\n' +
        '> Du möchtest einen Standard Bot, benötigst aber zusätzliche individuelle Features? Kein Problem!\n' +
        '> Wähle einfach den passenden Bot im **#🤖・standard-bots** Forum und Klicke den Bot kaufen Button.\n' +
        '> Dein Bot Wunsch ist nihcit bei den Standard Bots dabei? Dann Klicke den `🤖 Discord Button` unten.' 
      )
    )

    .addSeparatorComponents(
      new SeparatorBuilder()
        .setDivider(true)
        .setSpacing(1)
    )

    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        '## 💵 Unsere Preise\n' +
        '> 🖥️ **Hosting** (Wir übernehmen den kompletten Setup-Prozess)\n' +
        '> ➡️ 1 Monat = 10M\n' +
        '> ➡️ 1 Jahr = 100M\n' +
        '> 🤖 **Custom Discord Bot**\n' +
        '> ➡️ mind. Preis = 5M (Preis Verhandelbar)' 
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
};