<template>
    <div class="layout"  v-loading="loading">
      <p class="title">设置健康助理轮播图</p>
      <div class="wrapper" >
        <div class="wrapper-left">
          <el-carousel trigger="click" height="150px" indicator-position="none">
            <el-carousel-item v-for="item in tags" :key="item.id" >
              <img :src="item.image" :alt="item.id" class="img-list" >
            </el-carousel-item>
          </el-carousel>
        </div>
        <div class="wrapper-right">
          <draggable v-model="tags" :move="getdata" @update="datadragEnd" class="list-group">
            <transition-group>
                <div v-for="(element,index) in tags" :key="element.id" class="drag-list" >
                  <!--<span>{{element.updateTime|formatTime}}</span>-->
                  <span>{{element.desciption}}</span>
                  <span><el-button type="text" @click="deleteList(index)">删除</el-button></span>

                </div>
            </transition-group>
          </draggable>
          <div class="footer">
            <el-button @click="addSwiper">新增</el-button>
            <el-button type="success" @click="subm">保存</el-button>
          </div>
        </div>
      </div>
      <!-- 弹框-->
      <el-dialog title="轮播图选择" :visible.sync="dialogFormVisible" >
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="资讯" name="first" :type="1"></el-tab-pane>
          <el-tab-pane label="商品" name="second" :type="2"></el-tab-pane>
          <el-tab-pane label="活动" name="third" :type="3"></el-tab-pane>
        </el-tabs>

        <div v-if="type==1">
          <p>选择详情内容</p>
          <div class="dialog-content">
            <div class="dialog-list" v-for="(item,index) in dialogList" @click="selectCommodity(item.description,item.content,index,item.updateTime,item.informationGuid)" :class="{active:index==activityIndex}">
              <p>{{item.desciption}}</p>
              <img :src="item.image" :alt="item.informationGuid">
            </div>
          </div>
        </div>
       <div v-if="type==2">
         <p>选择详情内容</p>
         <div class="dialog-content">
           <div class="dialog-list" v-for="(item,index) in dialogList" @click="selectCommodity(item.description,item.content,index,item.updateTime,item.commodityGuid)" :class="{active:index==activityIndex}">
             <p>{{item.desciption}}</p>
             <img :src="item.image" :alt="item.commodityGuid">
           </div>
         </div>
       </div>
        <div class="pages">
          <el-pagination background layout="prev, pager, next" :total="count" :page-size=12 @current-change="dialogChangePage" :current-page.sync="currentPage1"></el-pagination>
        </div>
        <div class="description">
          <p>轮播图描述：</p>
          <el-input v-model="input" placeholder="请输入内容" :maxlength=30 ></el-input>
        </div>
        <div >
          <p>上传轮播图片</p>
          <el-upload class="avatar-uploader" action="/HealthAssistant/manage/material/upload" :show-file-list="false" :on-success="handleDetailSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="image" :src="image" class="avatar" style="width: 356px">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="selectMaterial">确 定</el-button>
        </div>
      </el-dialog>
    </div>
</template>
<script>
    import draggable from "vuedraggable"
    import {formatTime} from 'common/base/utils'
    import jsonp from 'jsonp'
    export default {
      name: "layout",
      methods: {
        deleteRow(index, rows) {
          rows.splice(index, 1);
        }
      },
      filters:{
        formatTime(val){
         return  formatTime(val,"Y-M-D h:m")
        }
      },
      data() {
        return {
          tags:[],
          dialogFormVisible: false,
          form: {},
          loading:true,
          formLabelWidth: '120px',
          dialogList: [],
          activeName: 'first',
          multipleSelection: [],
          currentPage1:1,
          count:0,
          type:1,

          image:"",//轮播图片
          input:"",//描述
          content:"",//详情内容
          updateTime:"",
          activityIndex:"-1",  //素材列表选中
          informationGuid:''
        }
      },
      mounted(){
        this.init()
      },
      methods:{
        /**
         *确认素材选择
         * */
        selectMaterial(){
          console.log(this.tags)
          if(this.input==""){
            this.$message({
              message: '提示，请输入轮播图描述',
              type: 'warning'
            });
          }else if(this.image==""){
            this.$message({
              message: '提示，请上传图片',
              type: 'warning'
            });
          }else if(this.content==""||this.content==""){
            this.$message({
              message: '提示，请选择对应的详情',
              type: 'warning'
            });
          }else{
            let data={
              content:this.content,
              desciption:this.input,
              image:this.image,
              type:this.type,
              id:this.informationGuid
            }
            console.log(data)
            this.tags.push(data)
            this.dialogFormVisible=false
          }
        },
        /**
         * 分页
         * */
        dialogChangePage(e){

          if(this.type==1){
            this.$get("/HealthAssistant/manage/information/getAll",{page:e}).then(res=>{
              console.log(res)
              this.dialogList=res.informationList
            }).catch(error=>{
              console.log(error)
            })
          }else if(this.type==2){
            this.$get("/HealthAssistant/manage/commodity/getAll", {page: e}).then(res => {
              this.dialogList = res.commodityList
            })

          }

        },
        /**
         * 图片上传
         * */
        handleDetailSuccess(res,file){
          this.image=file.response
        },
        /**
         * 上传之前的处理
         * @param file
         * @returns {boolean}
         */
        beforeAvatarUpload(file) {
          console.log(file)
          const isJPG = file.type === 'image/jpeg';
          const isPNG = file.type === 'image/png';
          const isLt1M = file.size / 1024 / 1024 < 2;
          console.log(file)
          if (!isPNG && !isJPG) {
            this.$message.error('上传图片只能是 JPG或者PNG 格式!');
            return false
          }
          if (!isLt1M) {
            this.$message.error('上传头像图片大小不能超过 1MB!');
            return false
          }
        },
        /**
         * 切换导航
         * */
        handleClick(tab) {
          this.type=tab.$attrs.type
          this.currentPage1=1
          if(tab.$attrs.type==1){
            this.$get("/HealthAssistant/manage/information/getAll",{page:1}).then(data=>{
              this.dialogFormVisible=true
              this.dialogList=data.informationList
              this.count=data.totalCount
            })
          }else{
            this.$get("/HealthAssistant/manage/commodity/getAll",{page:1}).then(data=>{
              this.dialogFormVisible=true
              this.dialogList=data.commodityList
              this.count=data.totalCount
            })
          }
        },
        /**
         * 获取素材
         * */
        addSwiper(){
          this.$get("/HealthAssistant/manage/information/getAll",{page:1}).then(data=>{
            this.dialogFormVisible=true
            this.dialogList=data.informationList
            this.count=data.totalCount
          })
        },
        /**
         * 选择素材
         * */
        selectCommodity(description,content,index,updateTime,informationGuid){
          this.activityIndex=index
          this.description=description
          this.content=informationGuid
          this.informationGuid=informationGuid

          this.updateTime=updateTime
          console.log(informationGuid)
        },
        /**
         * 分页
         * */
        closeDialog(){
          this.dialogFormVisible=false
          console.log(4)
        },
        handleSelectionChange(val) {
          console.log(val)
          this.multipleSelection = val;
        },
        /**
         * 初始化数据
         * */
        init(){
          this.$get("/HealthAssistant/manage/slideshow/getSlideshow").then(data=>{
            this.tags=data

            this.loading=false
          }).catch(err=>{
            console.log(err)
          })
        },
        /**
         * 删除当前行
         * @param index
         */
        deleteList(index){
          console.log(index)
          this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.tags.splice(index, 1);
            this.$message({
              type: 'success',
              message: '已删除，请点击保存按钮！'
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        },
        getdata (evt) {
          console.log(evt.draggedContext.element.id)
        },
        datadragEnd (evt) {
          console.log('拖动前的索引 :' + evt.oldIndex)
          console.log('拖动后的索引 :' + evt.newIndex)
          console.log(this.tags)
        },
        /*保存*/
        subm(){
          console.log(this.tags)
          this.$axios.post("/HealthAssistant/manage/slideshow/update",this.tags).then(()=>{
            this.$message({
              type: 'success',
              message: '恭喜您，保存成功啦！'
            });
          })
        }
      },
      components: {
        draggable
      },
    }
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable"
  .title
    font-size  $font-size-large
    color #333
  .wrapper
    display flex
    .wrapper-left
      background url("../assets/phone.png") no-repeat
      background-size 100% auto
      padding 94px 25px
      flex 4
      .img-list
        width 322px
        height 150px
    .wrapper-right
      flex 8
      padding 10px
      margin-left 20px
      .wrapper-title
        text-align right
        padding-right 20px
  .el-carousel__button
    width 10px
  .drag-list
    display flex
    height 50px
    align-items center
    border-bottom 1px solid #ebeef5
    font-size 14px
    padding 0 20px
    color #606266
    &:nth-child(2n)
      background #fafafa
    &:hover
      background  #ecf5ff
      cursor pointer
    span
      flex 4
      &:last-child
        text-align right
  .footer
    text-align center
    margin-top 50px
  .el-carousel__arrow
    top 25%
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
  .avatar-uploader .el-upload
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;

  .avatar-uploader .el-upload:hover
    border-color: #409EFF;

  .avatar-uploader-icon
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;

  .avatar
    width: 178px;
    height: 178px;
    display: block;
  .description
    display flex
    width 80%
    align-items center
    margin-top 20px
    p
      flex 2
    .el-input
      flex 10

</style>
