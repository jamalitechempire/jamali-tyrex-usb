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
    pattern: "subdomains",
    alias: ["subdomain", "subs", "domains"],
    react: "🔍",
    desc: "Find subdomains for a domain",
    category: "tools",
    filename: __filename
},
async(conn, mek, m, {from, prefix, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{

    if (!q || !q.trim()) {
        return reply("Please provide a domain\n\nExample: .subdomains gmail.com");
    }

    await conn.sendPresenceUpdate('composing', from);

    const response = await axios.get(`https://api.siputzx.my.id/api/tools/subdomains?domain=${encodeURIComponent(q.trim())}`);

    if (!response.data) {
        throw new Error('No response from API');
    }

    let result = response.data.subdomains || response.data.data || response.data;

    let formattedResult = '';

    if (Array.isArray(result)) {
        if (result.length === 0) {
            formattedResult = 'No subdomains found';
        } else {
            formattedResult = result.slice(0, 50).map((sub, i) => `${i + 1}. ${sub}`).join('\n');
            if (result.length > 50) {
                formattedResult += `\n... and ${result.length - 50} more`;
            }
        }
    } else if (typeof result === 'object') {
        formattedResult = JSON.stringify(result, null, 2);
    } else {
        formattedResult = String(result);
    }

    if (formattedResult.length > 4096) {
        formattedResult = formattedResult.substring(0, 4090) + '...';
    }

    await conn.sendPresenceUpdate('paused', from);

    await conn.sendMessage(from, {
        text: `╭┄┄┄🌸🌹 *SUBDOMAINS* 🌹🌸┄┄┄⊷\n┃ 🔍 Domain: ${q.trim()}\n┃\n┃ ${formattedResult}\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

} catch (e) {
    await conn.sendPresenceUpdate('paused', from);

    let errorMsg = 'Error fetching subdomains';

    if (e.response?.status === 429) {
        errorMsg = 'Rate limited try again later';
    } else if (e.response?.status === 500) {
        errorMsg = 'API server error';
    } else if (e.code === 'ECONNABORTED') {
        errorMsg = 'Request timeout';
    }

    reply(errorMsg);
    l(e);
}
});