 const { cmd } = require('../command');

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
  pattern: "hidetag",
  alias: ["tag", "h"],  
  react: "🔊",
  desc: "To Tag all Members for Any Message/Media",
  category: "group",
  use: '.hidetag Hello',
  filename: __filename
},
async (conn, mek, m, {
  from, q, isGroup, isCreator, isAdmins,
  participants, sender, reply
}) => {
  try {
    const isUrl = (url) => {
      return /https?:\/\/(www\.)?[\w\-@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([\w\-@:%_\+.~#?&//=]*)/.test(url);
    };

    if (!isGroup) {
      return reply("This command can only be used in groups.\n\n> ® Powered by Tyrex Tech");
    }
    
    if (!isAdmins && !isCreator) {
      return reply("Only group admins can use this command.\n\n> ® Powered by Tyrex Tech");
    }

    const mentionAll = { mentions: participants.map(u => u.id) };

    if (!q && !m.quoted) {
      return reply("Please provide a message or reply to a message to tag all members.\n\n> ® Powered by Tyrex Tech");
    }

    if (m.quoted) {
      const type = m.quoted.mtype || '';
      
      if (type === 'extendedTextMessage') {
        return await conn.sendMessage(from, {
          text: m.quoted.text || 'No message content found.',
          ...mentionAll,
          contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
      }

      if (['imageMessage', 'videoMessage', 'audioMessage', 'stickerMessage', 'documentMessage'].includes(type)) {
        try {
          const buffer = await m.quoted.download?.();
          if (!buffer) {
            return reply("Failed to download the quoted media.\n\n> ® Powered by Tyrex Tech");
          }

          let content;
          switch (type) {
            case "imageMessage":
              content = { 
                image: buffer, 
                caption: m.quoted.text || "📷 Image", 
                ...mentionAll,
                contextInfo: getContextInfo({ sender: sender })
              };
              break;
            case "videoMessage":
              content = { 
                video: buffer, 
                caption: m.quoted.text || "🎥 Video", 
                gifPlayback: m.quoted.message?.videoMessage?.gifPlayback || false, 
                ...mentionAll,
                contextInfo: getContextInfo({ sender: sender })
              };
              break;
            case "audioMessage":
              content = { 
                audio: buffer, 
                mimetype: "audio/mp4", 
                ptt: m.quoted.message?.audioMessage?.ptt || false, 
                ...mentionAll,
                contextInfo: getContextInfo({ sender: sender })
              };
              break;
            case "stickerMessage":
              content = { 
                sticker: buffer, 
                ...mentionAll,
                contextInfo: getContextInfo({ sender: sender })
              };
              break;
            case "documentMessage":
              content = {
                document: buffer,
                mimetype: m.quoted.message?.documentMessage?.mimetype || "application/octet-stream",
                fileName: m.quoted.message?.documentMessage?.fileName || "file",
                caption: m.quoted.text || "",
                ...mentionAll,
                contextInfo: getContextInfo({ sender: sender })
              };
              break;
          }

          if (content) {
            return await conn.sendMessage(from, content, { quoted: mek });
          }
        } catch (e) {
          console.error("Media download/send error:", e);
          return reply("Failed to process the media. Sending as text instead.\n\n> ® Powered by Tyrex Tech");
        }
      }

      return await conn.sendMessage(from, {
        text: m.quoted.text || "📨 Message",
        ...mentionAll,
        contextInfo: getContextInfo({ sender: sender })
      }, { quoted: mek });
    }

    if (q) {
      if (isUrl(q)) {
        return await conn.sendMessage(from, {
          text: q,
          ...mentionAll,
          contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
      }

      await conn.sendMessage(from, {
        text: q,
        ...mentionAll,
        contextInfo: getContextInfo({ sender: sender })
      }, { quoted: mek });
    }

  } catch (e) {
    console.error(e);
    reply(`Error Occurred!!\n\n${e.message}\n\n> ® Powered by Tyrex Tech`);
  }
});
