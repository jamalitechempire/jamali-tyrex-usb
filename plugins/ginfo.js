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

// ============ GINFO COMMAND ============
cmd({
    pattern: "ginfo",
    alias: ["groupinfo", "infogroup", "grouppic", "gp"],
    react: "ℹ️",
    desc: "Get detailed group information",
    category: "group",
    filename: __filename
},
async(conn, mek, m, {from, l, isGroup, sender, botNumber, participants, reply}) => {
try{
    if (!isGroup) {
        return reply("This command is only for groups\n\n> ® Powered by Tyrex Tech");
    }
    
    const groupMetadata = await conn.groupMetadata(from);
    const botJid = botNumber + '@s.whatsapp.net';
    
    const botParticipant = groupMetadata.participants.find(p => p.id === botJid);
    const isBotAdmin = botParticipant ? (botParticipant.admin === 'admin' || botParticipant.admin === 'superadmin') : false;
    
    let ppUrl;
    try {
        ppUrl = await conn.profilePictureUrl(from, 'image');
    } catch {
        ppUrl = 'https://i.ibb.co/2YRqb2Md/upload-1777244568390-9cc80c1a-jpg.jpg';
    }
    
    let adminList = '';
    let adminMentions = [];
    let adminCount = 0;
    
    for (let participant of groupMetadata.participants) {
        if (participant.admin === 'admin' || participant.admin === 'superadmin') {
            adminList += `┃ 👑 @${participant.id.split('@')[0]}\n`;
            adminMentions.push(participant.id);
            adminCount++;
        }
    }
    
    if (adminList === '') {
        adminList = '┃ No admins found\n';
    }
    
    let groupSettings = '';
    try {
        const groupInviteCode = await conn.groupInviteCode(from);
        groupSettings += `┃ 🔗 Invite: https://chat.whatsapp.com/${groupInviteCode}\n`;
    } catch {
        groupSettings += `┃ 🔗 Invite: Unable to fetch\n`;
    }
    
    const totalMembers = groupMetadata.participants.length;
    const totalAdmins = adminCount;
    const totalRegular = totalMembers - totalAdmins;
    
    const creationDate = new Date(groupMetadata.creation * 1000).toLocaleString();
    
    let response = `╭┄┄┄🌸🌹 *GROUP INFORMATION* 🌹🌸┄┄┄⊷\n`;
    response += `┃\n`;
    response += `┃ 📌 *Group:* ${groupMetadata.subject}\n`;
    response += `┃ 🆔 *ID:* ${from}\n`;
    response += `┃ 📅 *Created:* ${creationDate}\n`;
    response += `┃ 👥 *Total Members:* ${totalMembers}\n`;
    response += `┃ 👑 *Admins:* ${totalAdmins}\n`;
    response += `┃ 👤 *Regular:* ${totalRegular}\n`;
    response += `┃\n`;
    response += `┃ ━━━━━━━━━━━━━━━━━━━\n`;
    response += `┃ *BOT STATUS:*\n`;
    response += `┃ 🤖 Bot is ${isBotAdmin ? '✅ ADMIN' : '❌ NOT ADMIN'}\n`;
    response += `┃ 🔧 Bot can ${isBotAdmin ? '✅ perform all admin actions' : '❌ only perform basic actions'}\n`;
    response += `┃\n`;
    response += `┃ ━━━━━━━━━━━━━━━━━━━\n`;
    response += `┃ *ADMIN LIST:*\n`;
    response += adminList;
    response += `┃\n`;
    response += `┃ ━━━━━━━━━━━━━━━━━━━\n`;
    response += groupSettings;
    response += `┃\n`;
    response += `┃ ━━━━━━━━━━━━━━━━━━━\n`;
    response += `┃ *Group Description:*\n`;
    response += `┃ ${groupMetadata.desc || 'No description'}\n`;
    response += `╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`;
    
    await conn.sendMessage(from, {
        image: { url: ppUrl },
        caption: response,
        mentions: adminMentions,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

} catch (e) {
    console.log('GINFO ERROR:', e);
    reply(`Failed to get group info. Error: ${e.message}\n\n> ® Powered by Tyrex Tech`);
    l(e);
}
});

// ============ TEST COMMAND ============
cmd({
    pattern: "test",
    alias: ["testbot"],
    react: "🧪",
    desc: "Test command with fixed isBotAdmin",
    category: "group",
    filename: __filename
},
async(conn, mek, m, {from, isGroup, sender, botNumber, reply}) => {
try{
    if (!isGroup) return;
    
    const groupMetadata = await conn.groupMetadata(from);
    const botJid = botNumber + '@s.whatsapp.net';
    
    const botParticipant = groupMetadata.participants.find(p => p.id === botJid);
    const isBotAdmin = botParticipant ? (botParticipant.admin === 'admin' || botParticipant.admin === 'superadmin') : false;
    
    if (!isBotAdmin) {
        return reply("Bot is not admin. Cannot perform admin actions.\n\n> ® Powered by Tyrex Tech");
    }
    
    await conn.sendMessage(from, {
        text: "✅ Bot is admin! Ready to perform admin actions.\n\n> ® Powered by Tyrex Tech",
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

} catch (e) {
    console.log(e);
    l(e);
}
}); 
