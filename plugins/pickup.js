const axios = require('axios');
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

cmd({
    pattern: "pickup",
    alias: ["pickupline", "flirtline"],
    desc: "Get a random pickup line",
    react: "💘",
    category: "fun",
    use: '.pickup',
    filename: __filename
},
async (conn, mek, m, { from, reply, sender }) => {
    try {
        const { data } = await axios.get('https://apis.davidcyriltech.my.id/pickupline');

        if (!data.success) {
            return reply("Failed to get a pickup line. Try again!\n\n> ® Powered by Tyrex Tech");
        }

        const message = `💝 *Pickup Line* 💝\n\n"${data.pickupline}"\n\n_Use wisely!_\n\n> ® Powered by Tyrex Tech`;

        await conn.sendMessage(from, { 
            text: message,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });

    } catch (error) {
        console.error('Pickup Error:', error);
        reply("My charm isn't working right now. Try again later!\n\n> ® Powered by Tyrex Tech");
    }
});