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
  pattern: "cid",
  alias: ["newsletter", "id", "channelid"],
  react: "⏳",
  desc: "Get WhatsApp Channel info from link",
  category: "whatsapp",
  filename: __filename
}, async (conn, mek, m, {
  from,
  args,
  q,
  reply,
  sender
}) => {
  try {
    if (!q) {
      return reply(`Please provide a WhatsApp Channel link.\n\n*Example:* .cid https://whatsapp.com/channel/123456789\n\n> ® Powered by Tyrex Tech`);
    }

    const match = q.match(/whatsapp\.com\/channel\/([\w-]+)/);
    if (!match) {
      return reply(`*Invalid channel link format.*\n\nMake sure it looks like:\nhttps://whatsapp.com/channel/xxxxxxxxx\n\n> ® Powered by Tyrex Tech`);
    }

    const inviteId = match[1];

    let metadata;
    try {
      metadata = await conn.newsletterMetadata("invite", inviteId);
    } catch (e) {
      return reply(`Failed to fetch channel metadata. Make sure the link is correct.\n\n> ® Powered by Tyrex Tech`);
    }

    if (!metadata || !metadata.id) {
      return reply(`Channel not found or inaccessible.\n\n> ® Powered by Tyrex Tech`);
    }

    const infoText = `╭┄┄┄🌸🌹 *CHANNEL INFO* 🌹🌸┄┄┄⊷\n┃\n┃ 🛠️ *ID:* ${metadata.id}\n┃ 📌 *Name:* ${metadata.name}\n┃ 👥 *Followers:* ${metadata.subscribers?.toLocaleString() || "N/A"}\n┃ 📅 *Created:* ${metadata.creation_time ? new Date(metadata.creation_time * 1000).toLocaleString() : "Unknown"}\n┃\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`;

    if (metadata.preview) {
      await conn.sendMessage(from, {
        image: { url: `https://pps.whatsapp.net${metadata.preview}` },
        caption: infoText,
        contextInfo: getContextInfo({ sender: sender })
      }, { quoted: mek });
    } else {
      await conn.sendMessage(from, { 
        text: infoText,
        contextInfo: getContextInfo({ sender: sender })
      }, { quoted: mek });
    }

  } catch (error) {
    console.error("Error in .cid plugin:", error);
    reply(`An unexpected error occurred.\n\n> ® Powered by Tyrex Tech`);
  }
});
