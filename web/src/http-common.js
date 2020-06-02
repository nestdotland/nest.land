import axios from 'axios';

export const HTTP = axios.create({
    baseURL: `https://api.nest.land/`,
    headers: {
        // Authorization: 'Bearer {token}'
    }
});
