<template>
  <div class="menu">
    <el-row class="tac" >
      <el-col  >
        <el-menu default-active="/home" class="el-menu-vertical-demo" @open="handleOpen" :router="true" @close="handleClose" :default-openeds="['home','2', '3','4']" >
          <el-menu-item index="/home" >
            <!--<i class="el-icon-tickets"></i>-->
            <img src="../assets/home-icon.png" alt="" class="left-icon">
            <span slot="title" class="title-text">首页</span>
          </el-menu-item>
          <el-submenu index="2" >
            <template slot="title" >
              <img src="../assets/fun-icon.png" alt="" class="left-icon">
              <span class="title-text">功能</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/layout" >页面布局</el-menu-item>
              <el-menu-item index="/information">资讯发布</el-menu-item>
              <el-menu-item index="/commodity">商品发布</el-menu-item>
              <el-menu-item index="/classify">分类设置</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="3" >
            <template slot="title">
              <img src="../assets/manager-icon.png" alt="" class="left-icon">
              <span class="title-text">分类</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/material">素材管理</el-menu-item>
              <el-menu-item index="/massage">消息管理</el-menu-item>
              <el-menu-item index="/vip">会员管理</el-menu-item>
              <el-menu-item index="/indent">订单管理</el-menu-item>
              <el-menu-item index="/distribution">分销管理</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="4">
            <template slot="title">
              <img src="../assets/statistics-icon.png" alt="" class="left-icon">
              <span class="title-text">统计</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/allVip">会员统计</el-menu-item>
              <el-menu-item index="/informationAnalysis">资讯分析</el-menu-item>
              <el-menu-item index="/commodityAnalysis">商品分析</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: "my-menu",
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      }
    }
  }
</script>

<style scoped lang="stylus">
  .menu
    padding 20px
    padding-left 0
    color #fe6554
  .left-icon
    margin-right 10px
    width 22px
    height 22px
  .title-text
    font-weight 600
</style>
