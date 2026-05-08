const { cmd } = require('../command');
const axios = require('axios');

const getContextInfo = (m) => {
    return {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363424973782944@newsletter',
            newsletterName: '𝐓𝐘𝐑𝐄𝐗 𝐌𝐃',
            serverMessageId: 143,
        }
    };
};

cmd({
  pattern: "ytstalk",
  alias: ["ytinfo"],
  desc: "Get details about a YouTube channel.",
  react: "🔍",
  category: "search",
  filename: __filename
}, async (conn, m, store, { from, quoted, q, reply, sender }) => {
  try {
    if (!q) {
      return reply("Please provide a valid YouTube channel username or ID.\n\n> ® Powered by Tyrex Tech");
    }

    await conn.sendMessage(from, {
      react: { text: "⏳", key: m.key }
    });

    const apiUrl = `https://delirius-apiofc.vercel.app/tools/ytstalk?channel=${encodeURIComponent(q)}`;
    const { data } = await axios.get(apiUrl);

    if (!data || !data.status || !data.data) {
      return reply("Failed to fetch YouTube channel details. Ensure the username or ID is correct.\n\n> ® Powered by Tyrex Tech");
    }

    const yt = data.data;
    const caption = `╭┄┄┄🌸🌹 *YOUTUBE STALKER* 🌹🌸┄┄┄⊷\n┃\n┃ 👤 *Username:* ${yt.username}\n┃ 📊 *Subscribers:* ${yt.subscriber_count}\n┃ 🎥 *Videos:* ${yt.video_count}\n┃ 🔗 *Channel:* ${yt.channel}\n┃\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`;

    await conn.sendMessage(from, {
      image: { url: yt.avatar },
      caption: caption,
      contextInfo: getContextInfo({ sender: sender })
    }, { quoted: m });

  } catch (error) {
    console.error("Error:", error);
    reply("An error occurred while processing your request. Please try again.\n\n> ® Powered by Tyrex Tech");
  }
});