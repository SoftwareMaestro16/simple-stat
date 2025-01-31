import { loadImage } from 'canvas';
import fs from 'fs';
import path from 'path';

export function drawRoundedRect(ctx, x, y, width, height, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + width, y, x + width, y + height, radius);
    ctx.arcTo(x + width, y + height, x, y + height, radius);
    ctx.arcTo(x, y + height, x, y, radius);
    ctx.arcTo(x, y, x + width, y, radius);
    ctx.closePath();
    ctx.fill();
}

export function getCurrentDate() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = String(now.getFullYear()).slice(-2);
    return `${day}.${month}.${year}`;
}

export async function drawImageIfExists(ctx, image, x, y, width, height) {
    const imgPath = path.resolve('assets', image);
    if (fs.existsSync(imgPath)) {
        try {
            const img = await loadImage(imgPath);
            ctx.drawImage(img, x, y, width, height);
        } catch (error) {
            console.error(`Ошибка загрузки изображения: ${image}`, error);
        }
    }
}