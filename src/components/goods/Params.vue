<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-alert title="注意：只允许为第三类分类设置相关参数" type="warning" :closable="false" show-icon></el-alert>
        <!-- show-icon: 展示默认图标 -->
      
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader v-model="selectedCateKeys" :options="catelist" :props="CateProps" @change="handleChange" 
            clearable>
          </el-cascader>
        </el-col>
      </el-row>

      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <!-- name: 页签的唯一名称，会传递到 Tabs 的双向绑定 -->
          <el-button type="primary" :disabled="isBtnDisabled" @click="addDialogVisible = true">添加参数</el-button>
          <!-- 动态参数表 -->
          <el-table :data="manyTableData" border stripe>
            <el-table-column type="expand">
              <template v-slot="scope">
                <el-tag v-for="(item, index) in scope.row.attr_vals" :key="index" closable @close="handleClose(index, scope.row)">{{ item }}</el-tag>

                <el-input v-if="scope.row.inputVisible" v-model="scope.row.inputValue" class="input-new-tag" 
                  @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)" 
                  size="small" ref="inputRef">
                </el-input>
                <el-button v-else class="button-new-tag" @click="showInput(scope.row)" size="small">+ New Tag</el-button>
                <!-- v-if,v-else 联动实现按钮与输入框的切换 -->
                <!-- keyup.enter.native: enter键按下触发事件 -->
              </template>
            </el-table-column>
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button type="primary" icon="el-icon-edit" size="small" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="small" @click="removeParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" :disabled="isBtnDisabled" @click="addDialogVisible = true">添加属性</el-button>
          <!-- 静态属性表 -->
          <el-table :data="onlyTableData" border stripe>
            <el-table-column type="expand">
              <template v-slot="scope">
                <el-tag v-for="(item, index) in scope.row.attr_vals" :key="index" closable @close="handleClose(index, scope.row)">{{ item }}</el-tag>

                <el-input v-if="scope.row.inputVisible" v-model="scope.row.inputValue" class="input-new-tag" 
                  @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)" 
                  size="small" ref="inputRef">
                </el-input>
                <el-button v-else class="button-new-tag" @click="showInput(scope.row)" size="small">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button type="primary" icon="el-icon-edit" size="small" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="small" @click="removeParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>

    </el-card>
    <!-- 两个添加参数对话框-->
    <el-dialog :title="'添加' + titleText" :visible.sync="addDialogVisible" width="40%" @close="$refs.addFormRef.resetFields()">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button @click="addParams" type="primary">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 两个添加编辑对话框-->
    <el-dialog :title="'编辑' + titleText" :visible.sync="editDialogVisible" width="40%" @close="$refs.editFormRef.resetFields()">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button @click="editParams" type="primary">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data() {
    return {
      //商品分类列表
      catelist: [],
      CateProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
      selectedCateKeys: [],       //级联选择器选中的分类 id
      activeName: 'many',        //被激活的页签名称
      manyTableData: [],        //动态参数的数据
      onlyTableData: [],        //静态属性的数据
      addDialogVisible: false,
      editDialogVisible: false,
      addForm: {
        attr_name: ''
      },
      editForm: {},
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      editFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },

    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    //获取所有商品分类
    async getCateList() {
      const { data:res } = await this.$http.get('categories')
      if(res.meta.status !== 200) return this.$message.error('获取商品分类失败')
      this.catelist = res.data
    },
    handleChange() {
      this.getParamsData()
    },
    handleTabClick() {
      this.getParamsData()
    },
    //获取对应 分类 Id 和 页签 的参数
    async getParamsData() {
      //保证级联选择器选中三级分类
      if(this.selectedCateKeys.length !== 3){
        this.selectedCateKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return
      }
      const { data:res } = await this.$http.get(`categories/${ this.cateId }/attributes`, { params: { sel: this.activeName } })
      if(res.meta.status !== 200) return this.$message.error('获取参数失败')
      //将 attr_vals 由字符串变为数组
      res.data.forEach(item => {
        // 如果 attr_vals 为空，则返回空数组以防渲染空 tag
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        //设置每一行的 tag与input切换 和 input值
        item.inputVisible = false
        item.inputValue = ''
      });
      //根据数据属性，挂载到不同表格
      if(this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    addParams() {
      this.$refs.addFormRef.validate(async valid => {
        if(!valid) return 
        const { data:res } = await this.$http.post(`categories/${ this.cateId }/attributes`, { attr_name: this.addForm.attr_name, attr_sel: this.activeName })
        if(res.meta.status !== 201) return this.$message.error('添加参数失败')
        this.$message.success('添加参数成功')
        this.addDialogVisible = false
        this.getParamsData()
      })
    },
    async showEditDialog(id) {
      const { data:res } = await this.$http.get(`categories/${ this.cateId }/attributes/${ id }`, { params: { attr_sel: this.activeName } })
      if(res.meta.status !== 200) return this.$message.error('获取参数信息失败')
      this.editForm = res.data
      this.editDialogVisible = true
    },
    editParams() {
      this.$refs.editFormRef.validate(async valid => {
        if(!valid) return 
        const { data:res } = await this.$http.put(`categories/${ this.cateId }/attributes/${ this.editForm.attr_id }`, { attr_name: this.editForm.attr_name, attr_sel: this.activeName })
        if(res.meta.status !== 200) return this.$message.error('修改参数失败')
        this.$message.success('修改参数成功')
        this.editDialogVisible = false
        this.getParamsData()
      })
    },
    async removeParams(id) {
      const confirmResult = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', 
        {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'}
      ).catch(err => err)
      if (confirmResult !== 'confirm') return this.$message.info('删除操作已取消')
      const { data: res } = await this.$http.delete(`categories/${ this.cateId }/attributes/${ id }`)
      if(res.meta.status !== 200) return this.$message('删除参数失败')
      this.$message.success('删除参数成功')
      this.getParamsData()
    },
    async handleInputConfirm(row) {
      if(row.inputValue.trim().length === 0){
        row.inputValue = ''
        row.inputVisible = false
        return 
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      this.saveAttrVals(row)
    },
    showInput(row) {
      row.inputVisible = true
      this.$nextTick(_ => {
        //使输入框获得焦点
        this.$refs.inputRef.focus()
      })
      //$nextTick: 当页面被重新渲染时，执行回调函数
    },
    //删除对应的参数可选项
    async handleClose(index, row) {
      row.attr_vals.splice(index, 1)
      this.saveAttrVals(row)
    },
    //将现在的 attr_vals 保存到数据库
    async saveAttrVals(row) {
      const { data:res } = await this.$http.put(`categories/${ this.cateId }/attributes/${ row.attr_id }`, { attr_name: row.attr_name, attr_sel: row.attr_sel, attr_vals: row.attr_vals.join(' ') })
      if(res.meta.status !== 200) return this.$message.error('修改参数项失败')
      this.$message.success('修改参数项成功')
    }
  },
  //计算属性
  computed: {
    //如果需要禁用按钮，返回 true
    isBtnDisabled() {
      if(this.selectedCateKeys.length !== 3) return true
      return false
    },
    //当前选中的三级分类的 id
    cateId() {
      if(this.selectedCateKeys.length === 3) return this.selectedCateKeys[2]
      return null
    },
    //计算添加参数对话框的 title
    titleText() {
      if(this.activeName === 'many') return '动态参数'
      return '静态属性'
    }
  }
}
</script>

<style lang="less" scoped>
.cat_opt{
  margin: 15px 0px;
}
.el-cascader{
  width: 300px;
}
.el-tag{
  margin: 5px;
}
.input-new-tag{
  width: 150px;
  margin: 5px;
}
.button-new-tag{
  margin: 5px;
}
</style>
