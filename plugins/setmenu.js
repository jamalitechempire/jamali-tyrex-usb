const { cmd } = require('../command');
const fs = require('fs');
const path = require('path');

const SETTINGS_DIR = path.join(__dirname, '../data');
const MENU_SETTINGS_FILE = path.join(SETTINGS_DIR, 'menusettings.json');

if (!fs.existsSync(SETTINGS_DIR)) {
    fs.mkdirSync(SETTINGS_DIR, { recursive: true });
}

const DEFAULT_MENU = {
    style: 'v1',
    theme: 'default',
    layout: 'list',
    header: '╭┄┄┄🌸🌹 {botName} MENU 🌹🌸┄┄┄⊷',
    footer: '╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech',
    showCategoryHeader: true,
    showAlias: true,
    showDescription: true,
    showReact: true,
    emoji: {
        category: '📁',
        command: '⤷',
        alias: '🔹',
        desc: '📝',
        react: '⚡'
    },
    colors: {
        header: '#00ff00',
        category: '#ffff00',
        command: '#ffffff',
        alias: '#888888',
        desc: '#cccccc'
    }
};

function readMenuSettings() {
    try {
        if (fs.existsSync(MENU_SETTINGS_FILE)) {
            const data = fs.readFileSync(MENU_SETTINGS_FILE, 'utf8');
            return JSON.parse(data);
        }
        return DEFAULT_MENU;
    } catch (error) {
        console.log('Error reading menu settings:', error);
        return DEFAULT_MENU;
    }
}

function writeMenuSettings(data) {
    try {
        fs.writeFileSync(MENU_SETTINGS_FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.log('Error writing menu settings:', error);
        return false;
    }
}

function resetMenuSettings() {
    return writeMenuSettings(DEFAULT_MENU);
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
    pattern: "setmenu",
    alias: ["menusetting", "menusettings", "menuconfig"],
    react: "🎨",
    desc: "Configure menu appearance and style",
    category: "settings",
    filename: __filename
},
async(conn, mek, m, {from, l, sender, isOwner, args, reply}) => {
try{
    if (!isOwner) return reply("This command is only for bot owner\n\n> ® Powered by Tyrex Tech");

    let menuSettings = readMenuSettings();

    if (!args[0]) {
        let settingsText = `╭┄┄┄🌸🌹 *CURRENT MENU SETTINGS* 🌹🌸┄┄┄⊷\n┃\n┃ 🎨 *STYLE:* ${menuSettings.style}\n┃ 🎭 *THEME:* ${menuSettings.theme}\n┃ 📋 *LAYOUT:* ${menuSettings.layout}\n┃\n┃ ⚙️ *Options:*\n┃ • Show Header: ${menuSettings.showCategoryHeader}\n┃ • Show Aliases: ${menuSettings.showAlias}\n┃ • Show Desc: ${menuSettings.showDescription}\n┃ • Show React: ${menuSettings.showReact}\n┃\n┃ 🎯 *Available Commands:*\n┃\n┃ *STYLES:*\n┃ • .setmenu style v1 (simple)\n┃ • .setmenu style v2 (boxed)\n┃ • .setmenu style v3 (modern)\n┃ • .setmenu style v4 (minimal)\n┃ • .setmenu style v5 (fancy)\n┃\n┃ *THEMES:*\n┃ • .setmenu theme default\n┃ • .setmenu theme dark\n┃ • .setmenu theme light\n┃ • .setmenu theme neon\n┃ • .setmenu theme ocean\n┃ • .setmenu theme forest\n┃ • .setmenu theme sunset\n┃ • .setmenu theme galaxy\n┃\n┃ *LAYOUTS:*\n┃ • .setmenu layout list\n┃ • .setmenu layout grid\n┃ • .setmenu layout compact\n┃ • .setmenu layout detailed\n┃\n┃ *TOGGLES:*\n┃ • .setmenu header on/off\n┃ • .setmenu alias on/off\n┃ • .setmenu desc on/off\n┃ • .setmenu react on/off\n┃\n┃ *OTHER:*\n┃ • .setmenu reset (default)\n┃ • .setmenu preview (test)\n┃\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`;

        await conn.sendMessage(from, {
            text: settingsText,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
        return;
    }

    switch (args[0].toLowerCase()) {

        case 'style':
            if (!args[1]) return reply("Please specify style: v1, v2, v3, v4, v5\n\n> ® Powered by Tyrex Tech");

            const validStyles = ['v1', 'v2', 'v3', 'v4', 'v5'];
            if (!validStyles.includes(args[1].toLowerCase())) {
                return reply("Invalid style. Use: v1, v2, v3, v4, v5\n\n> ® Powered by Tyrex Tech");
            }

            menuSettings.style = args[1].toLowerCase();
            writeMenuSettings(menuSettings);
            reply(`✅ Menu style set to: *${args[1]}*\n\n> ® Powered by Tyrex Tech`);
            break;

        case 'theme':
            if (!args[1]) return reply("Please specify theme: default, dark, light, neon, ocean, forest, sunset, galaxy\n\n> ® Powered by Tyrex Tech");

            const validThemes = ['default', 'dark', 'light', 'neon', 'ocean', 'forest', 'sunset', 'galaxy'];
            if (!validThemes.includes(args[1].toLowerCase())) {
                return reply("Invalid theme\n\n> ® Powered by Tyrex Tech");
            }

            menuSettings.theme = args[1].toLowerCase();
            writeMenuSettings(menuSettings);
            reply(`✅ Menu theme set to: *${args[1]}*\n\n> ® Powered by Tyrex Tech`);
            break;

        case 'layout':
            if (!args[1]) return reply("Please specify layout: list, grid, compact, detailed\n\n> ® Powered by Tyrex Tech");

            const validLayouts = ['list', 'grid', 'compact', 'detailed'];
            if (!validLayouts.includes(args[1].toLowerCase())) {
                return reply("Invalid layout\n\n> ® Powered by Tyrex Tech");
            }

            menuSettings.layout = args[1].toLowerCase();
            writeMenuSettings(menuSettings);
            reply(`✅ Menu layout set to: *${args[1]}*\n\n> ® Powered by Tyrex Tech`);
            break;

        case 'header':
            if (!args[1]) return reply("Use: .setmenu header on/off\n\n> ® Powered by Tyrex Tech");

            if (args[1].toLowerCase() === 'on') {
                menuSettings.showCategoryHeader = true;
                reply("✅ Category headers: *ON*\n\n> ® Powered by Tyrex Tech");
            } else if (args[1].toLowerCase() === 'off') {
                menuSettings.showCategoryHeader = false;
                reply("✅ Category headers: *OFF*\n\n> ® Powered by Tyrex Tech");
            } else {
                return reply("Use on/off\n\n> ® Powered by Tyrex Tech");
            }
            writeMenuSettings(menuSettings);
            break;

        case 'alias':
            if (!args[1]) return reply("Use: .setmenu alias on/off\n\n> ® Powered by Tyrex Tech");

            if (args[1].toLowerCase() === 'on') {
                menuSettings.showAlias = true;
                reply("✅ Show aliases: *ON*\n\n> ® Powered by Tyrex Tech");
            } else if (args[1].toLowerCase() === 'off') {
                menuSettings.showAlias = false;
                reply("✅ Show aliases: *OFF*\n\n> ® Powered by Tyrex Tech");
            } else {
                return reply("Use on/off\n\n> ® Powered by Tyrex Tech");
            }
            writeMenuSettings(menuSettings);
            break;

        case 'desc':
            if (!args[1]) return reply("Use: .setmenu desc on/off\n\n> ® Powered by Tyrex Tech");

            if (args[1].toLowerCase() === 'on') {
                menuSettings.showDescription = true;
                reply("✅ Show descriptions: *ON*\n\n> ® Powered by Tyrex Tech");
            } else if (args[1].toLowerCase() === 'off') {
                menuSettings.showDescription = false;
                reply("✅ Show descriptions: *OFF*\n\n> ® Powered by Tyrex Tech");
            } else {
                return reply("Use on/off\n\n> ® Powered by Tyrex Tech");
            }
            writeMenuSettings(menuSettings);
            break;

        case 'react':
            if (!args[1]) return reply("Use: .setmenu react on/off\n\n> ® Powered by Tyrex Tech");

            if (args[1].toLowerCase() === 'on') {
                menuSettings.showReact = true;
                reply("✅ Show reactions: *ON*\n\n> ® Powered by Tyrex Tech");
            } else if (args[1].toLowerCase() === 'off') {
                menuSettings.showReact = false;
                reply("✅ Show reactions: *OFF*\n\n> ® Powered by Tyrex Tech");
            } else {
                return reply("Use on/off\n\n> ® Powered by Tyrex Tech");
            }
            writeMenuSettings(menuSettings);
            break;

        case 'reset':
            resetMenuSettings();
            reply("✅ Menu settings reset to default\n\n> ® Powered by Tyrex Tech");
            break;

        case 'preview':
            await showMenuPreview(conn, from, sender, menuSettings);
            break;

        case 'setheader':
            if (!args[1]) {
                return reply("Please provide header text\nUse {botName} for bot name\n\n> ® Powered by Tyrex Tech");
            }

            const headerText = args.slice(1).join(' ');
            menuSettings.header = headerText;
            writeMenuSettings(menuSettings);
            reply(`✅ Custom header set:\n${headerText}\n\n> ® Powered by Tyrex Tech`);
            break;

        case 'setfooter':
            if (!args[1]) {
                return reply("Please provide footer text\nUse {botName} for bot name\n\n> ® Powered by Tyrex Tech");
            }

            const footerText = args.slice(1).join(' ');
            menuSettings.footer = footerText;
            writeMenuSettings(menuSettings);
            reply(`✅ Custom footer set:\n${footerText}\n\n> ® Powered by Tyrex Tech`);
            break;

        case 'setemoji':
            if (!args[1] || !args[2]) {
                return reply("Use: .setmenu setemoji [type] [emoji]\n\nTypes: category, command, alias, desc, react\n\n> ® Powered by Tyrex Tech");
            }

            const emojiType = args[1].toLowerCase();
            const emoji = args[2];

            if (menuSettings.emoji.hasOwnProperty(emojiType)) {
                menuSettings.emoji[emojiType] = emoji;
                writeMenuSettings(menuSettings);
                reply(`✅ ${emojiType} emoji set to: ${emoji}\n\n> ® Powered by Tyrex Tech`);
            } else {
                reply("Invalid emoji type\n\n> ® Powered by Tyrex Tech");
            }
            break;

        default:
            reply("Unknown command. Use .setmenu for help\n\n> ® Powered by Tyrex Tech");
    }

} catch (e) {
    console.log('SETMENU ERROR:', e);
    reply(`Error: ${e.message}\n\n> ® Powered by Tyrex Tech`);
    l(e);
}
});

async function showMenuPreview(conn, from, sender, settings) {
    try {
        const botName = '𝐓𝐘𝐑𝐄𝐗 𝐌𝐃';
        let preview = '';

        let header = settings.header.replace('{botName}', botName);
        preview += header + '\n┃\n';

        const sampleCategories = ['MAIN', 'GROUP', 'DOWNLOAD'];

        sampleCategories.forEach((category, catIndex) => {
            if (settings.showCategoryHeader) {
                preview += `┃ ${settings.emoji.category} *${category}*\n`;
            }

            const sampleCommands = catIndex === 0 ? ['menu', 'ping'] : 
                                  catIndex === 1 ? ['mute', 'link'] : 
                                  ['play', 'video'];

            sampleCommands.forEach(cmd => {
                let line = '┃ ';

                if (settings.layout === 'grid') {
                    line += `[ ${cmd} ]  `;
                } else if (settings.layout === 'compact') {
                    line += `${settings.emoji.command} .${cmd}`;
                    if (settings.showAlias) line += ` (al)`;
                } else if (settings.layout === 'detailed') {
                    line += `${settings.emoji.command} .${cmd}\n`;
                    if (settings.showAlias) line += `┃   ${settings.emoji.alias} aliases: menu, mn\n`;
                    if (settings.showDescription) line += `┃   ${settings.emoji.desc} Show bot menu\n`;
                } else {
                    line += `${settings.emoji.command} .${cmd}`;
                    if (settings.showAlias) line += ` ${settings.emoji.alias}(mn)`;
                    if (settings.showDescription) line += ` ${settings.emoji.desc} description`;
                }

                if (settings.layout !== 'detailed') {
                    preview += line + '\n';
                } else {
                    preview += line;
                }

                if (settings.showReact) {
                    preview += ` ${settings.emoji.react}⚡`;
                }
            });

            preview += '┃\n';
        });

        let footer = settings.footer.replace('{botName}', botName);
        preview += footer;

        preview += `\n\n*Theme: ${settings.theme} | Style: ${settings.style}*`;

        await conn.sendMessage(from, {
            text: preview,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });

    } catch (e) {
        console.log('Preview error:', e);
    }
}

async function getMenuStyle() {
    return readMenuSettings();
}

module.exports = {
    getMenuStyle,
    readMenuSettings
};