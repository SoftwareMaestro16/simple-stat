import { createCanvas, registerFont } from 'canvas';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { drawRoundedRect, drawImageIfExists } from './utils/drawUtils.js';
import { WIDTH, HEIGHT, BACKGROUND_COLOR, BUTTON_COLOR, TEXT_COLOR, BUTTON_WIDTH, BUTTON_HEIGHT, BUTTON_RADIUS, BUTTON_GAP, COLUMN_GAP, BUTTONS_PER_COLUMN, IMAGE_WIDTH, IMAGE_HEIGHT, IMAGE_MARGIN, getDynamicData } from './utils/data.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

registerFont(path.resolve(__dirname, '../Fonts/AEROPORT.OTF'), { family: 'AEROPORT' });

export async function generateImage() {
    const timestamp = Date.now();
    const outputDir = path.resolve('output');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    const outputPath = path.resolve(outputDir, `image_${timestamp}.png`);
    const tempPath = path.resolve(outputDir, `temp_${timestamp}.png`);
    const canvas = createCanvas(WIDTH, HEIGHT);
    const ctx = canvas.getContext('2d');

    // Динамически получаем данные перед отрисовкой
    const buttons = await getDynamicData();

    const bgGradient = ctx.createLinearGradient(0, 0, 0, HEIGHT);
    bgGradient.addColorStop(0, BACKGROUND_COLOR[0]);
    bgGradient.addColorStop(1, BACKGROUND_COLOR[1]);
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    const totalButtonsHeight = BUTTONS_PER_COLUMN * BUTTON_HEIGHT + (BUTTONS_PER_COLUMN - 1) * BUTTON_GAP;
    const startY = (HEIGHT - totalButtonsHeight) / 2;
    const startXLeft = (WIDTH / 2) - BUTTON_WIDTH - (COLUMN_GAP / 2);
    const startXRight = (WIDTH / 2) + (COLUMN_GAP / 2);

    const buttonPositions = buttons.map((button, index) => ({
        ...button,
        x: index % 2 === 0 ? startXLeft : startXRight,
        y: startY + Math.floor(index / 2) * (BUTTON_HEIGHT + BUTTON_GAP),
    }));

    ctx.font = 'bold 24px "AEROPORT"';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';

    for (const { x, y, title, value, extra, image, isPrice } of buttonPositions) {
        const buttonGradient = ctx.createLinearGradient(x, y, x + BUTTON_WIDTH, y + BUTTON_HEIGHT);
        buttonGradient.addColorStop(0, BUTTON_COLOR[0]);
        buttonGradient.addColorStop(1, BUTTON_COLOR[1]);
        ctx.fillStyle = buttonGradient;
        drawRoundedRect(ctx, x, y, BUTTON_WIDTH, BUTTON_HEIGHT, BUTTON_RADIUS, buttonGradient);

        const imageX = x + IMAGE_MARGIN;
        const imageY = y + (BUTTON_HEIGHT - IMAGE_HEIGHT) / 2;
        drawRoundedRect(ctx, imageX, imageY, IMAGE_WIDTH, IMAGE_HEIGHT, 10);
        await drawImageIfExists(ctx, image, imageX, imageY, IMAGE_WIDTH, IMAGE_HEIGHT);

        const textX = imageX + IMAGE_WIDTH + IMAGE_MARGIN;
        ctx.fillStyle = TEXT_COLOR;
        if (isPrice) {
            ctx.font = 'bolder 26px "AEROPORT"';
            ctx.fillText(value, textX, y + BUTTON_HEIGHT / 3);
            if (extra) {
                ctx.font = 'bold 23px "AEROPORT"';
                ctx.fillText(extra, textX, y + 2 * (BUTTON_HEIGHT / 3));
            }
        } else {
            ctx.font = 'bold 26px "AEROPORT"';
            ctx.fillText(title, textX, y + BUTTON_HEIGHT / 3);
            ctx.font = 'bold 26px "AEROPORT"';
            ctx.fillText(value, textX, y + 2 * (BUTTON_HEIGHT / 3));
        }
    }

    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(tempPath, buffer);
    await sharp(tempPath)
        .withMetadata({
            exif: {
                IFD0: {
                    Software: `Anti-Telegram-Cache ${timestamp}`
                }
            }
        })
        .toFile(outputPath);
    fs.unlinkSync(tempPath);
    console.log(`✅ Изображение сохранено: ${outputPath}`);
    return outputPath;
}