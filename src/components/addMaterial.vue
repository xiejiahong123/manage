<template>
  <div class="components-container">
    <div>
      <p>标题</p>
      <el-input placeholder="请输入内容" v-model="input1" clearable></el-input>
    </div>
    <div>
      <p>上传封面图片</p>
      <el-upload class="avatar-uploader" action="../../HealthAssistant/manage/material/upload" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
        <img v-if="imageUrl" :src="imageUrl" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </div>

    <div v-if="this.type==2">
      <p>上传详情图片</p>
      <el-upload class="avatar-uploader" action="../../HealthAssistant/manage/material/upload" :show-file-list="false" :on-success="handleDetailSuccess" :before-upload="beforeAvatarUpload">
        <img v-if="detailImage" :src="detailImage" class="avatar" style="width: 356px">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </div>
    <div class="editor-container">
      <div class="editor-title">
        <span>编辑内容</span>
        <el-button type="primary" @click="LoadImage">添加图片<i class="el-icon-upload el-icon--right"></i></el-button>
      </div>
      <UE :defaultMsg=defaultMsg :config=config ref="ue" name="content" ></UE>
    </div>
    <div class="footer">
      <el-button type="success" @click="submit">保存</el-button>
    </div>
    <el-dialog title="选择图片" :visible.sync="dialogFormVisible">
      <p>
        <el-upload class="upload-demo" action="../../HealthAssistant/manage/material/upload" :show-file-list="false" :on-success="success" :before-upload="beforeAvatarUpload" multiple>
          <el-button size="small" type="primary" >上传图片</el-button>
        </el-upload>
      </p>
      <div class="dialog-wrapper">
        <div v-for="item in matterImage" class="img-list" @click="subImage(item.path)">
          <img :src="item.path" :alt="item.thumbnailGuid" >
        </div>
      </div>
      <div class="pages">
        <el-pagination background layout="prev, pager, next" :total="this.count"  @current-change="changePage"></el-pagination>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import UE from 'common/base/editor';
  export default {
    components: {UE},
    data() {
      return {
        imageUrl: '',//封面图片路径
        detailImage:"",
        input1: '', //标题
        defaultMsg:"",//编辑内容
        matterImage:[], //素材图片列表
        count:0,
        type:"",
        dialogFormVisible:false,//是否显示模态框
        config: {
          initialFrameWidth: null,
          initialFrameHeight: 350
        }
      }
    },
    mounted(){
      this.init()
    },
    methods: {
      /**
       * 选择图片
       * */
      subImage(url){
        console.log(url)
        let fragment="<img src='"+url+"' style='width:100%'/>"
        console.log(fragment)
        this.$refs.ue.setUeContent(fragment)
        this.dialogFormVisible=false
      },
      /**
       * 初始化数据
       */
      init(){
        console.log(this.$route.query.guid)
        if(this.$route.query.name=="first"){//资讯
          this.type=1
        }else if(this.$route.query.name=="second"){ //商品
          this.type=2
        } else if(this.$route.query.name=="third"){ //活动
          this.type=3
        }
      },
      /**
       * 加载图片
       */
      LoadImage(){
        console.log(this.$route)
        this.dialogFormVisible=true
        this.$get("/HealthAssistant/manage/material/getThumbnails",{page:1}).then(res=>{
          console.log(res)
          this.matterImage=res.thumbnails
          this.count=res.count
        })
      },
      /**
       * 图片素材分页
       */
      changePage(e){
        this.$get("/HealthAssistant/manage/material/getThumbnails",{page:e}).then(res=>{
          console.log(res)
          this.count=res.count
          this.matterImage=res.thumbnails
        })
      },
      /**
       * 提交数据
       */
      submit(){
        let html=this.$refs.ue.getUEContent()
        let title=this.input1
        if(html==""){
          this.$message({
            showClose: true,
            message: '请输入编辑内容',
            type: 'warning'
          });
        }else if(title==""){
          this.$message({
            showClose: true,
            message: '请输入标题',
            type: 'warning'
          });
        }else if(this.imageUrl==""){
          this.$message({
            showClose: true,
            message: '请上传封面图片',
            type: 'warning'
          });
        }else if(this.detailImage==""&&this.type==2){
          this.$message({
            showClose: true,
            message: '请上传详情图片',
            type: 'warning'
          });
        }
        else{
            let params={
              image:this.imageUrl,
              desciption:title,
              content:html,
              type:this.type,
              detailImage:this.detailImage
            }

          this.$post("/HealthAssistant/manage/material/addMaterial",params).then(()=>{
            this.$message({
              showClose: true,
              message: '恭喜你，添加成功',
              type: 'success'
            });
          }).catch(()=>{
            this.$message({
              showClose: true,
              message: '添加失败',
              type: 'warning'
            });
          })
        }
      },
      /**
       * 素材图片上传成功
       * */
      success(file){
        console.log(file)
        this.matterImage.unshift({"path":file})
      },
      /**
       * 头像上传成功的参数
       * @param res
       * @param file
       */
      handleAvatarSuccess(res, file) {
        console.log(file)
        this.imageUrl=file.response
      },
      /**
       * 详情上传成功的参数
       * @param res
       * @param file
       */
      handleDetailSuccess(res,file){
        this.detailImage=file.response
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
      }
    }
  };
</script>
<style scoped>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .footer{
    text-align: center;
    margin-top: 20px;
  }
  .editor-title{
    display: flex;
    align-items: center;
    margin: 10px 0;
    justify-content: space-between;
    padding-right: 20px;
  }
  .dialog-wrapper{display: flex; align-content: flex-start; flex-flow: row wrap;justify-content: flex-start}
  .img-list{flex:  0 0 25%;padding: 5px 10px;box-sizing:border-box;display: flex;align-items: center}
  .img-list:hover{cursor: pointer}
  .img-list img{width: 100%}
  .pages{text-align: center;margin-top: 20px}
</style>
