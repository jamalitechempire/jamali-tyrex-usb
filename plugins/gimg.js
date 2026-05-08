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
    pattern: "gimg",
    alias: ["gsearch", "googleimg", "gimages"],
    react: "🖼️",
    desc: "Search images using Google Images",
    category: "tools",
    filename: __filename
},
async(conn, mek, m, {from, prefix, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
    
    if (!q || !q.trim()) {
        return reply("Please provide a search query\n\nExample: .gimg dogs");
    }

    await conn.sendPresenceUpdate('composing', from);

    const response = await axios.get(`https://api.siputzx.my.id/api/images?query=${encodeURIComponent(q.trim())}`, {
        timeout: 30000
    });
    
    if (!response.data) {
        throw new Error('No response from API');
    }

    const images = Array.isArray(response.data) ? response.data : response.data.images || response.data.results || response.data.data || [];
    
    if (images.length === 0) {
        throw new Error('No images found');
    }

    await conn.sendPresenceUpdate('paused', from);

    const infoMsg = `🖼️ Found ${images.length} images for: "${q.trim()}"\n\nSending first 5 images...`;
    
    await conn.sendMessage(from, {
        text: infoMsg,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

    const imagesToSend = images.slice(0, 5);
    
    for (let i = 0; i < imagesToSend.length; i++) {
        const image = imagesToSend[i];
        
        if (!image) continue;

        const imageUrl = typeof image === 'string' ? image : (image.url || image.image || image.src);
        
        if (!imageUrl) continue;

        try {
            let dimensions = '';
            if (typeof image === 'object' && (image.width || image.height)) {
                dimensions = `\n📐 ${image.width || '?'} x ${image.height || '?'}`;
            }

            await conn.sendMessage(from, {
                image: { url: imageUrl },
                caption: `📷 Image ${i + 1}/${imagesToSend.length}${dimensions}\n\n🔗 ${imageUrl}`,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: mek });
            
            await new Promise(resolve => setTimeout(resolve, 500));
        } catch (imgError) {
            console.error(`Failed to send image ${i + 1}:`, imgError.message);
        }
    }

} catch (e) {
    await conn.sendPresenceUpdate('paused', from);
    
    let errorMsg = 'Error searching images';
    
    if (e.message === 'No images found') {
        errorMsg = 'No images found for your query';
    } else if (e.response?.status === 429) {
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
