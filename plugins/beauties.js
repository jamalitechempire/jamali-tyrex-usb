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

const flags = {
    china: '🇨🇳',
    indonesia: '🇮🇩',
    japan: '🇯🇵',
    korea: '🇰🇷',
    thailand: '🇹🇭'
};

cmd({
    pattern: "beauty",
    alias: ["china", "indonesia", "japan", "korea", "thailand", "chinese", "indo", "japanese", "korean", "thai"],
    react: "😍",
    desc: "Get random beauty image by country",
    category: "wakubwa",
    filename: __filename
},
async(conn, mek, m, {from, prefix, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
    
    let country = q?.trim() || command;
    country = country.toLowerCase();

    const countryMap = {
        'chinese': 'china',
        'indo': 'indonesia',
        'jp': 'japan',
        'japanese': 'japan',
        'korean': 'korea',
        'kr': 'korea',
        'thai': 'thailand'
    };

    if (countryMap[country]) {
        country = countryMap[country];
    }

    const validCountries = ['china', 'indonesia', 'japan', 'korea', 'thailand'];
    if (!validCountries.includes(country)) {
        return reply(`Invalid country\n\nAvailable countries:\n${validCountries.join(', ')}\n\nExample: .beauty korea`);
    }

    await conn.sendPresenceUpdate('composing', from);

    const response = await axios.get(`https://api.siputzx.my.id/api/r/cecan/${country}`, {
        timeout: 30000,
        responseType: 'arraybuffer'
    });
    
    if (!response.data) {
        throw new Error('No response from API');
    }

    await conn.sendPresenceUpdate('paused', from);

    const countryCapitalized = country.charAt(0).toUpperCase() + country.slice(1);

    await conn.sendMessage(from, {
        image: Buffer.from(response.data),
        caption: `😍 Random ${countryCapitalized} Beauty ${flags[country]}\n\n> ® Powered by Tyrex Tech`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

} catch (e) {
    await conn.sendPresenceUpdate('paused', from);
    
    let errorMsg = 'An error occurred';
    
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
