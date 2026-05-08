const { cmd } = require('../command');
const { fetchGif, gifToSticker } = require('../lib/sticker-utils');

// FakevCard ya TYREX MD
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
        }
    };
};

cmd({
    pattern: "attp",
    desc: "Convert text to a GIF sticker.",
    react: "✨",
    category: "convert",
    use: ".attp HI",
    filename: __filename,
}, async (conn, mek, m, { args, reply, from, sender }) => {
    try {
        if (!args[0]) {
            return await conn.sendMessage(from, { 
                text: `╭┄┄┄🌸🌹 *𝐓𝐘𝐑𝐄𝐗 𝐌𝐃* 🌹🌸┄┄┄⊷\n┃\n┃ ✨ *ATTP TEXT TO STICKER*\n┃▔▔▔▔▔▔▔▔▔▔▔▔▔▔\n┃\n┃ *Please provide text!*\n┃\n┃ 📝 *Example:*\n┃ *.attp Hello*\n┃ *.attp TYREX*\n┃\n┃▁▁▁▁▁▁▁▁▁▁▁▁▁▁\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐓𝐲𝐫𝐞𝐱 𝐓𝐞𝐜𝐡`, 
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: fkontak });
        }

        const gifBuffer = await fetchGif(`https://api-fix.onrender.com/api/maker/attp?text=${encodeURIComponent(args[0])}`);
        const stickerBuffer = await gifToSticker(gifBuffer);

        await conn.sendMessage(m.chat, { 
            sticker: stickerBuffer,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
        
    } catch (error) {
        await conn.sendMessage(from, { 
            text: `╭┄┄┄🌸🌹 *𝐓𝐘𝐑𝐄𝐗 𝐌𝐃* 🌹🌸┄┄┄⊷\n┃\n┃ ❌ *Error:* ${error.message}\n┃▔▔▔▔▔▔▔▔▔▔▔▔▔▔\n┃\n┃▁▁▁▁▁▁▁▁▁▁▁▁▁▁\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐓𝐲𝐫𝐞𝐱 𝐓𝐞𝐜𝐡`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
});
