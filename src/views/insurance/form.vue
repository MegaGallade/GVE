<template>
  <div class="app-container">
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      size="small"
      label-width="100px"
    >
      <el-form-item label="序号" prop="idnumber">
        <el-col :span="10">
          <el-input
            v-model="form.idnumber"
            clearable
            placeholder="请输入序号"
          />
        </el-col>
      </el-form-item>

      <el-form-item label="保险单号" prop="insurance">
        <el-col :span="10">
          <el-input
            v-model="form.insurance"
            clearable
            placeholder="请输入保险公司单号，如‘11209543901615991250’"
          />
        </el-col>
      </el-form-item>

      <el-form-item label="订单号" prop="order">
        <el-col :span="10">
          <el-input
            v-model="form.order"
            clearable
            placeholder="请输入销售订单号，如‘GBICKX220818888’"
          />
        </el-col>
      </el-form-item>

      <el-form-item label="客户" prop="customer">
        <el-col :span="10">
          <el-input
            v-model="form.customer"
            clearable
            placeholder="请输入客户名称，如‘XXXX有限公司’或‘人名’"
          />
        </el-col>
      </el-form-item>

      <el-form-item label="激活" required>
        <el-col :span="4">
          <el-radio-group v-model="form.activate" @change="activateChange">
            <el-radio :label="true">立即激活</el-radio>
            <el-radio :label="false">延迟激活 </el-radio>
          </el-radio-group>
        </el-col>
        <el-col :span="6">
          <el-slider
            v-model="form.days"
            show-input
            :show-input-controls="false"
            :disabled="delayDisabled"
            @change="daysActivate(form.days)"
          />
        </el-col>
      </el-form-item>

      <el-form-item label="有效期限" required>
        <el-date-picker
          v-model="form.start_date"
          type="date"
          placeholder="开始日期"
          format="yyyy年MM月dd日00时"
          value-format="yyyy-MM-dd"
          @change="startDateChange"
        >>
        </el-date-picker>
        <span style="margin: 20px">-</span>
        <el-date-picker
          v-model="form.end_date"
          type="date"
          placeholder="结束日期"
          format="yyyy年MM月dd日24时"
          value-format="yyyy-MM-dd"
        >>
        </el-date-picker>
        <!-- <date-range @dateRangeSelect="dateChange"></date-range> -->
      </el-form-item>

      <el-form-item label="设备信息" required>
        <el-radio-group v-model="form.kind" @change="kindChange">
          <el-radio :label="1">一体箱系统</el-radio>
          <el-radio :label="2">单独飞机 </el-radio>
        </el-radio-group>
        <el-row>
          <el-col :span="10">
            <el-input
              v-show="isSerialShow"
              v-model="form.serial"
              placeholder="请输入设备序列号，如‘f64b9684cdd9466a’"
              clearable
            />
            <el-input
              v-show="isCaseShow"
              v-model="form.case"
              placeholder="请输入机箱编号，如‘CGBX12DC029A’"
              clearable
            />
            <el-input
              v-model="form.uav"
              placeholder="请输入无人机编号，如‘6HGUP22FB085C’"
              clearable
            />
            <el-input
              v-model="form.light"
              placeholder="请输入灯组或广播编号，如‘6HGLT22FB085C’"
              clearable
            />
            <el-input
              v-model="form.remote"
              placeholder="请输入遥控器编号，如‘01GRC22MR075C’"
              clearable
            />
            <el-input
              v-model="form.wifi"
              placeholder="请输入WiFi号，如‘GBI_6200CFCF’"
              clearable
            />
            <el-input
              v-model="form.interphone"
              placeholder="请输入对讲机编号，如‘01GWR02NV003A’"
              clearable
            />
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item label="备注">
        <el-col :span="10">
          <el-input
            v-model="form.remark"
            type="textarea"
            placeholder=""
            clearable
          />
        </el-col>
      </el-form-item>

      <el-form-item>
        <el-col :offset="2">
          <el-button type="primary" @click="submitForm('form')">提交</el-button>
          <!-- <el-button @click="resetForm('ruleForm')">重置</el-button> -->
        </el-col>
      </el-form-item>
    </el-form>

    <span>表单信息{{ form }} </span>
  </div>
</template>

<script>
import DateRange from '@/components/datetime/daterange'
import '@/utils/date-format'

export default {
  components: {
    DateRange
  },
  data() {
    return {
      form: {
        id: '',
        insurance: '',
        order: '',
        customer: '',
        salesman: '',
        activate: '',
        state: '',
        days: 30,
        start_date: '',
        end_date: '',
        serial: '',
        case: '',
        uav: '',
        light: '',
        remote: '',
        wifi: '',
        interphone: '',
        remark: '',
        history: ''
      },
      rules: {
        idnumber: [
          {
            required: true,
            message: '序号是必须的！',
            trigger: 'blur'
          }
        ],
        order: [
          {
            required: true,
            message: '订单号是必须的！',
            trigger: 'blur'
          }
        ],
        customer: [
          {
            required: true,
            message: '客户名称是必须的！',
            trigger: 'blur'
          }
        ]
      },
      yearDays: 364,
      delayDays: 30,
      delayDisabled: true,
      isSerialShow: true,
      isCaseShow: true
    }
  },
  methods: {
    // 激活和延迟时间设置
    activateChange(activate) {
      this.delayDisabled = activate
      let days = 0
      if (!activate) {
        days = this.form.days
        if (!days) {
          days = this.delayDays
        }
      }
      this.daysActivate(days)
    },
    daysActivate(days) {
      this.form.start_date = this.dateSet(days)
      this.form.end_date = this.dateSet(days + this.yearDays)
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
        this.form.end_date = end.format('yyyy-MM-dd')
      } else {
        this.form.end_date = ''
      }
    },
    // 类型
    kindChange(kind) {
      if (kind == 1) {
        this.isSerialShow = true
        this.isCaseShow = true
      } else if (kind == 2) {
        this.isSerialShow = false
        this.isCaseShow = false
      }
    },
    // 提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
