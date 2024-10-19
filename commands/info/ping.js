const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("ดูสถานะปิงของบอท"),
  async execute(interaction, client) {
    const message = await interaction.deferReply({
      fetchReply: true,
    });
    // const newMessage = `API Latency: ${client.ws.ping} Ms\nClient Ping: ${Date.now() - message.createdTimestamp} Ms`
    const ping = new EmbedBuilder()
      .setAuthor({ name: "⌛ ความหน่วงของบอท ณ ขณะนี้!" })
      .setDescription(
        `เวลาในการตอบสนองข้อความ ${
          Date.now() - message.createdTimestamp
        }ms\nเวลาในการตอบสนองของ API ${client.ws.ping}ms.`
      );

    await interaction.editReply({
      embeds: [ping],
    });
  },
};
