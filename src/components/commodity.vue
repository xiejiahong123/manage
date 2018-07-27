<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane v-for="item in types" :label="item.name" :name="item.typeIndex.toString()" :typeId="item.id" :key="item.id">
          <div class="head">
            <el-input placeholder="请输入内容" v-model="input23" class="search">
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
              <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
            </el-input>
            <el-button type="success"  @click="publish">发布</el-button>
          </div>
          <div class="table-wrapper">
            <el-table :data="tableData" stripe style="width: 100%">
              <el-table-column prop="sellTime" label="发布时间" width="180" :formatter="formatTime"></el-table-column>
              <el-table-column prop="description" label="内容"></el-table-column>
              <el-table-column fixed="right" label="操作" width="150">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="setRecommend(scope.row)">{{scope.row.homepangRecommend=="1"?"已推荐":"推荐"}} </el-button>
                  <el-button @click="watchDetail(scope.$index, scope.row)" type="text" size="small" >查看</el-button>
                  <el-button @click="deleteRow(scope.$index, scope.row)" type="text" size="small" >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="pagination">
              <el-pagination background layout="prev, pager, next" :total="totalCount"  @current-change="changePage" :current-page.sync="currentPage1"  v-if="fuzzyQuery==false"></el-pagination>
              <el-pagination background layout="prev, pager, next" :total="fuzzyQueryCount"  @current-change="fuzzyQueryChangePage"  :current-page.sync="fuzzyQueryPage1" v-if="fuzzyQuery==true"></el-pagination>
            </div>
          </div>
      </el-tab-pane>
    </el-tabs>
    <el-dialog title="商品发布" :visible.sync="outerVisible"  width="50%">
      <el-dialog width="25%" title="预览" :visible.sync="innerVisible" append-to-body class="inner-wrapper">
        <div class="dialog-inner">
          <div class="inner-banner">
            <img :src="this.detailImage" alt="">
            <div class="inner-description">{{this.description}}</div>
          </div>
          <div class="inner-buy">
            <div class="inner-buy-left">￥{{ this.price}} 最高门市价{{this.offer}}</div>
            <div class="buy"><span>立即购买</span></div>
          </div>
          <div class="introduction">
            <div class="inner-title"> 商品简介</div>
            <div>{{this.name}}sss</div>
          </div>
          <div class="inner-content">
            <div class="inner-title"> 商品详情</div>
            <div v-html="this.content" class="dialog-html"> </div>
          </div>
        </div>
      </el-dialog>
      <div class="dialog-content">
        <div class="dialog-list" v-for="(item,index) in dialogList" @click="selectCommodity(item.image,item.desciption,item.content,index,item.detailImage)" :class="{active:index==activityIndex}">
          <p>{{item.desciption}}</p>
          <img :src="item.image" :alt="item.materialGuid">
        </div>
      </div>
      <div class="pages">
        <el-pagination background layout="prev, pager, next" :total="count" @current-change="dialogChangePage" :current-page.sync="currentPage2"></el-pagination>
      </div>
      <div>
        <ul  class="select-options">
          <li  class="textarea-wrapper">
            <span>产品简介：</span>
            <el-input v-model="name" type="textarea" class="ele-textarea" autosize></el-input>
          </li>
          <li class="select-item">
            <div>
              <span>产品类型：</span>
              <el-select v-model="type" placeholder="请选择" >
                <el-option v-for="item in types" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </div>
            <div class="second">
              <span>交易类别：</span>
              <el-select v-model="classes" placeholder="请选择">
                <el-option v-for="item in option2" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </div>
            <div>
              <span>是否推荐：</span>
              <el-select v-model="recommend" placeholder="请选择">
                <el-option v-for="item in option3" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </div>
          </li>
          <li class="select-item">
            <div>
              <span>促销价格：</span>
              <el-input v-model="price" type="number"></el-input>
            </div>
            <div class="second">
              <span>商品原价：</span>
              <el-input v-model="offer" type="number"></el-input>
            </div>
          </li>
        </ul>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="preview" >预览</el-button>
        <el-button @click="outerVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitCommodity">提交发布</el-button>
      </div>
    </el-dialog>
    <el-dialog title="查看" :visible.sync="centerDialogVisible" width="30%" center>
      <div>
        <div class="banner-wrapper" :style="{backgroundImage: 'url(' + detail.detailImage + ')'}">
          <div class="banner-text">
            <span>{{detail.description}}</span>
          </div>
        </div>
        <div class="buy-wrapper">
          <div>
            ￥<span>{{detail.price}}</span> 最高门市价 <span >{{detail.offer}}</span>
          </div>
          <div>
            <span class="wrapper-span">立即购买</span>
          </div>
        </div>
        <div class="watch-content">
          <ul>
            <li>
              <h3>商品简介</h3>
              <p>{{detail.intro}}</p>
            </li>
            <li>
              <h3>商品详情</h3>
              <p v-html="detail.content"></p>
            </li>
            <li>
              <h3>商品评价</h3>

            </li>
          </ul>
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
        activeName: "0",
        typeid:"",
        types:[],//产品类型列表
        count:0,
        dialogList:[],
        fuzzyQuery:false,
        fuzzyQueryCount:0,
        fuzzyQueryPage1:1,
        dialogVisible: false,
        outerVisible: false,
        innerVisible: false,
        currentPage1: 1,
        currentPage2: 1,
        tableData: [],
        totalCount:0,
        //交易类别下拉列表
        option2: [{value: '1', label: '商品'}, {value: '2', label: '服务'}],
        //是否推荐下拉列表
        option3: [{value: '1', label: '是'}, {value: '2', label: '否'}],

        name:"",//商品简介
        type: '',//商品类型
        classes:"",//交易类别
        recommend:"",//推荐
        price:"",//促销价格
        offer:"",//原价
        coverImage:"",//封面图片
        detailImage:"",//详情图片
        description:"",//描述
        content:"",//详情内容

        centerDialogVisible:false,
        detail:{},
        activityIndex:"-1"  //素材列表选中
      }
    },
    mounted(){
      this.getCommodity()
    },
    methods: {

      watchDetail(index,row){
        console.log(row)
        this.centerDialogVisible=true
        this.detail=row
      },
      /**
       * 设置推荐
       * @param e
       */
      setRecommend(item){
        console.log(item)
        let data={
          guid:item.commodityGuid
        }
        this.$post("/HealthAssistant/manage/commodity/recommend",data).then(()=>{
            item.homepangRecommend=1
            this.$message({
              message: '恭喜你，设置推荐成功',
              type: 'success'
            });
        }).catch(()=>{
          this.$message.error('很遗憾，置顶失败了');
        })
      },

      /**
       *预览
       * */
      preview(){
        if(this.coverImage==""||this.description==""||this.content==""){
          this.$message({
            message: '请选择素材',
            type: 'warning'
          });
        }else if(this.name==""){
          this.$message({
            message: '请输入产品简介',
            type: 'warning'
          });
        }else if(this.price==""){
          this.$message({
            message: '请输入促销价格',
            type: 'warning'
          });
        }else if(this.offer==""){
          this.$message({
            message: '请输入商品原价',
            type: 'warning'
          });
        }else if( parseFloat(this.price)>parseFloat(this.offer)){
          this.$message({
            message: '促销价格不能大于商品原价',
            type: 'warning'
          });
        } else{
          this.innerVisible = true
        }
      },
      /**
       *搜索
       * */
      search(){
        this.$get("/HealthAssistant/manage/commodity/fuzzyQuery",{content:this.input23,page:1}).then(data=>{
          console.log(data)
          this.tableData=data.list
          this.fuzzyQueryCount=data.count
          this.fuzzyQuery=true
          this.fuzzyQueryPage1=1
        })
      },
      fuzzyQueryChangePage(e){
        console.log(e)
        this.$get("/HealthAssistant/manage/commodity/fuzzyQuery",{content:this.input23,page:e}).then(data=>{
          this.tableData=data.list
          this.fuzzyQueryCount=data.count
          this.fuzzyQuery=true
        })
      },
      /**
       * 选择素材
       * */
      selectCommodity(image,description,content,index,detailImage){
        this.activityIndex=index
        this.coverImage=image
        this.description=description
        this.content=content
        this.detailImage=detailImage
      },
      /**
       * 发布素材
       * */
      submitCommodity(){
        if(this.name==""){
          this.$message({
            message: '请输入产品简介',
            type: 'warning'
          });
        }else if(this.image==""||this.detailImage==""||this.description==""||this.content==""){
          this.$message({
            message: '请选择商品素材',
            type: 'warning'
          });
        }else if(this.type==""){
          this.$message({
            message: '请选择产品类型',
            type: 'warning'
          });
        }else if(this.classes==""){
          this.$message({
            message: '请选择交易类别',
            type: 'warning'
          });
        }else if(this.recommend==""){
          this.$message({
            message: '请选择是否推荐',
            type: 'warning'
          });
        }else if(this.price==""){
          this.$message({
            message: '请输入促销价格',
            type: 'warning'
          });
        }else if(this.offer==""){
          this.$message({
            message: '请输入商品原价',
            type: 'warning'
          });
        }else if( parseFloat(this.price)>parseFloat(this.offer)){
          this.$message({
            message: '促销价格不能大于商品原价',
            type: 'warning'
          });
        }else{
          let param={
            image:this.coverImage,
            detailImage:this.detailImage,
            description:this.description,
            content:this.content,
            typeid:this.type,
            price:this.price,
            homepangRecommend:this.recommend,
            intro:this.name,
            offer:this.offer,
            classes:this.classes
          }
          this.$axios.post("/HealthAssistant/manage/commodity/publish",param).then(res=>{
            console.log(res)

              this.$message({
                type: 'success',
                message: '恭喜您，发布成功!'
              });
              this.outerVisible=false
              this.getCommodity()
          }).catch(()=>{
            this.$message.error('很遗憾，发布失败了');
          })
        }
      },
      /**
       * 点击发布按钮，选取素材
       * */
      publish(){
        this.outerVisible=true
        this.currentPage2=1
        this.$get("/HealthAssistant/manage/material/getMaterial", {type: 2, page: 1}).then(data => {
          console.log(data)
          this.count=data.count
          this.dialogList=data.materials
        }).catch(error => {
          console.log(error)
        })
      },
      /**
       * 弹框分页
       * */
      dialogChangePage(e){
        let data = {
          page: e,
          type: 2
        }
        this.$get("/HealthAssistant/manage/material/getMaterial",  data).then(data => {
          console.log(data)
          this.dialogList = data.materials
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


          let data={guid:rows.commodityGuid}
          this.$post("/HealthAssistant/manage/commodity/delete",data).then(()=>{
            this.tableData.splice(index, 1);
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
        let data={typeid:this.typeid, page:e}
        this.$get("/HealthAssistant/manage/commodity/getMoreCommodity",data).then(res=>{
          this.tableData=res.commodityList
        }).catch(error=>{
          console.log(error)
        })
      },
      /**
       * 初始化页面
       * */
      getCommodity(){
        this.$get("/HealthAssistant/manage/commodity/getCommodity").then(data=>{
          console.log(data)
          this.types=data.types
          this.totalCount=data.totalCount
          this.tableData=data.commodities
          this.typeid=data.types[0].id
        }).catch(error=>{
          console.log(error)
        })
      },
      /**
       * 格式化时间
       * */
      formatTime(row){
        // console.log(row)
        return formatTime(row.sellTime,"Y-M-D h:m")
      },

      /**
       * 切换导航
       * @param row
       */
      handleClick(row) {
        console.log(row)
        let data={
          typeid :row.$attrs.typeId,
          page:1
        }
        this.typeid=row.$attrs.typeId
        this.$get("/HealthAssistant/manage/commodity/getMoreCommodity",data).then(res=>{
          this.currentPage1=1
          this.totalCount=res.totalCount
          this.tableData=res.commodityList
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
    padding-right 30px
  .el-input
    width 200px
  .pagination
    text-align center
    margin-top 50px
  .search
    width 300px
  .dialog-content
    display flex
    align-content flex-start;
    flex-flow row wrap;
    justify-content flex-start;
    background #fff
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
     border 2px solid #32b531;
     cursor pointer
    img
      width 160px
      height 100px
  .pages
    text-align center
    margin-top 20px
  .select-options
    li
      list-style none
      margin-top 10px
    .select-item
      display flex
      .el-select
        width 200px
    .second
      margin 0 10px
  .dialog-inner
    height 600px
    overflow auto
    background #f5f5f5
  .dialog-html
    width:100%
  .inner-banner
    display flex
    flex-direction: column;
    justify-content: space-between;
    img
      width 100%
      height 200px
  .inner-description
    padding 6px 16px
    background linear-gradient(to bottom, rgba(255,0,0,0), rgba(0,0,0,0.4));
  .inner-buy
    height 50px
    display flex
    justify-content space-between
    align-items center
    background #fff
    padding 0 20px
  .introduction
    background #fff
    margin-top 10px
    margin-bottom 10px
    padding 6px 10px
    .inner-title
      border-bottom 1px solid #d6d6d6
  .buy
    span
      background #fe6554
      color #fff
      border-radius 10px
      padding 4px 10px
  .inner-content
    padding  0 10px
    background #fff
    .inner-title
      padding 6px 10px
      border-bottom 1px solid #d6d6d6
  .textarea-wrapper
    display flex
    align-items center
    .ele-textarea
      width 400px
      margin-left 4px
  .banner-wrapper
    height 200px
    background-size 100% auto ;
    position relative
    .banner-text
      position absolute
      background linear-gradient(to bottom, rgba(255,0,0,0), rgba(21, 21, 21, 0.5));
      display flex
      justify-content start
      width 96%
      padding 10px
      bottom 0
      color #fff
  .buy-wrapper
    display flex
    justify-content space-between
    margin-top 10px
    .wrapper-span
      background #fe6554
      color #fff
      border-radius 10px
      padding 4px 10px
  .watch-content
    ul
      padding 0
      li
        list-style none
        p
          padding-left 20px
</style>
