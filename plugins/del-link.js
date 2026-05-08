 const { cmd } = require('../command');
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

const linkPatterns = [
    /https?:\/\/(?:chat\.whatsapp\.com|wa\.me)\/\S+/gi,
    /^https?:\/\/(www\.)?whatsapp\.com\/channel\/([a-zA-Z0-9_-]+)$/,
    /wa\.me\/\S+/gi,
    /https?:\/\/(?:t\.me|telegram\.me)\/\S+/gi,
    /https?:\/\/(?:www\.)?youtube\.com\/\S+/gi,
    /https?:\/\/youtu\.be\/\S+/gi,
    /https?:\/\/(?:www\.)?facebook\.com\/\S+/gi,
    /https?:\/\/fb\.me\/\S+/gi,
    /https?:\/\/(?:www\.)?instagram\.com\/\S+/gi,
    /https?:\/\/(?:www\.)?twitter\.com\/\S+/gi,
    /https?:\/\/(?:www\.)?tiktok\.com\/\S+/gi,
    /https?:\/\/(?:www\.)?linkedin\.com\/\S+/gi,
    /https?:\/\/(?:www\.)?snapchat\.com\/\S+/gi,
    /https?:\/\/(?:www\.)?pinterest\.com\/\S+/gi,
    /https?:\/\/(?:www\.)?reddit\.com\/\S+/gi,
    /https?:\/\/ngl\/\S+/gi,
    /https?:\/\/(?:www\.)?discord\.com\/\S+/gi,
    /https?:\/\/(?:www\.)?twitch\.tv\/\S+/gi,
    /https?:\/\/(?:www\.)?vimeo\.com\/\S+/gi,
    /https?:\/\/(?:www\.)?dailymotion\.com\/\S+/gi,
    /https?:\/\/(?:www\.)?medium\.com\/\S+/gi
];

cmd({
    on: 'body'
}, async (conn, mek, m, { from, body, isGroup, isAdmins, isBotAdmins, sender }) => {
    try {
        if (!isGroup || isAdmins || !isBotAdmins) {
            return;
        }

        const containsLink = linkPatterns.some(pattern => pattern.test(body));

        if (containsLink && config.DELETE_LINKS === 'true') {
            await conn.sendMessage(from, { delete: m.key });
            
            await conn.sendMessage(from, { 
                text: `🚫 @${sender.split("@")[0]} Links are not allowed in this group!`,
                mentions: [sender],
                contextInfo: getContextInfo({ sender: sender }, "𝐓𝐘𝐑𝐄𝐗 𝐌𝐃", "255628378557")
            }, { quoted: mek });
        }
    } catch (error) {
        console.error(error);
    }
});

// Command to toggle link deletion
cmd({
    pattern: "dellink",
    alias: ["deletelinks", "autodeletelink"],
    desc: "Toggle automatic link deletion in groups",
    category: "group",
    react: "🔗",
    filename: __filename
},
async (conn, mek, m, { from, args, isGroup, isAdmins, isOwner, sender, reply }) => {
    try {
        const ownerName = "𝐓𝐘𝐑𝐄𝐗 𝐌𝐃";
        const formattedOwnerNumber = "255628378557";
        
        if (!isGroup) {
            return reply("This command is only for groups\n\n> ® Powered by Tyrex Tech");
        }
        
        if (!isAdmins && !isOwner) {
            return reply("Admin-only command!\n\n> ® Powered by Tyrex Tech");
        }

        const action = args[0]?.toLowerCase();
        let statusText = "";
        let reaction = "🔗";

        if (action === "on") {
            config.DELETE_LINKS = "true";
            statusText = "Auto Link Deletion has been ENABLED";
            reaction = "✅";
        } 
        else if (action === "off") {
            config.DELETE_LINKS = "false";
            statusText = "Auto Link Deletion has been DISABLED";
            reaction = "❌";
        } 
        else {
            const currentStatus = config.DELETE_LINKS === "true" ? "Enabled ✅" : "Disabled ❌";
            
            return await conn.sendMessage(from, { 
                text: `╭┄┄┄🌸🌹 *AUTO LINK DELETE* 🌹🌸┄┄┄⊷\n┃\n┃ 📜 *Usage:*\n┃ ➸ .dellink on  - Enable feature\n┃ ➸ .dellink off - Disable feature\n┃\n┃ 💡 *Current Status:* ${currentStatus}\n┃\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`, 
                contextInfo: getContextInfo({ sender: sender }, ownerName, formattedOwnerNumber)
            }, { quoted: mek });
        }

        await conn.sendMessage(from, { 
            text: `${statusText}\n\n> ® Powered by Tyrex Tech`, 
            contextInfo: getContextInfo({ sender: sender }, ownerName, formattedOwnerNumber)
        }, { quoted: mek });

        await conn.sendMessage(from, {
            react: { text: reaction, key: mek.key }
        });

    } catch (error) {
        console.error("Dellink command error:", error);
        reply(`Error: ${error.message}\n\n> ® Powered by Tyrex Tech`);
    }
});
