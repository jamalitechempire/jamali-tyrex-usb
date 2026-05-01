const config = require('../config');
const { cmd, commands } = require('../command');
const { runtime } = require('../lib/functions');
const axios = require('axios');

// FakevCard sawa na zilizopita
const fkontak = {
    "key": {
        "participant": '0@s.whatsapp.net',
        "remoteJid": '0@s.whatsapp.net',
        "fromMe": false,
        "id": "Halo"
    },
    "message": {
        "conversation": "𝚂𝙸𝙻𝙰"
    }
};

const getContextInfo = (m, ownerName = "𝐓𝐘𝐑𝐄𝐗 𝐌𝐃", formattedOwnerNumber = "255628378557") => {
    return {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363424973782944@newsletter',
            newsletterName: '© 𝐓𝐘𝐑𝐄𝐗 𝐌𝐃',
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

function isEnabled(value) {
    return value && value.toString().toLowerCase() === "true";
}

cmd({
    pattern: "config",
    alias: ["varlist", "envlist"],
    desc: "Show all bot configuration variables (Owner Only)",
    category: "system",
    react: "⚙️",
    filename: __filename
}, 
async (conn, mek, m, { from, quoted, reply, isCreator, sender }) => {
    try {
        const ownerName = "𝐓𝐘𝐑𝐄𝐗 𝐌𝐃";
        const formattedOwnerNumber = "2557628378557";
        
        if (!isCreator) {
            return await conn.sendMessage(from, { 
                text: "🚫 *𝙾𝚠𝚗𝚎𝚛 𝙾𝚗𝚕𝚢 𝙲𝚘𝚖𝚖𝚊𝚗𝚍!* 𝚈𝚘𝚞'𝚛𝚎 𝚗𝚘𝚝 𝚊𝚞𝚝𝚑𝚘𝚛𝚒𝚣𝚎𝚍 𝚝𝚘 𝚟𝚒𝚎𝚠 𝚋𝚘𝚝 𝚌𝚘𝚗𝚏𝚒𝚐𝚞𝚛𝚊𝚝𝚒𝚘𝚗𝚜.\n\n> © 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐓𝐲𝐫𝐞𝐱 𝐓𝐞𝐜𝐡", 
                contextInfo: getContextInfo({ sender: sender }, ownerName, formattedOwnerNumber)
            }, { quoted: fkontak });
        }

        let envSettings = `
╭───『 *${config.BOT_NAME} 𝙲𝙾𝙽𝙵𝙸𝙶* 』───❏
│
├─❏ *🤖 𝙱𝙾𝚃 𝙸𝙽𝙵𝙾*
│  ├─∘ 𝙽𝚊𝚖𝚎: ${config.BOT_NAME}
│  ├─∘ 𝙿𝚛𝚎𝚏𝚒𝚡: ${config.PREFIX}
│  ├─∘ 𝙾𝚠𝚗𝚎𝚛: ${config.OWNER_NAME}
│  ├─∘ 𝙽𝚞𝚖𝚋𝚎𝚛: ${config.OWNER_NUMBER}
│  └─∘ 𝙼𝚘𝚍𝚎: ${config.MODE.toUpperCase()}
│
├─❏ *⚙️ 𝙲𝙾𝚁𝙴 𝚂𝙴𝚃𝚃𝙸𝙽𝙶𝚂*
│  ├─∘ 𝙿𝚞𝚋𝚕𝚒𝚌 𝙼𝚘𝚍𝚎: ${isEnabled(config.PUBLIC_MODE) ? "✅" : "❌"}
│  ├─∘ 𝙰𝚕𝚠𝚊𝚢𝚜 𝙾𝚗𝚕𝚒𝚗𝚎: ${isEnabled(config.ALWAYS_ONLINE) ? "✅" : "❌"}
│  ├─∘ 𝚁𝚎𝚊𝚍 𝙼𝚜𝚐𝚜: ${isEnabled(config.READ_MESSAGE) ? "✅" : "❌"}
│  └─∘ 𝚁𝚎𝚊𝚍 𝙲𝚖𝚍𝚜: ${isEnabled(config.READ_CMD) ? "✅" : "❌"}
│
├─❏ *🔌 𝙰𝚄𝚃𝙾𝙼𝙰𝚃𝙸𝙾𝙽*
│  ├─∘ 𝙰𝚞𝚝𝚘 𝚁𝚎𝚙𝚕𝚢: ${isEnabled(config.AUTO_REPLY) ? "✅" : "❌"}
│  ├─∘ 𝙰𝚞𝚝𝚘 𝚁𝚎𝚊𝚌𝚝: ${isEnabled(config.AUTO_REACT) ? "✅" : "❌"}
│  ├─∘ 𝙲𝚞𝚜𝚝𝚘𝚖 𝚁𝚎𝚊𝚌𝚝: ${isEnabled(config.CUSTOM_REACT) ? "✅" : "❌"}
│  ├─∘ 𝚁𝚎𝚊𝚌𝚝 𝙴𝚖𝚘𝚓𝚒𝚜: ${config.CUSTOM_REACT_EMOJIS}
│  ├─∘ 𝙰𝚞𝚝𝚘 𝚂𝚝𝚒𝚌𝚔𝚎𝚛: ${isEnabled(config.AUTO_STICKER) ? "✅" : "❌"}
│
├─❏ *📢 𝚂𝚃𝙰𝚃𝚄𝚂 𝚂𝙴𝚃𝚃𝙸𝙽𝙶𝚂*
│  ├─∘ 𝚂𝚝𝚊𝚝𝚞𝚜 𝚂𝚎𝚎𝚗: ${isEnabled(config.AUTO_STATUS_SEEN) ? "✅" : "❌"}
│  ├─∘ 𝚂𝚝𝚊𝚝𝚞𝚜 𝚁𝚎𝚙𝚕𝚢: ${isEnabled(config.AUTO_STATUS_REPLY) ? "✅" : "❌"}
│  ├─∘ 𝚂𝚝𝚊𝚝𝚞𝚜 𝚁𝚎𝚊𝚌𝚝: ${isEnabled(config.AUTO_STATUS_REACT) ? "✅" : "❌"}
│  └─∘ 𝚂𝚝𝚊𝚝𝚞𝚜 𝙼𝚜𝚐: ${config.AUTO_STATUS_MSG}
│
├─❏ *🛡️ 𝚂𝙴𝙲𝚄𝚁𝙸𝚃𝚈*
│  ├─∘ 𝙰𝚗𝚝𝚒-𝙻𝚒𝚗𝚔: ${isEnabled(config.ANTI_LINK) ? "✅" : "❌"}
│  ├─∘ 𝙰𝚗𝚝𝚒-𝙱𝚊𝚍: ${isEnabled(config.ANTI_BAD) ? "✅" : "❌"}
│  ├─∘ 𝙰𝚗𝚝𝚒-𝚅𝚅: ${isEnabled(config.ANTI_VV) ? "✅" : "❌"}
│  └─∘ 𝙳𝚎𝚕 𝙻𝚒𝚗𝚔𝚜: ${isEnabled(config.DELETE_LINKS) ? "✅" : "❌"}
│
├─❏ *🎨 𝙼𝙴𝙳𝙸𝙰*
│  ├─∘ 𝙰𝚕𝚒𝚟𝚎 𝙸𝚖𝚐: ${config.ALIVE_IMG}
│  ├─∘ 𝙼𝚎𝚗𝚞 𝙸𝚖𝚐: ${config.MENU_IMAGE_URL}
│  ├─∘ 𝙰𝚕𝚒𝚟𝚎 𝙼𝚜𝚐: ${config.LIVE_MSG}
│  └─∘ 𝚂𝚝𝚒𝚌𝚔𝚎𝚛 𝙿𝚊𝚌𝚔: ${config.STICKER_NAME}
│
├─❏ *⏳ 𝙼𝙸𝚂𝙲*
│  ├─∘ 𝙰𝚞𝚝𝚘 𝚃𝚢𝚙𝚒𝚗𝚐: ${isEnabled(config.AUTO_TYPING) ? "✅" : "❌"}
│  ├─∘ 𝙰𝚞𝚝𝚘 𝚁𝚎𝚌𝚘𝚛𝚍: ${isEnabled(config.AUTO_RECORDING) ? "✅" : "❌"}
│  ├─∘ 𝙰𝚗𝚝𝚒-𝙳𝚎𝚕 𝙿𝚊𝚝𝚑: ${config.ANTI_DEL_PATH}
│  └─∘ 𝙳𝚎𝚟 𝙽𝚞𝚖𝚋𝚎𝚛: ${config.DEV}
│
╰───『 *${config.DESCRIPTION}* 』───❏
> © Powered by Sila Tech
`;

        await conn.sendMessage(
            from,
            {
                image: { url: config.MENU_IMAGE_URL },
                caption: envSettings,
                contextInfo: getContextInfo({ sender: sender }, ownerName, formattedOwnerNumber)
            },
            { quoted: fkontak }
        );

    } catch (error) {
        console.error('Env command error:', error);
        await conn.sendMessage(from, { 
            text: `❌ 𝙴𝚛𝚛𝚘𝚛 𝚍𝚒𝚜𝚙𝚕𝚊𝚢𝚒𝚗𝚐 𝚌𝚘𝚗𝚏𝚒𝚐: ${error.message}\n\n> © 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐓𝐲𝐫𝐞𝐱 𝐓𝐞𝐜𝐡`, 
            contextInfo: getContextInfo({ sender: sender }, "𝐓𝐘𝐑𝐄𝐗 𝐌𝐃", "255628378557")
        }, { quoted: fkontak });
    }
});
