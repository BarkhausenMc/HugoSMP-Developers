const { InteractionType } = require('discord.js');
const rulesHandler = require('../handlers/rulesHandler');
const ourTeamHandler = require('../handlers/ourTeamHandler');
const botShopHandler = require('../handlers/botShopHandler');
const ticketSupportBotHandler = require('../handlers/ticketSupportBotHandler');
const giveawayBotHandler = require('../handlers/giveawayBotHandler');
const { createDiscordBotModal } = require('../components/discordBotModal');
const { createTicketSupportBotModal } = require('../components/ticketSupportBotModal');
const { createGiveawayBotModal } = require('../components/giveawayBotModal');
const { createTicket } = require('../handlers/createTicket');

async function interactionCreateHandler(interaction, client) {
  // Slash Command Handler
  if (interaction.isChatInputCommand()) {
    switch (interaction.commandName) {
      case 'rules':
        await rulesHandler(interaction);
        break;
      case 'our-team':
        await ourTeamHandler(interaction);
        break;
      case 'bot-shop':
        await botShopHandler(interaction);
        break;
      case 'ticket-support-bot':
        await ticketSupportBotHandler(interaction);
        break;
      case 'giveaway-bot':
        await giveawayBotHandler(interaction);
        break;
    }
    return;
  }

  // Button Handler
  if (interaction.isButton()) {
    if (interaction.customId === 'discord_bot') {
      await interaction.showModal(createDiscordBotModal());
      return;
    }

    if (interaction.customId === 'buy_ticketSupportBot') {
      await interaction.showModal(createTicketSupportBotModal());
      return;
    }

    if (interaction.customId === 'buy_GiveawayBot') {
      await interaction.showModal(createGiveawayBotModal());
      return;
    }
  }

  // Modal Submit Handler
  if (interaction.isModalSubmit()) {
    if (interaction.customId === 'discord_bot_modal') {
      await createTicket(interaction, 'Custom Discord Bot');
      return;
    }

    if (interaction.customId === 'ticketSupportBot_kaufen_modal') {
      await createTicket(interaction, 'Standard Ticket/Support Bot');
      return;
    }

    if (interaction.customId === 'GiveawayBot_kaufen_modal') {
      await createTicket(interaction, 'Standard Giveaway Bot');
      return;
    }
  }
}

module.exports = interactionCreateHandler;