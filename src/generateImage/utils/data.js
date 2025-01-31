import { getCurrentDate } from './drawUtils.js';
import path from 'path';
import { fileURLToPath } from 'url';

import { getTonPrice, getTonPriceChange24h, getTonPayout } from '../../API/getTONData.js';
import { getSimpleCoinPrice, fetchSimpleCoinHolders, getSimpleCoinPriceChange24h, getBurnedPercentSimpleCoin } from '../../API/getSCData.js';

const tonPrice = await getTonPrice();
const scPrice = await getSimpleCoinPrice();

const tonPercent = await getTonPriceChange24h();
const scPercent = await getSimpleCoinPriceChange24h();

const scBurned = await getBurnedPercentSimpleCoin();
const { totalAmount } = await getTonPayout();

const { holders } = await fetchSimpleCoinHolders();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const tonImage = path.join(__dirname, '../images/ton.png');
const scImage = path.join(__dirname, '../images/sc.png');
const burnImage = path.join(__dirname, '../images/burn.png');
const rewardImage = path.join(__dirname, '../images/reward.png');
const holderImage = path.join(__dirname, '../images/holders.png');
const dateImage = path.join(__dirname, '../images/date.png');

export const WIDTH = 700;
export const HEIGHT = 450;

export const BACKGROUND_COLOR = ['#1C1C1C', '#000000']; // Градиент темно-серый → черный
export const BUTTON_COLOR = ['#DEC707', '#FFA500']; // Градиент желтый → оранжевый
export const TEXT_COLOR = '#FFFFFF';

export const BUTTON_WIDTH = 300;
export const BUTTON_HEIGHT = 100;
export const BUTTON_RADIUS = 25;
export const BUTTON_GAP = 30;
export const COLUMN_GAP = 30;
export const BUTTONS_PER_COLUMN = 3;

export const IMAGE_WIDTH = 70;
export const IMAGE_HEIGHT = 70;
export const IMAGE_MARGIN = 15;

export const buttons = [
    { value: '$' + scPrice.toFixed(6), extra: scPercent + '%', image: scImage, isPrice: true },
    { value: '$' + tonPrice, extra: tonPercent + '%', image: tonImage, isPrice: true },

    { title: '$SC Burned', value: scBurned.toFixed(2), image: burnImage },
    { title: 'TON Payout', value: totalAmount.toFixed(2), image: rewardImage },

    { title: 'Holders', value: holders, image: holderImage },
    { title: 'Date', value: getCurrentDate(), image: dateImage },
];