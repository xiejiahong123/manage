<template>
  <div class="container-login">
    <div class="header" >
      <div class="header-wrapper">
        <img src="../assets/logo.png" alt="">
        <span>一未堂健康助理后台管理系统</span>
      </div>
    </div>
    <div class="wrapper">
      <div class="wrapper-content">
        <p>登录</p>
        <div class="user">
          <i><img src="../assets/user-icon.png" alt=""></i>
          <input type="text" placeholder="账号" v-model="input1" class="input-class">
        </div>
        <div class="password">
          <i><img src="../assets/password-cion.png" alt=""></i>
          <input type="password" placeholder="密码" v-model="input2" class="input-class">

        </div>
        <div class="submit">
          <el-button type="primary" @click="sunmit">登录</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from "axios"
  export default {
    name: "login",
    data() {
      return {
        input1: '',
        input2: ''
      }
    },
    methods:{
      sunmit(){
        let data=this.$qs.stringify({
          account :this.input1,
          password:this.input2
        })
        // axios.post("../../HealthAssistant/admin/login",data).then(res=>{
        axios.post("/HealthAssistant/admin/login",data).then(res=>{
          console.log(res)
            this.$router.push({path: '/home'});
            // this.router.push({path:'/home'})

        }).catch(err=>{
          this.$router.push({path: '/home'});
          console.log(err)
        })
      }
    }
  }
</script>

<style scoped lang="stylus">

  .wrapper
    background url("../assets/login-bg.png")
    height 480px
    position relative
    width 1400px
    margin 0 auto
    margin-top 50px
    .wrapper-content
      position: absolute
      bottom 100px
      right 40px
      width 400px
      padding 20px
      background #fff
      height 260px
      .user
        display flex
        align-items center
        position relative
        i
          position absolute
          left 10px
      .password
        display flex
        align-items center
        margin-top 20px
        position relative
        i
          position absolute
          left 10px
      .submit
        margin-top 50px
        text-align center
  .input-class
    width 100%
    height 40px
    border 1px solid #d6d6d6
    border-radius 6px
    padding-left 50px
    &:focus
      border 1px solid #d6d6d6
      outline none
  .header
    display flex
    align-items center
    height 80px
    background #fff
    border-bottom 1px solid #d8d8d8
    .header-wrapper
      width 1400px
      margin 0 auto
      display flex
      align-items center


</style>
