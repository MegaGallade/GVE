<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.materialCode"
        placeholder="请输入物料编码"
        clearable
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.materialName"
        placeholder="请输入物料名称"
        clearable
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.materialModel"
        placeholder="请输入规格型号"
        clearable
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-cascader
        v-model="listQuery.materialType"
        :options="materialTypeOptions"
        placeholder="类别"
        :props="{ expandTrigger: 'hover', multiple: true }"
        collapse-tags
        clearable
        class="filter-item"
      >
      </el-cascader>
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
        label="类别"
        sortable
        align="center"
        width="120"
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
        <el-form-item label="物料编码" prop="materialCode" required>
          <el-col :span="elcol">
            <el-input
              v-model="temp.materialCode"
              placeholder="请输入物料编码"
              clearable
            />
          </el-col>
        </el-form-item>
        <el-form-item label="机箱名称" prop="materialName" required>
          <el-col :span="elcol">
            <el-input
              v-model="temp.materialName"
              placeholder="请输入机箱名称"
              clearable
            />
          </el-col>
        </el-form-item>
        <el-form-item label="规格型号" prop="materialModel" required>
          <el-col :span="elcol">
            <el-input
              v-model="temp.materialModel"
              placeholder="请输入规格型号"
              clearable
            />
          </el-col>
        </el-form-item>
        <el-form-item label="类别" prop="materialType" required>
          <el-cascader
            v-model="temp.materialType"
            :options="materialTypeOptions"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="单位" prop="materialUnit" required>
          <el-radio-group v-model="temp.materialUnit">
            <el-radio
              v-for="item in materialUnitOptions"
              :key="item.value"
              :label="item.label"
              >{{ item.label }}</el-radio
            >
          </el-radio-group>
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
import { fetchList, createArticle, updateArticle } from "@/api/article";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import material from "./material";

export default {
  name: "CaseIndex",
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
        materialCode: "",
        materialName: "",
        materialModel: "",
        materialType: "",
        materialUnit: "",
        materialCount: "",
        materialPrice: "",
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
