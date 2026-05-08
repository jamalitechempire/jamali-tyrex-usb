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
        },
    };
};

cmd({
    pattern: "github",
    alias: ["gh", "githubstalk", "ghuser"],
    react: "🐙",
    desc: "Get GitHub user profile information",
    category: "stalk",
    filename: __filename
},
async(conn, mek, m, {from, prefix, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
    
    if (!q || !q.trim()) {
        return reply("Please provide a GitHub username\n\nExample: .github torvalds");
    }

    await conn.sendPresenceUpdate('composing', from);

    const response = await axios.get(`https://api.siputzx.my.id/api/stalk/github?user=${encodeURIComponent(q.trim())}`, {
        timeout: 30000
    });
    
    if (!response.data) {
        throw new Error('No response from API');
    }

    const data = response.data;
    
    if (!data.username) {
        throw new Error('User not found');
    }

    await conn.sendPresenceUpdate('paused', from);

    let userInfo = `╭┄┄┄🌸🌹 *GITHUB PROFILE* 🌹🌸┄┄┄⊷\n`;
    userInfo += `┃ 🐙 Username: ${data.username || 'N/A'}\n`;
    userInfo += `┃ 👤 Name: ${data.name || 'N/A'}\n`;
    userInfo += `┃ 📝 Bio: ${(data.bio || 'N/A').substring(0, 80)}\n`;
    userInfo += `┃ 📍 Location: ${data.location || 'N/A'}\n`;
    userInfo += `┃ 🔗 Website: ${data.website || 'N/A'}\n`;
    userInfo += `┃ 📧 Email: ${data.email || 'Private'}\n`;
    userInfo += `┃ 👥 Followers: ${data.followers || '0'}\n`;
    userInfo += `┃ 👤 Following: ${data.following || '0'}\n`;
    userInfo += `┃ 📦 Repositories: ${data.repos || '0'}\n`;
    userInfo += `┃ ⭐ Public Gists: ${data.publicGists || '0'}\n`;
    userInfo += `┃ 🏢 Company: ${data.company || 'N/A'}\n`;
    userInfo += `┃ ✔️ Verified: ${data.verified ? '✅ Yes' : '❌ No'}\n`;
    userInfo += `┃ 🔒 Private: ${data.private ? '🔒 Yes' : '🔓 No'}\n`;
    userInfo += `┃ 📅 Created: ${data.createdAt || 'N/A'}\n`;
    userInfo += `┃ ✏️ Updated: ${data.updatedAt || 'N/A'}\n`;
    userInfo += `┃ 🔗 Profile Link: ${data.profileUrl || `https://github.com/${data.username}`}\n`;
    userInfo += `╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`;

    if (userInfo.length > 4096) {
        userInfo = userInfo.substring(0, 4090) + '...';
    }

    if (data.avatarUrl) {
        try {
            await conn.sendMessage(from, {
                image: { url: data.avatarUrl },
                caption: userInfo,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: mek });
        } catch (imgError) {
            await conn.sendMessage(from, {
                text: userInfo,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: mek });
        }
    } else {
        await conn.sendMessage(from, {
            text: userInfo,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }

} catch (e) {
    await conn.sendPresenceUpdate('paused', from);
    
    let errorMsg = 'Error fetching GitHub data';
    
    if (e.message === 'User not found') {
        errorMsg = 'User not found';
    } else if (e.response?.status === 429) {
        errorMsg = 'Rate limited try again later';
    } else if (e.response?.status === 404) {
        errorMsg = 'GitHub user not found';
    } else if (e.response?.status === 500) {
        errorMsg = 'API server error';
    } else if (e.code === 'ECONNABORTED') {
        errorMsg = 'Request timeout';
    }

    reply(errorMsg);
    l(e);
}
});
