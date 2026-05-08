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
    pattern: "lyrics",
    alias: ["lyric", "songlyrics"],
    desc: "Search for song lyrics",
    category: "search",
    react: "🎶",
    filename: __filename
}, async (conn, mek, m, { from, text, q, sender, reply }) => {
    try {
        const ownerName = "𝐓𝐘𝐑𝐄𝐗 𝐌𝐃";
        const formattedOwnerNumber = "255628378557";

        if (!q) {
            return reply(`*LYRICS*\n\n❌ Song name required\n✿ Example: .lyrics Faded\n\n> ® Powered by Tyrex Tech`);
        }

        await conn.sendMessage(from, {
            text: `🌼 Searching lyrics for *${q}*...`,
            contextInfo: getContextInfo({ sender: sender }, ownerName, formattedOwnerNumber)
        }, { quoted: mek });

        const apiUrl = `https://apis.davidcyriltech.my.id/lyrics3?song=${encodeURIComponent(q)}`;
        const response = await axios.get(apiUrl);
        const data = response.data;

        if (data.status === 200 && data.success) {
            const { title, artist, lyrics, image } = data.result;

            let lyricsMsg =
`*SONG LYRICS*

*Title:* ${title}  
*Artist:* ${artist}

*LYRICS*
${lyrics}

> ® Powered by Tyrex Tech`;

            if (image) {
                await conn.sendMessage(from, {
                    image: { url: image },
                    caption: lyricsMsg,
                    contextInfo: getContextInfo({ sender: sender }, ownerName, formattedOwnerNumber)
                }, { quoted: mek });
            } else {
                await conn.sendMessage(from, { 
                    text: lyricsMsg,
                    contextInfo: getContextInfo({ sender: sender }, ownerName, formattedOwnerNumber)
                }, { quoted: mek });
            }

        } else {
            return reply(`*Not Found*\n\nLyrics not available\nCheck spelling & retry\n\n> ® Powered by Tyrex Tech`);
        }

    } catch (e) {
        console.error("Lyrics Error:", e);
        reply(`*Error*\n\nUnable to fetch lyrics\nTry again later\n\n> ® Powered by Tyrex Tech`);
    }
});
