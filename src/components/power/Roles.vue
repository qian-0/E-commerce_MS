<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col><el-button type="primary" @click="addDialogVisible = true">添加角色</el-button></el-col>
      </el-row>

      <el-table :data="rolesList" border stripe>
        <el-table-column type="expand">
          <!-- type="expand": 指定展开列 -->
          <template v-slot="scope">
            <el-row :class="['bdbottom', 'vcenter', index_1 === 0 ? 'bdtop' : '']" v-for="(item_1, index_1) in scope.row.children" :key="item_1.id">
              <!-- 一级权限 -->
              <el-col :span="6">
                <el-tag closable @close="removeRightById(scope.row, item_1.id)">{{ item_1.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级和三级权限 -->
              <el-col :span="18">
                <el-row :class="['vcenter', index_2 === 0 ? '' : 'bdtop']" v-for="(item_2, index_2) in item_1.children" :key="item_2.id">
                  <el-col :span="8">
                    <el-tag type="success" closable @close="removeRightById(scope.row, item_2.id)">{{ item_2.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="16">
                    <el-tag v-for="item_3 in item_2.children" :key="item_3.id" type="warning" closable @close="removeRightById(scope.row, item_3.id)">{{ item_3.authName }}</el-tag>
                    <!-- closable: Tag属性，是否显示删除按钮 -->
                    <!-- close: Tag事件，点击删除按钮时触发-->
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeRoleById(scope.row.id)">删除</el-button>
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog title="添加角色" width="40%" :visible.sync="addDialogVisible" @close="$refs.addFormRef.resetFields()">
      <el-form :model="addForm" :rules="FormRules" ref="addFormRef" label-width="90px">
        <el-form-item label="角色名" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button @click="addRole" type="primary">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="编辑角色" width="40%" :visible.sync="editDialogVisiable" @close="$refs.editFormRef.resetFields()">
      <el-form :model="editForm" :rules="FormRules" ref="editFormRef" label-width="90px">
        <el-form-item label="角色名" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisiable = false">取 消</el-button>
        <el-button @click="editRoleInfo" type="primary">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="40%" @close="defKeys = []">
      <el-tree :data="rightslist" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys" ref="treeRef"></el-tree>
      <!-- show-checkbox: Tree属性，是否显示选择框 -->
      <!-- node-key: Tree属性，每个树节点的唯一标识属性，整棵树应该是唯一的 -->
      <!-- default-expand-all: Tree属性，是否展开所有节点 -->
      <!-- default-checked-keys: Tree属性，默认勾选的节点的 key 的数组-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button @click="allotRights" type="primary">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rolesList: [], //角色列表
      //对话框 隐藏与否
      addDialogVisible: false,
      editDialogVisiable: false,
      setRightDialogVisible: false,
      //添加角色的表单数据
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      editForm: {}, //编辑角色的表单数据
      //表单的验证规则对象
      FormRules: {
        roleName: [
          { required: true, message: '请输入角色名', trigger: 'blur' },
          { min: 2, max: 10, message: '角色长度为 2-10 字符', trigger: 'blur' }
        ],
        roleDesc: [{ max: 30, message: '角色描述长度至多 30 字符', trigger: 'blur' }]
      },
      rightslist: [], //所有权限列表
      //树形控件的属性绑定对象
      treeProps: {
        label: 'authName', //需要展示的属性
        children: 'children' //实现父子关系的属性名
      },
      defKeys: [], //默认选中的权限节点 key 数组
      roleId: '' //当前即将分配角色权限的 id
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    //获取角色列表
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error('获取角色列表失败')
      this.rolesList = res.data
    },
    //添加角色，包括表单预验证
    addRole() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('roles', this.addForm)
        if (res.meta.status !== 201) return this.$message.error('添加角色失败')
        this.$message.success('添加角色成功')
        this.addDialogVisible = false
        this.getRolesList()
      })
    },
    //展示编辑角色的对话框
    async showEditDialog(id) {
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) return this.$message.error('查询角色信息失败')
      this.editForm = res.data
      this.editDialogVisiable = true
    },
    //修改角色信息并提交
    editRoleInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('roles/' + this.editForm.roleId, { roleName: this.editForm.roleName, roleDesc: this.editForm.roleDesc })
        if (res.meta.status !== 200) return this.$message.error('更新角色信息失败')
        this.$message.success('更新角色信息成功')
        this.editDialogVisiable = false
        this.getRolesList()
      })
    },
    //根据 id 删除角色
    async removeRoleById(id) {
      const confirmResult = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).catch(err => err)
      if (confirmResult !== 'confirm') return this.$message.info('删除操作已取消')
      const { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) return this.$message('删除角色失败')
      this.$message.success('删除角色成功')
      this.getRolesList()
    },
    //根据 id 删除权限
    async removeRightById(role, rightId) {
      const confirmResult = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).catch(err => err)
      if (confirmResult !== 'confirm') return this.$message.info('删除操作已取消')
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      if (res.meta.status !== 200) return this.$message('删除权限失败')
      this.$message.success('删除权限成功')
      role.children = res.data //防止删除后角色权限列表折叠
    },
    //展示 分配权限对话框，并获取数据
    async showSetRightDialog(role) {
      //保存当前 role 的id，方便 allotRights 函数调用
      this.roleId = role.id
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) return this.$message.err('获取权限数据失败')
      this.rightslist = res.data
      this.getLeafKeys(role, this.defKeys)
      this.setRightDialogVisible = true
    },
    //通过递归的形式获取角色下所有三级权限的 id 值，并保存到 defKeys 中
    getLeafKeys(node, arr) {
      if (!node.children) return arr.push(node.id)
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    },
    //点击节点，为角色分配权限
    async allotRights() {
      const keys = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()]
      //getCheckedKeys: Tree函数，返回目前被选中的节点的 key 所组成的数组
      //getHalfCheckedKeys: Tree函数，返回目前半选中的节点的 key 所组成的数组
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (res.meta.status !== 200) return this.$message.error('分配权限失败')
      this.$message.success('分配权限成功')
      this.getRolesList()
      this.setRightDialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
