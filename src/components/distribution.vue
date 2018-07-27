<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="全部分销商" name="first">
        <div class="head">
          <el-input placeholder="请输入内容">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </div>
        <div class="table-wrapper">
          <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column prop="date" label="发布时间" width="180"></el-table-column>
            <el-table-column prop="name" label="发布者" width="180"></el-table-column>
            <el-table-column prop="address" label="内容"></el-table-column>
            <el-table-column fixed="right" label="操作" width="100">
              <template slot-scope="scope">
                <el-button @click="handleClick(scope.row)" type="text" size="small">取消资格</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="pagination">
          <el-pagination background layout="prev, pager, next" :total="1000"></el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="待批准" name="second">待批准</el-tab-pane>
      <el-tab-pane label="带返利" name="third">带返利</el-tab-pane>
      <el-tab-pane label="返利明细" name="fourth">返利明细</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  export default {
    name: "information",
    data() {
      return {
        input23: '',
        activeName: 'first',
        tableData: [{
          date: '2016-05-03',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }, {
          date: '2016-05-02',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }, {
          date: '2016-05-04',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }, {
          date: '2016-05-01',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }]
      }
    },
    methods: {
      handleClick(tab, event) {
        // console.log(tab, event);
      },
      handleClick(row) {
        console.log(row);
      }
    }
  }
</script>

<style scoped lang="stylus">
  .head
    .el-input
      width 200px
  .pagination
    text-align center
    margin-top 50px
</style>
