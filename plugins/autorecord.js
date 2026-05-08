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

// Auto Recording Feature
cmd({
  on: "body"
},    
async (conn, mek, m, { from, body, isOwner, sender }) => {       
    try {
        if (config.AUTO_RECORDING === 'true' || config.AUTO_RECORDING === true) {
            await conn.sendPresenceUpdate('recording', from);
        }
    } catch (error) {
        console.error("Auto Recording Error:", error);
    }
});

// Auto Recording Command to Toggle
cmd({
    pattern: "autorecord",
    alias: ["autorec", "record"],
    desc: "Toggle auto recording feature",
    category: "settings",
    react: "🎙️",
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
        let reaction = "🎙️";

        if (action === "on" || action === "enable") {
            config.AUTO_RECORDING = true;
            statusText = "Auto Recording has been ENABLED";
            reaction = "✅";
        } 
        else if (action === "off" || action === "disable") {
            config.AUTO_RECORDING = false;
            statusText = "Auto Recording has been DISABLED";
            reaction = "❌";
        } 
        else {
            const currentStatus = (config.AUTO_RECORDING === 'true' || config.AUTO_RECORDING === true) ? "Enabled ✅" : "Disabled ❌";
            
            return await conn.sendMessage(from, { 
                text: `Auto Recording Status\n\n` +
                      `Current Status: ${currentStatus}\n\n` +
                      `Usage:\n` +
                      `.autorecord on  - Enable auto recording\n` +
                      `.autorecord off - Disable auto recording\n\n` +
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
        console.error("Auto Record Command Error:", error);
        await conn.sendMessage(from, { 
            text: `Error: ${error.message}\n\n> ® Powered by Tyrex Tech`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
});
