 const axios = require("axios");
const { cmd } = require("../command");
const config = require('../config');

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

cmd({
  pattern: "mediafire",
  alias: ["mfire", "mfdownload"],
  react: '📥',
  desc: "Download files from MediaFire",
  category: "download",
  filename: __filename
}, async (conn, mek, m, { from, args, sender, reply }) => {
  try {
    const url = args[0];
    if (!url?.includes("mediafire.com")) {
      return reply("Example: .mediafire https://www.mediafire.com/file/...\n\n> ® Powered by Tyrex Tech");
    }

    await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

    const apiUrl = `https://apis.davidcyriltech.my.id/mediafire?url=${encodeURIComponent(url)}`;
    const { data } = await axios.get(apiUrl);

    if (!data?.downloadLink) {
      return reply("Failed to fetch file.\n\n> ® Powered by Tyrex Tech");
    }

    await conn.sendMessage(from, { text: `📥 Downloading (${data.size})...`, contextInfo: getContextInfo({ sender: sender }) }, { quoted: mek });

    const fileResponse = await axios.get(data.downloadLink, { responseType: 'arraybuffer' });
    const fileBuffer = Buffer.from(fileResponse.data);

    await conn.sendMessage(from, {
      document: fileBuffer,
      fileName: data.fileName,
      mimetype: data.mimeType,
      caption: `📄 *${data.fileName}*\n⚖️ ${data.size}\n\n> ® Powered by Tyrex Tech`,
      contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

    await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

  } catch (error) {
    console.error("MediaFire Error:", error);
    await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
    reply("Failed to download.\n\n> ® Powered by Tyrex Tech");
  }
});
