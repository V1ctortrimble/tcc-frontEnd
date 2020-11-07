import { notification } from 'antd';
import axios from 'axios';

const baseURL = 'http://localhost:8080/'

const api = axios.create({

    baseURL: baseURL
});

    api.interceptors.request.use(function (config) {
        if(localStorage.getItem('token')){
            config.headers.authorization = localStorage.getItem('token')
        }
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });

 api.interceptors.response.use((response) => {
      return response;
  },
  async function (error) {
      if (error.response.status === 500){
          notification.warning({
              message: "Sessão expirada",
              description: "Faça login novamente"
          })
          localStorage.setItem('token','');
          return error;     
      }
      return Promise.reject(error);
  });
export default api;

