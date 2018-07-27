<template>
  <div class="container">
    <my-header/>
    <el-container>
      <el-aside>
        <my-menu/>
      </el-aside>
      <el-main>

        <router-view></router-view>
      </el-main>
    </el-container>

  </div>
</template>

<script>
  import MyHeader from 'components/header'
  import MyMenu from 'components/menu'

  export default {
    name: 'index',
    components: {
      MyHeader,
      MyMenu
    }
  }
</script>


<style scoped lang="stylus">
  .container
    width 1400px
    margin 0 auto
</style>
