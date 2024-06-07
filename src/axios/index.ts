import _axios from 'axios';


export const axios = _axios.create({})
axios.interceptors.response.use((res) => {
    return res.data
},  (error) => {
    console.log(error);
})