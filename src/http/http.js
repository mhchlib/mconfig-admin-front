/**
 * ajax请求配置
 */
import axios from 'axios'
// import apiURL from './api.js'
import { setCookie, getCookie, delCookie } from '../util/cookie'


axios.defaults.timeout =  window.g.AXIOS_TIMEOUT;
axios.defaults.baseURL = window.g.BASE_URL;
// axios默认配置
// axios.defaults.timeout = 10000;   // 超时时间
// axios.defaults.baseURL = apiURL;  // 默认地址

//整理数据
axios.defaults.transformRequest = function (data) {
  data = JSON.stringify(data);
  return data;
};


axios.interceptors.request.use(
  config => {
    //config.data = JSON.stringify(config.data);  
    config.headers['Content-Type'] = 'application/json;charset=UTF-8';

    if (getCookie("token")) {
      config.headers['Authorization'] = getCookie("token")
    }

    return config;
  },
  error => {
    return Promise.reject(error.response);
  });

// 路由响应拦截
// http response 拦截器
var _this = this
axios.interceptors.response.use(
  response => {
    if (response.data.resultCode == "404") {
      // console.log("response.data.resultCode是404")
      // 返回 错误代码-1 清除ticket信息并跳转到登录页面
      //      cookie.del("ticket")
      //      window.location.href='http://login.com'
      return
    } else {
      if (response.data.code == "1003") {
        alert("token 无效")
        // this.$message.error("token 无效");

        //跳转到登陆页面
        window.location.href = "/login";
        return
      }
      return response;
    }
  },
  error => {
    console.log(error)
    if (error.response.status == "403") {
      // this.$message.error("您没有该操作权限");
      alert("您没有该操作权限")
      return
    }
    return Promise.reject(error.response)   // 返回接口返回的错误信息
  });
export default axios;