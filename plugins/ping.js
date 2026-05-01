const { cmd } = require('../command');

// fakevCard ya bot yako
const fakevCard = {
  key: {
    fromMe: false,
    participant: "0@s.whatsapp.net",
    remoteJid: "status@broadcast"
  },
  message: {
    contactMessage: {
      displayName: "© 𝐓𝐘𝐑𝐄𝐗 𝐌𝐃",
      vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:𝐓𝐘𝐑𝐄𝐗 𝐌𝐃 𝐁𝐎𝐓\nORG:𝐓𝐘𝐑𝐄𝐗-𝐓𝐄𝐂𝐇;\nTEL;type=CELL;type=VOICE;waid=255700000000:+255700000000\nEND:VCARD`
    }
  }
};

cmd({
    pattern: "ping",
    alias: ["p"],
    desc: "Angalia kasi ya bot",
    category: "main",
    react: "⚡",
    filename: __filename
},
async (conn, mek, m, { from, sender, reply }) => {
    try {
        const start = Date.now();
        
        // Tuma ujumbe wa kwanza
        const initialMsg = await conn.sendMessage(from, 
            { text: "𝐓𝐘𝐑𝐄𝐗 𝐌𝐃..." },
            { quoted: fakevCard }
        );
        
        const end = Date.now();
        const latency = end - start;
        
        // Majibu ya ping kwa style yako
        const text = 
`┏━❑ 𝐏𝐎𝐍𝐆 ━━━━━━━━━━━━━━
┃ ⚡ ${latency} ms
┃ 🚀 𝐓𝐘𝐑𝐄𝐗 𝐌𝐃 𝐁𝐎𝐓
┗━━━━━━━━━━━━━━━━━━━━━`;
        
        // Hariri ujumbe uliotumwa
        await conn.sendMessage(from, {
            text: text,
            edit: initialMsg.key,
            contextInfo: {
                externalAdReply: {
                    title: '𝐓𝐘𝐑𝐄𝐗 𝐌𝐃',
                    body: '𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚃𝚢𝚛𝚎𝚡 𝚃𝚎𝚌𝚑',
                    thumbnailUrl: 'https://i.ibb.co/2YRqb2Md/upload-1777244568390-9cc80c1a-jpg.jpg', // Badilisha na picha yako
                    sourceUrl: 'https://github.com/tyrex-team/tyrex-md', // Badilisha na link yako
                    mediaType: 1
                }
            }
        });
        
    } catch (e) {
        console.log("Ping Error:", e);
        reply("❌ Hitilafu wakati wa ping");
    }
});
