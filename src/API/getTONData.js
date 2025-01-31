import axios from 'axios';

/**
 * @returns {Promise<number|null>} 
 */
export async function getTonPrice() {
    const API_URL = 'https://api.geckoterminal.com/api/v2/networks/ton/tokens/EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c';

    try {
        const response = await axios.get(API_URL);
        const price = response.data?.data?.attributes?.price_usd;

        return price ? parseFloat(price) : null;
    } catch (error) {
        console.error('Ошибка получения цены TON:', error.message);
        return null;
    }
}

export async function getTonPriceChange24h() {
    const API_URL = 'https://api.geckoterminal.com/api/v2/networks/ton/tokens/EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c/pools?page=1';

    try {
        const response = await axios.get(API_URL);
        const priceChange24h = response.data?.data?.[0]?.attributes?.price_change_percentage?.h24;

        return priceChange24h ? parseFloat(priceChange24h) : null;
    } catch (error) {
        console.error('Ошибка при получении процентного изменения цены TON:', error.message);
        return null;
    }
}

export async function getTonPayout() {
    const currentTime = Math.floor(Date.now() / 1000);
    const time24HoursAgo = currentTime - 86400;

    const API_URL = `https://tonapi.io/v2/accounts/UQAIzv6xr4aaD7KbGVRQV0-opbk1SsGthjT53JP4vERhFoJy/events?initiator=true&limit=10&start_date=${time24HoursAgo}&end_date=${currentTime}`;

    try {
        const response = await axios.get(API_URL);
        const events = response.data?.events || [];

        let totalAmount = 0;
        let transactionCount = 0;

        events.forEach(event => {
            if (event.actions && Array.isArray(event.actions)) {
                event.actions.forEach(action => {
                    if (action.type === "TonTransfer" && action.TonTransfer?.amount) {
                        totalAmount += action.TonTransfer.amount;
                        transactionCount++;
                    }
                });
            }
        });

        totalAmount /= 10**9;

        console.log(`Общая сумма отправленных TON: ${totalAmount}`);
        console.log(`Количество транзакций: ${transactionCount}`);

        return { totalAmount, transactionCount };
    } catch (error) {
        console.error('Ошибка при получении выплат:', error.message);
        return { totalAmount: 0, transactionCount: 0 };
    }
}