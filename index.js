const { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, Events, EmbedBuilder } = require('discord.js');

const TOKEN = 'MTQ4OTU2OTY2MzM3NjU2MDI3OQ.G6xFev.2O_UZAd1-M9x0qUN513BJYmxbx6cBdiJZxwGNw'; // <- Wstaw tutaj swój token
const VERIFIED_ROLE_ID = '1489292794299420926'; // <- ID roli

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

client.once('ready', () => {
  console.log(`Zalogowano jako ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  if (message.content === '!setup') {
    const embed = new EmbedBuilder()
      .setColor('#00FFFF')
      .setTitle('🎁 | 𝗪𝗘𝗥𝗬𝗙𝗜𝗞𝗔𝗖𝗝𝗔 • LexmurGG')
      .setDescription('Kliknij przycisk, aby rozpocząć weryfikację. Po poprawnej odpowiedzi bot nada Ci rolę.')
      .setFooter({ text: 'LexmurGG • System weryfikacji' });

    const button = new ButtonBuilder()
      .setCustomId('verify')
      .setLabel('ROZPOCZNIJ WERYFIKACJĘ')
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents(button);
    await message.channel.send({ embeds: [embed], components: [row] });
  }
});

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

client.login(TOKEN);