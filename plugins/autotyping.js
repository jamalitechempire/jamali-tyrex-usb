const fs = require('fs');
const path = require('path');
const config = require('../config');
const { cmd , commands } = require('../command');

const fkontak = {
    "key": {
        "participant": '0@s.whatsapp.net',
        "remoteJid": '0@s.whatsapp.net',
        "fromMe": false,
        "id": "Halo"
    },
    "message": {
        "conversation": "𝐓𝐘𝐑𝐄𝐗"
    }
};

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

// Auto Typing Feature (Composing)
cmd({
    on: "body"
},    
async (conn, mek, m, { from, body, isOwner, sender }) => {
    try {
        if (config.AUTO_TYPING === 'true' || config.AUTO_TYPING === true) {
            await conn.sendPresenceUpdate('composing', from);
        }
    } catch (error) {
        console.error("Auto Typing Error:", error);
    }
});

// Auto Typing Command to Toggle
cmd({
    pattern: "autotyping",
    alias: ["autotype", "typing"],
    desc: "Toggle auto typing feature",
    category: "settings",
    react: "✍️",
    filename: __filename
},
async (conn, mek, m, { from, sender, args, isOwner, reply }) => {
    try {
        if (!isOwner) {
            return await conn.sendMessage(from, { 
                text: "This command is only available to the bot owner.\n\n> ® Powered by Tyrex Tech", 
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: fkontak });
        }

        const action = args[0]?.toLowerCase();
        let statusText = "";
        let reaction = "✍️";

        if (action === "on" || action === "enable") {
            config.AUTO_TYPING = true;
            statusText = "Auto Typing has been ENABLED";
            reaction = "✅";
        } 
        else if (action === "off" || action === "disable") {
            config.AUTO_TYPING = false;
            statusText = "Auto Typing has been DISABLED";
            reaction = "❌";
        } 
        else {
            const currentStatus = (config.AUTO_TYPING === 'true' || config.AUTO_TYPING === true) ? "Enabled ✅" : "Disabled ❌";
            
            return await conn.sendMessage(from, { 
                text: `Auto Typing Status\n\n` +
                      `Current Status: ${currentStatus}\n\n` +
                      `Usage:\n` +
                      `.autotyping on  - Enable auto typing\n` +
                      `.autotyping off - Disable auto typing\n\n` +
                      `> ® Powered by Tyrex Tech`, 
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: fkontak });
        }

        await conn.sendMessage(from, { 
            text: `${statusText}\n\n> ® Powered by Tyrex Tech`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });

        await conn.sendMessage(from, {
            react: { text: reaction, key: mek.key }
        });

    } catch (error) {
        console.error("Auto Typing Command Error:", error);
        await conn.sendMessage(from, { 
            text: `Error: ${error.message}\n\n> ® Powered by Tyrex Tech`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
});
