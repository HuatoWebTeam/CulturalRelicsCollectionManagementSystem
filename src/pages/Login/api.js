import axios from 'axios';

export  const LoginApi = (params, headers) => {
    return axios.get("/Loginfo/Login", { params: params }, {headers: headers} ).then(res => {console.log(res); return res.data} );
}