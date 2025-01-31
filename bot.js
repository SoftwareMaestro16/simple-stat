import TelegramBot from 'node-telegram-bot-api';
import cron from 'node-cron';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { generateImage } from './src/generateImage/generate.js';

dotenv.config();

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
const CHANNEL_ID = '-1002389898813';
const OUTPUT_IMAGE_PATH = path.resolve('output', 'image.png');

const keyboard = {
    reply_markup: {
        inline_keyboard: [
            [{ text: '📊 GeckoTerminal 📚', url: 'https://www.geckoterminal.com/ru/ton/pools/EQCfCyLLCOq_bw_Ge1C1pMlSo7dqFUVSsmNKP4osxoxTxCZo' }],
            [{ text: '💸 Swap DeDust 🪙', url: 'https://dedust.io/swap/TON/EQB9QBqniFI0jOmw3PU6v1v4LU3Sivm9yPXDDB9Qf7cXTDft' }]
        ]
    }
};

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, 'Привет!');
});

async function sendImageToChannel() {
    try {
        console.log('⏳ Генерация изображения...');
        const imagePath = await generateImage();

        if (fs.existsSync(imagePath)) {
            await bot.sendPhoto(CHANNEL_ID, fs.createReadStream(imagePath), {
                ...keyboard
            });
            console.log('✅ Изображение отправлено в канал.');
        } else {
            console.error('❌ Ошибка: Файл изображения не найден.');
        }
    } catch (error) {
        console.error('❌ Ошибка при отправке изображения:', error);
    }
}

cron.schedule('* * * * *', async () => {
    await sendImageToChannel();
});

console.log('🤖 Бот запущен!');