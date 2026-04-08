require('dotenv').config(); // linia 1

const { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, Events, EmbedBuilder } = require('discord.js');
const express = require('express');
const app = express();

// --- KONFIGURACJA ---
const MTQ4OTU2OTY2MzM3NjU2MDI3OQ.GA18iS.bJSWXnPfcjlbM9Y0SbyMUL3NVg4ELQH8sttH1Q = process.env.TOKEN; // <- w Render ustawione w Environment Variables
const VERIFIED_ROLE_ID = '1489292794299420926'; // ID roli

// --- INICJALIZACJA BOTA ---
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

client.once('ready', () => {
  console.log(`Zalogowano jako ${client.user.tag}`);
});

// --- KOMENDA !setup ---
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  if (message.content === '!setup') {
    const embed = new EmbedBuilder()
      .setColor('#00FFFF')
      .setTitle('🎁 | 𝗪𝗘𝗥𝗬𝗙𝗜𝗞𝗔𝗖𝗝𝗔 • WAMPIRMC.PL')
      .setDescription('Kliknij przycisk, aby rozpocząć weryfikację. Po poprawnej odpowiedzi bot nada Ci rolę.')
      .setFooter({ text: 'WampirMC.PL • System weryfikacji' });

    const button = new ButtonBuilder()
      .setCustomId('verify')
      .setLabel('ROZPOCZNIJ WERYFIKACJĘ')
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents(button);
    await message.channel.send({ embeds: [embed], components: [row] });
  }
});

// --- OBSŁUGA PRZYCISKU I MODALA ---
client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isButton() && interaction.customId === 'verify') {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;

    const modal = new ModalBuilder()
      .setCustomId(`math_${a}_${b}`)
      .setTitle('Weryfikacja');

    const input = new TextInputBuilder()
      .setCustomId('odp')
      .setLabel(`Ile to jest: ${a} + ${b}?`)
      .setStyle(TextInputStyle.Short);

    modal.addComponents(new ActionRowBuilder().addComponents(input));
    await interaction.showModal(modal);
  }

  if (interaction.isModalSubmit() && interaction.customId.startsWith('math_')) {
    const [_, a, b] = interaction.customId.split('_');
    const correct = parseInt(a) + parseInt(b);
    const answer = parseInt(interaction.fields.getTextInputValue('odp'));

    if (answer === correct) {
      const role = interaction.guild.roles.cache.get(VERIFIED_ROLE_ID);
      if (role) await interaction.member.roles.add(role);
      await interaction.reply({ content: '✅ Zweryfikowano!', ephemeral: true });
    } else {
      await interaction.reply({ content: '❌ Źle!', ephemeral: true });
    }
  }
});

// --- LOGOWANIE BOTA ---
client.login(TOKEN);

// --- EXPRESS DLA RENDER ---
const PORT = process.env.PORT || 10000;
app.get('/', (req, res) => res.send('Bot działa!'));
app.listen(PORT, () => console.log(`Serwis działa na porcie ${PORT}`));
