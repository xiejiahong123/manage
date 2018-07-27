<template>
  <div>
    <div>

      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-input placeholder="请输入内容"  class="search" v-model="input">
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
          <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
        </el-input>
        <el-tab-pane v-for="title in types" :label="title.label" :name="title.name" :key="title.id" :type="title.type">
          <el-table :data="orderList" style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="props">
                <ul >
                  <li class="detail-title">
                    <span>商品详情</span>
                    <span>单品单价</span>
                    <span>购买数量</span>
                  </li>
                </ul>
               <div v-for="item in props.row.list">
                 <ul>
                   <li class="detail-content">
                     <span class="detail-description"><img :src="item.image" alt=""> <span>{{item.description}}</span></span>
                     <span class="detail-other">{{item.price}}</span>
                     <span class="detail-other">{{item.count}}</span>
                   </li>
                 </ul>
               </div>
              </template>
            </el-table-column>
            <el-table-column label="订单号" prop="orderForm.alias"  width="300"></el-table-column>
            <el-table-column label="收货人" prop="orderForm.recipient"></el-table-column>
            <el-table-column label="金额" prop="orderForm.actualExpenditure"></el-table-column>
            <el-table-column label="状态" prop="orderForm.transactionStatus" :formatter="formatSex" ></el-table-column>
            <el-table-column label="运单号" prop="orderForm.waybill" v-if="type==3" ></el-table-column>
            <el-table-column fixed="right" label="操作" width="200"  v-if="type==2||type==3">
              <template slot-scope="scope">
                <!--<el-button type="text" size="small" @click.native.prevent="deleteRow(scope.$index)" >删除</el-button>-->
                <el-button type="text" size="small" @click="setGoods(scope.$index, scope.row)" v-if="scope.row.orderForm.transactionStatus==2">确认发货</el-button>
                <el-button type="text" size="small" @click="submit(scope.$index, scope.row)" v-if="scope.row.orderForm.transactionStatus==3">确认收货</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination">
            <el-pagination background layout="prev, pager, next" :total="count"  @current-change="changePage" :current-page.sync="currentPage1"></el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  export default {
    name: "indent",
    data() {
      return {
        activeName: 'first',
        orderList:[],
        count:0,
        input:"",
        currentPage1: 1,
        isShow:true,
        type:0,
        types:[
          {id:"1",label:"全部订单",name:"first",type:"0"},
          {id:"2",label:"待付款",name:"second",type:"1"},
          {id:"3",label:"待发货",name:"third",type:"2"},
          {id:"6",label:"已发货",name:"six",type:"3"},
          {id:"4",label:"已完成",name:"fourth",type:"4"},
          {id:"5",label:"已取消",name:"five",type:"5"}],
      };
    },
    mounted(){
      this.init()
    },
    methods: {
      submit(index,row){
        console.log(index,row)

        this.$post("/HealthAssistant/manage/order/receiveGoods",{guid:row.orderForm.orderGuid}).then(res=>{
          console.log(res)
          this.orderList.splice(index,1)

        })
      },
      setGoods(index,row){
        console.log(index,row)
        this.$prompt('请输入运单号', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          // inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
          // inputErrorMessage: '邮箱格式不正确'
        }).then(({ value }) => {
          // this.$message({
          //   type: 'success',
          //   message: '你的邮箱是: ' + value
          // });
          let params={
            guid:row.orderForm.orderGuid,
            waybill:value
          }
          this.$post("/HealthAssistant/manage/order/deliverGoods",params).then(res=>{
            console.log(res)
            this.orderList.splice(index,1)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });
        });
      },
      formatSex(row){
        // console.log(row,colum)
        if(row.orderForm.transactionStatus==1){
          return "待付款"
        }else if(row.orderForm.transactionStatus==2){
          return "待发货"
        }else if(row.orderForm.transactionStatus==3){
          return "已发货"
        }else if(row.orderForm.transactionStatus==4){
          return "已完成"
        }else if(row.orderForm.transactionStatus==5){
          return "已取消"
        }
      },
      /**
       *删除
       */
      deleteRow(index){
        this.orderList.splice(index,1)
      },
      /**
       * 查询
       */
      search(){
        console.log(this.input)
        if(this.input==""){
          this.$message({
            message: '请输入订单号',
            type: 'warning'
          });
        }else{
          this.$get("/HealthAssistant/manage/order/getOrderByAlias",{alias:this.input}).then(res=>{
            this.orderList=res
            this.count=1
          })
        }
      },
      /**
       * 初始化数据
       */
      init(){
        this.$get("/HealthAssistant/manage/order/getOrders",{page:1}).then(res=>{
          console.log(res)
          this.orderList=res.myOrderDetailDTOList
          this.count=res.count
        })
      },
      /**
       * 切换导航
       * @param row
       */
      handleClick(row){
        console.log(row.$attrs.type)
        this.currentPage1=1
        this.type=row.$attrs.type
        if(row.$attrs.type==0){
          this.$get("/HealthAssistant/manage/order/getOrders",{page:1}).then(res=>{
            console.log(res)
            this.isShow=true
            this.orderList=res.myOrderDetailDTOList
            this.count=res.count
          })
        }else{
          let data={
            type:row.$attrs.type,
            page:1
          }
          this.$get("/HealthAssistant/manage/order/getOrdersByType",data).then(res=>{
            console.log(res)
            this.isShow=false
            this.count=res.count
            this.orderList=res.myOrderDetailDTOList
          })
        }
        console.log(row)
      },
      /**
       * 分页
       * @param row
       */
      changePage(e){
        if(this.type==0){
          this.$get("/HealthAssistant/manage/order/getOrders",{page:e}).then(res=>{
            console.log(res)
            this.orderList=res.myOrderDetailDTOList
          })
        }else{
          let data={
            type:this.type,
            page:e
          }
          this.$get("/HealthAssistant/manage/order/getOrdersByType",data).then(res=>{
            this.orderList=res.myOrderDetailDTOList
          })
        }
      }
    }
  }
</script>

<style scoped lang="stylus">
  .pagination
    text-align center
    margin-top 50px
    .demo-table-expand {
      font-size: 0;
    }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  .detail-title{display:flex;justify-content space-betwee;background:#f5f7fa;height 40px;align-items center}
  .detail-title  span{flex:1;text-align center}
  .detail-content{display:flex;justify-content space-between}
  .detail-content img{width:100px;height 80px}
  .detail-description{display:flex;justify-content space-between;align-items center}
  .detail-other{display:flex;align-items center;justify-content center}
  .detail-content span{flex:1;margin-left 10px}
  .search{width:300px}
</style>
