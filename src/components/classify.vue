<template>
  <div>
    <div>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <div class="btn-wrapper">
          <!--<el-button >排序</el-button> -->
        </div>
        <el-tab-pane :label="item.name" :name="item.typeIndex" v-for="item in title" :typeId="item.id" :key="item.id">
          <draggable v-model="tableData" :move="getdata" @update="datadragEnd" class="draggable-wrapper">
            <transition-group>
              <div v-for="(element,index) in tableData" :key="index" class="drag-list">
                <span>{{element.name}}</span>
                <el-button type="text" @click="deleteList(index,element.id)">删除</el-button>
              </div>
            </transition-group>
          </draggable>
          <div class="submit-wrapper">
            <el-button  @click="addOpen">新增</el-button>
            <el-button type="success" @click="submit">保存</el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  import draggable from "vuedraggable"
  export default {
    name: "classify",
    data() {
      return {
        activeName: '1',
        tableData: [],
        title:[
          {id:1,name:"资讯分类",typeIndex:"1"},{id:2,name:"商品分类",typeIndex:"2"}
        ],
        type:"1"
      };
    },
    mounted(){
      this.init()
    },
    methods: {
      /**
       * 初始化
       */
      init(){
        this.$get("/HealthAssistant/manage/contentType/getByType",{type:1}).then(data=>{
          this.tableData=data
          console.log(this.tableData)
        }).catch(error=>{

        })
      },
      /**
       * 提交数据
       */
      submit(){
        // console.log(row)
        console.log(this.tableData)
        if(this.type==1){
          this.$axios.post("/HealthAssistant/manage/contentType/setInformationType", this.tableData).then(()=>{
            this.$message({
              type: 'success',
              message: '保存成功!'
            });
          }).catch(()=>{
            this.$message({
              type: 'error',
              message: '请求失败!'
            });
          })

        }else if(this.type==2){
          this.$axios.post("/HealthAssistant/manage/contentType/setCommodityType",this.tableData).then(()=>{
            this.$message({
              type: 'success',
              message: '保存成功!'
            });
          }).catch(()=>{
            this.$message({
              type: 'error',
              message: '请求失败!'
            });
          })
        }
      },
      /**
       * 删除当前行
       * @param index
       */
      deleteList(index,id){
        console.log(index,id)
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$get("/HealthAssistant/manage/contentType/checkDelete",{type:this.type,guid:id}).then(res=>{
            if(res==true){
              this.$message({
                type: 'error',
                message: '里面有内容，不能删除!'
              });
            }else {
              this.tableData.splice(index, 1);
              if (this.type == 1) {
                this.$axios.post("/HealthAssistant/manage/contentType/setInformationType", this.tableData).then(() => {

                  this.$message({
                    type: 'success',
                    message: '删除成功!'
                  });
                }).catch(() => {
                  this.$message({
                    type: 'error',
                    message: '删除失败'
                  });
                })
              }else if (this.type == 2) {
                this.$axios.post("/HealthAssistant/manage/contentType/setCommodityType", this.tableData).then(() => {

                  console.log(res)
                  this.$message({
                    type: 'success',
                    message: '删除成功!'
                  });
                }).catch(() => {
                  this.$message({
                    type: 'error',
                    message: '删除失败'
                  });
                })
              }
            }
          })
        }).catch(() => {

          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      /**
       * 新增
       */
      addOpen(){
        this.$prompt('请输入新增标题', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {
          this.tableData.push({id:"",type:this.type,name:value,typeIndex:""})
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });
        });
      },
      /**
       * 切换导航
       * @param row
       */
      handleClick(row) {
        let typeId=row.$attrs.typeId;
        this.type=typeId
        this.$get("/HealthAssistant/manage/contentType/getByType",{type:typeId}).then(res=>{
          console.log(res)
          this.tableData=res
        }).catch(error=>{

        })
      },
      getdata (evt) {
        console.log(evt.draggedContext.element.id)
      },
      datadragEnd (evt) {
        console.log('拖动前的索引 :' + evt.oldIndex)
        console.log('拖动后的索引 :' + evt.newIndex)
        console.log(this.tableData)
      },
    },
    components:{
      draggable
    }
  }
</script>

<style scoped lang="stylus">
  .btn-wrapper
    border-bottom 1px solid #d8d8d8
    padding-bottom 10px
    text-align right
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
  .submit-wrapper
    text-align center
    margin-top 50px
</style>
