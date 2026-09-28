const { SlashCommandBuilder } = require('discord.js');

const commands = [
  new SlashCommandBuilder()
    .setName('rules')
    .setDescription('Schickt das Embed mit den Server Regeln in den Channel.')
    .toJSON(),

  new SlashCommandBuilder()
    .setName('our-team')
    .setDescription('Schickt das Embed mit der Team Vorstellung in den Channel.')
    .toJSON(),

  new SlashCommandBuilder()
    .setName('bot-shop')
    .setDescription('Schickt das Embed für den Bot Shop in den Channel.')
    .toJSON(),

  new SlashCommandBuilder()
    .setName('ticket-support-bot')
    .setDescription('Schickt das Embed mit dem man den Standard Ticket-Support Bot kaufen kann.')
    .toJSON(),

  new SlashCommandBuilder()
    .setName('giveaway-bot')
    .setDescription('Schickt das Embed mit dem man den Standard Giveaway Bot kaufen kann.')
    .toJSON(),
];

module.exports = commands;