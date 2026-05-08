const { cmd } = require('../command');
const axios = require('axios');

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
    pattern: "pindl",
    alias: ["pinterestdl", "pint", "pins", "pindownload"],
    desc: "Download media from Pinterest",
    category: "download",
    react: "📌",
    filename: __filename
}, async (conn, mek, m, { args, quoted, from, reply, sender }) => {
    try {
        const ownerName = "𝐓𝐘𝐑𝐄𝐗 𝐌𝐃";
        const formattedOwnerNumber = "255628378557";

        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

        if (args.length < 1) {
            await conn.sendMessage(from, { react: { text: "⚠️", key: mek.key } });
            return reply("Please provide the Pinterest URL to download from.\n\n> ® Powered by Tyrex Tech");
        }

        const pinterestUrl = args[0];
        const response = await axios.get(`https://api.giftedtech.web.id/api/download/pinterestdl?apikey=gifted&url=${encodeURIComponent(pinterestUrl)}`);

        if (!response.data.success) {
            await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
            return reply("Failed to fetch data from Pinterest.\n\n> ® Powered by Tyrex Tech");
        }

        const media = response.data.result.media;
        const description = response.data.result.description || 'No description available';
        const title = response.data.result.title || 'No title available';
        const videoUrl = media.find(item => item.type.includes('720p'))?.download_url || media[0].download_url;

        const desc = `╭┄┄┄🌸🌹 *TYREX MD* 🌹🌸┄┄┄⊷\n┃ *PINS DOWNLOADER*\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n╭┄┄┄🌸🌹 *INFO* 🌹🌸┄┄┄⊷\n┃ *Title* - ${title}\n┃ *Media Type* - ${media[0].type}\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`;

        if (videoUrl) {
            await conn.sendMessage(from, { 
                video: { url: videoUrl }, 
                caption: desc,
                contextInfo: getContextInfo({ sender: sender }, ownerName, formattedOwnerNumber)
            }, { quoted: mek });
        } else {
            const imageUrl = media.find(item => item.type === 'Thumbnail')?.download_url;
            await conn.sendMessage(from, { 
                image: { url: imageUrl }, 
                caption: desc,
                contextInfo: getContextInfo({ sender: sender }, ownerName, formattedOwnerNumber)
            }, { quoted: mek });
        }

        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (e) {
        console.error(e);
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
        reply("An error occurred while processing your request.\n\n> ® Powered by Tyrex Tech");
    }
});