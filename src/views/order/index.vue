<template>
  <div class="app-container">
    <div>
      <el-input
        v-model="listQuery.order"
        placeholder="请输入表单号"
        clearable
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.running"
        placeholder="请输入单据号"
        clearable
        style="width: 150px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.company"
        placeholder="请输入单位名称"
        clearable
        style="width: 180px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.address"
        placeholder="请输入地址"
        clearable
        style="width: 180px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.orderType"
        placeholder="类型"
        clearable
        class="filter-item"
        style="width: 100px"
      >
        <el-option
          v-for="item in orderTypeOptions"
          :key="item.key"
          :label="item.value"
          :value="item.key"
        />
      </el-select>
      <el-select
        v-model="listQuery.plugType"
        placeholder="出入"
        clearable
        class="filter-item"
        style="width: 100px"
      >
        <el-option
          v-for="item in plugTypeOptions"
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
    </div>
    <div style="margin: 10px">
      <el-row>
        <el-col style="width: 100px">
          <span>显示信息</span>
        </el-col>
        <el-col :span="16">
          <!-- <el-checkbox
            v-model="treeExpandAll"
            class="filter-item"
            @change="checkExpandAll"
          >
            默认展开
          </el-checkbox> -->
        </el-col>
      </el-row>
    </div>

    <!-- 表格主体 -->
    <el-table
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
        </template></el-table-column
      >
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
        prop="contact"
        label="联系人"
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
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <!-- 编辑弹出框 -->
    <el-dialog :visible.sync="dialogFormVisible" width="80%" center>
      <!-- <div>{{ textMap[dialogStatus] }}</div> -->
      <el-image style="width: 30%" :src="urlLogo"></el-image>
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        :label-width=labelWidth
        style="margin: 15px"
      >
        <h1 id="form-header">
          极客桥无人机{{ temp.orderType }}{{ temp.plugType }}库单
        </h1>
        <el-form :inline="true" :label-width=labelWidth class="mrb">
          <el-form-item label="表单号">
            <el-input
              v-model="temp.order"
              placeholder="请输入表单号"
            ></el-input>
          </el-form-item>
          <el-form-item label="单据号">
            <el-input
              v-model="temp.running"
              placeholder="请输入单据号"
            ></el-input>
          </el-form-item>
          <el-form-item label="单据号2">
            <el-input
              v-model="temp.running"
              placeholder="请输入单据号2"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-divider></el-divider>
        <div class="title">对方单位信息</div>
        <el-form :inline="true" :label-width=labelWidth>
          <el-form-item label="单位名称">
            <el-input
              v-model="temp.company"
              class="wmid"
              placeholder="请输入单位名称"
            ></el-input>
          </el-form-item>

          <el-form-item label="联系人">
            <el-input
              v-model="temp.contact"
              placeholder="请输入联系人"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-form :inline="true" :label-width=labelWidth>
          <el-form-item label="单位地址">
            <el-input
              v-model="temp.address"
              class="wmid"
              placeholder="请输入单位地址"
            ></el-input>
          </el-form-item>
          <el-form-item label="电话">
            <el-input v-model="temp.phone" placeholder="请输入电话"></el-input>
          </el-form-item>
        </el-form>
        <el-divider></el-divider>
        <div class="title">产品类型</div>
        <el-form :inline="true" :label-width=labelWidth>
          <el-form-item label="类型">
            <el-select v-model="temp.orderType" placeholder="请选择类型" style="width: 150px">
              <el-option
                v-for="item in orderTypeOptions"
                :key="item.key"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="出入">
            <el-radio v-model="temp.plugType" label="出" >出库</el-radio>
            <el-radio v-model="temp.plugType" label="入">入库</el-radio>
          </el-form-item>
          <el-form-item label="业务员">
            <el-input
              v-model="temp.salesman"
              placeholder="请输入业务员"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-divider></el-divider>
        <div class="title">产品/部件名及数量</div>
        <el-divider></el-divider>
        <div class="title">
          <span> 产品编号信息 </span>
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="mini"
            circle
            @click="addSerialRow"
          >
          </el-button>
          <el-button
            type="danger"
            icon="el-icon-minus"
            size="mini"
            circle
            @click="lessSerialRow"
          >
          </el-button>
        </div>
        <el-table
          ref="SerialNumberTable"
          :data="temp.serialList"
          border
          style="width: 100%"
          :row-class-name="tableRowClassName"
          @cell-click="handleSerialEdit"
        >
          <el-table-column prop="id" label="序号" align="center" width="70"
            ><template slot-scope="{ $index }">
              <span>{{ $index + 1 }}</span>
            </template></el-table-column
          >
          <el-table-column
            v-for="(item, index) in serialData"
            :key="index"
            :label="item.label"
            :prop="item.prop"
            align="center"
          >
            <template slot-scope="scope">
              <el-input
                ref="serial"
                v-if="'serial' + item.prop + scope.row.index == serialValue"
                v-model="scope.row[item.prop]"
                clearable
                @blur="blurSerial"
              />
              <span v-else>{{ scope.row[item.prop] }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column
            label="操作"
            align="center"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="{ row }">
              <el-button type="primary" size="mini" @click="handleUpdate(row)">
                编辑
              </el-button>
            </template>
          </el-table-column> -->
        </el-table>

        
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
import { fetchList, createArticle, updateArticle } from "@/api/article";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination


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
      tableKey: 0,
      urlLogo: logo,
      list: null,
      serialList: [
        {
          serial: "",
          case: "",
          uav: "",
          light: "",
          remote: "",
          wifi: "",
          interphone: "",
        },
      ],
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
      defaultOrderType: "销售",
      defaultPlugType: "出",
      orderTypeOptions: [
        { key: "销售", value: "销售" },
        { key: "租赁", value: "租赁" },
        { key: "借用", value: "借用" },
        { key: "其他", value: "其他" },
        { key: "维修", value: "维修" },
        { key: "更换", value: "更换" },
      ],
      plugTypeOptions: [
        { key: "出", value: "出" },
        { key: "入", value: "入" },
      ],
      serialData: [
        {
          label: "序列号",
          prop: "serial",
        },
        {
          label: "机箱编号",
          prop: "case",
        },
        {
          label: "飞机编号",
          prop: "uav",
        },
        {
          label: "灯组编号",
          prop: "light",
        },
        {
          label: "遥控器编号",
          prop: "remote",
        },
        {
          label: "WiFi",
          prop: "wifi",
        },
        {
          label: "对讲机编号",
          prop: "interphone",
        },
      ],
      serialValue: "",
      serialDefault: {
        serial: "",
        case: "",
        uav: "",
        light: "",
        remote: "",
        wifi: "",
        interphone: "",
      },
      isShowNumber: true,
      temp: {
        id: undefined,
        order: "",
        running: "",
        company: "",
        address: "",
        contact: "",
        phone: "",
        orderType: "",
        plugType: "",
        salesman: "",
        detailList: [],
        serialList: [],
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
      labelWidth:'80px',
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
      const list = Object.assign({},this.serialDefault);
      this.temp = {
        id: undefined,
        order: "",
        running: "",
        company: "",
        address: "",
        contact: "",
        phone: "",
        orderType: this.defaultOrderType,
        plugType: this.defaultPlugType,
        salesman: "",
        detailList: [],
        serialList: [list],
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
      this.temp.serialList = Object.assign([], row.serialList);
      this.serialList = Object.assign([], row.serialList);
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
          const tempSerialData = Object.assign({}, this.serialList);
          // tempData.serialList=tempSerialData
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
    handleSerialEdit(row, column) {
      this.serialValue = "serial" + column.property + row.index;
      this.$nextTick(() => {
        if (this.$refs.serial[0]) {
          this.$refs.serial[0].focus();
        }
      });
    },
    addSerialRow() {
      const data = Object.assign({}, this.serialDefault);
      this.temp.serialList.push(data);
    },
    lessSerialRow() {
      this.temp.serialList.pop();
    },
    blurSerial() {
      this.serialValue = "";
    },
    tableRowClassName({ row, rowIndex }) {
      row.index = rowIndex;
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
h1 {
  margin-top: 0;
  text-align: center;
  font-family: "黑体", "Helvetica Neue", Helvetica, "PingFang SC",
    "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  color: #333;
}
.wlong {
  width: 450px;
}
.wmid {
  width: 35vw;
}
.wshort {
  width: 150px;
}
.title {
  margin: 5px auto 5px;
  font-weight: 700;
}
.el-divider {
  margin: 5px auto 5px;
}
.el-form-item {
  margin-bottom: 5px;
}
.mrb {
  margin: 0;
  padding: 0;
}
</style>
