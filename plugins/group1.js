const { cmd } = require('../command');

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

// ============ KICKALL COMMAND ============
cmd({
    pattern: "kickall",
    alias: ["removeall", "deleteall"],
    react: "👢",
    desc: "Remove all members from group (except admins)",
    category: "group",
    filename: __filename
},
async(conn, mek, m, {from, l, isGroup, sender, isAdmins, isBotAdmins, participants, groupAdmins, botNumber}) => {
try{
    if (!isGroup) return await conn.sendMessage(from, {
        text: `❌ This command is only for groups`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    if (!isAdmins) return await conn.sendMessage(from, {
        text: `❌ You need to be an admin to use this command`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    // Send processing message
    await conn.sendMessage(from, {
        text: `⏳ Removing all members...`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    // Get all participants except admins and bot
    const membersToRemove = participants
        .filter(p => !groupAdmins.includes(p.id) && p.id !== botNumber)
        .map(p => p.id);
    
    if (membersToRemove.length === 0) {
        return await conn.sendMessage(from, {
            text: `❌ No members to remove`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
    
    // Remove members in batches of 5 to avoid rate limiting
    let removed = 0;
    for (let i = 0; i < membersToRemove.length; i += 5) {
        const batch = membersToRemove.slice(i, i + 5);
        await conn.groupParticipantsUpdate(from, batch, 'remove');
        removed += batch.length;
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds between batches
    }
    
    await conn.sendMessage(from, {
        text: `┏━❑ KICKALL COMPLETE ━━━━━━━━━
┃ ✅ Successfully removed ${removed} members
┃ 👥 Remaining: ${participants.length - removed} (admins only)
┗━━━━━━━━━━━━━━━━━━━━`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) {
    console.log('KICKALL ERROR:', e);
    await conn.sendMessage(from, {
        text: `❌ Failed to remove members: ${e.message}`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    l(e);
}
});

// ============ REJECTALL COMMAND ============
cmd({
    pattern: "rejectall",
    alias: ["rejectpending", "rejectrequests"],
    react: "❌",
    desc: "Reject all pending join requests",
    category: "group",
    filename: __filename
},
async(conn, mek, m, {from, l, isGroup, sender, isAdmins, isBotAdmins}) => {
try{
    if (!isGroup) return await conn.sendMessage(from, {
        text: `❌ This command is only for groups`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    if (!isAdmins) return await conn.sendMessage(from, {
        text: `❌ You need to be an admin to use this command`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    await conn.sendMessage(from, {
        text: `⏳ Fetching pending join requests...`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    // Get join requests
    const requests = await conn.groupRequestParticipantsList(from);
    
    if (!requests || requests.length === 0) {
        return await conn.sendMessage(from, {
            text: `✅ No pending join requests`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
    
    // Reject all requests
    let rejected = 0;
    for (const request of requests) {
        if (request.requestMethod === 'invite') { // Only reject invite requests
            await conn.groupRequestParticipantsUpdate(from, [request.jid], 'reject');
            rejected++;
        }
    }
    
    await conn.sendMessage(from, {
        text: `┏━❑ REJECTALL COMPLETE ━━━━━━━━━
┃ ✅ Rejected ${rejected} pending requests
┃ 📋 Total requests: ${requests.length}
┗━━━━━━━━━━━━━━━━━━━━`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) {
    console.log('REJECTALL ERROR:', e);
    await conn.sendMessage(from, {
        text: `❌ Failed to reject requests: ${e.message}`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    l(e);
}
});

// ============ RGPP COMMAND (Reset Group Profile Picture) ============
cmd({
    pattern: "rgpp",
    alias: ["resetpp", "removepp", "delpp"],
    react: "🖼️",
    desc: "Remove group profile picture",
    category: "group",
    filename: __filename
},
async(conn, mek, m, {from, l, isGroup, sender, isAdmins, isBotAdmins}) => {
try{
    if (!isGroup) return await conn.sendMessage(from, {
        text: `❌ This command is only for groups`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    if (!isAdmins) return await conn.sendMessage(from, {
        text: `❌ You need to be an admin to use this command`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    // Remove group profile picture (set to default)
    await conn.updateProfilePicture(from, { delete: true });
    
    await conn.sendMessage(from, {
        text: `┏━❑ RGPP COMPLETE ━━━━━━━━━
┃ ✅ Group profile picture has been removed
┃ 🖼️ Group now has default picture
┗━━━━━━━━━━━━━━━━━━━━`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) {
    console.log('RGPP ERROR:', e);
    await conn.sendMessage(from, {
        text: `❌ Failed to remove group picture: ${e.message}`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    l(e);
}
});

// ============ CREATEGC COMMAND ============
cmd({
    pattern: "creategc",
    alias: ["creategroup", "newgc", "makegroup"],
    react: "✨",
    desc: "Create a new group",
    category: "group",
    filename: __filename
},
async(conn, mek, m, {from, l, sender, pushname, reply, args}) => {
try{
    if (!args[0]) return await conn.sendMessage(from, {
        text: `❌ Please provide group name\n\nExample: .creategc Group Name`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    const groupName = args.join(' ');
    
    await conn.sendMessage(from, {
        text: `⏳ Creating group "${groupName}"...`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    // Create group with sender as participant
    const { id, subject } = await conn.groupCreate(groupName, [sender]);
    
    // Make sender admin
    await conn.groupParticipantsUpdate(id, [sender], 'promote');
    
    await conn.sendMessage(from, {
        text: `┏━❑ GROUP CREATED ━━━━━━━━━
┃ ✅ Group created successfully
┃ 📌 *Name:* ${subject}
┃ 🔗 *ID:* ${id}
┃ 👑 *You are now admin*
┗━━━━━━━━━━━━━━━━━━━━`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    // Send invite link
    const code = await conn.groupInviteCode(id);
    await conn.sendMessage(id, {
        text: `┏━❑ WELCOME TO NEW GROUP ━━━━━━━━━
┃ 📌 *Group:* ${subject}
┃ 🔗 *Invite Link:* https://chat.whatsapp.com/${code}
┃ 👑 *Admin:* @${sender.split('@')[0]}
┗━━━━━━━━━━━━━━━━━━━━`,
        mentions: [sender],
        contextInfo: getContextInfo({ sender: sender })
    });

} catch (e) {
    console.log('CREATEGC ERROR:', e);
    await conn.sendMessage(from, {
        text: `❌ Failed to create group: ${e.message}`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    l(e);
}
});

// ============ JOIN COMMAND ============
cmd({
    pattern: "join",
    alias: ["joingroup", "joinlink"],
    react: "🔗",
    desc: "Join a group via invite link",
    category: "group",
    filename: __filename
},
async(conn, mek, m, {from, l, sender, reply, args}) => {
try{
    if (!args[0]) return await conn.sendMessage(from, {
        text: `❌ Please provide group link\n\nExample: .join https://chat.whatsapp.com/xxxxxx`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    const link = args[0];
    let code = link.split('https://chat.whatsapp.com/')[1] || link;
    
    if (!code) return await conn.sendMessage(from, {
        text: `❌ Invalid group link`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    await conn.sendMessage(from, {
        text: `⏳ Joining group...`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    const groupId = await conn.groupAcceptInvite(code);
    const groupMetadata = await conn.groupMetadata(groupId);
    
    await conn.sendMessage(from, {
        text: `┏━❑ JOIN SUCCESSFUL ━━━━━━━━━
┃ ✅ Bot has joined the group
┃ 📌 *Group:* ${groupMetadata.subject}
┃ 👥 *Members:* ${groupMetadata.participants.length}
┗━━━━━━━━━━━━━━━━━━━━`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    // Send welcome message in the joined group
    await conn.sendMessage(groupId, {
        text: `┏━❑ BOT JOINED ━━━━━━━━━
┃ 🤖 Hello! I'm Sila MD Bot
┃ 📌 Type .menu to see my commands
┗━━━━━━━━━━━━━━━━━━━━`,
        contextInfo: getContextInfo({ sender: sender })
    });

} catch (e) {
    console.log('JOIN ERROR:', e);
    await conn.sendMessage(from, {
        text: `❌ Failed to join group: ${e.message}`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    l(e);
}
});

// ============ LEFT COMMAND (Bot leave group) ============
cmd({
    pattern: "left",
    alias: ["leave", "exit", "leavegc"],
    react: "👋",
    desc: "Bot leaves the group",
    category: "group",
    filename: __filename
},
async(conn, mek, m, {from, l, isGroup, sender, isAdmins, isBotAdmins, reply}) => {
try{
    if (!isGroup) return await conn.sendMessage(from, {
        text: `❌ This command is only for groups`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    if (!isAdmins) return await conn.sendMessage(from, {
        text: `❌ You need to be an admin to use this command`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    await conn.sendMessage(from, {
        text: `┏━❑ BOT LEAVING ━━━━━━━━━
┃ 👋 Goodbye! Bot is leaving the group
┃ ⚡ Thanks for using Sila MD
┗━━━━━━━━━━━━━━━━━━━━`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    // Wait a moment before leaving
    setTimeout(async () => {
        await conn.groupLeave(from);
    }, 2000);

} catch (e) {
    console.log('LEFT ERROR:', e);
    await conn.sendMessage(from, {
        text: `❌ Failed to leave group: ${e.message}`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    l(e);
}
});

// ============ KICK COMMAND ============
cmd({
    pattern: "kick",
    alias: ["remove", "ban"],
    react: "👢",
    desc: "Remove members from group",
    category: "group",
    filename: __filename
},
async(conn, mek, m, {from, l, quoted, isGroup, sender, isAdmins, isBotAdmins, participants, groupAdmins, botNumber, args}) => {
try{
    if (!isGroup) return await conn.sendMessage(from, {
        text: `❌ This command is only for groups`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    if (!isAdmins) return await conn.sendMessage(from, {
        text: `❌ You need to be an admin to kick members`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    let usersToKick = [];
    
    // Check if replying to a message
    if (m.quoted && m.quoted.sender) {
        usersToKick.push(m.quoted.sender);
    }
    // Check if mentioning someone
    else if (m.mentionedJid && m.mentionedJid.length > 0) {
        usersToKick = m.mentionedJid;
    }
    // Check if providing number in args
    else if (args && args[0]) {
        let input = args[0].replace(/[^0-9]/g, '');
        if (input.length >= 10) {
            let number = input + '@s.whatsapp.net';
            usersToKick.push(number);
        } else {
            return await conn.sendMessage(from, {
                text: `❌ Please provide a valid number or tag the user\n\nExample: .kick @user\nOr reply to user's message with .kick`,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: fkontak });
        }
    } else {
        return await conn.sendMessage(from, {
            text: `❌ Please tag the user or reply to their message\n\nExample: .kick @user`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
    
    // Filter out admins and bot
    usersToKick = usersToKick.filter(user => 
        !groupAdmins.includes(user) && user !== botNumber
    );
    
    if (usersToKick.length === 0) {
        return await conn.sendMessage(from, {
            text: `❌ Cannot kick admins or bot`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
    
    // Send processing message
    await conn.sendMessage(from, {
        text: `⏳ Kicking ${usersToKick.length} user(s)...`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    // Kick each user
    for (let user of usersToKick) {
        try {
            await conn.groupParticipantsUpdate(from, [user], 'remove');
            console.log(`Kicked: ${user}`);
        } catch (kickError) {
            console.log(`Error kicking ${user}:`, kickError);
            await conn.sendMessage(from, {
                text: `❌ Failed to kick @${user.split('@')[0]}: ${kickError.message}`,
                mentions: [user],
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: fkontak });
        }
    }
    
    // Get usernames for mentioned users
    let mentions = [];
    let mentionText = '';
    
    for (let user of usersToKick) {
        mentions.push(user);
        let username = '@' + user.split('@')[0];
        mentionText += username + ' ';
    }
    
    await conn.sendMessage(from, {
        text: `┏━❑ KICKED SUCCESSFULLY ━━━━━━━━━
┃ 👢 *Kicked:* ${mentionText}
┃ ✅ ${usersToKick.length} user(s) removed from group
┗━━━━━━━━━━━━━━━━━━━━`,
        mentions: mentions,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) {
    console.log('KICK ERROR:', e);
    await conn.sendMessage(from, {
        text: `❌ Failed to kick user(s): ${e.message}`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    l(e);
}
});
