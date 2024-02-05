import axios from 'axios';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CustomToastContent from "../componets/CustomToastContent";

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
                if (error.response?.data) {
                    let errorResponse = error.response.data;
                    if (errorResponse.type === 'VALIDATION' && errorResponse.validations.length > 0) {
                        let errors = errorResponse.validations.map((value) => `${value.error}`);
                        if (errors.length === 1) {
                            toast.error(<CustomToastContent content={[...errors]}/>);
                        } else {
                            toast.error(
                                <CustomToastContent content={[errorResponse.errorCode, ...errors]}/>
                            );
                        }
                    } else {
                        if (+errorResponse.errorCode === 0) break;
                        else if (+errorResponse.errorCode > 0 && +errorResponse.errorCode < 9)
                            toast.error(
                                <CustomToastContent content={[errorResponse.errorCode]}/>,
                            );
                        else
                            toast.error(<CustomToastContent content={['apiError']}/>);
                    }
                }
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