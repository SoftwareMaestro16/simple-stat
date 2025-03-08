import axios from "axios";

export const SIMPLE_COIN_ADDRESS = 'EQB9QBqniFI0jOmw3PU6v1v4LU3Sivm9yPXDDB9Qf7cXTDft';

/**
 * @returns {Promise<{ price: number|null, fdv_usd: number|null }>} 
 */
export async function getSimpleCoinPrice() {
    const API_URL = `https://api.geckoterminal.com/api/v2/networks/ton/tokens/${SIMPLE_COIN_ADDRESS}`;

    try {
        const response = await axios.get(API_URL);
        const price = response.data.data.attributes.price_usd;
        const fdv = response.data.data.attributes.fdv_usd;

        return {
            price: price ? parseFloat(price) : null,     
            fdv_usd: fdv ? parseFloat(fdv) : null,       
        };
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

    const INITIAL_SUPPLY = 100_000_000; 

    try {
        const responseSupply = await axios.get(API_URL_SUPPLY);
        const responseBurned = await axios.get(API_URL_BURNED);

        const currentSupply = responseSupply.data.total_supply / 10**9;
        const burnedOnAddress = responseBurned.data.balance / 10**9;

        const burnedTotal = (INITIAL_SUPPLY - currentSupply) + burnedOnAddress;
        const burnedPercentage = (burnedTotal / INITIAL_SUPPLY) * 100;

        return burnedPercentage.toFixed(2) + '%';
    } catch (error) {
        console.error("Error fetching burned tokens:", error);
        return null;
    }
}