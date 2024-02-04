import axios from 'axios';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const instance = Object.assign(
    axios.create({
        baseURL: `${process.env.REACT_APP_API_URL}`,
    }),
    {}
);

//instance.defaults.headers.post['Content-Type'] = 'aplication/json';

instance.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('token');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

instance.interceptors.response.use(
    (response) => response.headers.get('Authorization') ?
        sessionStorage.setItem('token', response.headers.get('Authorization')) : response.data,
    (error) => {
        switch (error.response?.status) {
            case 400: {
                toast.error(error.response.data.detail);
                break;
            }
            case 403: {
                sessionStorage.removeItem('token');
                break;
            }
            case 404: {
                console.log('Server Connection Error:', error.response?.data);
                break;
            }
            //Dev only
            case 500 - 599: {
                console.log('Server Connection Error:', error.response?.data);
                break;
            }
            default: {
                console.log('Unmapped error', error.response?.data);
            }
        }
        return error.response?.data;
    }
);

export default instance;