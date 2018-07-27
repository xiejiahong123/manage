<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import MyHeader from 'components/header'
import MyMenu from 'components/menu'

export default {
  name: 'App',
  components: {
    MyHeader,
    MyMenu
  }
}
</script>

<style lang="stylus">
  #app
    background #f6f8f9
  .el-main
    background #fff
    margin-top 20px

</style>
