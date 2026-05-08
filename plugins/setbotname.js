const { cmd } = require('../command');
const fs = require('fs');
const path = require('path');

const SETTINGS_DIR = path.join(__dirname, '../Database');
const BOT_NAME_FILE = path.join(SETTINGS_DIR, 'botname.json');

if (!fs.existsSync(SETTINGS_DIR)) {
    fs.mkdirSync(SETTINGS_DIR, { recursive: true });
}

const DEFAULT_BOT_NAME = '𝐓𝐘𝐑𝐄𝐗 𝐌𝐃';

function readBotName() {
    try {
        if (fs.existsSync(BOT_NAME_FILE)) {
            const data = fs.readFileSync(BOT_NAME_FILE, 'utf8');
            return JSON.parse(data);
        }
        return { name: DEFAULT_BOT_NAME };
    } catch (error) {
        console.log('Error reading bot name:', error);
        return { name: DEFAULT_BOT_NAME };
    }
}

function writeBotName(data) {
    try {
        fs.writeFileSync(BOT_NAME_FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.log('Error writing bot name:', error);
        return false;
    }
}

function resetBotName() {
    return writeBotName({ name: DEFAULT_BOT_NAME });
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
    pattern: "setbotname",
    alias: ["botname", "setname", "changename", "renamebot"],
    react: "📛",
    desc: "Change bot name/username",
    category: "settings",
    filename: __filename
},
async(conn, mek, m, {from, l, sender, isOwner, args, reply}) => {
try{
    if (!isOwner) return reply("This command is only for bot owner\n\n> ® Powered by Tyrex Tech");

    let botNameData = readBotName();
    let currentName = botNameData.name;

    if (!args[0]) {
        await conn.sendMessage(from, {
            text: `╭┄┄┄🌸🌹 *BOT NAME SETTINGS* 🌹🌸┄┄┄⊷\n┃\n┃ 📛 *Current Bot Name:*\n┃ ${currentName}\n┃\n┃ *Commands:*\n┃\n┃ *Set New Name:*\n┃ • .setbotname New Name Here\n┃ • .setbotname 𝐓𝐘𝐑𝐄𝐗 𝐌𝐃\n┃\n┃ *Styling Options:*\n┃ • Bold: *text*\n┃ • Italic: _text_\n┃ • Monospace: \`\`\`text\`\`\`\n┃ • Strikethrough: ~text~\n┃\n┃ *Special Characters:*\n┃ • 𝐓𝐘𝐑𝐄𝐗 𝐌𝐃 (Bold)\n┃ • 𝘛𝘠𝘙𝘌𝘟 𝘔𝘋 (Italic)\n┃ • 𝕋𝕐ℝ𝔼𝕏 𝕄𝔻 (Double struck)\n┃ • T̶Y̶R̶E̶X̶ ̶M̶D̶ (Strikethrough)\n┃\n┃ *Other:*\n┃ • .setbotname reset - Reset to default\n┃ • .setbotname preview - See different styles\n┃ • .setbotname add [text] - Add to current name\n┃\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
        return;
    }

    switch (args[0].toLowerCase()) {

        case 'reset':
            resetBotName();
            reply(`✅ Bot name reset to default: *${DEFAULT_BOT_NAME}*\n\n> ® Powered by Tyrex Tech`);
            break;

        case 'preview':
            let previewText = `╭┄┄┄🌸🌹 *BOT NAME STYLES* 🌹🌸┄┄┄⊷\n┃\n┃ *Normal:* Tyrex MD\n┃\n┃ *Bold:* 𝐓𝐲𝐫𝐞𝐱 𝐌𝐃\n┃\n┃ *Italic:* 𝘛𝘺𝘳𝘦𝘹 𝘔𝘋\n┃\n┃ *Bold Italic:* 𝑻𝒚𝒓𝒆𝒙 𝑴𝑫\n┃\n┃ *Monospace:* \`Tyrex MD\`\n┃\n┃ *Double Struck:* 𝕋𝕪𝕣𝕖𝕩 𝕄𝔻\n┃\n┃ *Script:* 𝒯𝓎𝓇𝑒𝓍 ℳ𝒟\n┃\n┃ *Fraktur:* 𝔗𝔶𝔯𝔢𝔵 𝔐𝔇\n┃\n┃ *Strikethrough:* T̶y̶r̶e̶x̶ ̶M̶D̶\n┃\n┃ *Underline:* T̲y̲r̲e̲x̲ ̲M̲D̲\n┃\n┃ *Circled:* Ⓣⓨⓡⓔⓧ ⓂⒹ\n┃\n┃ *Squared:* 🆃🆈🆁🅴🆇 🅼🅳\n┃\n┃ *Use:* .setbotname [styled name]\n┃\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`;

            await conn.sendMessage(from, {
                text: previewText,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: mek });
            break;

        case 'add':
            if (!args[1]) {
                return reply("Please provide text to add\n\nExample: .setbotname add V2\n\n> ® Powered by Tyrex Tech");
            }

            const addText = args.slice(1).join(' ');
            const newName = `${currentName} ${addText}`;
            botNameData.name = newName;
            writeBotName(botNameData);

            await conn.sendMessage(from, {
                text: `╭┄┄┄🌸🌹 *BOT NAME UPDATED* 🌹🌸┄┄┄⊷\n┃ ✅ Name changed\n┃ ┣ Old: ${currentName}\n┃ ┗ New: ${newName}\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: mek });
            break;

        case 'remove':
        case 'pop':
            const words = currentName.split(' ');
            if (words.length > 1) {
                words.pop();
                const newName = words.join(' ');
                botNameData.name = newName;
                writeBotName(botNameData);

                await conn.sendMessage(from, {
                    text: `╭┄┄┄🌸🌹 *BOT NAME UPDATED* 🌹🌸┄┄┄⊷\n┃ ✅ Last word removed\n┃ ┣ Old: ${currentName}\n┃ ┗ New: ${newName}\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`,
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: mek });
            } else {
                reply("Cannot remove last word\n\n> ® Powered by Tyrex Tech");
            }
            break;

        case 'upper':
        case 'uppercase':
            const upperName = currentName.toUpperCase();
            botNameData.name = upperName;
            writeBotName(botNameData);

            await conn.sendMessage(from, {
                text: `╭┄┄┄🌸🌹 *BOT NAME UPDATED* 🌹🌸┄┄┄⊷\n┃ ✅ Converted to UPPERCASE\n┃ ┣ Old: ${currentName}\n┃ ┗ New: ${upperName}\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: mek });
            break;

        case 'lower':
        case 'lowercase':
            const lowerName = currentName.toLowerCase();
            botNameData.name = lowerName;
            writeBotName(botNameData);

            await conn.sendMessage(from, {
                text: `╭┄┄┄🌸🌹 *BOT NAME UPDATED* 🌹🌸┄┄┄⊷\n┃ ✅ Converted to lowercase\n┃ ┣ Old: ${currentName}\n┃ ┗ New: ${lowerName}\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: mek });
            break;

        case 'capitalize':
        case 'cap':
            const capName = currentName.split(' ').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            ).join(' ');
            botNameData.name = capName;
            writeBotName(botNameData);

            await conn.sendMessage(from, {
                text: `╭┄┄┄🌸🌹 *BOT NAME UPDATED* 🌹🌸┄┄┄⊷\n┃ ✅ Capitalized each word\n┃ ┣ Old: ${currentName}\n┃ ┗ New: ${capName}\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: mek });
            break;

        case 'history':
            const historyFile = path.join(SETTINGS_DIR, 'botname_history.json');
            let history = [];
            if (fs.existsSync(historyFile)) {
                history = JSON.parse(fs.readFileSync(historyFile, 'utf8'));
            }

            let historyText = `╭┄┄┄🌸🌹 *BOT NAME HISTORY* 🌹🌸┄┄┄⊷\n┃\n`;
            if (history.length > 0) {
                history.slice(-10).reverse().forEach((name, i) => {
                    historyText += `┃ ${i+1}. ${name}\n`;
                });
            } else {
                historyText += `┃ No history available\n`;
            }
            historyText += `┃\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`;

            await conn.sendMessage(from, {
                text: historyText,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: mek });
            break;

        default:
            const newBotName = args.join(' ');

            if (newBotName.length < 2) {
                return reply("Bot name too short (minimum 2 characters)\n\n> ® Powered by Tyrex Tech");
            }

            if (newBotName.length > 50) {
                return reply("Bot name too long (maximum 50 characters)\n\n> ® Powered by Tyrex Tech");
            }

            botNameData.name = newBotName;
            writeBotName(botNameData);

            const histFile = path.join(SETTINGS_DIR, 'botname_history.json');
            let hist = [];
            if (fs.existsSync(histFile)) {
                hist = JSON.parse(fs.readFileSync(histFile, 'utf8'));
            }
            hist.push(currentName);
            if (hist.length > 20) hist.shift();
            fs.writeFileSync(histFile, JSON.stringify(hist, null, 2));

            await conn.sendMessage(from, {
                text: `╭┄┄┄🌸🌹 *BOT NAME UPDATED* 🌹🌸┄┄┄⊷\n┃ ✅ Bot name changed successfully\n┃\n┃ *Old Name:*\n┃ ${currentName}\n┃\n┃ *New Name:*\n┃ ${newBotName}\n┃\n┃ *Styled Examples:*\n┃ 𝐁𝐨𝐥𝐝: ${newBotName.replace(/[A-Za-z]/g, c => String.fromCharCode(55349, 56832 + c.charCodeAt(0)))}\n┃ 𝘐𝘵𝘢𝘭𝘪𝘤: ${newBotName.replace(/[A-Za-z]/g, c => String.fromCharCode(55349, 56864 + c.charCodeAt(0)))}\n┃ 𝕊𝕔𝕣𝕚𝕡𝕥: ${newBotName.replace(/[A-Za-z]/g, c => String.fromCharCode(55349, 56944 + c.charCodeAt(0)))}\n┃\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: mek });
    }

} catch (e) {
    console.log('SETBOTNAME ERROR:', e);
    reply(`Error: ${e.message}\n\n> ® Powered by Tyrex Tech`);
    l(e);
}
});

async function getBotName() {
    try {
        const data = readBotName();
        return data.name;
    } catch (e) {
        return DEFAULT_BOT_NAME;
    }
}

async function replaceBotName(text) {
    try {
        const botName = await getBotName();
        return text.replace(/{botName}/g, botName);
    } catch (e) {
        return text;
    }
}

function styleBold(text) {
    return text.replace(/[A-Za-z]/g, c => 
        String.fromCharCode(55349, 56832 + c.charCodeAt(0))
    );
}

function styleItalic(text) {
    return text.replace(/[A-Za-z]/g, c => 
        String.fromCharCode(55349, 56864 + c.charCodeAt(0))
    );
}

function styleBoldItalic(text) {
    return text.replace(/[A-Za-z]/g, c => 
        String.fromCharCode(55349, 56896 + c.charCodeAt(0))
    );
}

function styleScript(text) {
    return text.replace(/[A-Za-z]/g, c => 
        String.fromCharCode(55349, 56944 + c.charCodeAt(0))
    );
}

function styleDoubleStruck(text) {
    return text.replace(/[A-Za-z]/g, c => {
        const base = c === c.toUpperCase() ? 120120 : 120122;
        return String.fromCodePoint(base + c.toUpperCase().charCodeAt(0) - 65);
    });
}

function styleCircled(text) {
    const circled = {
        'A': 'Ⓐ', 'B': 'Ⓑ', 'C': 'Ⓒ', 'D': 'Ⓓ', 'E': 'Ⓔ',
        'F': 'Ⓕ', 'G': 'Ⓖ', 'H': 'Ⓗ', 'I': 'Ⓘ', 'J': 'Ⓙ',
        'K': 'Ⓚ', 'L': 'Ⓛ', 'M': 'Ⓜ', 'N': 'Ⓝ', 'O': 'Ⓞ',
        'P': 'Ⓟ', 'Q': 'Ⓠ', 'R': 'Ⓡ', 'S': 'Ⓢ', 'T': 'Ⓣ',
        'U': 'Ⓤ', 'V': 'Ⓥ', 'W': 'Ⓦ', 'X': 'Ⓧ', 'Y': 'Ⓨ', 'Z': 'Ⓩ'
    };
    return text.split('').map(c => circled[c.toUpperCase()] || c).join('');
}

module.exports = {
    getBotName,
    replaceBotName,
    styleBold,
    styleItalic,
    styleBoldItalic,
    styleScript,
    styleDoubleStruck,
    styleCircled
};