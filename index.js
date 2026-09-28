const { Client, GatewayIntentBits } = require('discord.js');
const { DISCORD_BOT_TOKEN } = require('./src/config/env');
const { updateMemberCount } = require('./src/utils/memberCounter');

// Importiere Event Handler
const guildMemberAddHandler = require('./src/events/guildMemberAdd');
const guildMemberRemoveHandler = require('./src/events/guildMemberRemove');
const interactionCreateHandler = require('./src/events/interactionCreate');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
});

// Client Ready Event
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

// Event Listener registrieren
client.on('guildMemberAdd', async (member) => {
  guildMemberAddHandler(member);
});

client.on('guildMemberRemove', async (member) => {
  guildMemberRemoveHandler(member);
});

client.on('interactionCreate', async (interaction) => {
  await interactionCreateHandler(interaction, client);
});

// Bot Login
client.login(DISCORD_BOT_TOKEN);