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

// ============ LINK COMMAND ============
cmd({
    pattern: "link",
    alias: ["grouplink", "invite", "linkgroup"],
    react: "🔗",
    desc: "Get group invite link",
    category: "group",
    filename: __filename
},
async(conn, mek, m, {from, l, isGroup, sender, isAdmins, isBotAdmins, reply}) => {
try{
    if (!isGroup) return reply("This command is only for groups\n\n> ® Powered by Tyrex Tech");
    
    if (!isAdmins && !isBotAdmins) return reply("You need to be an admin to use this command\n\n> ® Powered by Tyrex Tech");
    
    const groupMetadata = await conn.groupMetadata(from);
    const response = await conn.groupInviteCode(from);
    const link = `https://chat.whatsapp.com/${response}`;
    
    await conn.sendMessage(from, {
        text: `╭┄┄┄🌸🌹 *GROUP LINK* 🌹🌸┄┄┄⊷\n┃\n┃ 📌 *Group:* ${groupMetadata.subject}\n┃ 🔗 *Link:* ${link}\n┃ 👥 *Members:* ${groupMetadata.participants.length}\n┃ ⏰ *Created:* ${new Date(groupMetadata.creation * 1000).toLocaleDateString()}\n┃\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

} catch (e) {
    reply("Failed to get group link\n\n> ® Powered by Tyrex Tech");
    l(e);
}
});

// ============ REVOKE COMMAND ============
cmd({
    pattern: "revoke",
    alias: ["resetlink", "newlink", "revokelink"],
    react: "🔄",
    desc: "Revoke and reset group invite link",
    category: "group",
    filename: __filename
},
async(conn, mek, m, {from, l, isGroup, sender, isAdmins, reply}) => {
try{
    if (!isGroup) return reply("This command is only for groups\n\n> ® Powered by Tyrex Tech");
    
    if (!isAdmins) return reply("You need to be an admin to revoke group link\n\n> ® Powered by Tyrex Tech");
    
    await conn.sendMessage(from, {
        text: `⏳ Revoking group link...`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });
    
    await conn.groupRevokeInvite(from);
    const newCode = await conn.groupInviteCode(from);
    const newLink = `https://chat.whatsapp.com/${newCode}`;
    
    const groupMetadata = await conn.groupMetadata(from);
    
    await conn.sendMessage(from, {
        text: `╭┄┄┄🌸🌹 *LINK REVOKED* 🌹🌸┄┄┄⊷\n┃\n┃ ✅ Group link has been reset successfully\n┃ 📌 *Group:* ${groupMetadata.subject}\n┃ 🔗 *New Link:* ${newLink}\n┃ 👥 *Members:* ${groupMetadata.participants.length}\n┃ ⏰ *Created:* ${new Date(groupMetadata.creation * 1000).toLocaleDateString()}\n┃\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

} catch (e) {
    console.log('REVOKE ERROR:', e);
    reply(`Failed to revoke group link. Error: ${e.message}\n\n> ® Powered by Tyrex Tech`);
    l(e);
}
});
