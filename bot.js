import TelegramBot from 'node-telegram-bot-api';
import cron from 'node-cron';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { generateImage } from './src/generateImage/generate.js';

dotenv.config();

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
const CHANNEL_ID = '-1002429972793';

const keyboard = {
    reply_markup: {
        inline_keyboard: [
            [{ text: '📊 GeckoTerminal 📚', url: 'https://www.geckoterminal.com/ru/ton/pools/EQCfCyLLCOq_bw_Ge1C1pMlSo7dqFUVSsmNKP4osxoxTxCZo' }],
            [{ text: '💸 Swap DeDust 🪙', url: 'https://dedust.io/swap/TON/EQB9QBqniFI0jOmw3PU6v1v4LU3Sivm9yPXDDB9Qf7cXTDft' }]
        ]
    }
};

function deleteImage(filePath) {
    try {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`🗑 Файл удалён: ${filePath}`);
        }
    } catch (error) {
        console.error(`❌ Ошибка при удалении файла: ${error}`);
    }
}

bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;

    try {
        console.log(`📩 Генерация изображения для пользователя ${chatId}...`);
        const imagePath = await generateImage();

        if (fs.existsSync(imagePath)) {
            await bot.sendPhoto(chatId, fs.createReadStream(imagePath), {
                caption: '📊 Актуальная информация',
                ...keyboard
            });
            console.log(`✅ Изображение отправлено пользователю ${chatId}`);
        } else {
            console.error('❌ Ошибка: Файл изображения не найден.');
            bot.sendMessage(chatId, 'Ошибка при генерации изображения.');
        }

        deleteImage(imagePath); 
    } catch (error) {
        console.error('❌ Ошибка при отправке изображения:', error);
        bot.sendMessage(chatId, 'Ошибка при отправке изображения.');
    }
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

        deleteImage(imagePath); 
    } catch (error) {
        console.error('❌ Ошибка при отправке изображения:', error);
    }
}

cron.schedule('0 7 * * *', async () => {
    await sendImageToChannel();
});

cron.schedule('10 19 * * *', async () => {
    await sendImageToChannel();
});

console.log('🤖 Бот запущен!');