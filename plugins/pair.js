const { cmd, commands } = require('../command');
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
    pattern: "pair",
    alias: ["code", "bot"],
    react: "✅",
    desc: "Get pairing code for TYREX MD bot",
    category: "download",
    use: ".pair 255628***",
    filename: __filename
}, async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, senderNumber, reply, sender }) => {
    try {
        const phoneNumber = q ? q.trim().replace(/[^0-9]/g, '') : senderNumber.replace(/[^0-9]/g, '');

        if (!phoneNumber || phoneNumber.length < 10 || phoneNumber.length > 15) {
            return reply("Please provide a valid phone number without `+`\nExample: `.pair 255628***`\n\n> ® Powered by Tyrex Tech");
        }

        const response = await axios.get(`https://tyrex-md-pair-a82329420b47.herokuapp.com/code?number=${encodeURIComponent(phoneNumber)}`);

        if (!response.data || !response.data.code) {
            return reply("Failed to retrieve pairing code. Please try again later.\n\n> ® Powered by Tyrex Tech");
        }

        const pairingCode = response.data.code;
        const doneMessage = "> *PAIRING COMPLETED*";

        await conn.sendMessage(from, { 
            text: `${doneMessage}\n\n*Your pairing code is:* ${pairingCode}\n\n> ® Powered by Tyrex Tech`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });

        await new Promise(resolve => setTimeout(resolve, 2000));

        await conn.sendMessage(from, { 
            text: `\`\`\`${pairingCode}\`\`\`\n\n> ® Powered by Tyrex Tech`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });

    } catch (error) {
        console.error("Pair command error:", error);
        reply("An error occurred while getting pairing code. Please try again later.\n\n> ® Powered by Tyrex Tech");
    }
});

cmd({
    pattern: "pair2",
    alias: ["getpair", "reqpair", "clonebot"],
    react: "📉",
    desc: "Get pairing code for TYREX MD bot",
    category: "download",
    use: ".pair 255628582XXX",
    filename: __filename
}, async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, senderNumber, reply, sender }) => {
    try {
        if (isGroup) {
            return reply("This command only works in private chat. Please message me directly.\n\n> ® Powered by Tyrex Tech");
        }

        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

        const phoneNumber = q ? q.trim().replace(/[^0-9]/g, '') : senderNumber.replace(/[^0-9]/g, '');

        if (!phoneNumber || phoneNumber.length < 10 || phoneNumber.length > 15) {
            return reply("Invalid phone number format!\n\nPlease use: `.pair 2557000000000`\n(Without + sign)\n\n> ® Powered by Tyrex Tech");
        }

        const response = await axios.get(`https://tyrex-md-pair-a82329420b47.herokuapp.com/code?number=${encodeURIComponent(phoneNumber)}`);

        if (!response.data?.code) {
            return reply("Failed to get pairing code. Please try again later.\n\n> ® Powered by Tyrex Tech");
        }

        const pairingCode = response.data.code;

        const sentMessage = await conn.sendMessage(from, {
            image: { url: "https://i.ibb.co/2YRqb2Md/upload-1777244568390-9cc80c1a-jpg.jpg" },
            caption: `╭┄┄┄🌸🌹 *TYREX MD PAIRING* 🌹🌸┄┄┄⊷\n┃\n┃ 📱 Number: ${phoneNumber}\n┃\n┃ 🔢 *Pairing Code*:\n┃ \`\`\`${pairingCode}\`\`\`\n┃\n┃ 📌 Notification has been sent to your WhatsApp.\n┃\n┃ ✨ Copy the code above to pair your device\n┃\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });

        await conn.sendMessage(from, { 
            text: `\`\`\`${pairingCode}\`\`\``,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (error) {
        console.error("Pair command error:", error);
        reply("An error occurred. Please try again later.\n\n> ® Powered by Tyrex Tech");
    }

});