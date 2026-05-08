const { cmd } = require('../command');
const { getBotName } = require('./setbotname');

cmd({
    pattern: "ping2",
    alias: ["pong", "speed"],
    react: "🏓",
    desc: "Check bot response time",
    category: "main"
},
async(conn, mek, m, {from, sender, reply}) => {
try{
    const botName = await getBotName();
    const start = Date.now();

    await conn.sendMessage(from, {
        text: `🏓 Pinging...`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

    const end = Date.now();
    const responseTime = end - start;

    await conn.sendMessage(from, {
        text: `╭┄┄┄🌸🌹 *${botName} PONG* 🌹🌸┄┄┄⊷\n┃ ⚡ Response: ${responseTime}ms\n┃ 🤖 Bot: ${botName}\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

} catch (e) {
    console.log(e);
    reply("❌ Error during ping");
}
});

function getContextInfo({ sender }) {
    return {
        mentionedJid: [sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363424973782944@newsletter',
            newsletterName: '𝐓𝐘𝐑𝐄𝐗 𝐌𝐃',
            serverMessageId: 143,
        }
    };
}