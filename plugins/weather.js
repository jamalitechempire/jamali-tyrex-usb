const axios = require('axios');
const { cmd } = require('../command');
const config = require('../config');

const getContextInfo = (m, ownerName = "𝐓𝐘𝐑𝐄𝐗 𝐌𝐃", formattedOwnerNumber = "255628378557") => {
    return {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363424973782944@newsletter',
            newsletterName: '𝐓𝐘𝐑𝐄𝐗 𝐌𝐃',
            serverMessageId: 143,
        },
        externalAdReply: {
            title: `👑 BOT OWNER: ${ownerName}`,
            body: `wa.me/${formattedOwnerNumber}`,
            mediaType: 1,
            previewType: 0,
            thumbnailUrl: 'https://i.ibb.co/2YRqb2Md/upload-1777244568390-9cc80c1a-jpg.jpg',
            sourceUrl: `https://wa.me/${formattedOwnerNumber}`,
            renderLargerThumbnail: false,
        }
    };
};

cmd({
    pattern: "weather",
    desc: "🌤 Get weather information for a location",
    react: "🌤",
    category: "utility",
    filename: __filename
},
async (conn, mek, m, { from, args, sender, reply }) => {
    try {
        const ownerName = "𝐓𝐘𝐑𝐄𝐗 𝐌𝐃";
        const formattedOwnerNumber = "255628378557";

        if (!args[0]) {
            return reply("Please provide a city name\nExample: .weather London\n\n> ® Powered by Tyrex Tech");
        }

        const city = args.join(' ');
        const apiUrl = `https://apis.davidcyriltech.my.id/weather?city=${encodeURIComponent(city)}`;

        const { data } = await axios.get(apiUrl);

        if (!data.success) {
            return reply("Couldn't fetch weather data for that location\n\n> ® Powered by Tyrex Tech");
        }

        const weatherInfo = `
🌤 *Weather for ${data.data.location}, ${data.data.country}*

🌡 Temperature: ${data.data.temperature}
💭 Feels Like: ${data.data.feels_like}
☁ Weather: ${data.data.weather} (${data.data.description})

💧 Humidity: ${data.data.humidity}
💨 Wind Speed: ${data.data.wind_speed}
📊 Pressure: ${data.data.pressure}

📍 Coordinates: ${data.data.coordinates.latitude}, ${data.data.coordinates.longitude}

> ® Powered by Tyrex Tech
`.trim();

        await conn.sendMessage(from, { 
            text: weatherInfo,
            contextInfo: getContextInfo({ sender: sender }, ownerName, formattedOwnerNumber)
        }, { quoted: mek });

    } catch (error) {
        console.error('Weather Error:', error);
        reply("Failed to fetch weather data. Please try again later.\n\n> ® Powered by Tyrex Tech");
    }
});