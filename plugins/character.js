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
    pattern: "character",
    alias: ["char"],
    desc: "Check the character of a mentioned user.",
    react: "🔥",
    category: "fun",
    filename: __filename,
}, 
async (conn, mek, m, { from, isGroup, sender, quoted, reply }) => {
    try {
        const ownerName = "𝐓𝐘𝐑𝐄𝐗 𝐌𝐃";
        const formattedOwnerNumber = "255628378557";
        
        if (!isGroup) {
            return reply("This command can only be used in groups.\n\n> ® Powered by Tyrex Tech");
        }

        const mentionedUser = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
        if (!mentionedUser) {
            return reply("Please mention a user whose character you want to check.\n\n> ® Powered by Tyrex Tech");
        }

        const userChar = [
            "Sigma",
            "Generous",
            "Grumpy",
            "Overconfident",
            "Obedient",
            "Good",
            "Simp",
            "Kind",
            "Patient",
            "Pervert",
            "Cool",
            "Helpful",
            "Brilliant",
            "Sexy",
            "Hot",
            "Gorgeous",
            "Cute",
        ];

        const userCharacterSelection = userChar[Math.floor(Math.random() * userChar.length)];

        await conn.sendMessage(from, {
            text: `🔥 Character of @${mentionedUser.split("@")[0]} is *${userCharacterSelection}*\n\n> ® Powered by Tyrex Tech`,
            mentions: [mentionedUser],
            contextInfo: getContextInfo({ sender: sender }, ownerName, formattedOwnerNumber)
        }, { quoted: mek });

    } catch (e) {
        console.error("Error in character command:", e);
        reply("An error occurred while processing the command.\n\n> ® Powered by Tyrex Tech");
    }
});
