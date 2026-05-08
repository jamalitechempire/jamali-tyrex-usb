 const config = require('../config');
const { cmd, commands } = require('../command');
const { runtime } = require('../lib/functions');
const axios = require('axios');

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
        const formattedOwnerNumber = "255628378557";
        
        if (!isCreator) {
            return reply("Owner Only Command! You're not authorized to view bot configurations.\n\n> ® Powered by Tyrex Tech");
        }

        let envSettings = `
╭───『 *${config.BOT_NAME} CONFIG* 』───❏
│
├─❏ *🤖 BOT INFO*
│  ├─∘ Name: ${config.BOT_NAME}
│  ├─∘ Prefix: ${config.PREFIX}
│  ├─∘ Owner: ${config.OWNER_NAME}
│  ├─∘ Number: ${config.OWNER_NUMBER}
│  └─∘ Mode: ${config.MODE.toUpperCase()}
│
├─❏ *⚙️ CORE SETTINGS*
│  ├─∘ Public Mode: ${isEnabled(config.PUBLIC_MODE) ? "✅" : "❌"}
│  ├─∘ Always Online: ${isEnabled(config.ALWAYS_ONLINE) ? "✅" : "❌"}
│  ├─∘ Read Msgs: ${isEnabled(config.READ_MESSAGE) ? "✅" : "❌"}
│  └─∘ Read Cmds: ${isEnabled(config.READ_CMD) ? "✅" : "❌"}
│
├─❏ *🔌 AUTOMATION*
│  ├─∘ Auto Reply: ${isEnabled(config.AUTO_REPLY) ? "✅" : "❌"}
│  ├─∘ Auto React: ${isEnabled(config.AUTO_REACT) ? "✅" : "❌"}
│  ├─∘ Custom React: ${isEnabled(config.CUSTOM_REACT) ? "✅" : "❌"}
│  ├─∘ React Emojis: ${config.CUSTOM_REACT_EMOJIS}
│  ├─∘ Auto Sticker: ${isEnabled(config.AUTO_STICKER) ? "✅" : "❌"}
│
├─❏ *📢 STATUS SETTINGS*
│  ├─∘ Status Seen: ${isEnabled(config.AUTO_STATUS_SEEN) ? "✅" : "❌"}
│  ├─∘ Status Reply: ${isEnabled(config.AUTO_STATUS_REPLY) ? "✅" : "❌"}
│  ├─∘ Status React: ${isEnabled(config.AUTO_STATUS_REACT) ? "✅" : "❌"}
│  └─∘ Status Msg: ${config.AUTO_STATUS_MSG}
│
├─❏ *🛡️ SECURITY*
│  ├─∘ Anti-Link: ${isEnabled(config.ANTI_LINK) ? "✅" : "❌"}
│  ├─∘ Anti-Bad: ${isEnabled(config.ANTI_BAD) ? "✅" : "❌"}
│  ├─∘ Anti-VV: ${isEnabled(config.ANTI_VV) ? "✅" : "❌"}
│  └─∘ Del Links: ${isEnabled(config.DELETE_LINKS) ? "✅" : "❌"}
│
├─❏ *🎨 MEDIA*
│  ├─∘ Alive Img: ${config.ALIVE_IMG}
│  ├─∘ Menu Img: ${config.MENU_IMAGE_URL}
│  ├─∘ Alive Msg: ${config.LIVE_MSG}
│  └─∘ Sticker Pack: ${config.STICKER_NAME}
│
├─❏ *⏳ MISC*
│  ├─∘ Auto Typing: ${isEnabled(config.AUTO_TYPING) ? "✅" : "❌"}
│  ├─∘ Auto Record: ${isEnabled(config.AUTO_RECORDING) ? "✅" : "❌"}
│  ├─∘ Anti-Del Path: ${config.ANTI_DEL_PATH}
│  └─∘ Dev Number: ${config.DEV}
│
╰───『 *${config.DESCRIPTION}* 』───❏
> ® Powered by Tyrex Tech
`;

        await conn.sendMessage(
            from,
            {
                image: { url: config.MENU_IMAGE_URL },
                caption: envSettings,
                contextInfo: getContextInfo({ sender: sender }, ownerName, formattedOwnerNumber)
            },
            { quoted: mek }
        );

    } catch (error) {
        console.error('Env command error:', error);
        reply(`Error displaying config: ${error.message}\n\n> ® Powered by Tyrex Tech`);
    }
});
