const { cmd } = require('../command');

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

// PROMOTE COMMAND
cmd({
    pattern: "promote",
    alias: ["admin", "makeadmin"],
    react: "👑",
    desc: "Promote a member to admin",
    category: "group",
    filename: __filename
},
async(conn, mek, m, {from, l, quoted, isGroup, sender, isAdmins, isBotAdmins, reply, participants, groupAdmins, botNumber}) => {
try{
    if (!isGroup) return reply("This command is only for groups\n\n> ® Powered by Tyrex Tech");

    if (!isAdmins) return reply("You need to be an admin to promote someone\n\n> ® Powered by Tyrex Tech");

    let usersToPromote = [];

    if (m.quoted && m.quoted.sender) {
        usersToPromote.push(m.quoted.sender);
    } else if (m.mentionedJid && m.mentionedJid.length > 0) {
        usersToPromote = m.mentionedJid;
    } else if (m.args && m.args[0]) {
        let input = m.args[0].replace(/[^0-9]/g, '');
        if (input.length >= 10) {
            let number = input + '@s.whatsapp.net';
            usersToPromote.push(number);
        } else {
            return reply("Please provide a valid number or tag the user\n\nExample: *.promote @user*\nOr reply to user's message with *.promote*\n\n> ® Powered by Tyrex Tech");
        }
    } else {
        return reply("Please tag the user or reply to their message\n\nExample: *.promote @user*\n\n> ® Powered by Tyrex Tech");
    }

    usersToPromote = usersToPromote.filter(user => !groupAdmins.includes(user));

    if (usersToPromote.length === 0) {
        return reply("Selected user(s) are already admins or invalid\n\n> ® Powered by Tyrex Tech");
    }

    await conn.sendMessage(from, {
        text: `⏳ Promoting ${usersToPromote.length} user(s)...\n\n> ® Powered by Tyrex Tech`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

    for (let user of usersToPromote) {
        try {
            await conn.groupParticipantsUpdate(from, [user], 'promote');
            console.log(`Promoted: ${user}`);
        } catch (promoteError) {
            console.log(`Error promoting ${user}:`, promoteError);
            await conn.sendMessage(from, {
                text: `❌ Failed to promote @${user.split('@')[0]}: ${promoteError.message}`,
                mentions: [user],
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: mek });
        }
    }

    let mentions = [];
    let mentionText = '';

    for (let user of usersToPromote) {
        mentions.push(user);
        let username = '@' + user.split('@')[0];
        mentionText += username + ' ';
    }

    await conn.sendMessage(from, {
        text: `╭┄┄┄🌸🌹 *PROMOTED SUCCESSFULLY* 🌹🌸┄┄┄⊷\n┃ 👑 *Admin(s):* ${mentionText}\n┃ ✅ ${usersToPromote.length} user(s) promoted to admin\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`,
        mentions: mentions,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

} catch (e) {
    console.log('PROMOTE ERROR:', e);
    reply(`Failed to promote user(s). Error: ${e.message}\n\n> ® Powered by Tyrex Tech`);
    l(e);
}
});

// DEMOTE COMMAND
cmd({
    pattern: "demote",
    alias: ["removeadmin", "unadmin"],
    react: "⬇️",
    desc: "Demote an admin to regular member",
    category: "group",
    filename: __filename
},
async(conn, mek, m, {from, l, quoted, isGroup, sender, isAdmins, isBotAdmins, reply, participants, groupAdmins, botNumber}) => {
try{
    if (!isGroup) return reply("This command is only for groups\n\n> ® Powered by Tyrex Tech");

    if (!isAdmins) return reply("You need to be an admin to demote someone\n\n> ® Powered by Tyrex Tech");

    let usersToDemote = [];

    if (m.quoted && m.quoted.sender) {
        usersToDemote.push(m.quoted.sender);
    } else if (m.mentionedJid && m.mentionedJid.length > 0) {
        usersToDemote = m.mentionedJid;
    } else if (m.args && m.args[0]) {
        let input = m.args[0].replace(/[^0-9]/g, '');
        if (input.length >= 10) {
            let number = input + '@s.whatsapp.net';
            usersToDemote.push(number);
        } else {
            return reply("Please provide a valid number or tag the user\n\nExample: *.demote @user*\nOr reply to user's message with *.demote*\n\n> ® Powered by Tyrex Tech");
        }
    } else {
        return reply("Please tag the user or reply to their message\n\nExample: *.demote @user*\n\n> ® Powered by Tyrex Tech");
    }

    usersToDemote = usersToDemote.filter(user => groupAdmins.includes(user));
    usersToDemote = usersToDemote.filter(user => user !== botNumber);

    if (usersToDemote.length === 0) {
        return reply("Selected user(s) are not admins or cannot be demoted\n\n> ® Powered by Tyrex Tech");
    }

    await conn.sendMessage(from, {
        text: `⏳ Demoting ${usersToDemote.length} user(s)...\n\n> ® Powered by Tyrex Tech`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

    for (let user of usersToDemote) {
        try {
            await conn.groupParticipantsUpdate(from, [user], 'demote');
            console.log(`Demoted: ${user}`);
        } catch (demoteError) {
            console.log(`Error demoting ${user}:`, demoteError);
            await conn.sendMessage(from, {
                text: `❌ Failed to demote @${user.split('@')[0]}: ${demoteError.message}`,
                mentions: [user],
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: mek });
        }
    }

    let mentions = [];
    let mentionText = '';

    for (let user of usersToDemote) {
        mentions.push(user);
        let username = '@' + user.split('@')[0];
        mentionText += username + ' ';
    }

    await conn.sendMessage(from, {
        text: `╭┄┄┄🌸🌹 *DEMOTED SUCCESSFULLY* 🌹🌸┄┄┄⊷\n┃ ⬇️ *User(s):* ${mentionText}\n┃ ✅ ${usersToDemote.length} user(s) demoted from admin\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷\n> ® Powered by Tyrex Tech`,
        mentions: mentions,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: mek });

} catch (e) {
    console.log('DEMOTE ERROR:', e);
    reply(`Failed to demote user(s). Error: ${e.message}\n\n> ® Powered by Tyrex Tech`);
    l(e);
}
});