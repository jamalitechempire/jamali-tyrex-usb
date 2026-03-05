const { cmd } = require("../command");

// FakevCard sawa na zilizopita
const fkontak = {
    "key": {
        "participant": '0@s.whatsapp.net',
        "remoteJid": '0@s.whatsapp.net',
        "fromMe": false,
        "id": "Halo"
    },
    "message": {
        "conversation": "𝚂𝙸𝙻𝙰"
    }
};

const getContextInfo = (m) => {
    return {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363402325089913@newsletter',
            newsletterName: '© 𝐒𝐈𝐋𝐀 𝐌𝐃',
            serverMessageId: 143,
        }
    };
};

// ==================== KICK COMMAND ====================
cmd({
  pattern: "kick",
  alias: ["k", "remove", "nital"],
  desc: "Remove a user from the group",
  category: "group",
  react: "💀",
  filename: __filename
}, async (conn, mek, m, {
  from,
  isCreator,
  isBotAdmins,
  isGroup,
  quoted,
  botNumber,
  sender
}) => {
  try {
    if (!isGroup) {
      return await conn.sendMessage(from, { 
        text: "⚠️ 𝚃𝚑𝚒𝚜 𝚌𝚘𝚖𝚖𝚊𝚗𝚍 𝚘𝚗𝚕𝚢 𝚠𝚘𝚛𝚔𝚜 𝚒𝚗 𝚐𝚛𝚘𝚞𝚙𝚜.\n\n> © Powered by Sila Tech", 
        contextInfo: getContextInfo({ sender: sender })
      }, { quoted: fkontak });
    }
    
    if (!isBotAdmins) {
      return await conn.sendMessage(from, { 
        text: "❌ 𝙸 𝚖𝚞𝚜𝚝 𝚋𝚎 𝚊𝚍𝚖𝚒𝚗 𝚝𝚘 𝚛𝚎𝚖𝚘𝚟𝚎 𝚜𝚘𝚖𝚎𝚘𝚗𝚎.\n\n> © Powered by Sila Tech", 
        contextInfo: getContextInfo({ sender: sender })
      }, { quoted: fkontak });
    }
    
    if (!isCreator) {
      return await conn.sendMessage(from, { 
        text: "🔐 𝙾𝚗𝚕𝚢 𝚋𝚘𝚝 𝚘𝚠𝚗𝚎𝚛 𝚌𝚊𝚗 𝚞𝚜𝚎 𝚝𝚑𝚒𝚜 𝚌𝚘𝚖𝚖𝚊𝚗𝚍.\n\n> © Powered by Sila Tech", 
        contextInfo: getContextInfo({ sender: sender })
      }, { quoted: fkontak });
    }

    if (!m.quoted && (!m.mentionedJid || m.mentionedJid.length === 0)) {  
      return await conn.sendMessage(from, { 
        text: "❓ 𝚈𝚘𝚞 𝚍𝚒𝚍 𝚗𝚘𝚝 𝚐𝚒𝚟𝚎 𝚖𝚎 𝚊 𝚞𝚜𝚎𝚛 𝚝𝚘 𝚛𝚎𝚖𝚘𝚟𝚎!\n\n> © Powered by Sila Tech", 
        contextInfo: getContextInfo({ sender: sender })
      }, { quoted: fkontak });
    }  

    let users = m.mentionedJid[0] 
      ? m.mentionedJid[0] 
      : m.quoted 
      ? m.quoted.sender 
      : null;  

    if (!users) {
      return await conn.sendMessage(from, { 
        text: "⚠️ 𝙲𝚘𝚞𝚕𝚍𝚗'𝚝 𝚍𝚎𝚝𝚎𝚛𝚖𝚒𝚗𝚎 𝚝𝚊𝚛𝚐𝚎𝚝 𝚞𝚜𝚎𝚛.\n\n> © Powered by Sila Tech", 
        contextInfo: getContextInfo({ sender: sender })
      }, { quoted: fkontak });
    }

    if (users === botNumber) {
      return await conn.sendMessage(from, { 
        text: "🤖 𝙸 𝚌𝚊𝚗'𝚝 𝚔𝚒𝚌𝚔 𝚖𝚢𝚜𝚎𝚕𝚏!\n\n> © Powered by Sila Tech", 
        contextInfo: getContextInfo({ sender: sender })
      }, { quoted: fkontak });
    }
    
    const ownerJid = conn.user.id.split(":")[0] + '@s.whatsapp.net';  
    if (users === ownerJid) {
      return await conn.sendMessage(from, { 
        text: "👑 𝚃𝚑𝚊𝚝'𝚜 𝚝𝚑𝚎 𝚘𝚠𝚗𝚎𝚛! 𝙸 𝚌𝚊𝚗'𝚝 𝚛𝚎𝚖𝚘𝚟𝚎 𝚝𝚑𝚎𝚖.\n\n> © Powered by Sila Tech", 
        contextInfo: getContextInfo({ sender: sender })
      }, { quoted: fkontak });
    }  

    await conn.groupParticipantsUpdate(from, [users], "remove");  
    
    await conn.sendMessage(from, { 
      text: `*✅ 𝚂𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢 𝚛𝚎𝚖𝚘𝚟𝚎𝚍 𝚏𝚛𝚘𝚖 𝚐𝚛𝚘𝚞𝚙.*\n\n> © Powered by Sila Tech`, 
      mentions: [users],
      contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

  } catch (err) {
    console.error(err);
    await conn.sendMessage(from, { 
      text: "❌ 𝙵𝚊𝚒𝚕𝚎𝚍 𝚝𝚘 𝚛𝚎𝚖𝚘𝚟𝚎 𝚞𝚜𝚎𝚛. 𝚂𝚘𝚖𝚎𝚝𝚑𝚒𝚗𝚐 𝚠𝚎𝚗𝚝 𝚠𝚛𝚘𝚗𝚐.\n\n> © Powered by Sila Tech", 
      contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
  }
});

// ==================== PROMOTE COMMAND ====================
cmd({
pattern: "promote",
alias: ["p1", "giveadmin", "makeadmin"],
desc: "Promote a user to admin",
category: "group",
react: "💀",
filename: __filename
}, async (conn, mek, m, {
from,
isCreator,
isBotAdmins,
isAdmins,
isGroup,
quoted,
botNumber,
sender
}) => {
try {
if (!isGroup) {
  return await conn.sendMessage(from, { 
    text: "⚠️ 𝚃𝚑𝚒𝚜 𝚌𝚘𝚖𝚖𝚊𝚗𝚍 𝚘𝚗𝚕𝚢 𝚠𝚘𝚛𝚔𝚜 𝚒𝚗 𝚐𝚛𝚘𝚞𝚙𝚜.\n\n> © Powered by Sila Tech", 
    contextInfo: getContextInfo({ sender: sender })
  }, { quoted: fkontak });
}

if (!isBotAdmins) {
  return await conn.sendMessage(from, { 
    text: "❌ 𝙸 𝚖𝚞𝚜𝚝 𝚋𝚎 𝚊𝚍𝚖𝚒𝚗 𝚝𝚘 𝚙𝚛𝚘𝚖𝚘𝚝𝚎 𝚜𝚘𝚖𝚎𝚘𝚗𝚎.\n\n> © Powered by Sila Tech", 
    contextInfo: getContextInfo({ sender: sender })
  }, { quoted: fkontak });
}

if (!isAdmins && !isCreator) {
  return await conn.sendMessage(from, { 
    text: "🔐 𝙾𝚗𝚕𝚢 𝚐𝚛𝚘𝚞𝚙 𝚊𝚍𝚖𝚒𝚗𝚜 𝚘𝚛 𝚘𝚠𝚗𝚎𝚛 𝚌𝚊𝚗 𝚞𝚜𝚎 𝚝𝚑𝚒𝚜 𝚌𝚘𝚖𝚖𝚊𝚗𝚍.\n\n> © Powered by Sila Tech", 
    contextInfo: getContextInfo({ sender: sender })
  }, { quoted: fkontak });
}

if (!m.quoted && (!m.mentionedJid || m.mentionedJid.length === 0)) {  
  return await conn.sendMessage(from, { 
    text: "❓ 𝚈𝚘𝚞 𝚍𝚒𝚍 𝚗𝚘𝚝 𝚐𝚒𝚟𝚎 𝚖𝚎 𝚊 𝚞𝚜𝚎𝚛 𝚝𝚘 𝚙𝚛𝚘𝚖𝚘𝚝𝚎!\n\n> © Powered by Sila Tech", 
    contextInfo: getContextInfo({ sender: sender })
  }, { quoted: fkontak });
}  

let users = m.mentionedJid[0] 
  ? m.mentionedJid[0] 
  : m.quoted 
  ? m.quoted.sender 
  : null;  

if (!users) {
  return await conn.sendMessage(from, { 
    text: "⚠️ 𝙲𝚘𝚞𝚕𝚍𝚗'𝚝 𝚍𝚎𝚝𝚎𝚛𝚖𝚒𝚗𝚎 𝚝𝚊𝚛𝚐𝚎𝚝 𝚞𝚜𝚎𝚛.\n\n> © Powered by Sila Tech", 
    contextInfo: getContextInfo({ sender: sender })
  }, { quoted: fkontak });
}

if (users === botNumber) {
  return await conn.sendMessage(from, { 
    text: "🤖 𝙸 𝚌𝚊𝚗'𝚝 𝚙𝚛𝚘𝚖𝚘𝚝𝚎 𝚖𝚢𝚜𝚎𝚕𝚏!\n\n> © Powered by Sila Tech", 
    contextInfo: getContextInfo({ sender: sender })
  }, { quoted: fkontak });
}

const ownerJid = conn.user.id.split(":")[0] + '@s.whatsapp.net';  
if (users === ownerJid) {
  return await conn.sendMessage(from, { 
    text: "👑 𝙾𝚠𝚗𝚎𝚛 𝚒𝚜 𝚊𝚕𝚛𝚎𝚊𝚍𝚢 𝚜𝚞𝚙𝚎𝚛 𝚊𝚍𝚖𝚒𝚗!\n\n> © Powered by Sila Tech", 
    contextInfo: getContextInfo({ sender: sender })
  }, { quoted: fkontak });
}  

await conn.groupParticipantsUpdate(from, [users], "promote");  

await conn.sendMessage(from, { 
  text: `*✅ 𝚂𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢 𝙿𝚛𝚘𝚖𝚘𝚝𝚎𝚍 𝚝𝚘 𝙰𝚍𝚖𝚒𝚗.*\n\n> © Powered by Sila Tech`, 
  mentions: [users],
  contextInfo: getContextInfo({ sender: sender })
}, { quoted: fkontak });

} catch (err) {
console.error(err);
await conn.sendMessage(from, { 
  text: "❌ 𝙵𝚊𝚒𝚕𝚎𝚍 𝚝𝚘 𝚙𝚛𝚘𝚖𝚘𝚝𝚎. 𝚂𝚘𝚖𝚎𝚝𝚑𝚒𝚗𝚐 𝚠𝚎𝚗𝚝 𝚠𝚛𝚘𝚗𝚐.\n\n> © Powered by Sila Tech", 
  contextInfo: getContextInfo({ sender: sender })
}, { quoted: fkontak });
}
});

// ==================== DEMOTE COMMAND ====================
cmd({
pattern: "demote",
alias: ["d", "dismiss", "removeadmin"],
desc: "Demote a group admin",
category: "group",
react: "💀",
filename: __filename
}, async (conn, mek, m, {
from,
isCreator,
isBotAdmins,
isAdmins,
isGroup,
quoted,
botNumber,
sender
}) => {
try {
if (!isGroup) {
  return await conn.sendMessage(from, { 
    text: "⚠️ 𝚃𝚑𝚒𝚜 𝚌𝚘𝚖𝚖𝚊𝚗𝚍 𝚘𝚗𝚕𝚢 𝚠𝚘𝚛𝚔𝚜 𝚒𝚗 𝚐𝚛𝚘𝚞𝚙𝚜.\n\n> © Powered by Sila Tech", 
    contextInfo: getContextInfo({ sender: sender })
  }, { quoted: fkontak });
}

if (!isBotAdmins) {
  return await conn.sendMessage(from, { 
    text: "❌ 𝙸 𝚖𝚞𝚜𝚝 𝚋𝚎 𝚊𝚍𝚖𝚒𝚗 𝚝𝚘 𝚍𝚎𝚖𝚘𝚝𝚎 𝚜𝚘𝚖𝚎𝚘𝚗𝚎.\n\n> © Powered by Sila Tech", 
    contextInfo: getContextInfo({ sender: sender })
  }, { quoted: fkontak });
}

if (!isAdmins && !isCreator) {
  return await conn.sendMessage(from, { 
    text: "🔐 𝙾𝚗𝚕𝚢 𝚐𝚛𝚘𝚞𝚙 𝚊𝚍𝚖𝚒𝚗𝚜 𝚘𝚛 𝚘𝚠𝚗𝚎𝚛 𝚌𝚊𝚗 𝚞𝚜𝚎 𝚝𝚑𝚒𝚜 𝚌𝚘𝚖𝚖𝚊𝚗𝚍.\n\n> © Powered by Sila Tech", 
    contextInfo: getContextInfo({ sender: sender })
  }, { quoted: fkontak });
}

if (!m.quoted && (!m.mentionedJid || m.mentionedJid.length === 0)) {  
  return await conn.sendMessage(from, { 
    text: "❓ 𝚈𝚘𝚞 𝚍𝚒𝚍 𝚗𝚘𝚝 𝚐𝚒𝚟𝚎 𝚖𝚎 𝚊 𝚞𝚜𝚎𝚛 𝚝𝚘 𝚍𝚎𝚖𝚘𝚝𝚎!\n\n> © Powered by Sila Tech", 
    contextInfo: getContextInfo({ sender: sender })
  }, { quoted: fkontak });
}  

let users = m.mentionedJid[0] 
  ? m.mentionedJid[0] 
  : m.quoted 
  ? m.quoted.sender 
  : null;  

if (!users) {
  return await conn.sendMessage(from, { 
    text: "⚠️ 𝙲𝚘𝚞𝚕𝚍𝚗'𝚝 𝚍𝚎𝚝𝚎𝚛𝚖𝚒𝚗𝚎 𝚝𝚊𝚛𝚐𝚎𝚝 𝚞𝚜𝚎𝚛.\n\n> © Powered by Sila Tech", 
    contextInfo: getContextInfo({ sender: sender })
  }, { quoted: fkontak });
}

if (users === botNumber) {
  return await conn.sendMessage(from, { 
    text: "🤖 𝙸 𝚌𝚊𝚗'𝚝 𝚍𝚎𝚖𝚘𝚝𝚎 𝚖𝚢𝚜𝚎𝚕𝚏!\n\n> © Powered by Sila Tech", 
    contextInfo: getContextInfo({ sender: sender })
  }, { quoted: fkontak });
}

const ownerJid = conn.user.id.split(":")[0] + '@s.whatsapp.net';  
if (users === ownerJid) {
  return await conn.sendMessage(from, { 
    text: "👑 𝙸 𝚌𝚊𝚗'𝚝 𝚍𝚎𝚖𝚘𝚝𝚎 𝚝𝚑𝚎 𝚘𝚠𝚗𝚎𝚛!\n\n> © Powered by Sila Tech", 
    contextInfo: getContextInfo({ sender: sender })
  }, { quoted: fkontak });
}  

await conn.groupParticipantsUpdate(from, [users], "demote");  

await conn.sendMessage(from, { 
  text: `*✅ 𝙰𝚍𝚖𝚒𝚗 𝚂𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢 𝚍𝚎𝚖𝚘𝚝𝚎𝚍 𝚝𝚘 𝚊 𝚗𝚘𝚛𝚖𝚊𝚕 𝚖𝚎𝚖𝚋𝚎𝚛.*\n\n> © Powered by Sila Tech`, 
  mentions: [users],
  contextInfo: getContextInfo({ sender: sender })
}, { quoted: fkontak });

} catch (err) {
console.error(err);
await conn.sendMessage(from, { 
  text: "❌ 𝙵𝚊𝚒𝚕𝚎𝚍 𝚝𝚘 𝚍𝚎𝚖𝚘𝚝𝚎. 𝚂𝚘𝚖𝚎𝚝𝚑𝚒𝚗𝚐 𝚠𝚎𝚗𝚝 𝚠𝚛𝚘𝚗𝚐.\n\n> © Powered by Sila Tech", 
  contextInfo: getContextInfo({ sender: sender })
}, { quoted: fkontak });
}

});
