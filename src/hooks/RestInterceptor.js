import axios from 'axios';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CustomToastContent from "../componets/CustomToastContent";
import {QueryClient} from "@tanstack/react-query";

export const queryClient = new QueryClient();

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
                            toast.error(<CustomToastContent translated content={[...errors]}/>);
                        } else {
                            toast.error(
                                <CustomToastContent translated content={[errorResponse.error, ...errors]}/>
                            );
                        }
                    } else {
                        if (+errorResponse.errorCode === 0){
                            toast.error(
                                <CustomToastContent translated content={[errorResponse.error]}/>,
                            );
                        }
                        else if (+errorResponse.errorCode > 0 && +errorResponse.errorCode < 9)
                            toast.error(
                                <CustomToastContent translated content={[errorResponse.error]}/>,
                            );
                        else
                            toast.error(<CustomToastContent translated content={['apiError']}/>);
                    }
                }
                break;
            }
            case 401: {
                console.log('ERROR STATUS', error.response.status, 'REDIRECT TO LOGIN');
                sessionStorage.removeItem('token');
                sessionStorage.removeItem('username');
                window.location.href = '/login';
                break;
            }
            case 403: {
                toast.error(<CustomToastContent translated content={['forbidden']}/>);
                break;
            }
            case 404: {
                toast.error(<CustomToastContent translated content={['serviceNotFound']}/>);
                console.log('Server Connection Error:', error.response?.data);
                break;
            }
            //Dev only
            case 500 - 599: {
                toast.error(<CustomToastContent translated content={['serviceNotFound']}/>);
                console.log('Server Connection Error:', error.response?.data);
                break;
            }
            default: {
                console.log('Unmapped error', error.response?.data);
            }
        }
        throw error;
    }
);

export default instance;