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
    'pattern': "couplepp",
    'alias': ["couple", "cpp"],
    'react': '💑',
    'desc': "Get a male and female couple profile picture.",
    'category': "image",
    'filename': __filename
}, async (conn, mek, m, { from, sender, reply }) => {
    try {
        const ownerName = "𝐓𝐘𝐑𝐄𝐗 𝐌𝐃";
        const formattedOwnerNumber = "255628378557";
        
        await conn.sendMessage(from, { 
            text: "💑 Fetching couple profile pictures...", 
            contextInfo: getContextInfo({ sender: sender }, ownerName, formattedOwnerNumber)
        }, { quoted: mek });
        
        const response = await axios.get("https://api.davidcyriltech.my.id/couplepp");

        if (!response.data || !response.data.success) {
            return reply("Failed to fetch couple profile pictures.\n\n> ® Powered by Tyrex Tech");
        }

        const malePp = response.data.male;
        const femalePp = response.data.female;

        if (malePp) {
            await conn.sendMessage(from, {
                'image': { 'url': malePp },
                'caption': "👨 Male Couple Profile Picture\n\n> ® Powered by Tyrex Tech",
                'contextInfo': getContextInfo({ sender: sender }, ownerName, formattedOwnerNumber)
            }, { 'quoted': mek });
        }

        if (femalePp) {
            await conn.sendMessage(from, {
                'image': { 'url': femalePp },
                'caption': "👩 Female Couple Profile Picture\n\n> ® Powered by Tyrex Tech",
                'contextInfo': getContextInfo({ sender: sender }, ownerName, formattedOwnerNumber)
            }, { 'quoted': mek });
        }

    } catch (error) {
        console.error(error);
        reply("An error occurred while fetching the couple profile pictures.\n\n> ® Powered by Tyrex Tech");
    }
});
