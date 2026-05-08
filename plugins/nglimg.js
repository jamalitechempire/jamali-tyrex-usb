const { cmd } = require('../command');
const axios = require('axios');

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
    pattern: "nglimg",
    alias: ["nglimage", "ngl", "getngl"],
    desc: "Generate an NGL-style image using custom text",
    category: "media",
    react: "🎨",
    filename: __filename
}, async (conn, mek, m, { from, reply, text, sender }) => {
    try {
        if (!text) {
            return reply("Please provide some text to generate NGL image.\nExample: .nglimg Aslam o Alykum\n\n> ® Powered by Tyrex Tech");
        }

        const encodedText = encodeURIComponent(text.trim());
        const apiUrl = `https://jawad-tech.vercel.app/random/ngl?text=${encodedText}`;

        try {
            const headCheck = await axios.head(apiUrl);
            if (!headCheck.headers['content-type']?.startsWith('image/')) {
                return reply("Failed to generate image. API did not return an image.\n\n> ® Powered by Tyrex Tech");
            }
        } catch (e) {
            return reply("Could not reach the NGL API. Please try again later.\n\n> ® Powered by Tyrex Tech");
        }

        await conn.sendMessage(from, {
            image: { url: apiUrl },
            caption: `> ® Powered by Tyrex Tech`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });

    } catch (err) {
        console.error('NGL Image Error:', err);
        reply(`Something went wrong while generating image.\nError: ${err.message}\n\n> ® Powered by Tyrex Tech`);
    }
});