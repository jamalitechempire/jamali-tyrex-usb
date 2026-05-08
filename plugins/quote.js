const axios = require("axios");
const { cmd } = require("../command");

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
  pattern: "quote",
  desc: "Get a random inspiring quote.",
  category: "fun",
  react: "💬",
  filename: __filename
}, async (conn, m, store, { from, reply, sender }) => {
  try {
    const response = await axios.get("https://api.quotable.io/random");
    const { content, author } = response.data;

    const message = `💬 *"${content}"*\n\n— ${author}\n\n> ® Powered by Tyrex Tech`;

    await conn.sendMessage(from, { 
      text: message,
      contextInfo: getContextInfo({ sender: sender })
    }, { quoted: m });

  } catch (error) {
    console.error("Error fetching quote:", error);
    reply("⚠️ API issue or coding error, please check the logs!\n\n> ® Powered by Tyrex Tech");
  }
});