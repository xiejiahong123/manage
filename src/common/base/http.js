import axios from 'axios'

axios.defaults.timeout=5000
axios.defaults.baseUrl=''

//http request 拦截器
axios.interceptors.request.use(config => {
  console.log(config)
    return config;
  },
  error => {
    return Promise.reject(err);
  }
);
//http response 拦截器
axios.interceptors.response.use(
  response => {
    console.log(response)
    // if(response.data.errCode ==2){
    //   router.push({
    //     path:"/login",
    //     querry:{redirect:router.currentRoute.fullPath}//从哪个页面跳转
    //   })
    // }
    return response;
  },
  error => {
    return Promise.reject(error)
  }
)

/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */

export function get(url,params={}){
  return new Promise((resolve,reject) => {
    axios.get(url,{
      params:params
    })
      .then(response => {
        console.log(response)
        resolve(response.data);
      })
      .catch(err => {
        if(err.response.status==666){
          this.$router.push({path: '/login'});
        }else{
          reject(err)
        }

      })
  })
}
/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function post(url,data){
  return new Promise((resolve,reject) => {
    axios.post(url,this.$qs.stringify(data) )
      .then(response => {
        resolve(response.data);
      },err => {
        if(err.response.status==666){
          this.$router.push({path: '/login'});
        }else{
          reject(err)
        }

      })
  })
}
