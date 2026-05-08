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
        },
    };
};

cmd({
    pattern: "tagall",
    alias: ["all", "everyone", "tagsemua", "alltag"],
    react: "📢",
    desc: "Tag all group members",
    category: "group",
    filename: __filename
},
async(conn, mek, m, {from, prefix, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{

    if (!isGroup) {
        return reply("This command only works in groups\n\n> ® Powered by Tyrex Tech");
    }

    const members = participants.map(p => p.id);

    if (members.length === 0) {
        return reply("No members found\n\n> ® Powered by Tyrex Tech");
    }

    let mentionText = `╭┄┄┄🌸🌹 *TAGALL* 🌹🌸┄┄┄⊷\n┃ 📢 Tagging all ${members.length} members\n┃\n`;

    if (q && q.trim()) {
        mentionText += `┃ Message: ${q.trim()}\n┃\n`;
    }

    // Chini kabisa ndio wote wanawekwa kwenye list
    mentionText += `┃ *Members:*\n┃\n`;
    members.forEach((member, index) => {
        mentionText += `┃ ${index + 1}. @${member.split('@')[0]}\n`;
    });

    mentionText += `┃\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`;

    await conn.sendMessage(from, {
        text: mentionText,
        mentions: members,
        contextInfo: {
            ...getContextInfo({ sender: sender }),
            mentionedJid: members
        }
    }, { quoted: mek });

} catch (e) {
    l(e);
    reply("Error tagging members\n\n> ® Powered by Tyrex Tech");
}
});