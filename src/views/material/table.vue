<template>
  <div>
    <el-table
      ref="MaterialTable"
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
        fit
        fixed
        align="center"
        sortable="custom"
        width="80"
        ><template slot-scope="{ row }">
          <span>{{ row.id }}</span>
        </template></el-table-column
      >
      <el-table-column
        prop="materialCode"
        label="物料编码"
        sortable
        align="center"
        width="110"
        show-overflow-tooltip
      />
      <el-table-column
        prop="materialName"
        label="物料名称"
        sortable
        header-align="center"
        width="150"
        show-overflow-tooltip
      />
      <el-table-column
        prop="materialModel"
        label="规格型号"
        sortable
        header-align="center"
        width="150"
        show-overflow-tooltip
      />
      <el-table-column
        prop="materialType"
        label="类型"
        sortable
        align="center"
        width="100"
        show-overflow-tooltip
      />
      <el-table-column
        prop="materialUnit"
        label="单位"
        align="center"
        width="80"
        show-overflow-tooltip
      />
      <el-table-column
        prop="materialCount"
        label="数量"
        sortable
        align="center"
        width="80"
        show-overflow-tooltip
      />
      <el-table-column
        prop="materialPrice"
        label="单价"
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
  </div>
</template>

<script>
import { fetchList, createArticle, updateArticle } from "@/api/article";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import Table from "./table.vue"
import material from "./material";

export default {
  name: "CaseIndex",
  components: { Pagination ,Table},
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
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        serial: undefined,
        case: undefined,
        useType: undefined,
        sort: "-id",
      },
      materialTypeOptions: material.materialTypeOptions,
      materialUnitOptions: material.materialUnitOptions,

      temp: {
        id: undefined,
        serial: "",
        case: "",
        useType: "",
        productionOrder: "",
        dateInProduced: "",
        remark: "",
      },
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
        useType: "",
        productionOrder: "",
        dateInProduced: "",
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
              message: "添加成功",
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
          "状态",
          "生产单号",
          "生产日期",
          "备注",
        ];
        const filterVal = [
          "id",
          "serial",
          "case",
          "useType",
          "productionOrder",
          "dateInProduced",
          "remark",
        ];
        const data = this.formatJson(filterVal);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "case-list",
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
  },
};
</script>

<style lang="scss" scoped>
</style>