const { cmd } = require('../command');
const crypto = require('crypto');
const webp = require('node-webpmux');
const axios = require('axios');
const fs = require('fs-extra');
const { exec } = require('child_process');
const { Sticker, createSticker, StickerTypes } = require("wa-sticker-formatter");
const Config = require('../config');

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

// Take Sticker 
cmd(
    {
        pattern: 'take',
        alias: ['rename', 'stake'],
        desc: 'Create a sticker with a custom pack name.',
        category: 'sticker',
        use: '<reply media or URL>',
        filename: __filename,
    },
    async (conn, mek, m, { quoted, args, q, reply, from, sender }) => {
        try {
            if (!mek.quoted) {
                return reply("*Reply to any sticker.*\n\n> ® Powered by Tyrex Tech");
            }

            if (!q) {
                return reply("*Please provide a pack name using .take <packname>*\n\n> ® Powered by Tyrex Tech");
            }

            let mime = mek.quoted.mtype;
            let pack = q;

            if (mime === "imageMessage" || mime === "stickerMessage") {
                let media = await mek.quoted.download();
                let sticker = new Sticker(media, {
                    pack: pack, 
                    type: StickerTypes.FULL,
                    categories: ["🤩", "🎉"],
                    id: "12345",
                    quality: 75,
                    background: 'transparent',
                });
                const buffer = await sticker.toBuffer();
                return conn.sendMessage(mek.chat, { 
                    sticker: buffer,
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: mek });
            } else {
                return reply("*Uhh, Please reply to an image.*\n\n> ® Powered by Tyrex Tech");
            }
        } catch (error) {
            console.error("Take command error:", error);
            reply(`❌ Error: ${error.message}\n\n> ® Powered by Tyrex Tech`);
        }
    }
);

// Sticker create 
cmd(
    {
        pattern: 'sticker',
        alias: ['s', 'stickergif'],
        desc: 'Create a sticker from an image, video, or URL.',
        category: 'sticker',
        use: '<reply media or URL>',
        filename: __filename,
    },
    async (conn, mek, m, { quoted, args, q, reply, from, sender }) => {
        try {
            if (!mek.quoted) {
                return reply("*Reply to any Image or Video.*\n\n> ® Powered by Tyrex Tech");
            }

            let mime = mek.quoted.mtype;
            let pack = Config.STICKER_NAME || "𝐓𝐘𝐑𝐄𝐗 𝐌𝐃";

            if (mime === "imageMessage" || mime === "stickerMessage") {
                let media = await mek.quoted.download();
                let sticker = new Sticker(media, {
                    pack: pack, 
                    type: StickerTypes.FULL,
                    categories: ["🤩", "🎉"], 
                    id: "12345",
                    quality: 75, 
                    background: 'transparent',
                });
                const buffer = await sticker.toBuffer();
                return conn.sendMessage(mek.chat, { 
                    sticker: buffer,
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: mek });
            } else {
                return reply("*Uhh, Please reply to an image.*\n\n> ® Powered by Tyrex Tech");
            }
        } catch (error) {
            console.error("Sticker command error:", error);
            reply(`❌ Error: ${error.message}\n\n> ® Powered by Tyrex Tech`);
        }
    }
);