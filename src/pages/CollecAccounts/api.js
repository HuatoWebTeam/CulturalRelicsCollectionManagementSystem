import axios from 'axios';

export const AccountAll = params => {
  return axios.post("/Accoun/AccountAll", params).then(res => res.data)
};