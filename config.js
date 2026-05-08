const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}

module.exports = {
SESSION_ID: process.env.SESSION_ID || "",
// add your session id

AUTO_STATUS_SEEN: process.env.AUTO_STATUS_SEEN || "true",
// make true/false for status auto seen

AUTO_STATUS_REPLY: process.env.AUTO_STATUS_REPLY || "false",
// make true for auto reply on status

AUTO_STATUS_REACT: process.env.AUTO_STATUS_REACT || "true",
// anticall on/off

ANTI_CALL: process.env.ANTI_CALL || "false",
// make true/false for anticall

CUSTOM_STATUS_EMOJIS: process.env.CUSTOM_STATUS_EMOJIS || "❤️,✨,🔥,💯,✅,👑",
// status reaction emojis

AUTO_STATUS_MSG: process.env.AUTO_STATUS_MSG || "*𝐓𝐘𝐑𝐄𝐗-𝐌𝐃 𝐕𝐈𝐄𝐖𝐄𝐃✅*",
// auto reply message on status

ANTI_DELETE: process.env.ANTI_DELETE || "false",
// true/false for anti delete

ANTI_DEL_PATH: process.env.ANTI_DEL_PATH || "index",
// change to 'Same' for resend in same chat

WELCOME: process.env.WELCOME || "false",
// true if want welcome & goodbye msgs in groups

ADMIN_EVENTS: process.env.ADMIN_EVENTS || "false",
// true to notify on member promote/demote

LINK_WHITELIST: "youtube.com,github.com",
LINK_ACTION: "mute", // "kick", "mute", or "none"
LINK_WARN_LIMIT: 3, // Warnings before action

ANTI_LINK: process.env.ANTI_LINK || "true",
// make true/false for anti-link in groups

MENTION_REPLY: process.env.MENTION_REPLY || "false",
// true for auto voice reply when mentioned

MENU_IMAGE_URL: process.env.MENU_IMAGE_URL || "https://i.ibb.co/2YRqb2Md/upload-1777244568390-9cc80c1a-jpg.jpg",
// custom menu & mention reply image

PREFIX: process.env.PREFIX || ".",
// bot command prefix

AUTO_BIO: process.env.AUTO_BIO || "false",
TIME_ZONE: process.env.TIME_ZONE || "Africa/Dar_es_Salaam",  // Change to your timezone
// auto-bio feature settings

BOT_NAME: process.env.BOT_NAME || "𝐓𝐘𝐑𝐄𝐗-𝐌𝐃",
// bot name for menu

STICKER_NAME: process.env.STICKER_NAME || "𝐓𝐘𝐑𝐄𝐗-𝐌𝐃",
// sticker pack name

CUSTOM_REACT: process.env.CUSTOM_REACT || "false",
// true/false for custom emoji react

CUSTOM_REACT_EMOJIS: process.env.CUSTOM_REACT_EMOJIS || "💝,💖,💗,❤️‍🩹,❤️,🧡,💛,💚,💙,💜,🤎,🖤,🤍",
// custom react emojis

DELETE_LINKS: process.env.DELETE_LINKS || "false",
// automatically delete links without removing member

OWNER_NUMBER: process.env.OWNER_NUMBER || "255628378557",
// bot owner number(s) - separate with comma (,) for multiple

OWNER_NAME: process.env.OWNER_NAME || "𝐓𝐘𝐑𝐄𝐗-𝐌𝐃",
// bot owner name

DESCRIPTION: process.env.DESCRIPTION || "*> © 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐓𝐲𝐫𝐞𝐱 𝐓𝐞𝐜𝐡*",
// bot description

ALIVE_IMG: process.env.ALIVE_IMG || "https://i.ibb.co/2YRqb2Md/upload-1777244568390-9cc80c1a-jpg.jpg",
// alive message image

LIVE_MSG: process.env.LIVE_MSG || "> 𝐓𝐘𝐑𝐄𝐗-𝐌𝐃",
// alive message

READ_MESSAGE: process.env.READ_MESSAGE || "false",
// true/false for auto read msgs

AUTO_REACT: process.env.AUTO_REACT || "false",
// true/false for auto react on all msgs

ANTI_BAD: process.env.ANTI_BAD || "false",
// false/true for anti bad words

MODE: process.env.MODE || "public",
// set bot mode: public-private-inbox-group

SRIHUB_API: process.env.SRIHUB_API || "dew_5H5Dbuh4v7NbkNRmI0Ns2u2ZK240aNnJ9lnYQXR9",
// srihub api key

AUTO_STICKER: process.env.AUTO_STICKER || "false",
// true for automatic stickers

AUTO_REPLY: process.env.AUTO_REPLY || "false",
// true/false for automatic text reply

ALWAYS_ONLINE: process.env.ALWAYS_ONLINE || "true",
// make true for always online

PUBLIC_MODE: process.env.PUBLIC_MODE || "true",
// make false for private mode

AUTO_TYPING: process.env.AUTO_TYPING || "true",
// true for auto show typing

READ_CMD: process.env.READ_CMD || "false",
// true if want to mark commands as read

DEV: process.env.DEV || "255628378557",
// developer whatsapp number

ANTI_VV: process.env.ANTI_VV || "true",
// true for anti once view

AUTO_RECORDING: process.env.AUTO_RECORDING || "false"
// make it true for auto recording
};
