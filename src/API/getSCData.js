import axios from "axios";

export const SIMPLE_COIN_ADDRESS = 'EQB9QBqniFI0jOmw3PU6v1v4LU3Sivm9yPXDDB9Qf7cXTDft';

/**
 * @returns {Promise<number|null>} 
 */
export async function getSimpleCoinPrice() {
    const API_URL = `https://api.geckoterminal.com/api/v2/networks/ton/tokens/${SIMPLE_COIN_ADDRESS}`;

    try {
        const response = await axios.get(API_URL);
        const price = response.data.data.attributes.price_usd;

        return price ? parseFloat(price) : null;
    } catch (error) {
        console.error("Error fetching jetton price:", error);
        throw new Error("Failed to fetch jetton price");
    }
}

export async function fetchSimpleCoinHolders() {
    try {
        const tonApiResponse = await fetch(`https://tonapi.io/v2/jettons/${SIMPLE_COIN_ADDRESS}`);
        const tonApiData = await tonApiResponse.json();

        return {
            holders: tonApiData.holders_count,
        };
    } catch (error) {
        console.error('Ошибка при загрузке количества держателей:', error);
        return {
            holders: null,
        };
    }
}

export async function getSimpleCoinPriceChange24h() {
    const API_URL = `https://api.geckoterminal.com/api/v2/networks/ton/tokens/${SIMPLE_COIN_ADDRESS}/pools?page=1`;

    try {
        const response = await axios.get(API_URL);
        const priceChange = response.data.data[0]?.attributes?.price_change_percentage?.h24;

        return priceChange ? parseFloat(priceChange) : null;
    } catch (error) {
        console.error("Error fetching 24h price change:", error);
        return null;
    }
}

export async function getBurnedPercentSimpleCoin() {
    const API_URL_SUPPLY = `https://tonapi.io/v2/jettons/${SIMPLE_COIN_ADDRESS}`;
    const API_URL_BURNED = `https://tonapi.io/v2/accounts/0%3A0000000000000000000000000000000000000000000000000000000000000000/jettons/${SIMPLE_COIN_ADDRESS}?currencies=ton,usd,rub&supported_extensions=custom_payload`;
    
    try {
        const responseSupply = await axios.get(API_URL_SUPPLY);
        const responseBurned = await axios.get(API_URL_BURNED);

        const totalSupply = responseSupply.data.total_supply / 10**9;
        const burned = responseBurned.data.balance / 10**9;
        const burnedPercentage = (burned / totalSupply) * 100;

        return burnedPercentage.toFixed(2) + '%';
    } catch (error) {
        console.error("Error fetching 24h price change:", error);
        return null;
    }
}