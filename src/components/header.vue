<template>
    <div>

      <div class="header" >
        <div class="left">
          <img src="../assets/logo.png" alt="">
          <span>一未堂健康助理后台管理系统</span>
        </div>
        <div class="right">
          <span>管理员：admin</span>
        </div>
      </div>
    </div>
</template>

<script>
    export default {
        name: "my-header"
    }
</script>

<style scoped  lang="stylus">
  @import "~common/stylus/variable"
  .left
    color #333333
    font-size $font-size-large-x
    display flex
    align-items center
    justify-content flex-start
    padding 0 30px
    flex 10
  .header
    line-height 80px
    height 80px
    background #fff
    display flex
    justify-content space-around
  .right
    flex 2
    font-size 20px
    color #409EFF
</style>
