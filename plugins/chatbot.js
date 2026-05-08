 const { cmd } = require("../command");
const config = require("../config");
const fetch = require("node-fetch");

const getContextInfo = (m, ownerName = "𝐓𝐘𝐑𝐄𝐗 𝐌𝐃", formattedOwnerNumber = "255628378557") => {
    return {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363424973782944@newsletter',
            newsletterName: '𝐓𝐘𝐑𝐄𝐗 𝐌𝐃',
            serverMessageId: 143,
        },
        externalAdReply: {
            title: `👑 BOT OWNER: ${ownerName}`,
            body: `wa.me/${formattedOwnerNumber}`,
            mediaType: 1,
            previewType: 0,
            thumbnailUrl: 'https://i.ibb.co/2YRqb2Md/upload-1777244568390-9cc80c1a-jpg.jpg',
            sourceUrl: `https://wa.me/${formattedOwnerNumber}`,
            renderLargerThumbnail: false,
        }
    };
};

// === AI Chatbot Event Handler ===
cmd({ on: "body" }, async (conn, mek, m, { from, body, isGroup, isCmd, sender }) => {
  try {
    if (config.AUTO_AI === "true" && !isCmd && !isGroup && !mek.key.fromMe && body) {
      
      await conn.sendPresenceUpdate('composing', from);

      const apiKey = ""; 
      const apiUrl = `https://apis.davidcyriltech.my.id/ai/chatbot?query=${encodeURIComponent(body)}&apikey=${apiKey}`;
      
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.status === 200 || data.success) {
        const aiReply = data.result;

        await conn.sendMessage(from, {
          text: `${aiReply}\n\n> ® Powered by Tyrex Tech 🤖`,
          contextInfo: getContextInfo({ sender: sender }, "𝐓𝐘𝐑𝐄𝐗 𝐌𝐃", "255628378557")
        }, { quoted: mek });
      }
    }
  } catch (error) {
    console.error("Chatbot Error:", error);
  }
});

// === Chatbot Toggle Command ===
cmd({
  pattern: "chatbot",
  alias: ["autoai", "aichat"],
  desc: "Toggle Auto AI Chatbot feature",
  category: "owner",
  react: "🤖",
  filename: __filename
},
async (conn, mek, m, { from, sender, args, isOwner, reply }) => {
  try {
    const ownerName = "𝐓𝐘𝐑𝐄𝐗 𝐌𝐃";
    const formattedOwnerNumber = "255628378557";
    
    if (!isOwner) {
      return reply("Owner-only command!\n\n> ® Powered by Tyrex Tech");
    }

    const action = args[0]?.toLowerCase() || 'status';
    let statusText, reaction = "🤖", additionalInfo = "";

    switch (action) {
      case 'on':
        if (config.AUTO_AI === "true") {
          statusText = "AI Chatbot is already ENABLED!";
          reaction = "ℹ️";
        } else {
          config.AUTO_AI = "true";
          statusText = "AI Chatbot has been ENABLED!";
          reaction = "✅";
          additionalInfo = "I will now reply to all private messages 💬";
        }
        break;

      case 'off':
        if (config.AUTO_AI === "false") {
          statusText = "AI Chatbot is already DISABLED!";
          reaction = "ℹ️";
        } else {
          config.AUTO_AI = "false";
          statusText = "AI Chatbot has been DISABLED!";
          reaction = "❌";
          additionalInfo = "Auto-replies are now turned off 🔇";
        }
        break;

      default:
        statusText = `Chatbot Status: ${config.AUTO_AI === "true" ? "ENABLED" : "DISABLED"}`;
        additionalInfo = config.AUTO_AI === "true" ? "Ready to chat 🤖" : "Standing by 💤";
        break;
    }

    await conn.sendMessage(from, {
      image: { url: "https://i.ibb.co/2YRqb2Md/upload-1777244568390-9cc80c1a-jpg.jpg" },
      caption: `${statusText}\n${additionalInfo}\n\n> ® Powered by Tyrex Tech`,
      contextInfo: getContextInfo({ sender: sender }, ownerName, formattedOwnerNumber)
    }, { quoted: mek });

    await conn.sendMessage(from, {
      react: { text: reaction, key: mek.key }
    });

  } catch (error) {
    console.error("Chatbot command error:", error);
    reply(`Error: ${error.message}\n\n> ® Powered by Tyrex Tech`);
  }
});
