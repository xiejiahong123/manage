<template>
  <div class="information"  v-loading="loading">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane v-for="item in types" :label="item.name" :name="item.typeIndex.toString()" :typeId="item.id" :key="item.id">
        <div class="head">
          <el-input placeholder="请输入内容" v-model="input23" class="search">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
          </el-input>
          <el-button type="success"  @click="publish">发布</el-button>
        </div>
        <div class="table-wrapper" >
          <el-table :data="informationList" stripe style="width: 100%">
            <el-table-column prop="updateTime" label="更新时间" width="180" :formatter="formatTime"></el-table-column>
            <el-table-column prop="description" label="内容"></el-table-column>
            <el-table-column fixed="right" label="操作" width="300">
              <template slot-scope="scope">
                <el-button @click="setTop(scope,scope.row)" type="text" size="small">{{scope.row.recommend==1?"已置顶":"置顶"}}</el-button>
                <el-button @click="setRecommend(scope.row)" type="text" size="small">{{scope.row.homepangRecommend==1?"已推荐":"推荐"}}</el-button>
                <el-button @click="watchDetail(scope.$index, scope.row)" type="text" size="small">查看</el-button>
                <el-button @click="deleteRow(scope.$index, scope.row)" type="text" size="small" >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="pagination">
          <el-pagination background layout="prev, pager, next" :total="totalCount"  @current-change="changePage"  :current-page.sync="currentPage1" v-if="fuzzyQuery==false"></el-pagination>
          <el-pagination background layout="prev, pager, next" :total="fuzzyQueryCount"  @current-change="fuzzyQueryChangePage"  :current-page.sync="fuzzyQueryPage1" v-if="fuzzyQuery==true"></el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-dialog title="资讯发布" :visible.sync="outerVisible" width="50%">
      <el-dialog width="30%" title="发布预览" :visible.sync="innerVisible" append-to-body class="inner-dialog">
        <div>{{this.description}}</div>
        <div>{{this.updatetime|filterTime}}</div>
        <div v-html="this.content"></div>
      </el-dialog>

      <div class="dialog-content">
        <div class="dialog-list" v-for="(item,index) in dialogList" @click="selectCommodity(item.image,item.desciption,item.content,index,item.updatetime)" :class="{active:index==activityIndex}">
          <p>{{item.desciption}}</p>
          <img :src="item.image" :alt="item.materialGuid">
        </div>
      </div>

      <div class="pages">
        <el-pagination background layout="prev, pager, next" :total="count" @current-change="dialogChangePage" :current-page.sync="currentPage2"></el-pagination>
      </div>
      <div class="select-options">
        <div>
          <span>资讯类型</span>
          <el-select v-model="type" placeholder="请选择" >
            <el-option v-for="item in types" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </div>
        <div>
          <span>是否置顶：</span>
          <el-select v-model="recommend" placeholder="请选择">
            <el-option v-for="item in option2" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>
        <div>
          <span>是否推荐:</span>
          <el-select v-model="homepangRecommend" placeholder="请选择">
            <el-option v-for="item in option3" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
         <el-button @click="preview">预览</el-button>
        <el-button @click="outerVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitDialog">确 定</el-button>
      </span>
    </el-dialog>


    <el-dialog title="查看" :visible.sync="centerDialogVisible" width="30%" center>
        <div>
          <p>{{detail.description}}</p>
          <p>{{detail.updateTime|filterTime}}</p>
          <div v-html="detail.content">

          </div>
        </div>
    <!--<el-button @click="centerDialogVisible = false">取 消</el-button>-->
    <!--<el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>-->

    </el-dialog>
  </div>
</template>

<script>
  import {formatTime} from 'common/base/utils'


  export default {
    name: "information",
    data() {
      return {
        input23: '',
        activeName: '0',
        loading:true,//是否显示loading
        informationList: [],//数据列表
        types:[], //导航标题
        typeid:"",//判断类型
        currentPage1: 1,//当前页码
        totalCount:0,//总条数
        currentPage2:1,
        centerDialogVisible:false,
        count:0,
        //是否推荐下拉列表
        option3: [{value: '1', label: '是'}, {value: '2', label: '否'}],
        //是否置顶
        option2: [{value: '1', label: '是'}, {value: '2', label: '否'}],
        dialogList:[],
        outerVisible: false,
        innerVisible: false,
        fuzzyQuery:false,
        fuzzyQueryCount:0,
        fuzzyQueryPage1:1,
        updatetime:"",//预览时间
        type:"",//类型
        description:"",//描述
        coverImage:"",//封面图片
        recommend:"",//是否置顶
        detailImage:"",//详情图片
        homepangRecommend:"",//首页推荐
        content:"",//详情内容

        detail:{},
        activityIndex:-1  //素材列表选中

      }
    },
    mounted(){
      this.getInformations()
    },
    filters:{
      filterTime(updateTime){
        return formatTime(updateTime,"Y-M-D h:m")
      }
    },
    methods: {
      /**
       * 发布之后预览
       * */
      watchDetail(index,row){
        console.log(row)
        this.centerDialogVisible=true
        this.detail=row
      },

      /**
       * 发布前预览
       * */
      preview(){
        if(this.coverImage==""||this.description==""||this.content==""){
          this.$message({
            message: '请您选择要预览的素材',
            type: 'warning'
          });
        }else{
          this.innerVisible=true
        }
      },
      /**
       * 格式化时间
       * */
      formatTime(row){
        return formatTime(row.updateTime,"Y-M-D h:m")
      },

      /**
       * 设置推荐
       * */
      setRecommend(item){
        console.log(item)
        let data={
          guid:item.informationGuid
        }
      this.$post("/HealthAssistant/manage/information/recommend",data).then(data=>{
          console.log(data)
            item.homepangRecommend=1
            this.$message({
              showClose: true,
              message: '恭喜你，推荐成功！',
              type: 'success'
            });
        }).catch(()=>{
            this.$message({
              showClose: true,
              message: '很遗憾，推荐失败了',
              type: 'error'
            });
        })
      },
      /**
       * 设置置顶
       * */
      setTop(scope,item){
        let data={
          typeId:this.typeid,
          guid:item.informationGuid
        }

        this.$post("/HealthAssistant/manage/information/top",data).then(()=>{

          for(var i=0;i<this.informationList.length;i++){
            this.informationList[i].recommend=2
          }
          item.recommend=1
          this.$message({
            showClose: true,
            message: '恭喜你，置顶成功！',
            type: 'success'
          });

        }).catch(error=>{
          console.log(error)
            this.$message({
              showClose: true,
              message: '很遗憾，置顶失败了',
              type: 'error'
            });
        })
      },
      /**
       * 模糊搜索
       * */
      search(){
        this.$get("/HealthAssistant/manage/information/fuzzyQuery",{content:this.input23,page:1}).then(data=>{
          this.informationList=data.list
          this.fuzzyQueryCount=data.count
          this.fuzzyQuery=true
          this.fuzzyQueryPage1=1
        })
      },
      fuzzyQueryChangePage(e){
        console.log(e)
        this.$get("/HealthAssistant/manage/information/fuzzyQuery",{content:this.input23,page:e}).then(data=>{
          this.informationList=data.list
          this.fuzzyQueryCount=data.count
          this.fuzzyQuery=true
        })
      },
      /**
       * 提交
       * */
      submitDialog(){
        if(this.type==""){
          this.$message({
            message: '请您选择资讯类别',
            type: 'warning'
          });
        }else if(this.recommend==""){
          this.$message({
            message: '请您选择是否置顶',
            type: 'warning'
          });
        }else if(this.homepangRecommend==""){
          this.$message({
            message: '请您选择是否首页推荐',
            type: 'warning'
          });
        }else if(this.coverImage==""||this.description==""||this.content==""){
          this.$message({
            message: '请您选择要发布的素材',
            type: 'warning'
          });
        }else{
          let data={
            image:this.coverImage,
            detailImage:this.detailImage,
            description:this.description,
            content:this.content,
            typeid:this.typeid,
            recommend:this.recommend,
            homepangRecommend:this.homepangRecommend
          }
          this.$axios.post("/HealthAssistant/manage/information/publish",data).then(data=>{
            console.log(data)
              this.$message({
                showClose: true,
                message: '恭喜你，发布成功',
                type: 'success'
              });
            this.outerVisible=false
            this.getInformations()
            this.outerVisible=false
          }).catch(()=>{
            this.$message({
              showClose: true,
              message: '资讯发布失败',
              type: 'error'
            });
          })
        }
      },
      /**
       * 选择类别
       * */
      selectCommodity(image,description,content,index,updatetime){
        this.activityIndex=index
        this.coverImage=image
        this.description=description
        this.content=content
        this.updatetime=updatetime
        console.log(this.coverImage,this.description,this.content)
      },
      /**
       * 弹框分页
       * */
      dialogChangePage(e){
        let data = {
          page: e,
          type: 1
        }
        this.$get("/HealthAssistant/manage/material/getMaterial",data).then(data => {
          console.log(data)
          this.dialogList = data.materials
        }).catch(error => {
          console.log(error)
        })
      },
      /**
       * 资讯发布
       * */
      publish(){
        this.outerVisible=true
        this.currentPage2=1
        this.$get("/HealthAssistant/manage/material/getMaterial", {type: 1, page: 1}).then(data => {
          console.log(data)
          this.count=data.count
          this.dialogList=data.materials
          console.log(this.dialogList)
        }).catch(error => {
          console.log(error)
        })
      },
      /**
       * 删除当前行
       **/
      deleteRow(index, rows) {
        console.log(index,rows)
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.$post("/HealthAssistant/manage/information/delete",{guid:rows.informationGuid}).then(()=>{
            this.informationList.splice(index, 1);
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          }).error(()=>{
            this.$message.error('很遗憾，删除失败了');
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },

      /**
       * 分页点击
       * @param e
       */
      changePage(e){
        let data={
          typeid :this.typeid,
          page:e
        }
        console.log(data)
        this.$get("/HealthAssistant/manage/information/getMoreInfo",data).then(data=>{
          // console.log(res)
          this.informationList=data.informationList
          console.log(this.informationList)
        }).catch(error=>{
          console.log(error)
        })
      },
      /**
       * 初始化数据
       */
      getInformations(){
        this.$get("/HealthAssistant/manage/information/getInformation").then(data=>{
          console.log(data)
          this.types=data.types
          this.informationList=data.informationList
          this.totalCount=data.totalCount
          this.typeid=data.types[0].id

          this.loading=false
          console.log(this.typeid)
        }).catch(error=>{
          console.log(error)
        })
      },
      /**
       * 切换导航
       * @param row
       */
      handleClick(row) {
        let data={
          typeid :row.$attrs.typeId,
          page:1
        }
        this.typeid=row.$attrs.typeId
        this.$get("/HealthAssistant/manage/information/getMoreInfo",data).then(data=>{
          this.currentPage1=1
          this.informationList=data.informationList
          this.totalCount=data.totalCount
          this.fuzzyQuery=false
        }).catch(error=>{
          console.log(error)
        })
      }
    }
  }
</script>

<style scoped lang="stylus">
  .table-wrapper
    border-top 1px solid #d8d8d8
    margin-top 20px
  .head
    display flex
    justify-content space-between
    .el-input
      width 300px
  .pagination
    text-align center
    margin-top 50px
  .dialog-content
    display flex
    align-content flex-start;
    flex-flow row wrap;
    justify-content flex-start;
    .active
      border 2px solid #32b531
  .dialog-list
    flex:  0 0 23%;
    border 2px solid #f1f1f1
    box-sizing border-box
    margin 5px
    text-align center
    background #f1f1f1
    box-shadow 2px 1px 1px #e2e2e2;
    &:hover
      border 2px solid #32b531
      cursor pointer
    img
      width 160px
      height 100px
    p
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow:hidden;
  .pages
    text-align center
    margin-top 20px
  .select-options
    display flex
    margin-top 20px
    div
      flex 1
      text-align center
      .el-select
        width 150px

</style>
