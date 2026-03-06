const { cmd } = require('../command');
const fs = require('fs');

// FakevCard
const fkontak = {
    "key": {
        "participant": '0@s.whatsapp.net',
        "remoteJid": '0@s.whatsapp.net',
        "fromMe": false,
        "id": "Halo"
    },
    "message": {
        "conversation": "𝐒𝐈𝐋𝐀 𝐌𝐃"
    }
};

const getContextInfo = (m) => {
    return {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363402325089913@newsletter',
            newsletterName: '𝐒𝐈𝐋𝐀 𝐌𝐃',
            serverMessageId: 143,
        },
    };
};

// ============ GSTATUS COMMAND (Posts to Group Status/Story) ============
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
    if (!isGroup) return await conn.sendMessage(from, {
        text: `❌ This command can only be used in group chats`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    if (!isAdmins) return await conn.sendMessage(from, {
        text: `❌ You need to be an admin to post group status`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    // Get group metadata
    const groupMetadata = await conn.groupMetadata(from);
    const groupName = groupMetadata.subject;
    const groupJid = from;
    
    const quotedMsg = m.quoted ? m.quoted : m;
    const mime = (quotedMsg.msg || quotedMsg).mimetype || '';
    const caption = args.join(' ').trim();
    
    const defaultCaption = 
`📢 *GROUP STATUS*
━━━━━━━━━━━━━
👥 *Group:* ${groupName}
⏰ *Time:* ${new Date().toLocaleTimeString()}
━━━━━━━━━━━━━
> 𝐒𝐈𝐋𝐀 𝐌𝐃`;

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
        }, { quoted: fkontak });
    }
    
    // Send processing message
    await conn.sendMessage(from, {
        text: `⏳ Posting to group status/story...`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    // Prepare status message
    const statusText = caption || defaultCaption;
    
    // Handle different media types for status
    if (/image/.test(mime)) {
        const buffer = await conn.downloadMediaMessage(quotedMsg);
        
        // Post as image status
        await conn.sendMessage(
            { jid: groupJid }, // Send to group's status
            {
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
                        renderLargerThumbnail: true
                    }
                }
            },
            { 
                status: 'groupStatus', // This makes it post to group status
                quoted: fkontak 
            }
        );
        
        // Send confirmation to group chat
        await conn.sendMessage(from, {
            text: `┏━❑ GSTATUS COMPLETE ━━━━━━━━━
┃ ✅ Image posted to group status/story
┃ 📌 Check group profile to view
┗━━━━━━━━━━━━━━━━━━━━
> 𝐒𝐈𝐋𝐀 𝐌𝐃`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });

    } else if (/video/.test(mime)) {
        const buffer = await conn.downloadMediaMessage(quotedMsg);
        
        // Post as video status
        await conn.sendMessage(
            { jid: groupJid },
            {
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
                        renderLargerThumbnail: true
                    }
                }
            },
            { 
                status: 'groupStatus',
                quoted: fkontak 
            }
        );
        
        await conn.sendMessage(from, {
            text: `┏━❑ GSTATUS COMPLETE ━━━━━━━━━
┃ ✅ Video posted to group status/story
┃ 📌 Check group profile to view
┗━━━━━━━━━━━━━━━━━━━━
> 𝐒𝐈𝐋𝐀 𝐌𝐃`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });

    } else if (/audio/.test(mime)) {
        const buffer = await conn.downloadMediaMessage(quotedMsg);
        
        // Post as audio status
        await conn.sendMessage(
            { jid: groupJid },
            {
                audio: buffer,
                mimetype: 'audio/mp4',
                contextInfo: {
                    mentionedJid: [sender],
                    forwardingScore: 999,
                    isForwarded: true
                }
            },
            { 
                status: 'groupStatus',
                quoted: fkontak 
            }
        );
        
        await conn.sendMessage(from, {
            text: `┏━❑ GSTATUS COMPLETE ━━━━━━━━━
┃ ✅ Audio posted to group status/story
┃ 📌 Check group profile to view
┗━━━━━━━━━━━━━━━━━━━━
> 𝐒𝐈𝐋𝐀 𝐌𝐃`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });

    } else if (caption) {
        // Post text only status
        await conn.sendMessage(
            { jid: groupJid },
            {
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
            },
            { 
                status: 'groupStatus',
                quoted: fkontak 
            }
        );
        
        await conn.sendMessage(from, {
            text: `┏━❑ GSTATUS COMPLETE ━━━━━━━━━
┃ ✅ Text posted to group status/story
┃ 📌 Check group profile to view
┗━━━━━━━━━━━━━━━━━━━━
> 𝐒𝐈𝐋𝐀 𝐌𝐃`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }

} catch (e) {
    console.log('GSTATUS ERROR:', e);
    
    // Try alternative method if first fails
    try {
        // Alternative method using group update
        const quotedMsg = m.quoted ? m.quoted : m;
        const mime = (quotedMsg.msg || quotedMsg).mimetype || '';
        
        if (/image/.test(mime)) {
            const buffer = await conn.downloadMediaMessage(quotedMsg);
            // Update group profile picture temporarily? No, that's different
            
            await conn.sendMessage(from, {
                text: `❌ Could not post to group status. Error: ${e.message}\n\nTry using a different media type.`,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: fkontak });
        }
    } catch (altError) {
        await conn.sendMessage(from, {
            text: `❌ Failed to post group status: ${e.message}`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
    l(e);
}
});

// ============ SIMPLER VERSION ============
cmd({
    pattern: "gcstory",
    alias: ["groupstory", "gstory"],
    react: "📱",
    desc: "Post to group story/status (simpler version)",
    category: "group"
},
async(conn, mek, m, {from, quoted, isGroup, sender, isAdmins, args}) => {
try{
    if (!isGroup) return;
    if (!isAdmins) return;
    
    const quotedMsg = m.quoted || m;
    const mime = (quotedMsg.msg || quotedMsg).mimetype || '';
    const caption = args.join(' ') || 'Group status update';
    
    if (!/image|video|audio/.test(mime) && !caption) {
        return await conn.sendMessage(from, {
            text: `Reply to image/video/audio with .gcstory`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
    
    // Get group name
    const groupMetadata = await conn.groupMetadata(from);
    const groupName = groupMetadata.subject;
    
    if (/image/.test(mime)) {
        const buffer = await conn.downloadMediaMessage(quotedMsg);
        await conn.sendMessage(
            { jid: from },
            { 
                image: buffer, 
                caption: `📢 ${caption}\n\n> ${groupName}` 
            },
            { status: 'groupStatus' }
        );
    } else if (/video/.test(mime)) {
        const buffer = await conn.downloadMediaMessage(quotedMsg);
        await conn.sendMessage(
            { jid: from },
            { 
                video: buffer, 
                caption: `📢 ${caption}\n\n> ${groupName}` 
            },
            { status: 'groupStatus' }
        );
    } else if (caption) {
        await conn.sendMessage(
            { jid: from },
            { text: `📢 ${caption}\n\n> ${groupName}` },
            { status: 'groupStatus' }
        );
    }
    
    await conn.sendMessage(from, {
        text: `✅ Posted to group story/status`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) {
    console.log(e);
    await conn.sendMessage(from, {
        text: `❌ Error: ${e.message}`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
}
});

// ============ GROUP STATUS VIEWER ============
cmd({
    pattern: "viewstatus",
    alias: ["viewstory", "seestatus"],
    react: "👁️",
    desc: "View current group status/story",
    category: "group"
},
async(conn, mek, m, {from, isGroup, sender}) => {
try{
    if (!isGroup) return;
    
    await conn.sendMessage(from, {
        text: `📱 To view group status/story:\n\n1. Open group chat\n2. Tap on group name at top\n3. Look for "Status" or "Story" tab\n4. Tap to view current status`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) { console.log(e); }
});
