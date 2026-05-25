const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}

module.exports = {
SESSION_ID: "",
// add your session id

AUTO_STATUS_SEEN: "true",
// make true/false for status auto seen

AUTO_STATUS_REPLY: "false",
// make true for auto reply on status

AUTO_STATUS_REACT: "true",
// anticall on/off

ANTI_CALL: "false",
// make true/false for anticall

CUSTOM_STATUS_EMOJIS: "❤️,✨,🔥,💯,✅,👑",
// status reaction emojis

AUTO_STATUS_MSG: "*JAMALI TECH EMPIRE VIEWED✅*",
// auto reply message on status

ANTI_DELETE: "false",
// true/false for anti delete

ANTI_DEL_PATH: "index",
// change to 'Same' for resend in same chat

WELCOME: "false",
// true if want welcome & goodbye msgs in groups

ADMIN_EVENTS: "false",
// true to notify on member promote/demote

LINK_WHITELIST: "youtube.com,github.com",
LINK_ACTION: "mute", // "kick", "mute", or "none"
LINK_WARN_LIMIT: 3, // Warnings before action

ANTI_LINK: "true",
// make true/false for anti-link in groups

MENTION_REPLY: "false",
// true for auto voice reply when mentioned

MENU_IMAGE_URL: "https://files.catbox.moe/xney4v.jpg",
// custom menu & mention reply image

PREFIX: ".",
// bot command prefix

AUTO_BIO: "false",
TIME_ZONE: "Africa/Dar_es_Salaam",  // Change to your timezone
// auto-bio feature settings

BOT_NAME: "JAMALI TECH EMPIRE",
// bot name for menu

STICKER_NAME: "JAMALI TECH EMPIRE",
// sticker pack name

CUSTOM_REACT: "false",
// true/false for custom emoji react

CUSTOM_REACT_EMOJIS: "💝,💖,💗,❤️‍🩹,❤️,🧡,💛,💚,💙,💜,🤎,🖤,🤍",
// custom react emojis

DELETE_LINKS: "false",
// automatically delete links without removing member

OWNER_NUMBER: "25578172655",
// bot owner number(s) - separate with comma (,) for multiple

OWNER_NAME: "JAMALI TECH EMPIRE",
// bot owner name

DESCRIPTION: "*> © Powered By Jamali Tech Empire*",
// bot description

ALIVE_IMG: "https://files.catbox.moe/xney4v.jpg",
// alive message image

LIVE_MSG: "> JAMALI TECH EMPIRE",
// alive message

READ_MESSAGE: "false",
// true/false for auto read msgs

AUTO_REACT: "false",
// true/false for auto react on all msgs

ANTI_BAD: "false",
// false/true for anti bad words

MODE: "public",
// set bot mode: public-private-inbox-group

SRIHUB_API: "dew_5H5Dbuh4v7NbkNRmI0Ns2u2ZK240aNnJ9lnYQXR9",
// srihub api key

AUTO_STICKER: "false",
// true for automatic stickers

AUTO_REPLY: "false",
// true/false for automatic text reply

ALWAYS_ONLINE: "true",
// make true for always online

PUBLIC_MODE: "true",
// make false for private mode

AUTO_TYPING: "true",
// true for auto show typing

READ_CMD: "false",
// true if want to mark commands as read

DEV: "25578172655",
// developer whatsapp number

ANTI_VV: "true",
// true for anti once view

AUTO_RECORDING: "false"
// make it true for auto recording
};
