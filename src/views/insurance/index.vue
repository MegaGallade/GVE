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
          :key="item.value"
          :label="item.label"
          :value="item.value"
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
      height="650"
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
        </template></el-table-column
      >
      <el-table-column
        prop="insurance"
        label="保单号"
        sortable
        align="center"
        width="180"
        show-overflow-tooltip
      >
        <!-- <template slot-scope="{ row }">{{ row.insurance }}</template> -->
      </el-table-column>
      <el-table-column
        prop="uav"
        label="飞机编号"
        sortable
        align="center"
        width="145"
        show-overflow-tooltip
      />
      <el-table-column
        prop="indent"
        label="订单号"
        sortable
        align="center"
        width="145"
        show-overflow-tooltip
      />
      <el-table-column
        prop="company"
        label="客户"
        sortable
        header-align="center"
        width="175"
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
        <template slot-scope="{ row }">
          <el-tag :type="stateType[row.state]" effect="plain">{{
            row.state
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="days"
        label="天数"
        sortable
        align="center"
        width="80"
        show-overflow-tooltip
      >
        <template slot-scope="{ row }">
          <el-tag :type="daysType(row)" effect="dark">{{ row.days }} </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="is_activate"
        label="激活"
        sortable
        align="center"
        width="90"
      >
        <template slot-scope="{ row }">
          <el-button
            v-if="row.is_activate"
            size="mini"
            type="success"
            plain
            @click="handleModifyActivate(row, false)"
          >
            已激活
          </el-button>
          <el-button
            v-if="!row.is_activate"
            size="mini"
            type="info"
            plain
            @click="handleModifyActivate(row, true)"
          >
            未激活
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="is_remind"
        label="提醒"
        sortable
        align="center"
        width="90"
      >
        <template slot-scope="{ row }">
          <el-button
            v-if="row.is_remind"
            :type="remindType(row)"
            size="mini"
            @click="handleModifyRemind(row, false)"
          >
            已提醒
          </el-button>
          <el-button
            v-if="!row.is_remind"
            :type="remindType(row)"
            size="mini"
            @click="handleModifyRemind(row, true)"
          >
            未提醒
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="is_renewal"
        label="续保"
        sortable
        align="center"
        width="90"
      >
        <template slot-scope="{ row }">
          <el-button
            v-if="row.is_renewal"
            size="mini"
            plain
            :type="renewalType(row)"
            @click="handleModifyRenewal(row, false)"
          >
            已续保
          </el-button>
          <el-button
            v-if="!row.is_renewal"
            size="mini"
            plain
            :type="renewalType(row)"
            @click="handleModifyRenewal(row, true)"
          >
            未续保
          </el-button>
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
          {{ new Date(row.start_date) | parseTime("{y}年{m}月{d}日00时") }}
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
          {{ new Date(row.end_date) | parseTime("{y}年{m}月{d}日24时") }}
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
        prop="platform"
        label="机箱编号"
        sortable
        align="center"
        width="140"
        show-overflow-tooltip
      />
      <el-table-column
        v-if="isShowFull"
        prop="ptz"
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
            :disabled="cannotDelete"
            @click="handleDelete(row, $index)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    /> -->

    <!-- 新建&编辑 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-width="80px"
        size="small"
      >
        <el-form-item label="保险单号" prop="insurance">
          <el-col :span="elcol">
            <el-input
              v-model="temp.insurance"
              clearable
              :placeholder="placeholder.insurance"
            />
          </el-col>
        </el-form-item>
        <el-form-item label="订单号" prop="indent">
          <el-col :span="elcol">
            <el-input
              v-model="temp.indent"
              clearable
              :placeholder="placeholder.indent"
            />
          </el-col>
        </el-form-item>
        <el-form-item label="客户" prop="company">
          <el-col :span="elcol">
            <el-input
              v-model="temp.company"
              clearable
              :placeholder="placeholder.customer"
            />
          </el-col>
        </el-form-item>
        <el-form-item label="业务员" prop="salesman">
          <el-col :span="elcol">
            <el-input
              v-model="temp.salesman"
              clearable
              :placeholder="placeholder.salesman"
            />
          </el-col>
        </el-form-item>
        <el-form-item v-if="dialogStatus == 'create'" label="激活">
          <el-col :span="elcol / 2">
            <el-radio-group v-model="temp.is_activate" @change="activateChange">
              <el-radio :label="true">立即激活</el-radio>
              <el-radio :label="false">延迟激活 </el-radio>
            </el-radio-group>
          </el-col>
          <el-col :span="elcol / 2">
            <el-slider
              v-model="delayDays"
              show-input
              :show-input-controls="false"
              :disabled="delayDisabled"
              @input="daysActivate(delayDays)"
            />
          </el-col>
        </el-form-item>

        <!-- <el-form-item v-if="dialogStatus == 'update'" label="状态" required>
          <el-col :span="elcol">
            <el-radio-group v-model="temp.state">
              <el-radio label="待激活">待激活</el-radio>
              <el-radio label="生效中">生效中</el-radio>
              <el-radio label="已续保">已续保</el-radio>
              <el-radio label="已失效">已失效</el-radio>
            </el-radio-group>
          </el-col>
        </el-form-item> -->

        <el-form-item label="有效期限">
          <el-date-picker
            v-model="temp.start_date"
            type="date"
            placeholder="开始日期"
            format="yyyy年MM月dd日00时"
            value-format="yyyy-MM-dd"
            :picker-options="datePickerOptions"
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
            :picker-options="datePickerOptions"
            >>
          </el-date-picker>
        </el-form-item>

        <el-form-item label="设备信息">
          <div>
            <el-row>
              <el-col :span="elcol">
                <el-input
                  v-model="temp.serial"
                  :placeholder="placeholder.serial"
                  clearable
                />
                <el-input
                  v-model="temp.platform"
                  :placeholder="placeholder.platform"
                  clearable
                />
                <el-input
                  v-model="temp.uav"
                  :placeholder="placeholder.uav"
                  clearable
                />
                <el-input
                  v-model="temp.ptz"
                  :placeholder="placeholder.ptz"
                  clearable
                />
                <el-input
                  v-model="temp.remote"
                  :placeholder="placeholder.remote"
                  clearable
                />
                <el-input
                  v-model="temp.wifi"
                  :placeholder="placeholder.wifi"
                  clearable
                />
                <el-input
                  v-model="temp.interphone"
                  :placeholder="placeholder.interphone"
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
              :placeholder="placeholder.remark"
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
import { addSql, delSql, getSql, updateSql } from "@/api/article";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import dataformat from "@/data-format/data";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import "@/utils/date-format";

export default {
  name: "InsuranceIndex",
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "info",
        deleted: "danger",
      };
      return statusMap[status];
    },
  },
  data() {
    return {
      date: new Date(),
      tableKey: 0,
      list: null,
      form: null,
      total: 0,
      listLoading: true,
      dialogFormVisible: false,
      dialogStatus: "",
      downloadLoading: false,
      maxId: 0,

      textMap: dataformat.common.textMap,
      rules: dataformat.common.rules,
      placeholder: dataformat.common.placeholder,
      datePickerOptions: dataformat.common.datePickerOptions,
      elcol: dataformat.constant.elcol,
      yearDaysDefault: dataformat.constant.yearDaysDefault,
      delayDaysDefault: dataformat.constant.delayDaysDefault,
      remindDaysDefault: dataformat.constant.remindDaysDefault,
      formatTimeList: dataformat.common.formatTimeList,

      temp: Object.assign({}, dataformat.insurance.temp),
      listQuery: Object.assign({}, dataformat.insurance.listQuery),
      stateTypeOptions: dataformat.insurance.stateTypeOptions,
      stateType: dataformat.insurance.stateType,
      activateDisplay: dataformat.insurance.activateDisplay,
      remindDisplay: dataformat.insurance.remindDisplay,
      renewalDisplay: dataformat.insurance.renewalDisplay,

      isShowFull: false,
      delayDays: 0,
      delayDisabled: true,
      cannotDelete: false,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      getSql({ type: "search", value: this.listQuery })
        .then((res) => {
          this.list = res.data;
          this.total = res.data.length;
          this.pretreatment(this.list);
          this.listLoading = false;
        })
        .catch((err) => {
          console.log("获取数据失败" + err);
        });
      getSql({ type: "maxId" })
        .then((res) => {
          this.maxId = res.data[0]["max(id)"];
        })
        .catch((err) => {
          console.log("获取数据失败" + err);
        });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: "操作成功",
        type: "success",
      });
      row.status = status;
    },
    sortChange(data) {
      const { prop, order } = data;
      if (prop === "id") {
        this.sortByID(order);
      }
    },
    sortByID(order) {
      if (order === "ascending") {
        this.listQuery.sort = "+id";
      } else {
        this.listQuery.sort = "-id";
      }
      this.handleFilter();
    },
    resetDefault() {
      this.temp = Object.assign({}, dataformat.insurance.temp);
      this.delayDays = this.delayDaysDefault;
      this.delayDisabled = true;
    },
    //新建
    handleCreate() {
      this.resetDefault();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          this.maxId += 1;
          this.temp.id = this.maxId;
          this.temp.state = this.temp.is_activate ? "生效中" : "未激活";
          this.temp.days = this.daysCalculate(this.temp);
          this.formatTime(this.temp);
          addSql({ type: "create", value: this.temp }).then(() => {
            this.list.unshift(this.temp);
            this.dialogFormVisible = false;
            this.$notify({
              title: "成功",
              message: "新建保单成功",
              type: "success",
              duration: 3000,
            });
          });
        }
      });
    },
    //编辑
    handleUpdate(row) {
      this.temp = Object.assign({}, row); // copy obj
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          tempData.modify_time = Date.now();
          this.formatTime(tempData);
          updateSql({ type: "edit", id: tempData.id, value: tempData })
            .then((res) => {
              // console.log(res.data);
              if (res.data.status == 200) {
                const index = this.list.findIndex((v) => v.id === this.temp.id);
                this.list.splice(index, 1, this.temp);
                this.dialogFormVisible = false;
                this.$notify({
                  title: "成功",
                  message: "编辑 成功",
                  type: "success",
                  duration: 3000,
                });
              } else {
                this.$message({
                  message: "修改失败",
                  type: "error",
                });
              }
            })
            .catch((err) => {
              console.log("操作失败" + err);
            });
        }
      });
    },
    handleDelete(row, index) {
      delSql({ type: "delete", id: row.id })
        .then((res) => {
          if (res.data.status == 200) {
            this.$notify({
              title: "成功",
              message: "删除 成功",
              type: "success",
              duration: 3000,
            });
            this.list.splice(index, 1);
          } else {
            this.$message({
              message: "修改失败",
              type: "error",
            });
          }
        })
        .catch((err) => {
          console.log("操作失败" + err);
        });
    },
    handleDownload() {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then((excel) => {
        const tHeader = dataformat.insurance.tHeader;
        const filterVal = dataformat.insurance.filterVal;
        const data = this.formatJson(filterVal);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "保险一览" + this.date.format("yyyyMMdd"),
        });
        this.downloadLoading = false;
      });
    },
    formatJson(filterVal) {
      return this.list.map((v) =>
        filterVal.map((j) => {
          if (j === "modify_time") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    },
    formatTime(obj) {
      const list = this.formatTimeList;
      for (const key in obj) {
        if (list.indexOf(key) > -1) {
          if (typeof obj[key] != "undefined") {
            obj[key] = parseTime(new Date(obj[key]));
          }
        }
      }
    },
    getSortClass: function (key) {
      const sort = this.listQuery.sort;
      return sort === `+${key}` ? "ascending" : "descending";
    },

    showFull() {
      this.tableKey = this.tableKey + 1;
    },

    // 数据预处理，状态和天数
    pretreatment(list) {
      for (let i = 0; i < list.length; i++) {
        this.daysCalculate(list[i]);
        this.stateCalculate(list[i]);
        this.maxId = Math.max(list[i].id, this.maxId);
      }
      return list;
    },
    // 状态计算
    stateCalculate(row) {
      if (!row.is_activate) {
        row.state = "未激活";
      } else {
        if (row.is_renewal) {
          row.state = "已续保";
        } else {
          if (row.days < 0) {
            row.state = "已失效";
          } else {
            row.state = "生效中";
          }
        }
      }
      return row.state;
    },
    // 天数计算和显示
    daysCalculate(row) {
      const end = new Date(row.end_date);
      let days = Math.ceil((end.getTime() - Date.now()) / 3600 / 1000 / 24);
      row.days = days;
      return days;
    },
    daysType(row) {
      if (row.state == "未激活") {
        return "info";
      } else {
        if (row.days > this.remindDaysDefault) {
          return "success";
        } else if (row.days <= this.remindDaysDefault && row.days >= 0) {
          return "danger";
        }
        return "warning";
      }
    },
    // 提醒和续保
    remindType(row) {
      if (row.is_remind) {
        return "success";
      } else {
        if (row.days <= this.remindDaysDefault) {
          return "danger";
        } else return "primary";
      }
    },
    renewalType(row) {
      if (!row.is_remind) {
        return "info";
      } else {
        if (row.is_renewal) {
          return "success";
        } else {
          if (row.days <= this.remindDaysDefault) {
            return "warning";
          } else return "primary";
        }
      }
    },
    // 更改激活，提醒，续保
    handleModifyActivate(row, is_activate) {
      let message = "";
      let type = "";
      if (row.is_remind) {
        message = "该保险无法设置为未激活，请重新核对";
        type = "warning";
      } else {
        row.is_activate = is_activate;
        if (is_activate) {
          message = "改为已激活成功！";
        } else {
          message = "改为未激活成功！";
        }
        type = "success";
        updateSql({ type: "is_activate", id: row.id, value: is_activate })
          .then((res) => {
            if (res.data.status == 200) {
            } else {
              this.message({
                message: "修改失败",
                type: "error",
              });
            }
          })
          .catch((err) => {
            console.log("操作失败" + err);
          });
      }
      this.stateCalculate(row);
      this.$message({
        message: message,
        type: type,
      });
    },
    handleModifyRemind(row, is_remind) {
      let message = "";
      let type = "";
      if (!row.is_activate) {
        message = "请先激活保险！";
        type = "warning";
      } else {
        if (row.days > this.remindDaysDefault * 2) {
          message = "时间未到，还不需要提醒。";
        } else {
          row.is_remind = is_remind;
          if (is_remind) {
            message = "改为已提醒成功！";
          } else {
            message = "改为未提醒成功！";
          }
          type = "success";
          updateSql({ type: "is_remind", id: row.id, value: is_remind })
            .then((res) => {
              if (res.data.status == 200) {
              } else {
                this.message({
                  message: "修改失败",
                  type: "error",
                });
              }
            })
            .catch((err) => {
              console.log("操作失败" + err);
            });
        }
      }
      this.stateCalculate(row);
      this.$message({
        message: message,
        type: type,
      });
    },
    handleModifyRenewal(row, is_renewal) {
      let message = "";
      let type = "";
      if (!row.is_remind) {
        message = "请先发送保险提醒！";
        type = "warning";
      } else {
        row.is_renewal = is_renewal;
        if (is_renewal) {
          message = " 改为已续保成功！";
        } else {
          message = " 改为未续保成功！";
        }
        type = "success";
        updateSql({ type: "is_renewal", id: row.id, value: is_renewal })
          .then((res) => {
            if (res.data.status == 200) {
            } else {
              this.message({
                message: "修改失败",
                type: "error",
              });
            }
          })
          .catch((err) => {
            console.log("操作失败" + err);
          });
      }
      this.stateCalculate(row);
      this.$message({
        message: message,
        type: type,
      });
    },
    // 激活和延迟时间设置
    activateChange(is_activate) {
      this.delayDisabled = is_activate;
      let days = 0;
      if (!is_activate) {
        days = this.temp.days;
        if (!days) {
          days = this.delayDaysDefault;
        }
      }
      this.daysActivate(days);
    },
    daysActivate(days) {
      this.temp.start_date = this.dateSet(days);
      this.temp.end_date = this.dateSet(days + this.yearDaysDefault);
    },
    dateSet(days) {
      const date = new Date();
      date.setTime(date.getTime() + 3600 * 1000 * 24 * days);
      return date;
    },
    startDateChange(date) {
      if (date) {
        const start = new Date(date);
        const end = new Date();
        end.setTime(start.getTime() + 3600 * 1000 * 24 * this.yearDaysDefault);
        this.temp.end_date = end;
      } else {
        this.temp.end_date = "";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
