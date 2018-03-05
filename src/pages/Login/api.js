import axios from 'axios';

export  const LoginApi = (params, headers) => {
    return axios.post("/Loginfo/Login",  params,  ).then(res => {console.log(res); return res.data} );
}