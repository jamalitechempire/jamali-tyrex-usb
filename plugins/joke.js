 const axios = require("axios");
const { sleep } = require('../lib/functions');
const { cmd, commands } = require("../command");

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
  pattern: "joke",
  desc: "😂 Get a random joke",
  react: "🤣",
  category: "fun",
  filename: __filename
}, async (conn, m, store, { from, reply, sender }) => {
  try {
    const response = await axios.get("https://official-joke-api.appspot.com/random_joke");
    const joke = response.data;

    if (!joke || !joke.setup || !joke.punchline) {
      return reply("Failed to fetch a joke. Please try again.\n\n> ® Powered by Tyrex Tech");
    }

    const jokeMessage = `🤣 *Here's a random joke for you!* 🤣\n\n*${joke.setup}*\n\n${joke.punchline} 😆\n\n> ® Powered by Tyrex Tech`;

    await conn.sendMessage(from, { 
      text: jokeMessage,
      contextInfo: getContextInfo({ sender: sender })
    }, { quoted: m });
    
  } catch (error) {
    console.error("Error in joke command:", error);
    reply("An error occurred while fetching the joke. Please try again.\n\n> ® Powered by Tyrex Tech");
  }
});
