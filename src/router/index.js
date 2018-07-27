import Vue from "vue"
import Router from "vue-router"

import Home from "components/home" //首页
import Layout from 'components/layout' //页面布局
import Information from 'components/information' //资讯发布
import Commodity from 'components/commodity' //商品发布
import Classify from 'components/classify' //分类设置
import Material from 'components/material' //素材管理
import Massage from 'components/massage' //消息管理
import Vip from 'components/vip' //会员管理
import Indent from 'components/indent' //订单管理
import Distribution from 'components/distribution' //分销管理
import AllVip from 'components/allVip' //会员管理
import InformationAnalysis from 'components/informationAnalysis' //资讯分析
import CommodityAnalysis from 'components/commodityAnalysis' //商品分析
import AddMaterial from "components/addMaterial"  //添加素材
import UploadMaterial from "components/UploadMaterial"
import Preview from "components/preview"
import Login from "components/login"
import Index from 'components/index'

Vue.use(Router)


let router = new Router({
  // mode: 'history',
  routes: [
    {path:'/',redirect:'/login'},
    {path: "/login", component: Login},
    {path: "/index", component: Index,children:[
        {path: "/home", component: Home},
        {path: "/layout", component: Layout},
        {path: "/information", component: Information},
        {path: "/commodity", component: Commodity},
        {path: "/classify", component: Classify},
        {path: "/material", component: Material },
        {path: "/addMaterial", component: AddMaterial },
        {path: "/uploadMaterial", component: UploadMaterial },
        {path: "/massage", component: Massage},
        {path: "/vip", component: Vip},
        {path: "/indent", component: Indent},
        {path: "/distribution", component: Distribution},
        {path: "/allVip", component: AllVip},
        {path: "/informationAnalysis", component: InformationAnalysis},
        {path: "/commodityAnalysis", component: CommodityAnalysis},

        {path:"/preview",components:Preview}
      ]},
  ]
})
// router.beforeEach((to, from, next) => {
//   // console.log('to:' + to.path)
//   // if (to.path.startsWith('/login')) {
//   //   window.localStorage.removeItem('name')
//   //   next()
//   // } else {
//   //   let user = JSON.parse(window.localStorage.getItem('name'))
//   //   console.log(user)
//   //   if (!user) {
//   //     next({path: '/login'})
//   //   } else {
//   //
//   //
//   //     next()
//   //   }
//   // }
// })
export default router

