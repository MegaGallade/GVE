<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.uav"
        placeholder="请输入飞机编号"
        clearable
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.uavType"
        placeholder="类型"
        clearable
        class="filter-item"
        style="width: 100px"
      >
        <el-option
          v-for="item in uavTypeOptions"
          :key="item.key"
          :label="item.value"
          :value="item.key"
        />
      </el-select>
      <el-select
        v-model="listQuery.useType"
        placeholder="状态"
        clearable
        class="filter-item"
        style="width: 100px"
      >
        <el-option
          v-for="item in useTypeOptions"
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

    <!-- -----------------------表格------------------------- -->

    <el-table
      ref="UavTable"
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
        prop="uav"
        label="飞机编号"
        sortable
        align="center"
        width="150"
        show-overflow-tooltip
      />

      <el-table-column
        prop="light"
        label="灯组&广播编号"
        sortable
        align="center"
        width="140"
        show-overflow-tooltip
      />
      <el-table-column
        prop="wifi"
        label="WiFi"
        sortable
        align="center"
        width="130"
        show-overflow-tooltip
      />
      <el-table-column
        prop="uavType"
        label="类型"
        sortable
        align="center"
        width="80"
        show-overflow-tooltip
      />
      <el-table-column
        prop="useType"
        label="状态"
        sortable
        align="center"
        width="80"
        show-overflow-tooltip
      />
      <el-table-column
        prop="remark"
        label="备注"
        header-align="center"
        min-width="150"
        show-overflow-tooltip
      />
      <el-table-column label="生产信息" align="center">
        <el-table-column
          prop="productionOrder"
          label="生产单号"
          sortable
          header-align="center"
          width="120"
          show-overflow-tooltip
        />
        <el-table-column
          prop="dateInProduced"
          label="生产日期"
          sortable
          header-align="center"
          width="130"
          show-overflow-tooltip
        />
      </el-table-column>

      <el-table-column label="保险信息（只读）" align="center">
        <el-table-column
          prop="isInsurance"
          label="参保"
          sortable
          align="center"
          width="80"
          show-overflow-tooltip
        ><template scope="{row}">
          <span :style="{ color: row.isInsurance ? 'green' : 'red' }">
            {{ isInsurance[row.isInsurance] }}</span>
        </template>
        </el-table-column>
        <el-table-column
          prop="insurance"
          label="保险单号"
          sortable
          header-align="center"
          width="110"
          show-overflow-tooltip
        />
        <el-table-column
          prop="state"
          label="状态"
          sortable
          align="center"
          width="80"
          show-overflow-tooltip
        />
        <el-table-column
          prop="days"
          label="天数"
          sortable
          align="center"
          width="80"
          show-overflow-tooltip
        />
      </el-table-column>

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
        label-width="100px"
        size="small"
        style="width: ; margin-left: 10px"
      >
        <el-form-item label="无人机编号" prop="uav" required>
          <el-col :span="elcol">
            <el-input
              v-model="temp.uav"
              placeholder="请输入无人机编号，如‘6HGUP22FB085C’"
              clearable
            />
          </el-col>
        </el-form-item>
        <el-form-item label="灯组编号" prop="light" required>
          <el-col :span="elcol">
            <el-input
              v-model="temp.light"
              placeholder="请输入灯组或广播编号，如‘6HGLT22FB085C’"
              clearable
            />
          </el-col>
        </el-form-item>
        <el-form-item label="WiFi号" prop="wifi" required>
          <el-col :span="elcol">
            <el-input
              v-model="temp.wifi"
              placeholder="请输入WiFi号，如‘GBI_6200CFCF’"
              clearable
            />
          </el-col>
        </el-form-item>

        <el-form-item label="类型" prop="uavType" required>
          <el-col :span="elcol">
            <el-radio-group v-model="temp.uavType">
              <el-radio
                v-for="item in uavTypeOptions"
                :key="item.key"
                :label="item.key"
              >{{ item.key }}</el-radio>
            </el-radio-group>
          </el-col>
        </el-form-item>
        <el-form-item label="状态" prop="useType" required>
          <el-col :span="elcol">
            <el-radio-group v-model="temp.useType">
              <el-radio
                v-for="item in useTypeOptions"
                :key="item.key"
                :label="item.key"
              >{{ item.key }}</el-radio>
            </el-radio-group>
          </el-col>
        </el-form-item>

        <el-form-item label="生产单号" prop="productionOrder">
          <el-col :span="elcol">
            <el-input
              v-model="temp.productionOrder"
              placeholder="请输生产单号"
              clearable
            />
          </el-col>
        </el-form-item>
        <el-form-item label="生产日期">
          <el-date-picker
            v-model="temp.dateInProduced"
            type="datetime"
            placeholder="生产日期"
          >>
          </el-date-picker>
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
  name: 'UavIndex',
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
        uav: undefined,
        uavType: undefined,
        useType: undefined,
        sort: '-id'
      },
      useTypeOptions: [
        { key: '生产中', value: '生产中' },
        { key: '测试中', value: '测试中' },
        { key: '库存中', value: '库存中' },
        { key: '可使用', value: '可使用' },
        { key: '维修中', value: '维修中' },
        { key: '租用中', value: '租用中' },
        { key: '已售出', value: '已售出' },
        { key: '已废弃', value: '已废弃' },
        { key: '未知', value: '未知' }
      ],
      uavTypeOptions: [
        { key: '照明机' },
        { key: '广播机' },
        { key: '直播机' },
        { key: '机巢机' },
        { key: '航拍机' },
        { key: '其他' }
      ],
      isInsurance: {
        true: '是',
        false: '否'
      },
      temp: {
        id: undefined,
        uav: '',
        light: '',
        wifi: '',
        uavType: '',
        useType: '',
        productionOrder: '',
        dateInProduced: '',
        remark: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新建'
      },
      downloadLoading: false,
      elcol: 20
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
        uav: '',
        light: '',
        wifi: '',
        uavType: '',
        useType: '',
        productionOrder: '',
        dateInProduced: '',
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
              message: '添加成功',
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
          '飞机编号',
          '机箱编号',
          'WiFi号',
          '类型',
          '状态',
          '生产单号',
          '生产日期',
          '备注'
        ]
        const filterVal = [
          'id',
          'uav',
          'light',
          'wifi',
          'uavType',
          'useType',
          'productionOrder',
          'dateInProduced',
          'remark'
        ]
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'uav-list'
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
