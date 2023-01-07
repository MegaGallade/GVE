<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.order"
        placeholder="请输入表单号"
        clearable
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
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
      <!-- <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-plus"
        @click="handleCreate"
      >
        新建
      </el-button> -->
    </div>
    <el-divider class="divider"></el-divider>
    <div>
      <h2>极客桥无人机{{ form.orderType }}{{ form.plugType }}库单</h2>
      <el-form :inline="true" :model="form" label-width="80px" class="mrb">
        <el-form-item label="表单号">
          <el-input v-model="form.order" placeholder="请输入表单号"></el-input>
        </el-form-item>
        <el-form-item label="单据号">
          <el-input
            v-model="form.running"
            placeholder="请输入单据号"
          ></el-input>
        </el-form-item>
      </el-form>

      <span class="title">对方单位信息</span>
      <el-form :inline="true" :model="form" label-width="80px">
        <el-form-item label="单位名称">
          <el-input
            v-model="form.company"
            class="wmid"
            placeholder="请输入单位名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系人">
          <el-input
            v-model="form.running"
            placeholder="请输入联系人"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-form :inline="true" :model="form" label-width="80px">
        <el-form-item label="单位地址">
          <el-input
            v-model="form.address"
            class="wmid"
            placeholder="请输入单位地址"
          ></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="form.running" placeholder="请输入电话"></el-input>
        </el-form-item>
      </el-form>
      <span class="title">产品类型</span>
      <el-form :inline="true" label-width="80px">
        <el-form-item label="类型">
          <el-select v-model="form.orderType" placeholder="请选择类型">
            <el-option
              v-for="item in orderTypeOptions"
              :key="item.key"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="出入">
          <el-radio v-model="radio" label="1">出库</el-radio>
          <el-radio v-model="radio" label="2">入库</el-radio>
          <el-select v-model="form.plugType" placeholder="请选择类型">
            <el-option
              v-for="item in plugTypeOptions"
              :key="item.key"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="业务员">
          <el-input
            v-model="form.salesman"
            placeholder="请输入业务员"
          ></el-input>
        </el-form-item>
      </el-form>
      <span class="title">产品/部件名及数量</span>
    </div>

    <!-- 表格主体 -->
    <!-- <el-table
      ref="DeviceTable"
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      tooltip-effect="dark"
      highlight-current-row
      height="600"
      style="width: 100%"
      :row-style="{ height: '40px' }"
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
        prop="display_time"
        label="日期"
        sortable
        header-align="center"
        width="110"
        show-overflow-tooltip
      />
      <el-table-column
        prop="order"
        label="表单号"
        sortable
        header-align="center"
        width="145"
        show-overflow-tooltip
      />
      <el-table-column
        prop="running"
        label="单据号"
        sortable
        header-align="center"
        width="110"
        show-overflow-tooltip
      />

      <el-table-column
        prop="company"
        label="单位"
        sortable
        header-align="center"
        width="150"
        show-overflow-tooltip
      />
      <el-table-column
        prop="address"
        label="地址"
        sortable
        header-align="center"
        width="150"
        show-overflow-tooltip
      />
      <el-table-column
        prop="salesman"
        label="收货人"
        align="center"
        width="70"
        show-overflow-tooltip
      />
      <el-table-column
        prop="phone"
        label="电话"
        align="center"
        width="110"
        show-overflow-tooltip
      />
      <el-table-column
        prop="orderType"
        label="类型"
        align="center"
        width="60"
        show-overflow-tooltip
      />
      <el-table-column
        prop="plugType"
        label="出入"
        align="center"
        width="50"
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
        prop="detailList"
        label="明细"
        align="center"
        width="100"
        show-overflow-tooltip
      ><template slot-scope="{ row }">
        <span>{{ row.detailList }}</span>
      </template>
      </el-table-column>

      <el-table-column
        prop="serialList"
        label="编号"
        align="center"
        width="100"
        show-overflow-tooltip
      ><template slot-scope="{ row }">
        <span>{{ row.serialList }}</span>
      </template>
      </el-table-column>

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
        width="80"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table> -->

    <!-- 编辑弹出框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-width="90px"
        size="small"
        style="width: ; margin-left: 10px"
      >
        <el-form-item label="序列号" prop="serial">
          <el-col :span="elcol">
            <el-input
              v-model="temp.serial"
              placeholder="请输入设备序列号，如‘f64b9684cdd9466a’"
              clearable
            />
          </el-col>
        </el-form-item>
        <el-form-item label="机箱编号" prop="case">
          <el-col :span="elcol">
            <el-input
              v-model="temp.case"
              placeholder="请输入机箱编号，如‘CGBX22DC066A’"
              clearable
            />
          </el-col>
        </el-form-item>
        <el-form-item label="无人机编号" prop="uav">
          <el-col :span="elcol">
            <el-input
              v-model="temp.uav"
              placeholder="请输入无人机编号，如‘6HGUP22FB085C’"
              clearable
            />
          </el-col>
        </el-form-item>
        <el-form-item label="灯组编号" prop="light">
          <el-col :span="elcol">
            <el-input
              v-model="temp.light"
              placeholder="请输入灯组或广播编号，如‘6HGLT22FB085C’"
              clearable
            />
          </el-col>
        </el-form-item>
        <el-form-item label="遥控器编号" prop="remote">
          <el-col :span="elcol">
            <el-input
              v-model="temp.remote"
              placeholder="请输入遥控器编号，如‘01GRC22MR075C’"
              clearable
            />
          </el-col>
        </el-form-item>
        <el-form-item label="WiFi号" prop="wifi">
          <el-col :span="elcol">
            <el-input
              v-model="temp.wifi"
              placeholder="请输入WiFi号，如‘GBI_6200CFCF’"
              clearable
            />
          </el-col>
        </el-form-item>
        <el-form-item label="对讲机号" prop="interphone">
          <el-col :span="elcol">
            <el-input
              v-model="temp.interphone"
              placeholder="请输入对讲机编号，如‘01GWR02NV003A’"
              clearable
            />
          </el-col>
        </el-form-item>

        <el-form-item label="状态" prop="useType">
          <el-col :span="elcol">
            <el-radio-group v-model="temp.useType">
              <el-radio
                v-for="item in useTypeOptions"
                :key="item.key"
                :label="item.key"
                >{{ item.key }}</el-radio
              >
            </el-radio-group>
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
import { createArticle, fetchList, updateArticle } from "@/api/article";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";

export default {
  name: "DeviceIndex",
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
      form: {},
      formInline: {
        user: "",
        region: "",
      },
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        serial: undefined,
        case: undefined,
        uav: undefined,
        useType: undefined,
        sort: "-id",
      },
      orderTypeOptions: [
        { key: "销售", value: "销售" },
        { key: "租赁", value: "租赁" },
        { key: "借用", value: "借用" },
        { key: "无偿", value: "无偿" },
        { key: "维修", value: "维修" },
        { key: "更换", value: "更换" },
      ],
      plugTypeOptions: [
        { key: "出", value: "出" },
        { key: "入", value: "入" },
      ],
      useTypeOptions: [
        { key: "生产中", value: "生产中" },
        { key: "测试中", value: "测试中" },
        { key: "库存中", value: "库存中" },
        { key: "可使用", value: "可使用" },
        { key: "维修中", value: "维修中" },
        { key: "租用中", value: "租用中" },
        { key: "已售出", value: "已售出" },
        { key: "已废弃", value: "已废弃" },
        { key: "未知", value: "未知" },
      ],
      useTypeColor: {
        生产中: "#C0C0C0",
        测试中: "#99DD00",
        库存中: "#67C23A",
        可使用: "#00DD00",
        维修中: "#EE7700",
        租用中: "#9900FF",
        已售出: "#409EFF",
        已废弃: "#909399",
        未知: "#FF0000 ",
      },
      treeExpandAll: false,
      isShowNumber: true,
      isShowProduction: true,
      isShowInsurance: true,
      isShowFirmware: true,
      isActivatedDisplay: {
        true: "已激活",
        false: "未激活",
      },
      isDisabledDisplay: {
        true: "已禁用",
        false: "未禁用",
      },
      versionDisplay: {
        true: "试用版",
        false: "正式版",
      },
      isInsurance: {
        true: "是",
        false: "否",
      },
      temp: {
        id: undefined,
        serial: "",
        case: "",
        uav: "",
        light: "",
        remote: "",
        wifi: "",
        interphone: "",
        useType: "",
        remark: "",
      },
      rules: {},
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "新建",
      },
      downloadLoading: false,
      elcol: 20,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      fetchList(this.listQuery).then((response) => {
        this.list = response.data.items;
        this.total = response.data.total;
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000);
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
    resetTemp() {
      this.temp = {
        id: undefined,
        serial: "",
        case: "",
        uav: "",
        light: "",
        remote: "",
        wifi: "",
        interphone: "",
        useType: "",
        remark: "",
      };
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024; // mock a id
          createArticle(this.temp).then(() => {
            this.list.unshift(this.temp);
            this.dialogFormVisible = false;
            this.$notify({
              title: "成功",
              message: "添加 成功",
              type: "success",
              duration: 3000,
            });
          });
        }
      });
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row); // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp);
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
          tempData.timestamp = +new Date(tempData.timestamp);
          updateArticle(tempData).then(() => {
            const index = this.list.findIndex((v) => v.id === this.temp.id);
            this.list.splice(index, 1, this.temp);
            this.dialogFormVisible = false;
            this.$notify({
              title: "成功",
              message: "编辑 成功",
              type: "success",
              duration: 3000,
            });
          });
        }
      });
    },
    handleDelete(row, index) {
      this.$notify({
        title: "成功",
        message: "删除 成功",
        type: "success",
        duration: 3000,
      });
      this.list.splice(index, 1);
    },
    handleDownload() {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then((excel) => {
        const tHeader = [
          "序号",
          "序列号",
          "机箱编号",
          "飞机编号",
          "灯组编号",
          "遥控器编号",
          "WiFi号",
          "对讲机编号",
          "备注",
        ];
        const filterVal = [
          "id",
          "serial",
          "case",
          "uav",
          "light",
          "remote",
          "wifi",
          "interphone",
          "remark",
        ];
        const data = this.formatJson(filterVal);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "device-list",
        });
        this.downloadLoading = false;
      });
    },
    formatJson(filterVal) {
      return this.list.map((v) =>
        filterVal.map((j) => {
          if (j === "timestamp") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    },
    getSortClass: function (key) {
      const sort = this.listQuery.sort;
      return sort === `+${key}` ? "ascending" : "descending";
    },

    checkExpandAll() {
      // this.treeExpandAll = !this.treeExpandAll
      console.log(this.treeExpandAll);
      // this.tableKey = this.tableKey + 1;
    },
    checkShowNumber() {
      this.tableKey = this.tableKey + 1;
    },
  },
};
</script>

<style lang="scss" scoped>
.el-tooltip__popper {
  margin: 200px;
  max-width: 600px;
}
.wlong {
  width: 450px;
}
.wmid {
  width: 300px;
}
.wshort {
  width: 150px;
}
h2 {
  margin: 10px;
}
.title {
  margin: 5px auto;
  font-weight: 700;
}
.divider {
  margin: 0 auto 10px;
}
.el-form-item {
  margin-bottom: 5px;
}
.mrb {
  margin: 0;
  padding: 0;
}
</style>
