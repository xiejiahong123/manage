<template>
  <div class="components-container">
    <!--<div>-->
      <!--<p>标题</p>-->
      <!--<el-input placeholder="请输入内容" v-model="input1" clearable>-->
      <!--</el-input>-->
    <!--</div>-->
    <!--<div>-->
      <!--<p>上传图片</p>-->
      <!--<el-upload-->
        <!--class="avatar-uploader"-->
        <!--action="api/manage/material/upload"-->
        <!--:show-file-list="false"-->

        <!--:on-success="handleAvatarSuccess"-->
        <!--:before-upload="beforeAvatarUpload">-->
        <!--<img v-if="imageUrl" :src="imageUrl" class="avatar">-->
        <!--<i v-else class="el-icon-plus avatar-uploader-icon"></i>-->
      <!--</el-upload>-->
    <!--</div>-->

    <!--<div class="editor-container">-->
      <!--<div class="editor-title">-->
        <!--<span>编辑内容</span>-->
        <!--<el-button type="primary" @click="LoadImage">添加图片<i class="el-icon-upload el-icon&#45;&#45;right"></i></el-button>-->
      <!--</div>-->
      <!--<UE :defaultMsg=defaultMsg :config=config ref="ue" name="content" ></UE>-->
    <!--</div>-->
    <!--<div class="footer">-->
      <!--<el-button type="success" @click="submit">保存</el-button>-->
    <!--</div>-->

    <!--<el-dialog title="选择图片" :visible.sync="dialogFormVisible">-->
      <!--<p>-->
        <!--<el-button type="success" @click="locationUpload">{{ this.$route.params.userId }}</el-button>-->
      <!--</p>-->
      <!--<div class="dialog-wrapper">-->
        <!--<div v-for="item in matterImage" class="img-list" @click="subImage(item.imageUrl)">-->
          <!--<img :src="item.imageUrl" :alt="item.guid" >-->
        <!--</div>-->
      <!--</div>-->
      <!--<div class="pages">-->
        <!--<el-pagination-->
          <!--background-->
          <!--layout="prev, pager, next"-->
          <!--:total="1000">-->
        <!--</el-pagination>-->
      <!--</div>-->

    <!--</el-dialog>-->
    消息管理

  </div>
</template>
<script>
  import UE from 'common/base/editor';
  export default {
    components: {UE},
    data() {
      return {
        imageUrl: '',//图片路径
        input1: '', //标题
        defaultMsg:"小二十文字",//编辑内容
        imageGuid:"55",//图片的guid
        matterImage:[],
        dialogFormVisible:false,//是否显示模态框
        config: {
          initialFrameWidth: null,
          initialFrameHeight: 350
        }
      }
    },
    mounted(){
      // this.LoadImage()
    },
    methods: {



      /**
       * 选择图片
       * */
      subImage(url){
        console.log(url)
        let fragment="<img src='"+url+"'/>"
        console.log(fragment)
        this.$refs.ue.setUeContent(fragment)
        this.dialogFormVisible=false
      },
      locationUpload(){
        console.log("本地")
      },
      /**
       * 加载图片
       */
      LoadImage(){
        console.log(this.$route)

        this.dialogFormVisible=false
        // this.$axios.get("http://localhost:3000/uploadimg").then(res=>{
        //   console.log(res)
        //   this.matterImage=res.data
        // })
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
        }else if(this.imageGuid==""){
          this.$message({
            showClose: true,
            message: '请上传图片',
            type: 'warning'
          });
        }else{
          console.log(title,html,this.imageGuid)
        }


      },
      handleAvatarSuccess(res, file) {
        console.log(6)
        console.log(res)
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt1M = file.size / 1024 / 1024 < 2;
        console.log(file)
        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt1M) {
          this.$message.error('上传头像图片大小不能超过 1MB!');
        }
        return isJPG && isLt1M;
      }
    }
  };
</script>
<style>
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
  .img-list{flex:  0 0 25%;padding: 5px 10px;box-sizing:border-box;}
  .img-list:hover{cursor: pointer}
  .img-list img{width: 100%}
  .pages{text-align: center;margin-top: 20px}
</style>
