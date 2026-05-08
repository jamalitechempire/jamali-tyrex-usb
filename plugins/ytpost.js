const { cmd } = require('../command');
const axios = require('axios');
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
    pattern: "ytpost",
    alias: ["ytcommunity", "ytc"],
    desc: "Download YouTube community post",
    category: "downloader",
    react: "🎥",
    filename: __filename
},
async (conn, mek, m, { from, q, sender, reply }) => {
    try {
        if (!q) return reply("Example: .ytpost <url>\n\n> ® Powered by Tyrex Tech");

        const apiUrl = `https://api.siputzx.my.id/api/d/ytpost?url=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);

        if (!data.status || !data.data) {
            await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
            return reply("Failed to fetch post.\n\n> ® Powered by Tyrex Tech");
        }

        const post = data.data;
        let caption = `📢 *YT Community Post*\n\n${post.content}\n\n> ® Powered by Tyrex Tech`;

        if (post.images?.length > 0) {
            for (const img of post.images) {
                await conn.sendMessage(from, { image: { url: img }, caption, contextInfo: getContextInfo({ sender: sender }) }, { quoted: mek });
                caption = "";
            }
        } else {
            await conn.sendMessage(from, { text: caption, contextInfo: getContextInfo({ sender: sender }) }, { quoted: mek });
        }

        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (e) {
        console.error("ytpost Error:", e);
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
        reply("Error fetching post.\n\n> ® Powered by Tyrex Tech");
    }
});