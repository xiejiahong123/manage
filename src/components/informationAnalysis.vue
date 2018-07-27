<template>
  <div>
    <div class="search">
      <el-input placeholder="请输入内容" v-model="input1">
        <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
      </el-input>
    </div>
    <div class="content">
      <el-table :data="tableData" stripe style="width: 100%" >
        <el-table-column prop="updateTime" label="发布时间" :formatter="formatTime" ></el-table-column>
        <el-table-column prop="description" label="内容" ></el-table-column>
        <el-table-column prop="praise" label="点赞人数" ></el-table-column>
        <el-table-column prop="favourite" label="收藏人数"></el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background layout="prev, pager, next" :total="totalCount" @current-change="pageChangePage"  v-if="!isSearch"  ></el-pagination>
        <el-pagination background layout="prev, pager, next" :total="searchCount" @current-change="searchChangePage"  v-if="isSearch" ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import {formatTime} from 'common/base/utils'
  export default {
    name: "informationAnalysis",
    data() {
      return {
        tableData: [],
        totalCount:0,
        currentPage:1,
        input1:"",
        isSearch:false,
        searchCount:0
      }
    },
    mounted(){
      this.init()
    },
    methods:{
      init(){
        this.$get("/HealthAssistant/manage/information/getAll",{page:1}).then(res=>{
          console.log(res)

            this.tableData=res.informationList
            this.totalCount=res.totalCount

        }).catch(error=>{
          console.log(error)
        })
      },
      search(){
        if(this.input1==""){
          this.$message({
            showClose: true,
            message: '请输入要查询的内容',
            type: 'error'
          });
        }else{
          this.$get("/HealthAssistant/manage/information/fuzzyQuery",{content:this.input1,page:1}).then(res=>{
            this.tableData=res.list
            this.searchCount=res.count
            this.isSearch=true

            console.log(res)
          }).catch(()=>{
            console.log("查询失败")
          })
        }

      },
      searchChangePage(e){
        this.$get("/HealthAssistant/manage/information/fuzzyQuery",{content:this.input1,page:e}).then(res=>{
          this.tableData=res.list
          this.searchCount=res.count
          console.log(res)
        }).catch(()=>{
          console.log("cuowu")
        })
      },
      pageChangePage(e){
        this.$get("/HealthAssistant/manage/information/getAll",{page:e}).then(res=>{
          console.log(res)
            this.tableData=res.informationList
        }).catch(error=>{
          console.log(error)
        })
      },
      formatTime(row){
        return formatTime(row.updateTime,"Y-M-D h:m")
      }
    }
  }
</script>

<style scoped lang="stylus">
  .search
    border-bottom 1px solid #d8d8d8
    padding 10px 0px
    .el-input
      width 300px
  .pagination
    text-align center
    margin-top 50px
</style>
