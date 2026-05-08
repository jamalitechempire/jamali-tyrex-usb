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
    pattern: "mute",
    alias: ["silent", "quiet"],
    react: "🔇",
    desc: "Mute the group",
    category: "group",
    filename: __filename
},
async(conn, mek, m, {from, prefix, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
    if (!isGroup) return reply("This command is only for groups\n\n> ® Powered by Tyrex Tech");

    if (!isAdmins) return reply("You need to be an admin to mute\n\n> ® Powered by Tyrex Tech");

    await conn.groupSettingUpdate(from, 'announcement');

    await conn.sendMessage(from, {
        text: `╭┄┄┄🌸🌹 *GROUP MUTED* 🌹🌸┄┄┄⊷\n┃ ✅ Group has been muted\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

} catch (e) {
    if (e.message.includes('403') || e.message.includes('permission')) {
        reply("Bot needs to be admin first\n\n> ® Powered by Tyrex Tech");
    } else {
        reply("Command failed\n\n> ® Powered by Tyrex Tech");
    }
    l(e);
}
});