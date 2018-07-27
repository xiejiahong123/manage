<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane :label="title.label" :name="title.name" v-for="title in types" :key="title.id" :type="title.type">
        <div class="btn-wrapper">
          <div>
            <!--<el-input placeholder="请输入内容" prefix-icon="el-icon-search"> <el-button slot="append" icon="el-icon-search" ></el-button></el-input>-->
          </div>
          <div>
            <el-button type="success" @click="add(name)">增加</el-button>
          </div>
        </div>
        <div class="wrapper-list">
          <div class="list" v-for="(item,index) in materrialList">
            <div class="list-title">{{item.desciption}}</div>
            <img :src="item.image" alt="">
            <!--<div class="list-content">{{item.content}}</div>-->
            <div class="list-footer">
              <p class="list-time">{{item.updatetime|formatTime}}</p>
              <p>
                <span @click="updataMaterial(item.materialGuid)">修改</span>
                <span @click="delInformation(item.materialGuid,index)">删除</span>
              </p>
            </div>
          </div>
        </div>
        <div class="pagination">
          <el-pagination background layout="prev, pager, next" :total="count" :page-size=12   @current-change="materChangePage" :current-page.sync="currentPage1"></el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="图片" name="fourth" :type="4">
        <div>
          <el-upload class="upload-demo" action="/HealthAssistant/manage/material/upload" :show-file-list="false" :on-success="success" :before-upload="beforeAvatarUpload" multiple>
            <el-button size="small" type="primary" >上传图片</el-button>
          </el-upload>
        </div>
        <div class="dialog-wrapper">
          <div v-for="(item,index) in matterImage" class="img-list"   @mouseout="mouseout(index)"  @mouseover="selectStyle (item) " :class="{'active':item.active,'':!item.active}">
            <img :src="item.path" :alt="item.thumbnailGuid" >
            <div class="delete" >
             <i class="el-icon-delete" @click="delInformation(item.thumbnailGuid,index)"></i>
            </div>
          </div>
        </div>
        <div class="pages">
          <el-pagination background layout="prev, pager, next" :total="count" :page-size=12  @current-change="materChangePage" :current-page.sync="currentPage1">
          </el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>
    <router-view></router-view>
  </div>
</template>

<script>
  import {formatTime} from 'common/base/utils'
  import Vue from 'vue'
  export default {
    name: "material",
    data() {
      return {
        activeName: 'first',
        name:"first",
        active: false,
        count:0, //总条数
        type:1,
        currentPage1:1,
        types:[
          {id:"1",label:"资讯",name:"first",type:"1"},
          {id:"2",label:"商品",name:"second",type:"2"},
          {id:"3",label:"活动",name:"third",type:"3"},
        ],
        matterImage:[], //图片列表
        materrialList: []
      }
    },
    filters: {
      formatTime(val) {
        return formatTime(val, "Y-M-D h:m")
      }
    },
    mounted() {
      this.init()
    },
    methods: {
      /**
       *  是否显示删除按钮
       */
      selectStyle (item, index) {
        this.$nextTick(function () {
          this.matterImage.forEach(function (item) {
            Vue.set(item,'active',false);
          });
          Vue.set(item,'active',true);
        });
      },
      /**
       *  鼠标移出事件
       */
      mouseout(){
        this.$nextTick(function () {
          this.matterImage.forEach(function (item) {
            Vue.set(item,'active',false);
          });
        });
      },

      /**
       * 修改素材
       * */
      updataMaterial(id){
        this.$router.push({path:'/uploadMaterial',query: {
          name:this.name,
          guid: id
        }})
      },
      /**
       * 添加素材
       * @param id
       */
      add(name) {
        this.$router.push({path:'/addMaterial',query: {
          name: name
        }})
      },
      /**
       * 删除素材
       */
      delInformation(guid,index){
        console.log(guid,index)
          this.$confirm('此操作将永久删除该条记录, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            console.log(this.type)
            let data={guid:guid}
            if(this.type==4){
              console.log(this.type)

              this.$post("/HealthAssistant/manage/material/deleteThumbnail",data).then(()=>{
                  this.$message({
                    message: '删除成功',
                    type: 'success'
                  });
                  this.matterImage.splice(index,1)
              }).error(error=>{
                this.$message.error("请求失败");
              })
            }else{
              this.$post("/HealthAssistant/manage/material/deleteMaterial",data).then(()=>{
                  this.$message({
                    message: '删除成功',
                    type: 'success'
                  });
                  this.materrialList.splice(index,1)
              }).error(()=>{
                this.$message.error("请求失败");
              })
            }
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
      },
      /**
       * 资讯数据
       */
      init() {
        this.$get("/HealthAssistant/manage/material/getMaterial", {type: 1, page: 1}).then(res => {
          console.log(res)
          this.materrialList=res.materials
          this.count=res.count
          console.log(this.count)
        }).catch(error => {
          console.log(error)
        })
      },
      /**
       * 其他素材的分页
       * @param id
       */
      materChangePage(e){
        if(this.type==4){
          this.$get("/HealthAssistant/manage/material/getThumbnails",{page:e}).then(res=>{
            this.matterImage=res.thumbnails
          })
        }else {
          let data = {
            page: e,
            type: this.type
          }
          this.$get("/HealthAssistant/manage/material/getMaterial", data).then(res => {
            console.log(res)
            this.materrialList = res.materials
          }).catch(error => {
            console.log(error)
          })
        }
      },
      /**
       * 切换导航
       * @param tab
       */
      handleClick(tab) {
        console.log(tab);
        this.name=tab.name
        this.type=tab.$attrs.type
        this.currentPage1=1
        if(tab.name=="fourth"){
          this.$get("/HealthAssistant/manage/material/getThumbnails",{page:1}).then(res=>{
            console.log(res)
            this.matterImage=res.thumbnails
            this.count=res.count
          })
        }else{
          this.$get("/HealthAssistant/manage/material/getMaterial", {type: this.type, page: 1}).then(res => {
            this.count=res.count
            this.materrialList=res.materials
          }).catch(error => {
            console.log(error)
          })
        }
      },
      /**
       *图片素材上传成功
       * */
      success(file){
        console.log(file)
        this.$message({
          message: '恭喜你，上传成功',
          type: 'success'
        });
        this.matterImage.unshift({"path":file})
        console.log(this.matterImage)
      },
      /**
       * 图片上传之前的处理
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
  }
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable"
  p
    margin 0
  .btn-wrapper
    border-bottom 1px solid #d8d8d8
    padding-bottom 10px
    text-align right
    display flex
    justify-content space-between

  .wrapper-list
    display flex
    align-content: flex-start;
    flex-flow: row wrap;
    .list
      background #f1f1f1
      width 240px
      padding 20px
      box-sizing border-box
      margin 10px

      img
        width 200px
        height 110px
        margin 10px 0
      .list-title
        font-size $font-size-small-s
        color #333333
        height 42px
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow:hidden;
      .list-content
        font-size 14px
        color #999
      .list-footer
        display flex
        align-content space-between
        justify-content space-between
        margin-top 10px
        font-size 14px
        span
          color #4a90e2
          &:hover
            cursor pointer

  .pagination
    text-align center
    margin-top 50px

  .operate
    span

      &:hover
        cursor pointer
  .dialog-wrapper{display: flex; align-content: flex-start; flex-flow: row wrap;justify-content: flex-start;margin-top 20px}
  .img-list{flex:  0 0 25%;padding: 5px 10px;box-sizing:border-box;position relative;display flex;align-items center;height 160px;margin-top 20px}
  .img-list:hover{cursor: pointer}
  .img-list img{width: 100%;height 100%}
  .pages{margin-top:50px;text-align center}
  .upload-demo{text-align:right;padding-right 30px}
  .delete{display:none;position absolute;bottom 4px;width 93%;height 20%; background-color: rgba(0,0,0,0.5);text-align center;vertical-align middle;}
  .delete i{color:#fff;position absolute;top 50%;margin-top -10px;margin-left -10px;}
  .active .delete{display:block}
  .el-icon-delete:before{font-size:22px}
  .list-time{color:#666}
</style>
