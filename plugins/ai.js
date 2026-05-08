const { cmd } = require('../command');
const axios = require('axios');

// TYREX MD fakevCard 
const fakevCard = {
  key: {
    fromMe: false,
    participant: "0@s.whatsapp.net",
    remoteJid: "status@broadcast"
  },
  message: {
    contactMessage: {
      displayName: "© 𝐓𝐘𝐑𝐄𝐗 𝐌𝐃",
      vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:𝐓𝐘𝐑𝐄𝐗 𝐌𝐃 𝐁𝐎𝐓\nORG:𝐓𝐘𝐑𝐄𝐗-𝐓𝐄𝐂𝐇;\nTEL;type=CELL;type=VOICE;waid=255700000000:+255700000000\nEND:VCARD`
    }
  }
};

const getContextInfo = (m) => {
    return {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363424973782944@newsletter',
            newsletterName: `𝐓𝐘𝐑𝐄𝐗 𝐌𝐃`,
            serverMessageId: 143,
        },
    };
};

cmd({
    pattern: "ai",
    alias: ["gpt", "ask", "think", "tyrexai", "brainy", "chat"],
    react: "🤖",
    desc: "Ask AI anything",
    category: "ai",
    filename: __filename
},
async(conn, mek, m, {from, prefix, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
    
    if (!q || !q.trim()) {
        return await conn.sendMessage(from, {
            text: `╭┄┄┄🌸🌹 *𝐓𝐘𝐑𝐄𝐗 𝐌𝐃* 🌹🌸┄┄┄⊷\n┃\n┃ 🤖 *AI CHAT*\n┃▔▔▔▔▔▔▔▔▔▔▔▔▔▔\n┃\n┃ ❌ *Please ask a question*\n┃\n┃ 📝 *Example:* \n┃ *.ai What is python?*\n┃ *.gpt Who is Elon Musk?*\n┃\n┃▁▁▁▁▁▁▁▁▁▁▁▁▁▁\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐓𝐲𝐫𝐞𝐱 𝐓𝐞𝐜𝐡`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fakevCard });
    }

    // Show typing indicator
    await conn.sendPresenceUpdate('composing', from);

    // Call AI API
    const response = await axios.get(`https://api.yupra.my.id/api/ai/gpt5?text=${encodeURIComponent(q.trim())}`);
    
    if (!response.data) {
        throw new Error('No response from API');
    }

    let aiResponse = response.data.response || response.data.result || response.data.data || JSON.stringify(response.data);

    // Truncate if too long
    if (aiResponse.length > 4096) {
        aiResponse = aiResponse.substring(0, 4090) + '...';
    }

    await conn.sendPresenceUpdate('paused', from);

    await conn.sendMessage(from, {
        text: `╭┄┄┄🌸🌹 *𝐓𝐘𝐑𝐄𝐗 𝐌𝐃* 🌹🌸┄┄┄⊷\n┃\n┃ 🤖 *AI RESPONSE*\n┃▔▔▔▔▔▔▔▔▔▔▔▔▔▔\n┃\n┃ ${aiResponse}\n┃\n┃▁▁▁▁▁▁▁▁▁▁▁▁▁▁\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐓𝐲𝐫𝐞𝐱 𝐓𝐞𝐜𝐡`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fakevCard });

} catch (e) {
    await conn.sendPresenceUpdate('paused', from);
    
    let errorMsg = `╭┄┄┄🌸🌹 *𝐓𝐘𝐑𝐄𝐗 𝐌𝐃* 🌹🌸┄┄┄⊷\n┃\n┃ ❌ *AI ERROR*\n┃▔▔▔▔▔▔▔▔▔▔▔▔▔▔\n┃\n┃ 🔧 *AI malfunctioning*\n┃\n┃▁▁▁▁▁▁▁▁▁▁▁▁▁▁\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐓𝐲𝐫𝐞𝐱 𝐓𝐞𝐜𝐡`;
    
    if (e.response?.status === 429) {
        errorMsg = `╭┄┄┄🌸🌹 *𝐓𝐘𝐑𝐄𝐗 𝐌𝐃* 🌹🌸┄┄┄⊷\n┃\n┃ ❌ *RATE LIMITED*\n┃▔▔▔▔▔▔▔▔▔▔▔▔▔▔\n┃\n┃ ⏳ *Too many requests*\n┃ *Please try again later*\n┃\n┃▁▁▁▁▁▁▁▁▁▁▁▁▁▁\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐓𝐲𝐫𝐞𝐱 𝐓𝐞𝐜𝐡`;
    } else if (e.response?.status === 500) {
        errorMsg = `╭┄┄┄🌸🌹 *𝐓𝐘𝐑𝐄𝐗 𝐌𝐃* 🌹🌸┄┄┄⊷\n┃\n┃ ❌ *SERVER ERROR*\n┃▔▔▔▔▔▔▔▔▔▔▔▔▔▔\n┃\n┃ 🔌 *AI server error*\n┃ *Please try again later*\n┃\n┃▁▁▁▁▁▁▁▁▁▁▁▁▁▁\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐓𝐲𝐫𝐞𝐱 𝐓𝐞𝐜𝐡`;
    } else if (e.code === 'ECONNABORTED') {
        errorMsg = `╭┄┄┄🌸🌹 *𝐓𝐘𝐑𝐄𝐗 𝐌𝐃* 🌹🌸┄┄┄⊷\n┃\n┃ ❌ *TIMEOUT*\n┃▔▔▔▔▔▔▔▔▔▔▔▔▔▔\n┃\n┃ ⏰ *Request timeout*\n┃ *Please try again*\n┃\n┃▁▁▁▁▁▁▁▁▁▁▁▁▁▁\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐓𝐲𝐫𝐞𝐱 𝐓𝐞𝐜𝐡`;
    }

    await conn.sendMessage(from, {
        text: errorMsg,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fakevCard });
    l(e);
}
});
