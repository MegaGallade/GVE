<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.insurance"
        placeholder="保单号"
        clearable
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.uav"
        placeholder="飞机编号"
        clearable
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.state"
        placeholder="状态"
        clearable
        class="filter-item"
        style="width: 100px"
      >
        <el-option
          v-for="item in stateTypeOptions"
          :key="item.key"
          :label="item.value"
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
      <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >
        下载
      </el-button>
      <el-checkbox
        v-model="isShowFull"
        class="filter-item"
        style="margin-left: 10px"
        @change="showFull"
      >
        显示完整信息
      </el-checkbox>
    </div>

    <!-- 表格 -->

    <el-table
      ref="insuranceTable"
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
        label="NO."
        fixed
        align="center"
        sortable="custom"
        width="70"
      ><template slot-scope="{ row }">
        <span>{{ row.id }}</span>
      </template></el-table-column>
      <el-table-column
        prop="insurance"
        label="保单号"
        sortable
        header-align="center"
        width="180"
        show-overflow-tooltip
      >
        <!-- <template slot-scope="{ row }">{{ row.insurance }}</template> -->
      </el-table-column>
      <el-table-column
        prop="uav"
        label="飞机编号"
        sortable
        header-align="center"
        width="140"
        show-overflow-tooltip
      />
      <el-table-column
        prop="order"
        label="订单号"
        sortable
        header-align="center"
        width="145"
        show-overflow-tooltip
      />
      <el-table-column
        prop="customer"
        label="客户"
        sortable
        header-align="center"
        width="150"
        show-overflow-tooltip
      />
      <el-table-column
        prop="salesman"
        label="业务员"
        align="center"
        width="70"
        show-overflow-tooltip
      />
      <el-table-column
        prop="state"
        label="状态"
        sortable
        align="center"
        width="80"
        show-overflow-tooltip
      >
        >
        <template slot-scope="{ row }">
          <el-tag :type="stateType[row.state]" effect="dark">{{
            row.state
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="end_date"
        label="天数"
        sortable
        align="center"
        width="80"
        show-overflow-tooltip
      >
        //
        <template slot-scope="{ row }">
          <el-tag
            :type="daysType(row.state, daysCounting(row))"
          >{{ row.days }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="isRemind"
        label="提醒"
        sortable
        align="center"
        width="80"
        show-overflow-tooltip
      >
        <template slot-scope="{ row }">
          <el-tag :type="remindType(row)">
            {{ remindDisplay[row.isRemind] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="isRenewal"
        label="续保"
        sortable
        align="center"
        width="80"
        show-overflow-tooltip
      >
        <template slot-scope="{ row }">
          <el-tag :type="renewalType(row)">
            {{ renewalDisplay[row.isRenewal] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="start_date"
        label="保单起始日"
        sortable
        align="center"
        width="160"
        show-overflow-tooltip
      ><template slot-scope="{ row }">
        {{ row.start_date | parseTime("{y}年{m}月{d}日00时") }}
      </template>
      </el-table-column>
      <el-table-column
        prop="end_date"
        label="保单到期日"
        sortable
        align="center"
        width="160"
        show-overflow-tooltip
      ><template slot-scope="{ row }">
        {{ row.end_date | parseTime("{y}年{m}月{d}日24时") }}
      </template>
      </el-table-column>
      <el-table-column
        v-if="isShowFull"
        prop="serial"
        label="序列号"
        sortable
        align="center"
        width="150"
        show-overflow-tooltip
      />
      <el-table-column
        v-if="isShowFull"
        prop="case"
        label="机箱编号"
        sortable
        align="center"
        width="140"
        show-overflow-tooltip
      />
      <el-table-column
        v-if="isShowFull"
        prop="light"
        label="灯组编号"
        sortable
        align="center"
        width="140"
        show-overflow-tooltip
      />
      <el-table-column
        v-if="isShowFull"
        prop="remote"
        label="遥控器编号"
        sortable
        align="center"
        width="140"
        show-overflow-tooltip
      />
      <el-table-column
        v-if="isShowFull"
        prop="wifi"
        label="WiFi"
        sortable
        align="center"
        width="130"
        show-overflow-tooltip
      />
      <el-table-column
        v-if="isShowFull"
        prop="interphone"
        label="对讲机编号"
        sortable
        align="center"
        width="140"
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
        label="续保"
        align="center"
        width="150"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <el-button
            v-if="row.isRemind"
            size="mini"
            type="success"
            @click="handleModifyRemind(row, false)"
          >
            已提醒
          </el-button>
          <el-button
            v-if="!row.isRemind"
            size="mini"
            @click="handleModifyRemind(row, true)"
          >
            未提醒
          </el-button>
          <el-button
            v-if="row.isRenewal"
            size="mini"
            type="primary"
            @click="handleModifyRenewal(row, false)"
          >
            已续保
          </el-button>
          <el-button
            v-if="!row.isRenewal"
            size="mini"
            @click="handleModifyRenewal(row, true)"
          >
            未续保
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        fixed="right"
        align="center"
        width="80"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button
            v-if="canDelete"
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
        <el-form-item label="保险单号" prop="insurance">
          <el-col :span="elcol">
            <el-input
              v-model="temp.insurance"
              clearable
              placeholder="请输入保险公司单号，如‘11209543901615991250’"
            />
          </el-col>
        </el-form-item>
        <el-form-item label="订单号" prop="order" required>
          <el-col :span="elcol">
            <el-input
              v-model="temp.order"
              clearable
              placeholder="请输入销售订单号，如‘GBICKX220818888’"
            />
          </el-col>
        </el-form-item>
        <el-form-item label="客户" prop="customer" required>
          <el-col :span="elcol">
            <el-input
              v-model="temp.customer"
              clearable
              placeholder="请输入客户名称，如‘XXXX有限公司’或‘人名’"
            />
          </el-col>
        </el-form-item>
        <el-form-item label="业务员" prop="salesman" required>
          <el-col :span="elcol">
            <el-input
              v-model="temp.salesman"
              clearable
              placeholder="请输入业务员姓名"
            />
          </el-col>
        </el-form-item>
        <el-form-item v-if="dialogStatus == 'create'" label="激活" required>
          <el-col :span="10">
            <el-radio-group v-model="temp.activate" @change="activateChange">
              <el-radio :label="true">立即激活</el-radio>
              <el-radio :label="false">延迟激活 </el-radio>
            </el-radio-group>
          </el-col>
          <el-col :span="10">
            <el-slider
              v-model="temp.days"
              show-input
              :show-input-controls="false"
              :disabled="delayDisabled"
              @change="daysActivate(temp.days)"
            />
          </el-col>
        </el-form-item>
        <el-form-item v-if="dialogStatus == 'update'" label="状态" required>
          <el-col :span="elcol">
            <el-radio-group v-model="temp.state">
              <el-radio label="待激活">待激活</el-radio>
              <el-radio label="生效中">生效中</el-radio>
              <el-radio label="已续保">已续保</el-radio>
              <el-radio label="已失效">已失效</el-radio>
            </el-radio-group>
          </el-col>
        </el-form-item>

        <el-form-item label="有效期限" required>
          <el-date-picker
            v-model="temp.start_date"
            type="date"
            placeholder="开始日期"
            format="yyyy年MM月dd日00时"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions"
            @change="startDateChange"
          >>
          </el-date-picker>
          <span style="margin: 20px">-</span>
          <el-date-picker
            v-model="temp.end_date"
            type="date"
            placeholder="结束日期"
            format="yyyy年MM月dd日24时"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions"
          >>
          </el-date-picker>
        </el-form-item>

        <el-form-item label="设备信息" required>
          <div>
            <el-row>
              <el-col :span="elcol">
                <el-input
                  v-model="temp.serial"
                  placeholder="请输入设备序列号，如‘f64b9684cdd9466a’"
                  clearable
                />
                <el-input
                  v-model="temp.case"
                  placeholder="请输入机箱编号，如‘CGBX12DC029A’"
                  clearable
                />
                <el-input
                  v-model="temp.uav"
                  placeholder="请输入无人机编号，如‘6HGUP22FB085C’"
                  clearable
                />
                <el-input
                  v-model="temp.light"
                  placeholder="请输入灯组或广播编号，如‘6HGLT22FB085C’"
                  clearable
                />
                <el-input
                  v-model="temp.remote"
                  placeholder="请输入遥控器编号，如‘01GRC22MR075C’"
                  clearable
                />
                <el-input
                  v-model="temp.wifi"
                  placeholder="请输入WiFi号，如‘GBI_6200CFCF’"
                  clearable
                />
                <el-input
                  v-model="temp.interphone"
                  placeholder="请输入对讲机编号，如‘01GWR02NV003A’"
                  clearable
                />
              </el-col>
            </el-row>
          </div>
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
import '@/utils/date-format'

export default {
  name: 'InsuranceIndex',
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
      date: new Date(),
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        insurance: undefined,
        uav: undefined,
        state: undefined,
        sort: '-id'
      },
      stateTypeOptions: [
        { key: '待激活', value: '待激活' },
        { key: '生效中', value: '生效中' },
        { key: '已续保', value: '已续保' },
        { key: '已失效', value: '已失效' }
      ],
      stateType: {
        待激活: 'info',
        生效中: 'success',
        已续保: 'primary',
        已失效: 'warning'
      },
      remindDisplay: {
        false: '未提醒',
        true: '已提醒'
      },
      renewalDisplay: {
        false: '未续保',
        true: '已续保'
      },
      temp: {
        id: undefined,
        insurance: '',
        order: '',
        customer: '',
        salesman: '',
        activate: '',
        state: '',
        days: '',
        isRemind: '',
        isRenewal: '',
        start_date: '',
        end_date: '',
        timestamp: '',
        serial: '',
        case: '',
        uav: '',
        light: '',
        remote: '',
        wifi: '',
        interphone: '',
        remark: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新建'
      },

      rules: {
        type: [
          { required: true, message: 'type is required', trigger: 'change' }
        ],
        timestamp: [
          {
            type: 'date',
            required: true,
            message: 'timestamp is required',
            trigger: 'change'
          }
        ],
        title: [
          { required: true, message: 'title is required', trigger: 'blur' }
        ]
      },
      downloadLoading: false,
      isShowFull: false,
      elcol: 20,
      yearDays: 364,
      delayDays: 30,
      remindDays: 30,
      delayDisabled: true,
      state: '',
      canDelete: false,
      pickerOptions: {
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date())
            }
          },
          {
            text: '一月后',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 30)
              picker.$emit('pick', date)
            }
          },
          {
            text: '一年后',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 365)
              picker.$emit('pick', date)
            }
          }
        ]
      }
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
        insurance: '',
        order: '',
        customer: '',
        salesman: '',
        activate: '',
        state: '',
        days: 30,
        start_date: '',
        end_date: '',
        timestamp: '',
        isRemind: false,
        isRenewal: false,
        serial: '',
        case: '',
        uav: '',
        light: '',
        remote: '',
        wifi: '',
        interphone: '',
        remark: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.delayDisabled = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          if (this.temp.activate) {
            this.temp.state = '生效中'
          } else {
            this.temp.state = '待激活'
          }
          createArticle(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '新建保单成功',
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
          'NO.',
          '保单号',
          '飞机编号',
          '订单号',
          '客户',
          '业务员',
          '状态',
          '天数',
          '提醒',
          '续保',
          '开始日期',
          '结束日期',
          '序列号',
          '机箱编号',
          '灯组编号',
          '遥控器编号',
          'WiFi号',
          '对讲机编号',
          '备注',
          '123'
        ]
        const filterVal = [
          'id',
          'insurance',
          'uav',
          'order',
          'customer',
          'salesman',
          'state',
          'days',
          'isRemind',
          'isRenewal',
          'start_date',
          'end_date',
          'serial',
          'case',
          'light',
          'remote',
          'wifi',
          'interphone',
          'remark',
          'timestamp'
        ]
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'insurance-list'
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
    },

    showFull() {
      this.tableKey = this.tableKey + 1
    },

    // 天数计算
    daysCounting(row) {
      const end = new Date(row.end_date)
      const days = Math.ceil((end.getTime() - Date.now()) / 3600 / 1000 / 24)
      row.days = days
      return days
    },
    daysType(state, days) {
      if (state == '待激活') {
        return 'info'
      } else {
        if (days > this.remindDays) {
          return 'success'
        } else if (days <= this.remindDays && days >= 0) {
          return 'danger'
        }
        return 'warning'
      }
    },
    // 提醒和续保
    remindType(row) {
      if (row.isRemind) {
        return 'success'
      } else {
        if (row.days <= this.remindDays) {
          return 'danger'
        } else return 'primary'
      }
    },
    renewalType(row) {
      if (!row.isRemind) {
        return 'info'
      } else {
        if (row.isRenewal) {
          return 'success'
        } else {
          if (row.days <= this.remindDays) {
            return 'warning'
          } else return 'primary'
        }
      }
    },
    handleModifyRemind(row, isRemind) {
      let message = '操作成功'
      if (isRemind) {
        message = '改为已提醒成功'
      } else {
        message = '改为未提醒成功'
      }
      this.$message({
        message: message,
        type: 'success'
      })
      row.isRemind = isRemind
    },
    handleModifyRenewal(row, isRenewal) {
      let message = '保单号：' + row.insurance + ' 飞机编号：' + row.uav
      message = ''
      let type = ''
      if (!row.isRemind) {
        message = '请先发送提醒'
        type = 'warning'
      } else {
        if (isRenewal) {
          message += ' 改为已续保成功！'
        } else {
          message += ' 改为未续保成功！'
        }
        type = 'success'
        row.isRenewal = isRenewal
      }
      this.$message({
        message: message,
        type: type
      })
    },

    // 激活和延迟时间设置
    activateChange(activate) {
      this.delayDisabled = activate
      let days = 0
      if (!activate) {
        days = this.temp.days
        if (!days) {
          days = this.delayDays
        }
      }
      this.daysActivate(days)
    },
    daysActivate(days) {
      this.temp.start_date = this.dateSet(days)
      this.temp.end_date = this.dateSet(days + this.yearDays)
    },
    dateSet(days) {
      const date = new Date()
      date.setTime(date.getTime() + 3600 * 1000 * 24 * days)
      return date.format('yyyy-MM-dd')
    },
    startDateChange(date) {
      if (date) {
        const start = new Date(date)
        const end = new Date()
        end.setTime(start.getTime() + 3600 * 1000 * 24 * this.yearDays)
        this.temp.end_date = end.format('yyyy-MM-dd')
      } else {
        this.temp.end_date = ''
      }
    }

  }
}
</script>

<style lang="scss" scoped>
</style>
