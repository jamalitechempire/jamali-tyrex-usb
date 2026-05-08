const fs = require('fs');
const path = require('path');
const config = require('../config');
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
        }
    };
};

const configPath = path.join(__dirname, '../config.js');

cmd({
    pattern: "setprefix",
    alias: ["changeprefix", "newprefix"],
    desc: "Change bot command prefix (Owner only)",
    category: "owner",
    react: "🔧",
    filename: __filename
},
async (conn, mek, m, { from, args, q, isOwner, sender, reply }) => {
    try {
        if (!isOwner) {
            return reply("*This command is only available to the bot owner.*\n\n> ® Powered by Tyrex Tech");
        }

        if (!q) {
            const currentPrefix = config.PREFIX || '.';
            return reply(`🔧 *Set Prefix*\n\nCurrent Prefix: *${currentPrefix}*\n\n*Usage:* .setprefix <new_prefix>\nExample: .setprefix !\n\n> ® Powered by Tyrex Tech`);
        }

        const newPrefix = q.trim();
        if (newPrefix.length > 2) {
            return reply("Prefix should be a single character or max 2 characters.\n\n> ® Powered by Tyrex Tech");
        }

        try {
            let configContent = fs.readFileSync(configPath, 'utf8');

            configContent = configContent.replace(
                /PREFIX:\s*['"`].*?['"`]/,
                `PREFIX: '${newPrefix}'`
            );

            fs.writeFileSync(configPath, configContent, 'utf8');

            config.PREFIX = newPrefix;

            await conn.sendMessage(from, { 
                text: `✅ *Prefix Updated Successfully!*\n\nNew Prefix: *${newPrefix}*\n\nPlease restart the bot for changes to take effect.\n\n> ® Powered by Tyrex Tech`, 
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: mek });

        } catch (fileError) {
            console.error("File write error:", fileError);
            reply(`Failed to update config file: ${fileError.message}\n\n> ® Powered by Tyrex Tech`);
        }

    } catch (error) {
        console.error("Setprefix Error:", error);
        reply(`Error: ${error.message}\n\n> ® Powered by Tyrex Tech`);
    }
});

// Alternative command to view prefix only
cmd({
    pattern: "prefix",
    alias: ["getprefix"],
    desc: "View current bot prefix",
    category: "main",
    react: "🔤",
    filename: __filename
},
async (conn, mek, m, { from, sender, reply }) => {
    try {
        const currentPrefix = config.PREFIX || '.';

        await conn.sendMessage(from, { 
            text: `🔤 *BOT PREFIX*\n\nCurrent Prefix: *${currentPrefix}*\n\n> ® Powered by Tyrex Tech`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });

    } catch (error) {
        console.error("Prefix Error:", error);
        reply(`Error: ${error.message}\n\n> ® Powered by Tyrex Tech`);
    }
});