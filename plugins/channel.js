const config = require('../config');
const { cmd } = require('../command');

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

const stylizedChars = {
    a: '🅐', b: '🅑', c: '🅒', d: '🅓', e: '🅔', f: '🅕', g: '🅖',
    h: '🅗', i: '🅘', j: '🅙', k: '🅚', l: '🅛', m: '🅜', n: '🅝',
    o: '🅞', p: '🅟', q: '🅠', r: '🅡', s: '🅢', t: '🅣', u: '🅤',
    v: '🅥', w: '🅦', x: '🅧', y: '🅨', z: '🅩',
    '0': '⓿', '1': '➊', '2': '➋', '3': '➌', '4': '➍',
    '5': '➎', '6': '➏', '7': '➐', '8': '➑', '9': '➒'
};

cmd({
    pattern: "ch",
    alias: ["chreact"],
    react: "🔤",
    desc: "React to channel messages with stylized text",
    category: "owner",
    filename: __filename
},
async (conn, mek, m, { from, q, sender, isCreator, reply }) => {
    try {
        const ownerName = "𝐓𝐘𝐑𝐄𝐗 𝐌𝐃";
        const formattedOwnerNumber = "255628378557";
        
        if (!isCreator) {
            return reply("This command is only available to the bot owner.\n\n> ® Powered by Tyrex Tech");
        }
        
        if (!q) {
            return await conn.sendMessage(from, { 
                text: `╭┄┄┄🌸🌹 *CHANNEL REACT* 🌹🌸┄┄┄⊷\n┃\n┃ 📜 *Usage:*\n┃ ➸ .ch <channel-link> <text>\n┃\n┃ 💡 *Example:*\n┃ ➸ .ch https://whatsapp.com/channel/123 hello\n┃\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`, 
                contextInfo: getContextInfo({ sender: sender }, ownerName, formattedOwnerNumber)
            }, { quoted: mek });
        }

        const [link, ...textParts] = q.split(' ');
        if (!link.includes("whatsapp.com/channel/")) {
            return reply("Invalid channel link format\n\n> ® Powered by Tyrex Tech");
        }
        
        const inputText = textParts.join(' ').toLowerCase();
        if (!inputText) {
            return reply("Please provide text to convert\n\n> ® Powered by Tyrex Tech");
        }

        const emoji = inputText
            .split('')
            .map(char => {
                if (char === ' ') return '―';
                return stylizedChars[char] || char;
            })
            .join('');

        const channelId = link.split('/')[4];
        const messageId = link.split('/')[5];
        
        if (!channelId || !messageId) {
            return reply("Invalid link - missing IDs\n\n> ® Powered by Tyrex Tech");
        }

        const channelMeta = await conn.newsletterMetadata("invite", channelId);
        await conn.newsletterReactMessage(channelMeta.id, messageId, emoji);

        await conn.sendMessage(from, { 
            text: `╭┄┄┄🌸🌹 *SUCCESS* 🌹🌸┄┄┄⊷\n┃\n┃ ▸ *Reaction Sent!*\n┃ ▸ *Channel:* ${channelMeta.name}\n┃ ▸ *Reaction:* ${emoji}\n┃\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`, 
            contextInfo: getContextInfo({ sender: sender }, ownerName, formattedOwnerNumber)
        }, { quoted: mek });
        
    } catch (e) {
        console.error(e);
        reply(`Error: ${e.message || "Failed to send reaction"}`);
    }
});
