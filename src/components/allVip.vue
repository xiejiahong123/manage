<template>
    <div>
      <div class="pie">
        <div id="myChart" :style="{width: '400px', height: '400px'}"></div>
        <div id="myChart1" :style="{width: '400px', height: '400px'}"></div>
      </div>
      <div class="bar">
        <div id="myChart2" :style="{width: '1000px', height: '400px'}"></div>
      </div>
    </div>
</template>

<script>
    export default {
        name: "allVip",
      data () {
        return {
          gender:[],
          system:[],
          Xcity:[],
          Ycity:[],
          classData:[]
        }
      },
      mounted(){
        this.drawLine();
        this.init()
      },
      methods: {
        init(){
          this.$get("/HealthAssistant/manage/memberWechat/statistics").then(res=>{
            console.log(res.data)
            for(var i=0;i<res.gender.length;i++){
              this.gender.push({value:res.gender[i].counts,name:res.gender[i].classify=="1"?"男":(res.gender[i].classify=="2"?"女":"未知")})
            }
            for(var j=0;j<res.system.length;j++){
              this.system.push({value:res.system[j].counts,name:res.system[j].classify})
              this.classData.push(res.system[j].classify)
            }
            for(var m=0;m<res.city.length;m++){
              this.Xcity.push(res.city[m].classify)

              this.Ycity.push(res.city[m].counts)
            }
            console.log(this.gender)
            // 基于准备好的dom，初始化echarts实例
            let myChart = this.$echarts.init(document.getElementById('myChart'))
            // 绘制图表
            myChart.setOption({
              title : {
                text: '男女比例',
                x:'center',
                bottom:"0%"
              },
              tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
              },
              legend: {
                // orient: 'vertical',
                // top: 'middle',
                top: 20,
                left: 'center',
                data: ['男', '女',"未知"]
              },
              series : [
                {
                  name: '男女比例',
                  type: 'pie',
                  radius : '55%',
                  center: ['50%', '50%'],
                  data:this.gender,
                  itemStyle: {
                    emphasis: {
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                  }
                }
              ]
            });
            let myChart1 = this.$echarts.init(document.getElementById('myChart1'))
            /*
            * 终端分析
            * */
            myChart1.setOption({
              title : {
                text: '终端分析',
                x:'center',
                bottom:"bottom"
              },
              legend: {
                // orient: 'vertical',
                // top: 'middle',
                top: 20,
                left: 'center',
                data:this.classData
              },
              tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
              },
              // color: ['#5fdf7a','#f0b75e'],
              series : [
                {
                  name: '终端分析',
                  type: 'pie',
                  radius : '55%',
                  center: ['50%', '50%'],
                  data:this.system,
                  itemStyle: {
                    emphasis: {
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                  }
                }
              ]
            });
            /*
            * 地域分布
            * */
            let myChart2 = this.$echarts.init(document.getElementById('myChart2'))
              myChart2.setOption({
                title : {
                  text: '地域分布',
                  x:'center',
                  bottom:"0%"
                },
                color: ['#3398DB'],
                tooltip : {
                  trigger: 'axis',
                  axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                  }
                },
                grid: {
                  left: '3%',
                  right: '4%',
                  bottom: '10%',
                  containLabel: true
                },
                xAxis : [
                  {
                    type : 'category',
                    data : this.Xcity,
                    axisTick: {
                      alignWithLabel: true
                    }
                  }
                ],
                yAxis : [
                  {
                    type : 'value'
                  }
                ],
                series : [
                  {
                    name:'人数',
                    type:'bar',
                    barWidth: '60%',
                    data:this.Ycity
                  }
                ]
              })

          })
        },

        drawLine() {

        }
      }
    }
</script>

<style scoped>
  .pie{display: flex;justify-content: space-between}
</style>
