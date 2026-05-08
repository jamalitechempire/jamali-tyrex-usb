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
    pattern: "githubstalk2",
    alias: ["github2", "ghstalk", "gitstalk"],
    desc: "Stalk a GitHub user profile",
    category: "search",
    react: "🔍",
    filename: __filename
}, async (conn, mek, m, { from, text, q, sender, reply }) => {
    try {
        if (!q) {
            return await conn.sendMessage(from, {
                text: `╭┄┄┄🌸🌹 *GITHUB STALK* 🌹🌸┄┄┄⊷\n┃\n┃ ❗ Username required\n┃\n┃ 📌 Example:\n┃ .githubstalk2 popkidmd\n┃\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: mek });
        }

        await conn.sendMessage(from, {
            text: `⏳ *Fetching GitHub profile...*`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });

        const apiUrl = `https://apis.davidcyriltech.my.id/githubStalk?user=${encodeURIComponent(q)}`;
        const response = await axios.get(apiUrl);
        const data = response.data;

        if (data.status === 200 && data.success) {
            const user = data.result;

            let stalkMsg = `╭┄┄┄🌸🌹 *GITHUB PROFILE* 🌹🌸┄┄┄⊷\n┃\n┃ 🧑 *Name:* ${user.name || 'Not set'}\n┃ 🆔 *User:* ${user.login}\n┃ 📝 *Bio:* ${user.bio || 'No bio'}\n┃\n┃ 📊 *Stats*\n┃ 📁 Repos: ${user.public_repos}\n┃ 👥 Followers: ${user.followers}\n┃ 🔄 Following: ${user.following}\n┃\n┃ 📍 *Location:* ${user.location || 'Unknown'}\n┃ 🏢 *Company:* ${user.company || 'None'}\n┃\n┃ 🔗 ${user.html_url}\n┃\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`;

            await conn.sendMessage(from, {
                image: { url: user.avatar_url },
                caption: stalkMsg,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: mek });

        } else {
            return reply("User does not exist\n\nCheck username & retry\n\n> ® Powered by Tyrex Tech");
        }

    } catch (e) {
        console.error("GitHub Stalk Error:", e);
        reply("Failed to fetch profile\n\nTry again later\n\n> ® Powered by Tyrex Tech");
    }
});
