 const axios = require('axios');
const { cmd } = require('../command');
const config = require('../config');

const getContextInfo = (m, ownerName = "𝐓𝐘𝐑𝐄𝐗 𝐌𝐃", formattedOwnerNumber = "255628378557") => {
    return {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363424973782944@newsletter',
            newsletterName: '𝐓𝐘𝐑𝐄𝐗 𝐌𝐃',
            serverMessageId: 143,
        },
        externalAdReply: {
            title: `👑 BOT OWNER: ${ownerName}`,
            body: `wa.me/${formattedOwnerNumber}`,
            mediaType: 1,
            previewType: 0,
            thumbnailUrl: 'https://i.ibb.co/2YRqb2Md/upload-1777244568390-9cc80c1a-jpg.jpg',
            sourceUrl: `https://wa.me/${formattedOwnerNumber}`,
            renderLargerThumbnail: false,
        }
    };
};

cmd({
    pattern: "define",
    desc: "Get the definition of a word",
    react: "🔍",
    category: "search",
    filename: __filename
},
async (conn, mek, m, { from, q, sender, reply }) => {
    try {
        const ownerName = "𝐓𝐘𝐑𝐄𝐗 𝐌𝐃";
        const formattedOwnerNumber = "255628378557";
        
        if (!q) {
            return reply("Usage: .define [word]\n\n> ® Powered by Tyrex Tech");
        }

        const word = q.trim();
        const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

        const response = await axios.get(url);
        const definitionData = response.data[0];

        const definition = definitionData.meanings[0].definitions[0].definition;
        const example = definitionData.meanings[0].definitions[0].example || 'No example available';
        const synonyms = definitionData.meanings[0].definitions[0].synonyms.join(', ') || 'No synonyms available';
        const phonetics = definitionData.phonetics[0]?.text || 'No phonetics available';
        const audio = definitionData.phonetics[0]?.audio || null;

        const wordInfo = `
📖 *Word*: *${definitionData.word}*  
🗣️ *Pronunciation*: _${phonetics}_  
📚 *Definition*: ${definition}  
✍️ *Example*: ${example}  
📝 *Synonyms*: ${synonyms}  

> ® Powered by Tyrex Tech`;

        if (audio) {
            await conn.sendMessage(from, { 
                audio: { url: audio }, 
                mimetype: 'audio/mpeg' 
            }, { quoted: mek });
        }

        return await conn.sendMessage(from, { 
            text: wordInfo,
            contextInfo: getContextInfo({ sender: sender }, ownerName, formattedOwnerNumber)
        }, { quoted: mek });
        
    } catch (e) {
        console.error("Error:", e);
        if (e.response && e.response.status === 404) {
            return reply("Word not found. Please check the spelling.\n\n> ® Powered by Tyrex Tech");
        }
        return reply("An error occurred while fetching the definition.\n\n> ® Powered by Tyrex Tech");
    }
});
