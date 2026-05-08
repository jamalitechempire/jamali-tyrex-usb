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

// Auto Reply Feature
cmd({
  on: "body"
},    
async (conn, mek, m, { from, body, isOwner, sender }) => {
    try {
        const filePath = path.join(__dirname, '../assets/autoreply.json');
        
        if (!fs.existsSync(filePath)) {
            console.error("Auto Reply: autoreply.json file not found!");
            return;
        }
        
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        
        for (const text in data) {
            if (body.toLowerCase() === text.toLowerCase()) {
                
                if (config.AUTO_REPLY === 'true' || config.AUTO_REPLY === true) {
                    
                    await conn.sendMessage(from, { 
                        text: data[text],
                        contextInfo: getContextInfo({ sender: sender })
                    }, { quoted: fkontak });
                }
            }
        }
    } catch (error) {
        console.error("Auto Reply Error:", error);
    }
});

// Auto Reply Command to Toggle
cmd({
    pattern: "autoreply",
    alias: ["autores", "autorespond"],
    desc: "Toggle auto reply feature",
    category: "settings",
    react: "🤖",
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
        let reaction = "🤖";

        if (action === "on" || action === "enable") {
            config.AUTO_REPLY = true;
            statusText = "Auto Reply has been ENABLED";
            reaction = "✅";
        } 
        else if (action === "off" || action === "disable") {
            config.AUTO_REPLY = false;
            statusText = "Auto Reply has been DISABLED";
            reaction = "❌";
        } 
        else {
            const currentStatus = (config.AUTO_REPLY === 'true' || config.AUTO_REPLY === true) ? "Enabled ✅" : "Disabled ❌";
            
            return await conn.sendMessage(from, { 
                text: `Auto Reply Status\n\n` +
                      `Current Status: ${currentStatus}\n\n` +
                      `Usage:\n` +
                      `.autoreply on  - Enable auto reply\n` +
                      `.autoreply off - Disable auto reply\n\n` +
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
        console.error("Auto Reply Command Error:", error);
        await conn.sendMessage(from, { 
            text: `Error: ${error.message}\n\n> ® Powered by Tyrex Tech`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
});
