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
    pattern: "githubstalk",
    desc: "Fetch detailed GitHub user profile including profile picture.",
    category: "menu",
    react: "🖥️",
    filename: __filename
},
async (conn, mek, m, { from, args, reply, sender }) => {
    try {
        const username = args[0];
        if (!username) {
            return reply("Please provide a GitHub username.\n\n> ® Powered by Tyrex Tech");
        }
        
        const apiUrl = `https://api.github.com/users/${username}`;
        const response = await axios.get(apiUrl);
        const data = response.data;

        let userInfo = `╭┄┄┄🌸🌹 *GITHUB STALK* 🌹🌸┄┄┄⊷\n┃\n┃ 👤 *Username*: ${data.name || data.login}\n┃ 🔗 *URL*: ${data.html_url}\n┃ 📝 *Bio*: ${data.bio || 'Not available'}\n┃ 🏙️ *Location*: ${data.location || 'Unknown'}\n┃ 📊 *Public Repos*: ${data.public_repos}\n┃ 👥 *Followers*: ${data.followers} | Following: ${data.following}\n┃ 📅 *Created*: ${new Date(data.created_at).toDateString()}\n┃ 🔭 *Public Gists*: ${data.public_gists}\n┃\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`;

        await conn.sendMessage(from, {
            image: { url: data.avatar_url },
            caption: userInfo,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
        
    } catch (e) {
        console.log(e);
        reply(`Error: ${e.response ? e.response.data.message : e.message}\n\n> ® Powered by Tyrex Tech`);
    }
});
