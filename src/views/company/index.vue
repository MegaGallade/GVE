<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.company"
        placeholder="单位名称"
        clearable
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.companyType"
        placeholder="类型"
        clearable
        class="filter-item"
        style="width: 100px"
      >
        <el-option
          v-for="item in companyTypeOptions"
          :key="item.key"
          :label="item.key"
          :value="item.key"
        />
      </el-select>
      <el-button
        v-waves
        class="filter-item"
        style="margin-left: 1px"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        查询
      </el-button>
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-plus"
        @click="handleCreate"
      >
        新建
      </el-button>

    </div>

    <el-table
      ref="CompanyTable"
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      fit
      border
      tooltip-effect="dark"
      highlight-current-row
      height="600"
      style="width: 100%"
      :header-cell-style="{ background: '#eef1fc', color: '#303132' }"
      @sort-change="sortChange"
    >
      <el-table-column
        prop="id"
        label="序号"
        fixed
        align="center"
        sortable="custom"
        width="80"
      ><template slot-scope="{ row }">
        <span>{{ row.id }}</span>
      </template></el-table-column>
      <el-table-column
        prop="company"
        label="单位名称"
        sortable
        header-align="center"
        width="180"
        show-overflow-tooltip
      />
      <el-table-column
        prop="address"
        label="省市"
        sortable
        header-align="center"
        width="130"
        show-overflow-tooltip
      />
      <el-table-column
        prop="companyType"
        label="类型"
        sortable
        align="center"
        width="80"
        show-overflow-tooltip
      />
      <el-table-column
        prop="salesman"
        label="联系人"
        align="center"
        width="70"
        show-overflow-tooltip
      />
      <el-table-column
        prop="phone"
        label="电话"
        align="center"
        width="120"
        show-overflow-tooltip
      />

      <el-table-column
        prop="remark"
        label="备注"
        header-align="center"
        min-width="150"
        show-overflow-tooltip
      />

      <el-table-column
        label="操作"
        fixed="right"
        align="center"
        width="150"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(row, $index)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-width="90px"
        size="small"
        style="width: ; margin-left: 10px"
      >
        <el-form-item label="单位名称" prop="company" required>
          <el-col :span="elcol">
            <el-input
              v-model="temp.company"
              clearable
              placeholder="请输入公司名称或个人单位"
            />
          </el-col>
        </el-form-item>
        <el-form-item label="省市" prop="address" required>
          <el-col :span="elcol">
            <el-input
              v-model="temp.address"
              clearable
              placeholder="请输入该单位所在的省份和城市"
            />
          </el-col>
        </el-form-item>

        <el-form-item label="类型" prop="companyType" required>
          <el-col :span="elcol">
            <el-radio-group v-model="temp.companyType">
              <el-radio label="买方">买方</el-radio>
              <el-radio label="卖方">卖方</el-radio>
              <el-radio label="其他">其他</el-radio>
              <el-radio label="特殊">特殊</el-radio>
            </el-radio-group>
          </el-col>
        </el-form-item>
        <el-form-item label="联系人" prop="salesman">
          <el-col :span="elcol">
            <el-input
              v-model="temp.salesman"
              clearable
              placeholder="请输入对方主要联系人姓名"
            />
          </el-col>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-col :span="elcol">
            <el-input
              v-model="temp.phone"
              clearable
              placeholder="请输入对方主要联系人电话"
            />
          </el-col>
        </el-form-item>

        <el-form-item label="备注">
          <el-col :span="elcol">
            <el-input
              v-model="temp.remark"
              clearable
              type="textarea"
              placeholder="请输入"
            />
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> 取消 </el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, createArticle, updateArticle } from '@/api/article'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'CompanyIndex',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      form: {},
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        company: undefined,
        companyType: undefined,
        sort: '+id'
      },
      companyTypeOptions: [
        { key: '买方' },
        { key: '卖方' },
        { key: '其他' },
        { key: '特殊' }
      ],
      temp: {
        id: undefined,
        company: '',
        address: '',
        salesman: '',
        phone: '',
        companyType: '',
        remark: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新建'
      },
      downloadLoading: false
      // elcol:20,
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then((response) => {
        this.list = response.data.items
        this.total = response.data.total
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        company: '',
        address: '',
        salesman: '',
        phone: '',
        companyType: '',
        remark: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          createArticle(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '添加单位成功',
              type: 'success',
              duration: 3000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp)
          updateArticle(tempData).then(() => {
            const index = this.list.findIndex((v) => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '编辑 成功',
              type: 'success',
              duration: 3000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      this.$notify({
        title: '成功',
        message: '删除 成功',
        type: 'success',
        duration: 3000
      })
      this.list.splice(index, 1)
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then((excel) => {
        const tHeader = [
          '序号',
          '单位名称',
          '省市',
          '类型',
          '联系人',
          '电话',
          '备注'
        ]
        const filterVal = [
          'id',
          'company',
          'address',
          'companyType',
          'salesman',
          'phone',
          'remark'
        ]
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'company-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map((v) =>
        filterVal.map((j) => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        })
      )
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }

  }
}
</script>

<style lang="scss" scoped>
</style>
