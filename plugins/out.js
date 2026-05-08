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
        }
    };
};

cmd({
    pattern: "out",
    alias: ["ck", "🦶"],
    desc: "Removes all members with specific country code from the group",
    category: "admin",
    react: "❌",
    filename: __filename
},
async (conn, mek, m, {
    from, q, isGroup, isBotAdmins, groupMetadata, isCreator, sender, reply
}) => {
    if (!isGroup) {
        return reply("This command can only be used in groups.\n\n> ® Powered by Tyrex Tech");
    }

    if (!isCreator) {
        return reply("*📛 This is an owner command.*\n\n> ® Powered by Tyrex Tech");
    }

    if (!isBotAdmins) {
        return reply("I need to be an admin to use this command.\n\n> ® Powered by Tyrex Tech");
    }

    if (!q) {
        return reply("Please provide a country code. Example: .out 92\n\n> ® Powered by Tyrex Tech");
    }

    const countryCode = q.trim();
    if (!/^\d+$/.test(countryCode)) {
        return reply("Invalid country code. Please provide only numbers (e.g., 92 for +92 numbers)\n\n> ® Powered by Tyrex Tech");
    }

    try {
        const participants = await groupMetadata.participants;
        const targets = participants.filter(
            participant => participant.id.startsWith(countryCode) && !participant.admin
        );

        if (targets.length === 0) {
            return reply(`No members found with country code +${countryCode}\n\n> ® Powered by Tyrex Tech`);
        }

        const jids = targets.map(p => p.id);
        await conn.groupParticipantsUpdate(from, jids, "remove");

        await conn.sendMessage(from, { 
            text: `✅ Successfully removed ${targets.length} members with country code +${countryCode}\n\n> ® Powered by Tyrex Tech`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: mek });

    } catch (error) {
        console.error("Out command error:", error);
        reply(`Failed to remove members. Error: ${error.message}\n\n> ® Powered by Tyrex Tech`);
    }
});