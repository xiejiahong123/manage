<template>
  <div class="home">
    <section class="section section1">
      <div class="title">会员整体情况</div>
      <div class="section1-content">
        <div class="classes">
          <p>会员总数</p>
          <p>{{dataList.headcount}}</p>
        </div>
        <div class="classes">
          <p>当前在线</p>
          <p>{{dataList.online}}</p>
        </div>
        <div class="classes">
          <p>今日订单</p>
          <p>{{dataList.todayOrder}}</p>
        </div>
      </div>
    </section>
    <section class="section section1">
      <div class="title">最近编辑</div>
      <div class="section2-content">
        <div class="list" v-for="item in dataList.materialManagementList">
          <p class="mini-title">
            <span>{{item.type==1?"健康资讯":"养生课堂"}}</span>
            <span>{{item.updatetime|formatTime}}</span>
          </p>
          <div class="details" >
            <div><img :src="item.image" alt="watchDetail"></div>
            <div>
              {{item.desciption}}
            </div>
            <div>
              <!--<span>编辑</span>-->
              <!--<span>发布</span>-->
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="section section1">
      <div class="title">最近发布</div>
      <div class="section3-content">
        <div class="list"  v-for="item in dataList.showInforList">
          <p class="mini-title">
            <span>{{item.type==1?"健康资讯":"养生课堂"}}</span>
            <span>{{item.updateTime|formatTime}}</span>
          </p>
          <div class="details" @click="watchDetail">
            <div><img :src="item.image" alt=""></div>
            <div>
              {{item.description}}
            </div>
            <div>
              <!--<span>修改</span>-->
              <!--<span>删除</span>-->
            </div>
          </div>
        </div>
      </div>
    </section>

    <el-dialog title="预览" :visible.sync="centerDialogVisible" width="30%" center>
      <div class="wrapper-detail">

      </div>

    <!--<el-button @click="centerDialogVisible = false">取 消</el-button>-->
        <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>

    </el-dialog>
  </div>
</template>

<script>

  import {formatTime} from "../common/base/utils";
  import axios from "axios"
  export default {
    name: "home",
    data(){
      return{
        dataList: {},
        centerDialogVisible: false
      }
    },
    filters:{
      formatTime(val){
        return formatTime(val,"Y-M-D h:m")
      }
    },
    mounted(){
      this.mounted()
    },
    methods: {
      watchDetail:function(){
        this.centerDialogVisible=true
      },
      mounted:function (e) {

        this.$get("/HealthAssistant/manage/homepage/getHomepageInfo").then(res=>{
          console.log(res)
          this.dataList=res
        }).catch( (err) =>{
          console.log(err)
        })
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable"
  .section
    background: $base-background
    margin-top 30px
    border 1px solid #dcdcdc
    padding 24px 40px

  .title
    font-size $font-size-large
    color #333

  .section1-content
    display flex
    margin-top 20px
    .classes
      flex 1
      text-align center
      p:first-child
        font-size $font-size-small-s
        color #666
      p:last-child
        font-weight bold
        font-size $font-size-large-x

  .details
    display flex
    background #f4f5f9
    padding 10px
    &:hover
      cursor pointer
    div:first-child
      flex 1
      img
        width 180px
        height 100px
    div:nth-child(2)
      padding-left 20px
      flex 9
    div:last-child
      display flex
      align-items center
      justify-content center
      flex 2
      align-items center
      vertical-align middle
      text-align center
      color #4a90e2
      span
        margin 10px

  .mini-title
    font-size $font-size-small-s
</style>
