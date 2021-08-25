<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col><el-button type="primary" @click="showAddCateDialog">添加分类</el-button></el-col>
      </el-row>

      <tree-table class="treeTable" :data="catelist" :columns="columns" :selection-type="false" :expand-type="false" show-index index-text="#" border :show-row-hover="false">
        <!-- columns: tree-table属性，指定表格各列配置 -->
        <!-- selection-type: tree-table属性，指定是否为多选类型表格 -->
        <!-- expand-type: tree-table属性，指定是否为展开类型表格 -->
        <!-- show-index: tree-table属性，指定是否显示数据索引列; index-text: tree-table属性，指定数据索引列的列名 -->
        <!-- show-row-hover: tree-table属性，指定鼠标悬停时，是否高亮当前行 -->
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" style="color: lightgreen" v-if="scope.row.cat_deleted === false"></i>
          <i class="el-icon-error" style="color: red" v-else></i>
        </template>
        <template slot="order" slot-scope="scope">
          <el-tag type="primary" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <template slot="opt" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="small">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="small" @click="removeCateById(scope.row.cat_id)">删除</el-button>
        </template>
      </tree-table>

      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 20]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

    <el-dialog title="添加分类" width="40%" :visible.sync="addCateDialogVisible" @close="addCateDialogClosed">
      <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader v-model="selectedKeys" :options="parentCateList" :props="cascaderProps" @change="parentCateChanged" clearable change-on-select></el-cascader>
          <!-- options: 级联选择器的数据源 -->
          <!-- props: 指定级联选择器的配置对象 -->
          <!-- 双向绑定级联选择器选中的数据，绑定对象对象必须为 数组-->
          <!-- change-on-select: Cascader属性，指定是否允许选中任意一项 -->
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button @click="addCate" type="primary">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data() {
    return {
      catelist: [],    //商品分类列表
      //查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      //tree-table 列的配置
      columns: [
        { label: '分类名称', prop: 'cat_name' },
        { label: '是否有效', type: 'template', template: 'isok'},
        //type:'template' 指定当前列定义为模板列，template:指定模板
        { label: '排序', type: 'template', template: 'order'},
        { label: '操作', type: 'template', template: 'opt'}
      ],
      addCateDialogVisible: false,
      addCateForm: {
        cat_name: '',
        cat_pid: 0,     //父级分类的 id
        cat_level: 0    //分类的等级
      },
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      parentCateList: [],   //父级分类的列表
      //级联选择器配置对象
      cascaderProps: {
        expandTrigger: 'hover',   //指定通过 hover 方式展开子菜单
        value: 'cat_id',      //选项选中值传递的属性
        label: 'cat_name',      //选项展示文本的属性
        children: 'children',   //父子嵌套的属性
      },
      selectedKeys: [],       //选中的父级分类的 id 数组
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data:res } = await this.$http.get('categories', { params: this.queryInfo })
      if(res.meta.status !== 200) return this.$message.error('获取商品分类失败')
      this.catelist = res.data.result
      this.total = res.data.total
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    showAddCateDialog() {
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    //获取父级分类的数据列表
    async getParentCateList() {
      const { data:res } = await this.$http.get('categories', { params: { type: 2 } })
      if(res.meta.status !== 200) return this.$message.error('获取父级分类数据失败')
      this.parentCateList = res.data
    },
    parentCateChanged() {
      if(this.selectedKeys.length > 0){
        //已选中父级分类
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length-1]
        this.addCateForm.cat_level = this.selectedKeys.length
        return
      }else{
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    addCate() {
      this.$refs.addCateFormRef.validate(async valid => {
        if(!valid) return
        const { data:res } = await this.$http.post('categories', this.addCateForm)
        if(res.meta.status !== 201) return this.$message.error('添加分类失败')
        this.$message.success('添加分类成功')
        this.getCateList()
        this.addCateDialogVisible = false
      })
    },
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields()
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
      this.selectedKeys = []
    },
    async removeCateById(id) {
      const confirmResult = await this.$confirm('此操作将永久删除该商品分类, 是否继续?', '提示', 
        {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'}
      ).catch(err => err)
      if (confirmResult !== 'confirm') return this.$message.info('删除操作已取消')
      const { data: res } = await this.$http.delete('categories/' + id)
      if(res.meta.status !== 200) return this.$message('删除商品分类失败')
      this.$message.success('删除商品分类成功')
      this.getCateList()
    }
  }
}
</script>

<style lang="less" scoped>
.treeTable{
  margin-top: 15px;
}
.el-cascader{
  width: 100%;
}
</style>
