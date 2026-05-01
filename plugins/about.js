const { cmd } = require('../command');
const { getBotName } = require('./setbotname'); // Ikiwa ipo kwenye path yako

// Helper function (kama haipo, nakili hii)
const getContextInfo = (sender) => {
    return {
        mentionedJid: [sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363424973782944@newsletter', // Badilisha na yako
            newsletterName: `✨ 𝐓𝐘𝐑𝐄𝐗 𝐌𝐃 ✨`,
            serverMessageId: 143,
        },
    };
};

cmd({
    pattern: "about",
    alias: ["info", "botinfo"],
    react: "ℹ️",
    desc: "Taarifa za Bot",
    category: "main",
    filename: __filename
},
async (conn, mek, m, { from, sender, reply }) => {
    try {
        const botName = await getBotName(); // Au andika mwenyewe kama "TYREX MD"
        
        const info = `┏━❑ 𝐀𝐁𝐎𝐔𝐓 ${botName} ━━━━━━━━━
┃
┃ 🤖 *Jina:* ${botName}
┃ ⚡ *Toleo:* 2.0.0
┃ 📦 *Mfumo:* WhatsApp (Baileys)
┃ 👑 *Mmiliki:* 𝐓𝐘𝐑𝐄𝐗 𝐓𝐄𝐂𝐇
┃ 🌐 *Lugha:* Node.js
┃
┗━━━━━━━━━━━━━━━━━━━━`;

        await conn.sendMessage(from, {
            text: info,
            contextInfo: getContextInfo(sender)
        }, { quoted: mek }); // Tumia mek badala ya fkontak isiyojulikana

    } catch (e) {
        console.log("About Error:", e);
        reply("❌ Hitilafu wakati wa kupata taarifa za bot.");
    }
});
