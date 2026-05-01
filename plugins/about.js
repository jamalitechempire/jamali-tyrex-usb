const { cmd } = require('../command');
const { getBotName } = require('./setbotname'); // Hakikisha path ni sahihi

// Ikiwa huna getBotName, unaweza kufafanua mwenyewe:
// const getBotName = () => "𝐓𝐘𝐑𝐄𝐗 𝐌𝐃";

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
        const botName = await getBotName(); // Sasa inachukua jina lako halisi
        
        const info = `┏━❑ 𝐀𝐁𝐎𝐔𝐓 ${botName} ━━━━━━━━━
┃
┃ 🤖 *Jina:* ${botName}
┃ ⚡ *Toleo:* 2.0.0
┃ 📦 *Mfumo:* WhatsApp (Baileys)
┃ 👑 *Mmiliki:* 𝐓𝐘𝐑𝐄𝐗 𝐓𝐄𝐂𝐇
┃ 🌐 *Lugha:* Node.js
┃
┗━━━━━━━━━━━━━━━━━━━━`;

        await conn.sendMessage(from, { text: info }, { quoted: mek });
    } catch (e) {
        console.log("About Error:", e);
        reply("❌ Imeshindwa kupata taarifa za bot.");
    }
});
