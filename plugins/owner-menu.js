const { cmd, commands } = require('../command');
const { exec } = require('child_process');
const config = require('../config');
const { sleep } = require('../lib/functions');

// Fake vCard (inaweza kubadilishwa)
const fkontak = {
    "key": {
        "participant": '0@s.whatsapp.net',
        "remoteJid": '0@s.whatsapp.net',
        "fromMe": false,
        "id": "Halo"
    },
    "message": {
        "conversation": "TYREX"
    }
};

// === Context Info yenye newsletter yako na owner number ===
const getContextInfo = (m, ownerName = "TYREX 𝐌𝐃", formattedOwnerNumber = "255628378557") => {
    return {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363424973782944@newsletter',
            newsletterName: '© TYREX 𝐌𝐃',
            serverMessageId: 143,
        },
        externalAdReply: {
            title: `👑 𝙱𝙾𝚃 𝙾𝚆𝙽𝙴𝚁: ${ownerName}`,
            body: `📞 wa.me/${formattedOwnerNumber}`,
            mediaType: 1,
            previewType: 0,
            thumbnailUrl: 'https://i.ibb.co/2YRqb2Md/upload-1777244568390-9cc80c1a-jpg.jpg',
            sourceUrl: `https://wa.me/${formattedOwnerNumber}`,
            renderLargerThumbnail: false,
        }
    };
};

// ==============================================
// 1. SHUTDOWN BOT
// ==============================================
cmd({
    pattern: "shutdown",
    desc: "Shutdown the bot.",
    category: "owner",
    react: "🛑",
    filename: __filename
},
async (conn, mek, m, { from, isOwner, reply, sender }) => {
    const ownerName = "TYREX 𝐌𝐃";
    const ownerNumber = "255628378557";

    if (!isOwner) {
        return await conn.sendMessage(from, { 
            text: `*╭┄┄┄🌸🌹 TYREX MD 🌸🌹┄┄┄⊷*
*┃◆┬┄★ ★ ★ ★ ★ ★ ★ ★*
*┃◆┊ sᴛᴀᴛᴜs:* ᴀᴄᴄᴇss ᴅᴇɴɪᴇᴅ
*┃◆┊ ʀᴇᴀsᴏɴ:* ʏᴏᴜ ᴀʀᴇ ɴᴏᴛ ᴛʜᴇ ᴏᴡɴᴇʀ
*┃◆┴┄★ ★ ★ ★ ★ ★ ★ ★*
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷*

> ® 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 Tyrex Tech`,
            contextInfo: getContextInfo({ sender: sender }, ownerName, ownerNumber)
        }, { quoted: fkontak });
    }

    await conn.sendMessage(from, { 
        text: `*╭┄┄┄🌸🌹 TYREX MD 🌸🌹┄┄┄⊷*
*┃◆┬┄★ ★ ★ ★ ★ ★ ★ ★*
*┃◆┊ sᴛᴀᴛᴜs:* sʜᴜᴛᴛɪɴɢ ᴅᴏᴡɴ...
*┃◆┊ ᴍᴇssᴀɢᴇ:* ʙᴏᴛ ᴡɪʟʟ ʀᴇsᴛᴀʀᴛ ᴏʀ sᴛᴏᴘ
*┃◆┴┄★ ★ ★ ★ ★ ★ ★ ★*
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷*

> ® 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 Tyrex Tech`,
        contextInfo: getContextInfo({ sender: sender }, ownerName, ownerNumber)
    }, { quoted: fkontak });

    setTimeout(() => process.exit(), 1000);
});

// ==============================================
// 2. BROADCAST TO ALL GROUPS
// ==============================================
cmd({
    pattern: "broadcast",
    desc: "Broadcast a message to all groups.",
    category: "owner",
    react: "📢",
    filename: __filename
},
async (conn, mek, m, { from, isOwner, args, reply, sender }) => {
    const ownerName = "TYREX 𝐌𝐃";
    const ownerNumber = "255628378557";

    if (!isOwner) {
        return await conn.sendMessage(from, { 
            text: `*╭┄┄┄🌸🌹 TYREX MD 🌸🌹┄┄┄⊷*
*┃◆┬┄★ ★ ★ ★ ★ ★ ★ ★*
*┃◆┊ sᴛᴀᴛᴜs:* ᴀᴄᴄᴇss ᴅᴇɴɪᴇᴅ
*┃◆┊ ʀᴇᴀsᴏɴ:* ʏᴏᴜ ᴀʀᴇ ɴᴏᴛ ᴛʜᴇ ᴏᴡɴᴇʀ
*┃◆┴┄★ ★ ★ ★ ★ ★ ★ ★*
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷*

> ® 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 Tyrex Tech`,
            contextInfo: getContextInfo({ sender: sender }, ownerName, ownerNumber)
        }, { quoted: fkontak });
    }

    if (args.length === 0) {
        return await conn.sendMessage(from, { 
            text: `*╭┄┄┄🌸🌹 TYREX MD 🌸🌹┄┄┄⊷*
*┃◆┬┄★ ★ ★ ★ ★ ★ ★ ★*
*┃◆┊ ᴜsᴀɢᴇ:* .broadcast <message>
*┃◆┊ ᴇxᴀᴍᴘʟᴇ:* .broadcast Hello everyone
*┃◆┴┄★ ★ ★ ★ ★ ★ ★ ★*
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷*

> ® 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 Tyrex Tech`,
            contextInfo: getContextInfo({ sender: sender }, ownerName, ownerNumber)
        }, { quoted: fkontak });
    }

    const message = args.join(' ');
    const groups = Object.keys(await conn.groupFetchAllParticipating());

    for (const groupId of groups) {
        await conn.sendMessage(groupId, { 
            text: `*╭┄┄┄🌸🌹 BROADCAST 🌸🌹┄┄┄⊷*
*┃◆┬┄★ ★ ★ ★ ★ ★ ★ ★*
*┃◆┊ ᴍᴇssᴀɢᴇ:* ${message}
*┃◆┴┄★ ★ ★ ★ ★ ★ ★ ★*
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷*

> ® 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 Tyrex Tech`,
            contextInfo: getContextInfo({ sender: sender }, ownerName, ownerNumber)
        }, { quoted: fkontak });
    }

    await conn.sendMessage(from, { 
        text: `*╭┄┄┄🌸🌹 TYREX MD 🌸🌹┄┄┄⊷*
*┃◆┬┄★ ★ ★ ★ ★ ★ ★ ★*
*┃◆┊ sᴛᴀᴛᴜs:* ʙʀᴏᴀᴅᴄᴀsᴛ ᴄᴏᴍᴘʟᴇᴛᴇ
*┃◆┊ ɢʀᴏᴜᴘs:* ${groups.length} ɢʀᴏᴜᴘ(s)
*┃◆┴┄★ ★ ★ ★ ★ ★ ★ ★*
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷*

> ® 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 Tyrex Tech`,
        contextInfo: getContextInfo({ sender: sender }, ownerName, ownerNumber)
    }, { quoted: fkontak });
});

// ==============================================
// 3. SET BOT PROFILE PICTURE
// ==============================================
cmd({
    pattern: "setme",
    desc: "Set bot profile picture.",
    category: "owner",
    react: "🖼️",
    filename: __filename
},
async (conn, mek, m, { from, isOwner, quoted, reply, sender }) => {
    const ownerName = "TYREX 𝐌𝐃";
    const ownerNumber = "255628378557";

    if (!isOwner) {
        return await conn.sendMessage(from, { 
            text: `*╭┄┄┄🌸🌹 TYREX MD 🌸🌹┄┄┄⊷*
*┃◆┬┄★ ★ ★ ★ ★ ★ ★ ★*
*┃◆┊ sᴛᴀᴛᴜs:* ᴀᴄᴄᴇss ᴅᴇɴɪᴇᴅ
*┃◆┊ ʀᴇᴀsᴏɴ:* ʏᴏᴜ ᴀʀᴇ ɴᴏᴛ ᴛʜᴇ ᴏᴡɴᴇʀ
*┃◆┴┄★ ★ ★ ★ ★ ★ ★ ★*
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷*

> ® 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 Tyrex Tech`,
            contextInfo: getContextInfo({ sender: sender }, ownerName, ownerNumber)
        }, { quoted: fkontak });
    }

    if (!quoted || !quoted.message.imageMessage) {
        return await conn.sendMessage(from, { 
            text: `*╭┄┄┄🌸🌹 TYREX MD 🌸🌹┄┄┄⊷*
*┃◆┬┄★ ★ ★ ★ ★ ★ ★ ★*
*┃◆┊ ᴜsᴀɢᴇ:* ʀᴇᴘʟʏ ᴛᴏ ᴀɴ ɪᴍᴀɢᴇ ᴡɪᴛʜ .setme
*┃◆┊ ɴᴏᴛᴇ:* ᴛʜᴇ ɪᴍᴀɢᴇ ᴡɪʟʟ ʙᴇᴄᴏᴍᴇ ʙᴏᴛ's ᴘᴘ
*┃◆┴┄★ ★ ★ ★ ★ ★ ★ ★*
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷*

> ® 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 Tyrex Tech`,
            contextInfo: getContextInfo({ sender: sender }, ownerName, ownerNumber)
        }, { quoted: fkontak });
    }

    try {
        const media = await conn.downloadMediaMessage(quoted);
        await conn.updateProfilePicture(conn.user.jid, { url: media });

        await conn.sendMessage(from, { 
            text: `*╭┄┄┄🌸🌹 TYREX MD 🌸🌹┄┄┄⊷*
*┃◆┬┄★ ★ ★ ★ ★ ★ ★ ★*
*┃◆┊ sᴛᴀᴛᴜs:* sᴜᴄᴄᴇss
*┃◆┊ ᴍᴇssᴀɢᴇ:* ᴘʀᴏғɪʟᴇ ᴘɪᴄᴛᴜʀᴇ ᴜᴘᴅᴀᴛᴇᴅ!
*┃◆┴┄★ ★ ★ ★ ★ ★ ★ ★*
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷*

> ® 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 Tyrex Tech`,
            contextInfo: getContextInfo({ sender: sender }, ownerName, ownerNumber)
        }, { quoted: fkontak });
    } catch (error) {
        await conn.sendMessage(from, { 
            text: `*╭┄┄┄🌸🌹 TYREX MD 🌸🌹┄┄┄⊷*
*┃◆┬┄★ ★ ★ ★ ★ ★ ★ ★*
*┃◆┊ sᴛᴀᴛᴜs:* ᴇʀʀᴏʀ
*┃◆┊ ᴅᴇᴛᴀɪʟs:* ${error.message}
*┃◆┴┄★ ★ ★ ★ ★ ★ ★ ★*
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷*

> ® 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 Tyrex Tech`,
            contextInfo: getContextInfo({ sender: sender }, ownerName, ownerNumber)
        }, { quoted: fkontak });
    }
});

// ==============================================
// 4. CLEAR ALL CHATS
// ==============================================
cmd({
    pattern: "clearchats",
    desc: "Clear all chats from the bot.",
    category: "owner",
    react: "🧹",
    filename: __filename
},
async (conn, mek, m, { from, isOwner, reply, sender }) => {
    const ownerName = "TYREX 𝐌𝐃";
    const ownerNumber = "255628378557";

    if (!isOwner) {
        return await conn.sendMessage(from, { 
            text: `*╭┄┄┄🌸🌹 TYREX MD 🌸🌹┄┄┄⊷*
*┃◆┬┄★ ★ ★ ★ ★ ★ ★ ★*
*┃◆┊ sᴛᴀᴛᴜs:* ᴀᴄᴄᴇss ᴅᴇɴɪᴇᴅ
*┃◆┊ ʀᴇᴀsᴏɴ:* ʏᴏᴜ ᴀʀᴇ ɴᴏᴛ ᴛʜᴇ ᴏᴡɴᴇʀ
*┃◆┴┄★ ★ ★ ★ ★ ★ ★ ★*
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷*

> ® 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 Tyrex Tech`,
            contextInfo: getContextInfo({ sender: sender }, ownerName, ownerNumber)
        }, { quoted: fkontak });
    }

    try {
        const chats = conn.chats.all();
        for (const chat of chats) {
            await conn.modifyChat(chat.jid, 'delete');
        }

        await conn.sendMessage(from, { 
            text: `*╭┄┄┄🌸🌹 TYREX MD 🌸🌹┄┄┄⊷*
*┃◆┬┄★ ★ ★ ★ ★ ★ ★ ★*
*┃◆┊ sᴛᴀᴛᴜs:* sᴜᴄᴄᴇss
*┃◆┊ ᴍᴇssᴀɢᴇ:* ᴀʟʟ ᴄʜᴀᴛs ᴄʟᴇᴀʀᴇᴅ
*┃◆┴┄★ ★ ★ ★ ★ ★ ★ ★*
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷*

> ® 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 Tyrex Tech`,
            contextInfo: getContextInfo({ sender: sender }, ownerName, ownerNumber)
        }, { quoted: fkontak });
    } catch (error) {
        await conn.sendMessage(from, { 
            text: `*╭┄┄┄🌸🌹 TYREX MD 🌸🌹┄┄┄⊷*
*┃◆┬┄★ ★ ★ ★ ★ ★ ★ ★*
*┃◆┊ sᴛᴀᴛᴜs:* ᴇʀʀᴏʀ
*┃◆┊ ᴅᴇᴛᴀɪʟs:* ${error.message}
*┃◆┴┄★ ★ ★ ★ ★ ★ ★ ★*
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷*

> ® 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 Tyrex Tech`,
            contextInfo: getContextInfo({ sender: sender }, ownerName, ownerNumber)
        }, { quoted: fkontak });
    }
});

// ==============================================
// 5. GROUP JIDs LIST
// ==============================================
cmd({
    pattern: "gjid",
    desc: "Get the list of JIDs for all groups the bot is part of.",
    category: "owner",
    react: "📝",
    filename: __filename
},
async (conn, mek, m, { from, isOwner, reply, sender }) => {
    const ownerName = "TYREX 𝐌𝐃";
    const ownerNumber = "255628378557";

    if (!isOwner) {
        return await conn.sendMessage(from, { 
            text: `*╭┄┄┄🌸🌹 TYREX MD 🌸🌹┄┄┄⊷*
*┃◆┬┄★ ★ ★ ★ ★ ★ ★ ★*
*┃◆┊ sᴛᴀᴛᴜs:* ᴀᴄᴄᴇss ᴅᴇɴɪᴇᴅ
*┃◆┊ ʀᴇᴀsᴏɴ:* ʏᴏᴜ ᴀʀᴇ ɴᴏᴛ ᴛʜᴇ ᴏᴡɴᴇʀ
*┃◆┴┄★ ★ ★ ★ ★ ★ ★ ★*
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷*

> ® 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 Tyrex Tech`,
            contextInfo: getContextInfo({ sender: sender }, ownerName, ownerNumber)
        }, { quoted: fkontak });
    }

    const groups = await conn.groupFetchAllParticipating();
    const groupJids = Object.keys(groups).join('\n');

    await conn.sendMessage(from, { 
        text: `*╭┄┄┄🌸🌹 TYREX MD 🌸🌹┄┄┄⊷*
*┃◆┬┄★ ★ ★ ★ ★ ★ ★ ★*
*┃◆┊ ɢʀᴏᴜᴘ ᴊɪᴅs:* (${Object.keys(groups).length} ɢʀᴏᴜᴘs)
*┃◆┊ ${groupJids.replace(/\n/g, '\n*┃◆┊ ')}*
*┃◆┴┄★ ★ ★ ★ ★ ★ ★ ★*
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷*

> ® 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 Tyrex Tech`,
        contextInfo: getContextInfo({ sender: sender }, ownerName, ownerNumber)
    }, { quoted: fkontak });
});

// ==============================================
// 6. DELETE MESSAGE (GROUP/OWNER COMMAND)
// ==============================================
cmd({
    pattern: "delete",
    react: "❌",
    alias: ["del"],
    desc: "Delete a quoted message (owner or admin only)",
    category: "group",
    use: '.del',
    filename: __filename
},
async (conn, mek, m, { from, quoted, isOwner, isAdmins, sender, reply }) => {
    const ownerName = "TYREX 𝐌𝐃";
    const ownerNumber = "255628378557";

    if (!isOwner && !isAdmins) {
        return await conn.sendMessage(from, { 
            text: `*╭┄┄┄🌸🌹 TYREX MD 🌸🌹┄┄┄⊷*
*┃◆┬┄★ ★ ★ ★ ★ ★ ★ ★*
*┃◆┊ sᴛᴀᴛᴜs:* ᴀᴄᴄᴇss ᴅᴇɴɪᴇᴅ
*┃◆┊ ʀᴇᴀsᴏɴ:* ʏᴏᴜ ɴᴇᴇᴅ ᴀᴅᴍɪɴ ᴏʀ ᴏᴡɴᴇʀ ʀɪɢʜᴛs
*┃◆┴┄★ ★ ★ ★ ★ ★ ★ ★*
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷*

> ® 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 Tyrex Tech`,
            contextInfo: getContextInfo({ sender: sender }, ownerName, ownerNumber)
        }, { quoted: fkontak });
    }

    if (!m.quoted) {
        return await conn.sendMessage(from, { 
            text: `*╭┄┄┄🌸🌹 TYREX MD 🌸🌹┄┄┄⊷*
*┃◆┬┄★ ★ ★ ★ ★ ★ ★ ★*
*┃◆┊ ᴜsᴀɢᴇ:* ʀᴇᴘʟʏ ᴛᴏ ᴀ ᴍᴇssᴀɢᴇ ᴡɪᴛʜ .ᴅᴇʟᴇᴛᴇ
*┃◆┊ ɴᴏᴛᴇ:* ᴏɴʟʏ ᴛʜᴇ ᴍᴇssᴀɢᴇ ʏᴏᴜ ʀᴇᴘʟɪᴇᴅ ᴛᴏ ᴡɪʟʟ ʙᴇ ᴅᴇʟᴇᴛᴇᴅ
*┃◆┴┄★ ★ ★ ★ ★ ★ ★ ★*
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷*

> ® 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 Tyrex Tech`,
            contextInfo: getContextInfo({ sender: sender }, ownerName, ownerNumber)
        }, { quoted: fkontak });
    }

    try {
        const key = {
            remoteJid: m.chat,
            fromMe: false,
            id: m.quoted.id,
            participant: m.quoted.sender
        };
        await conn.sendMessage(m.chat, { delete: key });

        // Sending a silent success message (optional)
        await conn.sendMessage(from, { 
            text: `*╭┄┄┄🌸🌹 TYREX MD 🌸🌹┄┄┄⊷*
*┃◆┬┄★ ★ ★ ★ ★ ★ ★ ★*
*┃◆┊ sᴛᴀᴛᴜs:* ᴍᴇssᴀɢᴇ ᴅᴇʟᴇᴛᴇᴅ sᴜᴄᴄᴇssғᴜʟʟʏ
*┃◆┴┄★ ★ ★ ★ ★ ★ ★ ★*
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷*

> ® 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 Tyrex Tech`,
            contextInfo: getContextInfo({ sender: sender }, ownerName, ownerNumber)
        }, { quoted: fkontak });
    } catch (e) {
        console.log(e);
        await conn.sendMessage(from, { 
            text: `*╭┄┄┄🌸🌹 TYREX MD 🌸🌹┄┄┄⊷*
*┃◆┬┄★ ★ ★ ★ ★ ★ ★ ★*
*┃◆┊ sᴛᴀᴛᴜs:* ᴇʀʀᴏʀ
*┃◆┊ ᴅᴇᴛᴀɪʟs:* ${e.message || 'ᴄᴏᴜʟᴅ ɴᴏᴛ ᴅᴇʟᴇᴛᴇ ᴍᴇssᴀɢᴇ'}
*┃◆┴┄★ ★ ★ ★ ★ ★ ★ ★*
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷*

> ® 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 Tyrex Tech`,
            contextInfo: getContextInfo({ sender: sender }, ownerName, ownerNumber)
        }, { quoted: fkontak });
    }
});
