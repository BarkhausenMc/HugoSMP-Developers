const {
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  MessageFlags
} = require('discord.js');

async function rulesHandler(interaction) {
  const rulesContainer = new ContainerBuilder()
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        '# 📚 General Server Rules 📚\n\n' +
        '__**🔹 Behavior & Respect**__\n\n' +
        '• 🤝 **Be friendly and respectful** – Treat all members the way you would like to be treated.\n\n' +
        '• 🚫 **No bullying, hate, or discrimination** – Racism, sexism, homophobia, transphobia, or any other form of hate is strictly prohibited.\n\n' +
        '• 💬 **No spam or flooding** – Avoid sending repeated messages, excessive emojis, or meaningless content.'
      )
    )
    .addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1))
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        '__**🔹 Content & Communication**__\n\n' +
        '• 🔞 **No NSFW content** – Pornographic, sexually explicit, or excessively violent content is prohibited.\n\n' +
        '• 🚨 **No illegal content** – Do not share links to pirated content, drugs, weapons, or other illegal activities.\n\n' +
        '• 📢 **No advertising without permission** – Server invites and advertisements are only allowed in designated channels.'
      )
    )
    .addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1))
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        '__**🔹 Privacy & Security**__\n\n' +
        '• 🔒 **Protect your personal information** – Do not share personal information such as your address, passwords, or other sensitive data.\n\n' +
        '• 🚫 **No doxxing** – Do not publish or share private information belonging to other people.\n\n' +
        '• 🤖 **Beware of phishing** – Do not click suspicious links and report them to the moderators.'
      )
    )
    .addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1))
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        '__**🔹 Moderation & Consequences**__\n\n' +
        '• ⚠️ **Warnings & Kicks** – Violations may initially result in a warning. Repeated violations may result in a kick.\n\n' +
        '• 🚪 **Bans** – Serious violations, such as hate speech or illegal content, may result in an immediate ban.\n\n' +
        '• 📩 **Report users** – Use the report channel to report inappropriate behavior or rule violations.'
      )
    )
    .addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1))
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        '__**🔹 Other**__\n\n' +
        '• 🔄 **Ignorance of the rules is not an excuse.**\n\n' +
        '• 💙 **Discord ToS:** https://discord.com/terms\n\n' +
        '• 💙 **Discord Guidelines:** https://discord.com/guidelines'
      )
    )
    .addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1))
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent('⚠️ **By joining this server, you agree to follow these rules.**')
    );

  await interaction.reply({
    components: [rulesContainer],
    flags: MessageFlags.IsComponentsV2
  });
}

module.exports = rulesHandler;