import axios from 'axios';

export  const LoginApi = (params, headers) => {
    return axios.post("/Loginfo/Login",  params,  ).then(res => {console.log(res); return res.data} );
}
export const getUserIp = () => {
    return axios
      .get("//freegeoip.net/json/?callback=?")
      .then(res => res.data);
}