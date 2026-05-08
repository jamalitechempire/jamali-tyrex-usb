 const { cmd } = require('../command');
const fs = require('fs');

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

// ============ GSTATUS COMMAND ============
cmd({
    pattern: "gstatus",
    alias: ["groupstatus", "gs", "statusgc", "gcstatus"],
    react: "📢",
    desc: "Post status to group profile (appears in status/story)",
    category: "group",
    filename: __filename
},
async(conn, mek, m, {from, l, prefix, quoted, isGroup, sender, isAdmins, isBotAdmins, reply, args}) => {
try{
    if (!isGroup) return reply("This command can only be used in group chats\n\n> ® Powered by Tyrex Tech");
    
    if (!isAdmins) return reply("You need to be an admin to post group status\n\n> ® Powered by Tyrex Tech");
    
    const groupMetadata = await conn.groupMetadata(from);
    const groupName = groupMetadata.subject;
    
    const quotedMsg = m.quoted ? m.quoted : m;
    const mime = (quotedMsg.msg || quotedMsg).mimetype || '';
    const caption = args.join(' ').trim();
    
    const defaultCaption = 
`📢 *GROUP STATUS*
━━━━━━━━━━━━━
👥 *Group:* ${groupName}
⏰ *Time:* ${new Date().toLocaleTimeString()}
━━━━━━━━━━━━━
> 𝐓𝐘𝐑𝐄𝐗 𝐌𝐃`;

    if (!/image|video|audio/.test(mime) && !caption) {
        return await conn.sendMessage(from, {
            text: `📢 *GROUP STATUS COMMAND*
            
Post status that appears on group profile (like story)

*Examples:*
▸ Reply to image with: ${prefix}gstatus
▸ Reply to video with: ${prefix}gstatus
▸ Reply to audio with: ${prefix}gstatus
▸ ${prefix}gstatus Hello group status!

*Note:* This posts to group status/story, not group chat`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
    }
    
    await conn.sendMessage(from, {
        text: `⏳ Posting to group status/story...`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });
    
    const statusText = caption || defaultCaption;
    
    try {
        await conn.sendPresenceUpdate('composing', from);
        
        if (/image/.test(mime)) {
            const buffer = await conn.downloadMediaMessage(quotedMsg);
            
            await conn.sendMessage(from, {
                image: buffer,
                caption: statusText,
                contextInfo: {
                    mentionedJid: [sender],
                    forwardingScore: 999,
                    isForwarded: true,
                    externalAdReply: {
                        title: "📢 GROUP STATUS",
                        body: groupName,
                        mediaType: 1,
                        thumbnail: buffer.slice(0, 100),
                        sourceUrl: "https://chat.whatsapp.com",
                        renderLargerThumbnail: true
                    }
                }
            }, { quoted: mek });
            
        } else if (/video/.test(mime)) {
            const buffer = await conn.downloadMediaMessage(quotedMsg);
            
            await conn.sendMessage(from, {
                video: buffer,
                caption: statusText,
                contextInfo: {
                    mentionedJid: [sender],
                    forwardingScore: 999,
                    isForwarded: true,
                    externalAdReply: {
                        title: "📢 GROUP STATUS",
                        body: groupName,
                        mediaType: 1,
                        sourceUrl: "https://chat.whatsapp.com",
                        renderLargerThumbnail: true
                    }
                }
            }, { quoted: mek });
            
        } else if (/audio/.test(mime)) {
            const buffer = await conn.downloadMediaMessage(quotedMsg);
            
            await conn.sendMessage(from, {
                audio: buffer,
                mimetype: 'audio/mp4',
                ptt: false,
                contextInfo: {
                    mentionedJid: [sender],
                    forwardingScore: 999,
                    isForwarded: true,
                    externalAdReply: {
                        title: "📢 GROUP STATUS",
                        body: groupName,
                        mediaType: 1
                    }
                }
            }, { quoted: mek });
            
        } else if (caption) {
            await conn.sendMessage(from, {
                text: statusText,
                contextInfo: {
                    mentionedJid: [sender],
                    forwardingScore: 999,
                    isForwarded: true,
                    externalAdReply: {
                        title: "📢 GROUP STATUS",
                        body: groupName,
                        mediaType: 1
                    }
                }
            }, { quoted: mek });
        }
        
        await conn.sendMessage(from, {
            text: `╭┄┄┄🌸🌹 *GSTATUS COMPLETE* 🌹🌸┄┄┄⊷\n┃ ✅ Status posted successfully\n┃ 📌 Check group profile to view\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> 𝐓𝐘𝐑𝐄𝐗 𝐌𝐃`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });
        
    } catch (statusError) {
        console.log('Status error:', statusError);
        
        try {
            await conn.sendMessage("status@broadcast", {
                text: `📢 *${groupName}*\n\n${statusText}`,
                contextInfo: {
                    mentionedJid: [sender],
                    forwardingScore: 999,
                    isForwarded: true
                }
            });
            
            await conn.sendMessage(from, {
                text: `✅ Status posted as broadcast`,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: mek });
            
        } catch (broadcastError) {
            throw statusError;
        }
    }

} catch (e) {
    console.log('GSTATUS ERROR:', e);
    reply(`Failed to post group status: ${e.message}\n\n> ® Powered by Tyrex Tech`);
    l(e);
}
});

// ============ GCSTORY COMMAND ============
cmd({
    pattern: "gcstory",
    alias: ["groupstory", "gstory"],
    react: "📱",
    desc: "Post to group story/status (working version)",
    category: "group"
},
async(conn, mek, m, {from, quoted, isGroup, sender, isAdmins, args, reply}) => {
try{
    if (!isGroup) return;
    if (!isAdmins) return;
    
    const quotedMsg = m.quoted || m;
    const mime = (quotedMsg.msg || quotedMsg).mimetype || '';
    const caption = args.join(' ') || 'Group status update';
    
    if (!/image|video/.test(mime) && !caption) {
        return reply("Reply to image/video with .gcstory\n\n> ® Powered by Tyrex Tech");
    }
    
    const groupMetadata = await conn.groupMetadata(from);
    const groupName = groupMetadata.subject;
    
    if (/image/.test(mime)) {
        const buffer = await conn.downloadMediaMessage(quotedMsg);
        
        await conn.sendMessage(from, {
            image: buffer,
            caption: caption,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true,
                externalAdReply: {
                    title: "📢 GROUP STATUS",
                    body: groupName,
                    thumbnail: buffer.slice(0, 100),
                    sourceUrl: "https://chat.whatsapp.com",
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: mek });
        
    } else if (/video/.test(mime)) {
        const buffer = await conn.downloadMediaMessage(quotedMsg);
        
        await conn.sendMessage(from, {
            video: buffer,
            caption: caption,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true,
                externalAdReply: {
                    title: "📢 GROUP STATUS",
                    body: groupName,
                    sourceUrl: "https://chat.whatsapp.com",
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: mek });
        
    } else if (caption) {
        await conn.sendMessage(from, {
            text: `📢 *${groupName}*\n\n${caption}`,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true
            }
        }, { quoted: mek });
    }
    
    await conn.sendMessage(from, {
        text: `✅ Posted successfully`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

} catch (e) {
    console.log(e);
    reply(`Error: ${e.message}\n\n> ® Powered by Tyrex Tech`);
}
});

// ============ STATUS BROADCAST COMMAND ============
cmd({
    pattern: "status",
    alias: ["mystatus", "poststatus"],
    react: "📱",
    desc: "Post to your personal status",
    category: "group"
},
async(conn, mek, m, {from, quoted, sender, args, reply}) => {
try{
    const quotedMsg = m.quoted || m;
    const mime = (quotedMsg.msg || quotedMsg).mimetype || '';
    const caption = args.join(' ') || 'My status update';
    
    if (!/image|video/.test(mime) && !caption) {
        return reply("Reply to image/video with .status\n\n> ® Powered by Tyrex Tech");
    }
    
    if (/image/.test(mime)) {
        const buffer = await conn.downloadMediaMessage(quotedMsg);
        await conn.sendMessage("status@broadcast", {
            image: buffer,
            caption: caption
        });
    } else if (/video/.test(mime)) {
        const buffer = await conn.downloadMediaMessage(quotedMsg);
        await conn.sendMessage("status@broadcast", {
            video: buffer,
            caption: caption
        });
    } else if (caption) {
        await conn.sendMessage("status@broadcast", {
            text: caption
        });
    }
    
    await conn.sendMessage(from, {
        text: `✅ Posted to your status`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

} catch (e) {
    console.log(e);
    reply(`Error: ${e.message}\n\n> ® Powered by Tyrex Tech`);
}
});
