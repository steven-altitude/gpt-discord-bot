require('dotenv').config();
const { Client, Intents } = require('discord.js');
const { Configuration, OpenAIApi } = require('openai');

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

const configuration = new Configuration({
  apiKey: process.env.API_KEY,
});
const openai = new OpenAIApi(configuration);

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (message.channel.id !== process.env.CHANNEL_ID) return;
  if (message.content.startsWith('!')) return;

  const conversationLog = [
    {
      speaker: 'USER',
      text: message.content,
    },
  ];

  try {
    const result = await openai.createCompletion({
      engine: 'davinci-codex',
      prompt: conversationLog,
      maxTokens: 100,
    });

    const response = result.choices[0].text;
    message.reply(response);
  } catch (error) {
    console.error(error);
    message.reply('An error occurred while processing your request.');
  }
});

client.login(process.env.TOKEN);
