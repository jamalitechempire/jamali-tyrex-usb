const { isJidGroup } = require('@whiskeysockets/baileys');
const config = require('../config');

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

const GroupEvents = async (conn, update) => {
    try {
        const isGroup = isJidGroup(update.id);
        if (!isGroup) return;

        const metadata = await conn.groupMetadata(update.id);
        const participants = update.participants;
        const groupMembersCount = metadata.participants.length;

        for (const num of participants) {
            const userName = num.split("@")[0];

            let userPp;
            try {
                userPp = await conn.profilePictureUrl(num, 'image');
            } catch {
                userPp = null;
            }

            if (update.action === "add" && config.WELCOME === "true") {
                const msg = {
                    text: `╭┄┄┄🌸🌹 *WELCOME* 🌹🌸┄┄┄⊷
┃
┃ 👋 *Hello* @${userName}
┃ 🎉 *Welcome to* ${metadata.subject}
┃ 👥 *Members:* ${groupMembersCount}
┃
╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷
> ® 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐓𝐲𝐫𝐞𝐱 𝐓𝐞𝐜𝐡`,
                    mentions: [num],
                    contextInfo: getContextInfo({ sender: num }),
                };

                if (userPp) {
                    msg.image = { url: userPp };
                    msg.caption = msg.text;
                    delete msg.text;
                }

                await conn.sendMessage(update.id, msg);

            } else if (update.action === "remove" && config.WELCOME === "true") {
                await conn.sendMessage(update.id, {
                    text: `╭┄┄┄🌸🌹 *GOODBYE* 🌹🌸┄┄┄⊷
┃
┃ 👋 *See you* @${userName}
┃ 💔 *Left the group*
┃ 👥 *Members:* ${groupMembersCount}
┃
╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷
> ® 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐓𝐲𝐫𝐞𝐱 𝐓𝐞𝐜𝐡`,
                    mentions: [num],
                    contextInfo: getContextInfo({ sender: num }),
                });

            } else if (update.action === "demote" && config.ADMIN_EVENTS === "true") {
                const demoter = update.author.split("@")[0];
                await conn.sendMessage(update.id, {
                    text: `╭┄┄┄🌸🌹 *ADMIN CHANGE* 🌹🌸┄┄┄⊷
┃
┃ 👤 @${demoter}
┃ ⬇️ *Demoted* @${userName} *from admin*
┃
╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷
> ® 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐓𝐲𝐫𝐞𝐱 𝐓𝐞𝐜𝐡`,
                    mentions: [update.author, num],
                    contextInfo: getContextInfo({ sender: update.author }),
                });

            } else if (update.action === "promote" && config.ADMIN_EVENTS === "true") {
                const promoter = update.author.split("@")[0];
                await conn.sendMessage(update.id, {
                    text: `╭┄┄┄🌸🌹 *NEW ADMIN* 🌹🌸┄┄┄⊷
┃
┃ 👤 @${promoter}
┃ ⬆️ *Promoted* @${userName} 👑
┃
╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷
> ® 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐓𝐲𝐫𝐞𝐱 𝐓𝐞𝐜𝐡`,
                    mentions: [update.author, num],
                    contextInfo: getContextInfo({ sender: update.author }),
                });

            } else if (update.action === "restrict" && config.ADMIN_EVENTS === "true") {
                await conn.sendMessage(update.id, {
                    text: `╭┄┄┄🌸🌹 *GROUP UPDATE* 🌹🌸┄┄┄⊷
┃
┃ 🔒 *Restricted Mode Activated*
┃
╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷
> ® 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐓𝐲𝐫𝐞𝐱 𝐓𝐞𝐜𝐡`,
                    contextInfo: getContextInfo({ sender: update.author }),
                });

            } else if (update.action === "announcement" && config.ADMIN_EVENTS === "true") {
                await conn.sendMessage(update.id, {
                    text: `╭┄┄┄🌸🌹 *ANNOUNCEMENT* 🌹🌸┄┄┄⊷
┃
┃ 📢 *Announcement Mode ON*
┃
╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊷
> ® 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐓𝐲𝐫𝐞𝐱 𝐓𝐞𝐜𝐡`,
                    contextInfo: getContextInfo({ sender: update.author }),
                });
            }
        }
    } catch (err) {
        console.error('Group event error:', err);
    }
};

module.exports = GroupEvents;
