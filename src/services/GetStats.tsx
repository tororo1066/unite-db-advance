import {Stat} from "../data/Stat.tsx";

const url = import.meta.env.VITE_APP_CORS_ANYWHERE + "https://unite-db.com/stats.json";

const GetStats = async () => {
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0',
        },
        mode: 'cors',
    });
    if (response.ok) {
        return await response.json() as Stat[];
    } else {
        return undefined;
    }
}

export default GetStats;
