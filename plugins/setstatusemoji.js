const { cmd } = require('../command');
const fs = require('fs');
const path = require('path');

const SETTINGS_DIR = path.join(__dirname, '../data');
const EMOJI_SETTINGS_FILE = path.join(SETTINGS_DIR, 'statusemoji.json');

if (!fs.existsSync(SETTINGS_DIR)) {
    fs.mkdirSync(SETTINGS_DIR, { recursive: true });
}

const DEFAULT_EMOJI = {
    online: '🟢',
    offline: '⚫',
    typing: '✍️',
    recording: '🎤',
    read: '👁️',
    delivered: '✅',
    sent: '📤',
    pending: '⏳',
    failed: '❌',
    botOnline: '🤖',
    botOffline: '💤',
    botProcessing: '⚙️',
    botSuccess: '✅',
    botError: '❌',
    botWarning: '⚠️',
    messageSent: '📨',
    messageReceived: '📩',
    messageRead: '👀',
    messageDeleted: '🗑️',
    groupOpen: '🔓',
    groupClose: '🔒',
    groupMute: '🔇',
    groupUnmute: '🔊',
    groupPromote: '👑',
    groupDemote: '⬇️',
    groupAdd: '➕',
    groupRemove: '➖',
    groupJoin: '🚪',
    groupLeave: '👋',
    commandSuccess: '✅',
    commandError: '❌',
    commandProcessing: '⏳',
    commandInvalid: '⚠️',
    commandNotFound: '❓',
    image: '📸',
    video: '🎥',
    audio: '🎵',
    document: '📄',
    sticker: '🖼️',
    contact: '📇',
    location: '📍',
    poll: '📊',
    userAdmin: '👑',
    userMember: '👤',
    userOwner: '👑',
    userBot: '🤖',
    userVerified: '✅',
    userBlocked: '🚫',
    morning: '🌅',
    afternoon: '☀️',
    evening: '🌆',
    night: '🌙',
    midnight: '🌃',
    sunny: '☀️',
    cloudy: '☁️',
    rainy: '☔',
    stormy: '⛈️',
    snowy: '❄️',
    happy: '😊',
    sad: '😢',
    angry: '😠',
    love: '❤️',
    cool: '😎',
    sleepy: '😴',
    custom1: '✨',
    custom2: '🌟',
    custom3: '💫',
    custom4: '⭐',
    custom5: '⚡'
};

function readEmojiSettings() {
    try {
        if (fs.existsSync(EMOJI_SETTINGS_FILE)) {
            const data = fs.readFileSync(EMOJI_SETTINGS_FILE, 'utf8');
            return JSON.parse(data);
        }
        return DEFAULT_EMOJI;
    } catch (error) {
        console.log('Error reading emoji settings:', error);
        return DEFAULT_EMOJI;
    }
}

function writeEmojiSettings(data) {
    try {
        fs.writeFileSync(EMOJI_SETTINGS_FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.log('Error writing emoji settings:', error);
        return false;
    }
}

function resetEmojiSettings() {
    return writeEmojiSettings(DEFAULT_EMOJI);
}

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
    pattern: "setstatusemoji",
    alias: ["setemoji", "statusemoji", "emojisettings", "emoji"],
    react: "😊",
    desc: "Configure status emojis for bot",
    category: "settings",
    filename: __filename
},
async(conn, mek, m, {from, l, sender, isOwner, args, reply}) => {
try{
    if (!isOwner) return reply("This command is only for bot owner\n\n> ® Powered by Tyrex Tech");

    let emojiSettings = readEmojiSettings();

    if (!args[0]) {
        let settingsText = `╭┄┄┄🌸🌹 *STATUS EMOJI SETTINGS* 🌹🌸┄┄┄⊷\n┃\n┃ *🟢 ONLINE STATUS:*\n┃ Online: ${emojiSettings.online} | Offline: ${emojiSettings.offline}\n┃ Typing: ${emojiSettings.typing} | Recording: ${emojiSettings.recording}\n┃\n┃ *📨 MESSAGE STATUS:*\n┃ Sent: ${emojiSettings.sent} | Delivered: ${emojiSettings.delivered}\n┃ Read: ${emojiSettings.read} | Failed: ${emojiSettings.failed}\n┃\n┃ *🤖 BOT STATUS:*\n┃ Online: ${emojiSettings.botOnline} | Offline: ${emojiSettings.botOffline}\n┃ Processing: ${emojiSettings.botProcessing}\n┃ Success: ${emojiSettings.botSuccess} | Error: ${emojiSettings.botError}\n┃\n┃ *👥 GROUP STATUS:*\n┃ Open: ${emojiSettings.groupOpen} | Close: ${emojiSettings.groupClose}\n┃ Mute: ${emojiSettings.groupMute} | Unmute: ${emojiSettings.groupUnmute}\n┃ Promote: ${emojiSettings.groupPromote} | Demote: ${emojiSettings.groupDemote}\n┃\n┃ *📁 MEDIA STATUS:*\n┃ Image: ${emojiSettings.image} | Video: ${emojiSettings.video}\n┃ Audio: ${emojiSettings.audio} | Document: ${emojiSettings.document}\n┃ Sticker: ${emojiSettings.sticker} | Location: ${emojiSettings.location}\n┃\n┃ *👤 USER STATUS:*\n┃ Admin: ${emojiSettings.userAdmin} | Member: ${emojiSettings.userMember}\n┃ Owner: ${emojiSettings.userOwner} | Bot: ${emojiSettings.userBot}\n┃\n┃ *✨ CUSTOM EMOJIS:*\n┃ Custom1: ${emojiSettings.custom1} | Custom2: ${emojiSettings.custom2}\n┃ Custom3: ${emojiSettings.custom3} | Custom4: ${emojiSettings.custom4}\n┃\n┃ *📝 AVAILABLE COMMANDS:*\n┃\n┃ *View Categories:*\n┃ • .setstatusemoji list online\n┃ • .setstatusemoji list message\n┃ • .setstatusemoji list bot\n┃ • .setstatusemoji list group\n┃ • .setstatusemoji list media\n┃ • .setstatusemoji list user\n┃ • .setstatusemoji list custom\n┃\n┃ *Set Emoji:*\n┃ • .setstatusemoji set [type] [emoji]\n┃   Example: .setstatusemoji set online 🔵\n┃\n┃ *Reset:*\n┃ • .setstatusemoji reset\n┃ • .setstatusemoji reset [category]\n┃\n┃ *Search:*\n┃ • .setstatusemoji search [keyword]\n┃\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`;

        await conn.sendMessage(from, {
            text: settingsText,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
        return;
    }

    switch (args[0].toLowerCase()) {

        case 'list':
            if (!args[1]) {
                return reply("Please specify category: online, message, bot, group, media, user, custom\n\n> ® Powered by Tyrex Tech");
            }

            let listText = `╭┄┄┄🌸🌹 *${args[1].toUpperCase()} EMOJIS* 🌹🌸┄┄┄⊷\n┃\n`;

            switch (args[1].toLowerCase()) {
                case 'online':
                    listText += `┃ Online: ${emojiSettings.online}\n`;
                    listText += `┃ Offline: ${emojiSettings.offline}\n`;
                    listText += `┃ Typing: ${emojiSettings.typing}\n`;
                    listText += `┃ Recording: ${emojiSettings.recording}\n`;
                    break;

                case 'message':
                    listText += `┃ Sent: ${emojiSettings.sent}\n`;
                    listText += `┃ Delivered: ${emojiSettings.delivered}\n`;
                    listText += `┃ Read: ${emojiSettings.read}\n`;
                    listText += `┃ Pending: ${emojiSettings.pending}\n`;
                    listText += `┃ Failed: ${emojiSettings.failed}\n`;
                    break;

                case 'bot':
                    listText += `┃ Online: ${emojiSettings.botOnline}\n`;
                    listText += `┃ Offline: ${emojiSettings.botOffline}\n`;
                    listText += `┃ Processing: ${emojiSettings.botProcessing}\n`;
                    listText += `┃ Success: ${emojiSettings.botSuccess}\n`;
                    listText += `┃ Error: ${emojiSettings.botError}\n`;
                    listText += `┃ Warning: ${emojiSettings.botWarning}\n`;
                    break;

                case 'group':
                    listText += `┃ Open: ${emojiSettings.groupOpen}\n`;
                    listText += `┃ Close: ${emojiSettings.groupClose}\n`;
                    listText += `┃ Mute: ${emojiSettings.groupMute}\n`;
                    listText += `┃ Unmute: ${emojiSettings.groupUnmute}\n`;
                    listText += `┃ Promote: ${emojiSettings.groupPromote}\n`;
                    listText += `┃ Demote: ${emojiSettings.groupDemote}\n`;
                    listText += `┃ Add: ${emojiSettings.groupAdd}\n`;
                    listText += `┃ Remove: ${emojiSettings.groupRemove}\n`;
                    listText += `┃ Join: ${emojiSettings.groupJoin}\n`;
                    listText += `┃ Leave: ${emojiSettings.groupLeave}\n`;
                    break;

                case 'media':
                    listText += `┃ Image: ${emojiSettings.image}\n`;
                    listText += `┃ Video: ${emojiSettings.video}\n`;
                    listText += `┃ Audio: ${emojiSettings.audio}\n`;
                    listText += `┃ Document: ${emojiSettings.document}\n`;
                    listText += `┃ Sticker: ${emojiSettings.sticker}\n`;
                    listText += `┃ Contact: ${emojiSettings.contact}\n`;
                    listText += `┃ Location: ${emojiSettings.location}\n`;
                    listText += `┃ Poll: ${emojiSettings.poll}\n`;
                    break;

                case 'user':
                    listText += `┃ Admin: ${emojiSettings.userAdmin}\n`;
                    listText += `┃ Member: ${emojiSettings.userMember}\n`;
                    listText += `┃ Owner: ${emojiSettings.userOwner}\n`;
                    listText += `┃ Bot: ${emojiSettings.userBot}\n`;
                    listText += `┃ Verified: ${emojiSettings.userVerified}\n`;
                    listText += `┃ Blocked: ${emojiSettings.userBlocked}\n`;
                    break;

                case 'custom':
                    listText += `┃ Custom1: ${emojiSettings.custom1}\n`;
                    listText += `┃ Custom2: ${emojiSettings.custom2}\n`;
                    listText += `┃ Custom3: ${emojiSettings.custom3}\n`;
                    listText += `┃ Custom4: ${emojiSettings.custom4}\n`;
                    listText += `┃ Custom5: ${emojiSettings.custom5}\n`;
                    break;

                default:
                    return reply("Invalid category\n\n> ® Powered by Tyrex Tech");
            }

            listText += `┃\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`;

            await conn.sendMessage(from, {
                text: listText,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: mek });
            break;

        case 'set':
            if (!args[1] || !args[2]) {
                return reply("Use: .setstatusemoji set [type] [emoji]\n\nExample: .setstatusemoji set online 🟢\n\n> ® Powered by Tyrex Tech");
            }

            const type = args[1].toLowerCase();
            const emoji = args[2];

            if (emojiSettings.hasOwnProperty(type)) {
                const oldEmoji = emojiSettings[type];
                emojiSettings[type] = emoji;
                writeEmojiSettings(emojiSettings);

                await conn.sendMessage(from, {
                    text: `╭┄┄┄🌸🌹 *EMOJI UPDATED* 🌹🌸┄┄┄⊷\n┃ ✅ *${type}* emoji changed\n┃ ┣ Old: ${oldEmoji}\n┃ ┗ New: ${emoji}\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`,
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: mek });
            } else {
                let types = Object.keys(emojiSettings).join(', ');
                reply(`Invalid type: ${type}\n\nAvailable types:\n${types}\n\n> ® Powered by Tyrex Tech`);
            }
            break;

        case 'reset':
            if (!args[1]) {
                resetEmojiSettings();
                reply("✅ All emoji settings reset to default\n\n> ® Powered by Tyrex Tech");
            } else {
                const category = args[1].toLowerCase();
                const categoryEmojis = {
                    online: ['online', 'offline', 'typing', 'recording'],
                    message: ['sent', 'delivered', 'read', 'pending', 'failed'],
                    bot: ['botOnline', 'botOffline', 'botProcessing', 'botSuccess', 'botError', 'botWarning'],
                    group: ['groupOpen', 'groupClose', 'groupMute', 'groupUnmute', 'groupPromote', 'groupDemote', 'groupAdd', 'groupRemove', 'groupJoin', 'groupLeave'],
                    media: ['image', 'video', 'audio', 'document', 'sticker', 'contact', 'location', 'poll'],
                    user: ['userAdmin', 'userMember', 'userOwner', 'userBot', 'userVerified', 'userBlocked'],
                    custom: ['custom1', 'custom2', 'custom3', 'custom4', 'custom5']
                };

                if (categoryEmojis[category]) {
                    categoryEmojis[category].forEach(key => {
                        emojiSettings[key] = DEFAULT_EMOJI[key];
                    });
                    writeEmojiSettings(emojiSettings);
                    reply(`✅ ${category} emojis reset to default\n\n> ® Powered by Tyrex Tech`);
                } else {
                    reply("Invalid category. Use: online, message, bot, group, media, user, custom\n\n> ® Powered by Tyrex Tech");
                }
            }
            break;

        case 'search':
            if (!args[1]) {
                return reply("Use: .setstatusemoji search [keyword]\n\n> ® Powered by Tyrex Tech");
            }

            const keyword = args[1].toLowerCase();
            let results = [];

            for (let [key, value] of Object.entries(emojiSettings)) {
                if (key.toLowerCase().includes(keyword) || value.includes(keyword)) {
                    results.push({ key, value });
                }
            }

            if (results.length > 0) {
                let searchText = `╭┄┄┄🌸🌹 *SEARCH RESULTS FOR "${keyword}"* 🌹🌸┄┄┄⊷\n┃\n`;
                results.forEach((r, i) => {
                    searchText += `┃ ${i+1}. ${r.key}: ${r.value}\n`;
                });
                searchText += `┃\n┃ Total: ${results.length}\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`;

                await conn.sendMessage(from, {
                    text: searchText,
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: mek });
            } else {
                reply(`No results found for "${keyword}"\n\n> ® Powered by Tyrex Tech`);
            }
            break;

        case 'export':
            const exportData = JSON.stringify(emojiSettings, null, 2);
            await conn.sendMessage(from, {
                text: `╭┄┄┄🌸🌹 *EXPORT EMOJI SETTINGS* 🌹🌸┄┄┄⊷\n┃\n┃ \`\`\`${exportData}\`\`\`\n┃\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: mek });
            break;

        case 'import':
            try {
                const imported = JSON.parse(args.slice(1).join(' '));
                if (typeof imported === 'object') {
                    emojiSettings = { ...emojiSettings, ...imported };
                    writeEmojiSettings(emojiSettings);
                    reply("✅ Emoji settings imported successfully\n\n> ® Powered by Tyrex Tech");
                }
            } catch (e) {
                reply("Invalid JSON format\n\n> ® Powered by Tyrex Tech");
            }
            break;

        case 'preview':
            let previewText = `╭┄┄┄🌸🌹 *EMOJI PREVIEW* 🌹🌸┄┄┄⊷\n┃\n`;
            previewText += `┃ ${emojiSettings.botOnline} Bot Online\n`;
            previewText += `┃ ${emojiSettings.botProcessing} Processing\n`;
            previewText += `┃ ${emojiSettings.botSuccess} Success\n`;
            previewText += `┃ ${emojiSettings.botError} Error\n`;
            previewText += `┃ ${emojiSettings.messageSent} Message Sent\n`;
            previewText += `┃ ${emojiSettings.messageRead} Message Read\n`;
            previewText += `┃ ${emojiSettings.groupOpen} Group Open\n`;
            previewText += `┃ ${emojiSettings.groupClose} Group Close\n`;
            previewText += `┃ ${emojiSettings.image} Image\n`;
            previewText += `┃ ${emojiSettings.video} Video\n`;
            previewText += `┃ ${emojiSettings.userAdmin} Admin\n`;
            previewText += `┃ ${emojiSettings.userMember} Member\n`;
            previewText += `┃ ${emojiSettings.custom1} Custom 1\n`;
            previewText += `┃\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`;

            await conn.sendMessage(from, {
                text: previewText,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: mek });
            break;

        default:
            reply("Unknown command. Use .setstatusemoji for help\n\n> ® Powered by Tyrex Tech");
    }

} catch (e) {
    console.log('SETSTATUSEMOJI ERROR:', e);
    reply(`Error: ${e.message}\n\n> ® Powered by Tyrex Tech`);
    l(e);
}
});

async function getStatusEmoji(type) {
    try {
        const settings = readEmojiSettings();
        return settings[type] || '❓';
    } catch (e) {
        return '❓';
    }
}

async function getAllEmojis() {
    return readEmojiSettings();
}

module.exports = {
    getStatusEmoji,
    getAllEmojis,
    readEmojiSettings
};