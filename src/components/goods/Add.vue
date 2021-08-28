<template>
    <div>
        <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-alert title="添加商品信息" type="info" :closable="false" center show-icon></el-alert>
      <!-- center: 使提示信息居中 -->

      <el-steps :space="180" :active="activeIndex - 0" finish-status="success" align-center>
        <!-- align-center: 指定步骤条是否居中显示 -->
        <!-- active: 指定激活的步骤, 减 0 是将 activeIndex 转换成 数值 -->
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
        <!-- label-position: 指定 label 相对于输入框的位置 -->
        <el-tabs tab-position="left" v-model="activeIndex" :before-leave="beforeTabLeave" @tab-click="tabClicked">
          <!-- tab-position: 指定标签所在位置 -->
          <!-- before-leave: 切换标签之前的钩子，如果返回 false 或者 失败的Promise对象，则阻止切换
            第一个参数代表 即将进入的标签页的 name 名称， 第二个参数代表 即将离开的标签页的名称 -->
          <!-- tab-click: Tabs事件，tab 被选中时触发 -->
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
              <!-- type="number": 规定只能输入数字 -->
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader v-model="addForm.goods_cat" :options="catelist" :props="cateProps" @change="handleChange" 
                clearable>
              </el-cascader>
            </el-form-item>
          </el-tab-pane>
          <!-- name: Tab-pane的值，会被传递至 Tabs 用以双项绑定 -->
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="cb" v-for="(cb, index) in item.attr_vals" :key="index" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" prop="" v-for="item in onlyTableData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload :action="uploadURL" :on-preview="handlePreview" :on-remove="handleRemove" list-type="picture" 
              :headers="headerObj" :on-success="handleSuccess">
              <!-- action: 上传图片需请求的 API 接口 -->
              <!-- on-preview: 指定点击的预览的钩子，参数为文件信息 -->
              <!-- on-remove：指定移除文件的钩子，第一个参数为被移除文件信息，第二个参数代表上传的文件列表 -->
              <!-- list-type: 指定预览组件的呈现方式 -->
              <!-- headers: 指定上传的请求头部 -->
              <!-- on-success: 文件上传成功时的钩子，第一个参数代表服务器响应，第二个参数代表文件信息，第三个参数代表上传的文件列表 -->
              <el-button type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button type="primary" class="btnAdd" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>

    </el-card>

    <el-dialog title="图片预览" :visible.sync="previewVisible" width="60%">
      <img :src="previewPath" alt="" class="previewImg">
    </el-dialog>

    </div>
</template>

<script>
import _ from 'lodash'

export default({
  data() {
    return {
      activeIndex: '0',
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],        //商品所属的分类数组
        pics: [],             //添加图片的数组
        goods_introduce: '',
        attrs: []
      },
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
      catelist: [],
      cateProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
      manyTableData: [],      //动态参数列表数据
      onlyTableData: [],      //静态属性列表数据
      uploadURL: 'http://www.ysqorz.top:8888/api/private/v1/upload',
      //upload 组件的 请求头对象
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      previewPath: '',      //预览图片路径
      previewVisible: false,
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data:res } = await this.$http.get('categories')
      if(res.meta.status !== 200) return this.$message.error('获取商品分类失败')
      this.catelist = res.data
    },
    handleChange() {
      if(this.addForm.goods_cat.length !== 3){
        this.addForm.goods_cat = []
        return
      }
    },
    beforeTabLeave(activeName, oldActiveName) {
      if(oldActiveName === '0' && this.addForm.goods_cat.length !== 3){
        this.$message.error('请先选择商品分类')
        return false
      }
    },
    async tabClicked() {
      //访问商品参数面板
      if(this.activeIndex === '1'){
        const { data:res } = await this.$http.get(`categories/${ this.cateId }/attributes`, { params: { sel: 'many' } })
        if(res.meta.status !== 200) return this.$message.error('获取商品动态参数列表失败')
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        this.manyTableData = res.data
      }else if(this.activeIndex === '2'){
        const { data:res } = await this.$http.get(`categories/${ this.cateId }/attributes`, { params: { sel: 'only' } })
        if(res.meta.status !== 200) return this.$message.error('获取商品静态属性列表失败')
        this.onlyTableData = res.data
      }
    },
    handlePreview(file) {
      this.previewPath = file.response.data.url
      this.previewVisible = true
    },
    handleRemove(file) {
      const filePath = file.response.data.tem_path
      const index = this.addForm.pics.findIndex(item => item.pic === filePath)
      this.addForm.pics.splice(index, 1)
    },
    handleSuccess(response) {
      const picInfo = { pic: response.data.tem_path }
      this.addForm.pics.push(picInfo)
    },
    add() {
      this.$refs.addFormRef.validate(async valid => {
        if(!valid) return this.$message.error('请填写必要的表单项')
        //使用 lodash 深拷贝
        this.manyTableData.forEach(item => {
          const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals.join(' ') }
          this.addForm.attrs.push(newInfo)
        })
        this.onlyTableData.forEach(item => {
          const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals }
          this.addForm.attrs.push(newInfo)
        })
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        
        const { data:res } = await this.$http.post('goods', form)
        if(res.meta.status !== 201) return this.$message.error('添加商品失败')
        this.$message.success('添加商品成功')
        this.$router.push('/goods')
      })
    }
  },
  computed: {
    cateId() {
      if(this.addForm.goods_cat.length === 3) return this.addForm.goods_cat[2]
      return null
    }
  }
})
</script>

<style lang="less" scoped>
.el-checkbox{
  margin: 0px 10px 0px 0px !important;
}
.previewImg{
  width: 100%;
}
.btnAdd{
  margin-top: 15px;
}
</style>
