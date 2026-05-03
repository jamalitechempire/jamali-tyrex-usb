const { cmd } = require("../command");
const config = require("../config");
const fs = require('fs');
const path = require('path');

// ==================== DATABASE ====================
const dbPath = path.join(__dirname, '../data/antigroupmention_settings.json');
const dbFolder = path.join(__dirname, '../data');
if (!fs.existsSync(dbFolder)) fs.mkdirSync(dbFolder, { recursive: true });
if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, '{}');

function readDB() {
    try {
        return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    } catch {
        return {};
    }
}

function writeDB(data) {
    try {
        fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error('❌ Error writing anti-groupmention DB:', err);
    }
}

// ==================== HELPER ====================
const getContextInfo = (sender) => {
    return {
        mentionedJid: [sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363424973782944@newsletter',
            newsletterName: '✨ 𝐓𝐘𝐑𝐄𝐗 𝐌𝐃 ✨',
            serverMessageId: 143,
        },
    };
};

// ==================== EVENT HANDLER (detects @everyone / @all) ====================
cmd({ on: "body" }, async (client, message, chat, { from, sender, isGroup, isAdmins, isOwner, body }) => {
    try {
        if (!isGroup || isAdmins || isOwner) return;
        if (message.key && message.key.fromMe) return;

        const db = readDB();
        let enabled = false;
        let mode = 'delete';

        if (db[from] && typeof db[from].enabled !== 'undefined') {
            enabled = db[from].enabled;
            mode = db[from].mode || 'delete';
        } else {
            // optional global default (you can set from config if needed)
            enabled = false;
            mode = 'delete';
        }

        if (!enabled) return;

        // Detect @everyone or @all (case insensitive)
        const mentionRegex = /(@everyone|@all)/i;
        if (!mentionRegex.test(body)) return;

        // 1. Delete the offending message
        try {
            await client.sendMessage(from, { delete: message.key });
        } catch (e) {
            console.error('Failed to delete groupmention message:', e);
        }

        // 2. Take action
        if (mode === 'warn') {
            await client.sendMessage(from, {
                text: `⚠️ *Group mention detected!*\n@${sender.split('@')[0]}, please do not tag everyone/all.\n\n> © 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐓𝐲𝐫𝐞𝐱 𝐓𝐞𝐜𝐡`,
                mentions: [sender],
                contextInfo: getContextInfo(sender)
            }, { quoted: message });
        } 
        else if (mode === 'kick') {
            await client.sendMessage(from, {
                text: `🚫 *Group mention detected!*\n@${sender.split('@')[0]} has been kicked.\n\n> © 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐓𝐲𝐫𝐞𝐱 𝐓𝐞𝐜𝐡`,
                mentions: [sender],
                contextInfo: getContextInfo(sender)
            }, { quoted: message });
            try {
                await client.groupParticipantsUpdate(from, [sender], "remove");
            } catch (err) {
                console.error('Kick failed:', err);
            }
        }
        // if mode === 'delete' -> no extra message, just deleted
    } catch (err) {
        console.error('Anti-GroupMention handler error:', err);
    }
});

// ==================== COMMAND TO CONFIGURE ====================
cmd({
    pattern: "antigrpmention",
    alias: ["antigpmention", "agm", "antieveryone"],
    desc: "Configure anti-group-mention settings",
    category: "group",
    react: "🔇",
    filename: __filename,
},
async (client, message, m, { isGroup, isAdmins, isOwner, from, sender, args, reply }) => {
    try {
        if (!isGroup) {
            return await client.sendMessage(from, {
                text: "❌ This command can only be used in groups!\n\n> © 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐓𝐲𝐫𝐞𝐱 𝐓𝐞𝐜𝐡",
                contextInfo: getContextInfo(sender)
            }, { quoted: message });
        }

        if (!isAdmins && !isOwner) {
            return await client.sendMessage(from, {
                text: "🚫 Only group admins can use this command!",
                mentions: [sender],
                contextInfo: getContextInfo(sender)
            }, { quoted: message });
        }

        const action = args[0]?.toLowerCase();
        const db = readDB();
        if (!db[from]) db[from] = { enabled: false, mode: 'delete' };

        let statusText, reaction = "🔇", extra = "";

        if (!action || action === 'status') {
            const settings = db[from];
            statusText = `📌 *Anti Group Mention Settings*\n\n⚙️ Status: ${settings.enabled ? "✅ ENABLED" : "❌ DISABLED"}\n🔧 Mode: *${settings.mode}*\n\n📝 *Commands:*\n.antigroupmention on\n.antigroupmention off\n.antigroupmention set delete  (just delete)\n.antigroupmention set warn    (delete + warn)\n.antigrpmention set kick    (delete + kick)`;
            extra = `Detects: @everyone , @all`;
            reaction = "📊";
        } 
        else if (action === 'on') {
            db[from].enabled = true;
            statusText = "✅ Anti group mention has been *ENABLED* for this group!";
            reaction = "✅";
            extra = "Anyone tagging @everyone/@all will be stopped.";
        }
        else if (action === 'off') {
            db[from].enabled = false;
            statusText = "❌ Anti group mention has been *DISABLED* for this group!";
            reaction = "❌";
            extra = "Now @everyone/@all mentions are allowed.";
        }
        else if (action === 'set') {
            const mode = args[1]?.toLowerCase();
            if (!['delete', 'warn', 'kick'].includes(mode)) {
                return await client.sendMessage(from, {
                    text: "❌ Invalid mode! Use: delete, warn, or kick",
                    contextInfo: getContextInfo(sender)
                }, { quoted: message });
            }
            db[from].enabled = true;
            db[from].mode = mode;
            statusText = `🔄 Anti group mention mode set to *${mode.toUpperCase()}*`;
            reaction = "⚙️";
            extra = mode === 'delete' ? "Messages will be deleted silently." : (mode === 'warn' ? "Users will be warned then message deleted." : "Users will be kicked immediately.");
        }
        else {
            statusText = "❌ Unknown option. Use: on, off, set <delete/warn/kick>, status";
            reaction = "❌";
        }

        writeDB(db);

        // Send response with image
        await client.sendMessage(from, {
            image: { url: "https://i.ibb.co/2YRqb2Md/upload-1777244568390-9cc80c1a-jpg.jpg" },
            caption: `${statusText}\n${extra}\n\n> © 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐓𝐲𝐫𝐞𝐱 𝐓𝐞𝐜𝐡`,
            contextInfo: getContextInfo(sender)
        }, { quoted: message });

        // React to command
        try {
            await client.sendMessage(from, { react: { text: reaction, key: message.key } });
        } catch (e) {}

    } catch (err) {
        console.error("AntiGroupMention command error:", err);
        await client.sendMessage(from, {
            text: `⚠️ Error: ${err.message}`,
            contextInfo: getContextInfo(sender)
        }, { quoted: message });
    }
});
