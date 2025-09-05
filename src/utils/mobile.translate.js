import axios from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

export const translate = async (text, target) => {
    const options = {
        method: 'POST',
        url: 'https://deep-translate1.p.rapidapi.com/language/translate/v2',
        headers: {
            'x-rapidapi-key': API_KEY,
            'x-rapidapi-host': 'deep-translate1.p.rapidapi.com',
            'Content-Type': 'application/json'
        },
        data: {
            q: text,
            source: 'en',
            target: target
        }
    };

    try {
        const response = await axios.request(options);
        return response.data.data.translations.translatedText;
    } catch (error) {
        console.error(error);
        return null;
    }
}
