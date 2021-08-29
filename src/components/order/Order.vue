<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable>
            <el-button slot="append" icon="el-icon-search" ></el-button>
          </el-input>
        </el-col>
      </el-row>

      <el-table :data="orderlist" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款">
          <template v-slot="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间">
          <template v-slot="scope">
            {{ scope.row.create_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button type="primary" icon="el-icon-edit" size="small" @click="showBox"></el-button>
            <el-button type="success" icon="el-icon-location" size="small" @click="showProgressBox"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 20]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

    <el-dialog title="修改地址" width="40%" :visible.sync="addressDialogVisiable" @close="$refs.addressFormRef.resetFields()">
      <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px">
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader :options="cityData" v-model="addressForm.address1"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressDialogVisiable = false">取 消</el-button>
        <el-button @click="addressDialogVisiable = false" type="primary">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="物流进度" width="40%" :visible.sync="progressDialogVisiable">
      <el-timeline>
        <el-timeline-item v-for="(activity, index) in progerssInfo" :key="index" :timestamp="activity.time">
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>

  </div>
</template>

<script>
import cityData from './citydata.js'

export default ({
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      orderlist: [],
      addressDialogVisiable: false,
      progressDialogVisiable: false,
      addressForm: {
        address1: [],
        address2: ''
      },
      addressFormRules: {
        address1: [
          { required: true, message: '请选择省市区县', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请选择详细地址', trigger: 'blur' }
        ]
      },
      cityData: cityData,
      progerssInfo: []
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    async getOrderList() {
      const { data:res } = await this.$http.get('orders', { params: this.queryInfo })
      if(res.meta.status !== 200) return this.$message.error('获取订单列表失败')
      this.orderlist = res.data.goods
      this.total = res.data.total
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    showBox() {
      this.addressDialogVisiable = true
    },
    async showProgressBox(){
      const { data:res } = await this.$http.get('/kuaidi/1106975712662')
      if(res.meta.status !== 200) return this.$message.error('获取物流进度失败')
      this.progerssInfo = res.data
      console.log(this.progerssInfo)
      this.progressDialogVisiable = true
    }
  }
})
</script>

<style lang="less" scoped>
@import '../../plugins/timeline/timeline.css';
@import '../../plugins/timeline-item/timeline-item.css';

.el-cascader{
  width: 100%;
}
</style>
