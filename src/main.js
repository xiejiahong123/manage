import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import echarts from 'echarts'
import router from "./router"
import axios from "axios"
import {get,post} from 'common/base/http'
import 'common/stylus/variable.styl'
import qs from 'qs'

import 'kindeditor/kindeditor-all-min.js'
import 'kindeditor/themes/default/default.css'
import '../static/UE/ueditor.config.js'
import '../static/UE/ueditor.all.min.js'
import '../static/UE/lang/zh-cn/zh-cn.js'
import '../static/UE/ueditor.parse.min.js'




Vue.use(ElementUI)

Vue.prototype.$echarts = echarts
Vue.prototype.$axios=axios
Vue.prototype.$get=get
Vue.prototype.$post=post
Vue.prototype.$qs=qs
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  axios,
  components: { App },
  template: '<App/>'
})
