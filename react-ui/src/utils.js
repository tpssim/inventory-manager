import axios from 'axios';

const availabilityRequestCreator = () => {
    let tokens = new Map();

    return async (manufacturer) => {
        // Check for previous request
        if (tokens.has(manufacturer)) {
            // Cancel previous request
            tokens.get(manufacturer).cancel();
        }

        const token = axios.CancelToken.source();
        tokens.set(manufacturer, token);

        // Try 4 times
        for (var attempt = 1; attempt < 5; attempt++) {
            try {
                const res = await axios.get('/api/availability/' + manufacturer, { cancelToken: token.token });
                const result = new Map(res.data.map(item => [item.id, item.availability]));
                return result;
            } catch (err) {
                if (axios.isCancel(err)) {
                    console.log('Availability request canceled');
                    return;
                } else {
                    console.log(err);
                }
            }
        }
    }
}


const productRequestCreator = () => {
    let token;

    return async (category) => {
        // Check for previous request
        if (token) {
            // Cancel previous request
            token.cancel();
        }

        token = axios.CancelToken.source();

        try {
            const res = await axios.get('/api/products/' + category, { cancelToken: token.token });
            const result = res.data;
            return result;
        } catch (err) {
            if (axios.isCancel(err)) {
                console.log('Availability request canceled');
            } else {
                console.log(err);
            }
        }
    }
}

export const availabilityRequest = availabilityRequestCreator();
export const productRequest = productRequestCreator();