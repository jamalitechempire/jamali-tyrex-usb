 const { cmd } = require('../command');
const axios = require('axios');
const yts = require('yt-search');

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
    pattern: "song",
    alias: ["mp3", "play"],
    react: "🎵",
    desc: "Download song with cover art",
    category: "download",
    filename: __filename
},
async(conn, mek, m, {from, prefix, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
    if (!q) return reply(`╭┄┄┄🌸🌹 *HOW TO USE* 🌹🌸┄┄┄⊷\n┃ ✦ song shape of you\n┃ ✦ song https://youtube.com/...\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`);
    
    let videoData = null;
    let isDirectUrl = false;
    
    if (q.includes('youtube.com') || q.includes('youtu.be')) {
        isDirectUrl = true;
        const videoId = q.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)?.[1];
        
        if (!videoId) {
            return reply("Invalid YouTube link\n\n> ® Powered by Tyrex Tech");
        }
        
        const search = await yts({ videoId: videoId });
        if (search) videoData = search;
    } else {
        await conn.sendMessage(from, {
            text: `🔍 Searching YouTube for "${q}"...\n\n> ® Powered by Tyrex Tech`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
        
        const search = await yts(q);
        if (!search || !search.all || search.all.length === 0) {
            return reply(`No results found for "${q}"\n\n> ® Powered by Tyrex Tech`);
        }
        
        videoData = search.all[0];
    }
    
    if (!videoData) {
        return reply("Could not get video information\n\n> ® Powered by Tyrex Tech");
    }
    
    const videoUrl = videoData.url;
    const title = videoData.title || 'Unknown Title';
    const thumbnail = videoData.thumbnail || videoData.image;
    const duration = videoData.timestamp || videoData.duration || 'N/A';
    const views = videoData.views ? videoData.views.toLocaleString() : 'N/A';
    
    await conn.sendMessage(from, {
        image: { url: thumbnail },
        caption: `╭┄┄┄🌸🌹 *SONG INFO* 🌹🌸┄┄┄⊷\n┃ 🎵 *Title:* ${title}\n┃ ⏱️ *Duration:* ${duration}\n┃ 👁️ *Views:* ${views}\n┃ 🔗 *URL:* ${videoUrl}\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n⏳ Downloading MP3...\n\n> ® Powered by Tyrex Tech`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });
    
    try {
        const fallbackApi = `https://yt-dl.officialhectormanuel.workers.dev/?url=${encodeURIComponent(videoUrl)}`;
        
        const fallbackResponse = await axios.get(fallbackApi, { timeout: 30000 });
        const fallbackData = fallbackResponse.data;
        
        if (fallbackData?.status && fallbackData.audio) {
            await conn.sendMessage(from, {
                audio: { url: fallbackData.audio },
                mimetype: "audio/mpeg",
                fileName: `${title.substring(0, 50).replace(/[^\w\s]/gi, '')}.mp3`
            }, { quoted: mek });
            
            await conn.sendMessage(from, {
                document: { url: fallbackData.audio },
                mimetype: "audio/mpeg",
                fileName: `${title.substring(0, 50).replace(/[^\w\s]/gi, '')}.mp3`
            }, { quoted: mek });
            
        } else {
            const apiUrl = `https://meta-api.zone.id/downloader/youtube?url=${encodeURIComponent(videoUrl)}`;
            const response = await axios.get(apiUrl, { timeout: 30000 });
            const data = response.data;
            
            let audioUrl = data?.result?.audio || data?.result?.url;
            
            if (audioUrl) {
                await conn.sendMessage(from, {
                    audio: { url: audioUrl },
                    mimetype: "audio/mpeg",
                    fileName: `${title.substring(0, 50).replace(/[^\w\s]/gi, '')}.mp3`
                }, { quoted: mek });
                
                await conn.sendMessage(from, {
                    document: { url: audioUrl },
                    mimetype: "audio/mpeg",
                    fileName: `${title.substring(0, 50).replace(/[^\w\s]/gi, '')}.mp3`
                }, { quoted: mek });
            } else {
                throw new Error('No audio URL found');
            }
        }
        
    } catch (error) {
        console.error('Download error:', error.message);
        
        reply(`Failed to download audio\n\nReason: ${error.message}\n\n> ® Powered by Tyrex Tech`);
    }
    
} catch (e) {
    reply(`Command failed: ${e.message}\n\n> ® Powered by Tyrex Tech`);
    l(e);
}
});
