<template>
  <div>
    <div class="search">
      <el-input placeholder="请输入内容" prefix-icon="el-icon-search" v-model="input1"> <el-button slot="append" icon="el-icon-search" @click="search"></el-button></el-input>
    </div>
    <el-table :data="tableData" stripe style="width: 100%" >
      <el-table-column prop="nickname" label="昵称"></el-table-column>
      <el-table-column prop="mobile" label="绑定的手机号" ></el-table-column>
      <el-table-column prop="lastLoginTime" label="最近登录时间" :formatter="fromatTime"></el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination background layout="prev, pager, next" :total="count" @current-change="changePage" :page-size="12"  ></el-pagination>
    </div>
  </div>
</template>

<script>
  import {formatTime} from 'common/base/utils'
  export default {
    name: "massage",
    data() {
      return {
        tableData: [],
        input1:"",
        count:0,
      }
    },
    mounted(){
      this.init()
    },
    methods:{
      init(){
        this.$get("/HealthAssistant/manage/memberWechat/getMembers",{page:1}).then(res=>{
          this.tableData=res.memberList
          this.count=res.count
        })
      },
      fromatTime(row){
        return formatTime(row.lastLoginTime,"Y-M-D h:m")
      },
      search(){
       this.$get("/HealthAssistant/manage/memberWechat/fuzzyQuery",{content:this.input1}).then(res=>{
         this.tableData=res
         this.count=1
       })
      },
      changePage(e){
        this.$get("/HealthAssistant/manage/memberWechat/getMembers",{page:e}).then(res=>{

          this.tableData=res.memberList
        }).catch(error=>{
          console.log(error)
        })
      },
    }
  }
</script>

<style scoped lang="stylus">
  .search
    border-bottom 1px solid #d8d8d8
    padding-bottom 10px
    .el-input
      width 300px
  .pagination
    text-align center
    margin-top 50px
</style>
