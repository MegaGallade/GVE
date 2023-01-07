<template>
  <div>
    <h1>Test</h1>
    <el-button @click="addRow"> xinzn </el-button>
    <el-table
      :data="tableData"
      style="width: 100%"
      border
      :row-class-name="tableRowClassName"
      @cell-click="handleSerialEdit"
    >
      <el-table-column prop="id" label="序号" align="center"
        ><template slot-scope="{ $index }">
          <span>{{ $index + 1 }}</span>
        </template></el-table-column
      >
      <el-table-column
        v-for="(item, index) in columnData"
        :key="index"
        :label="item.label"
        :prop="item.prop"
      >
        <template slot-scope="scope">
          <el-input
            ref="serial"
            v-if="'flag' + item.prop + scope.row.index == value"
            v-model="scope.row[scope.column.property]"
            @blur="blur"
          />
          <span v-else>{{ scope.row[scope.column.property] }}</span>
        </template>
      </el-table-column>
    </el-table>
    <hr />
    <el-table
      :data="tableData"
      style="width: 100%"
      border
      :row-style="rowStyle"
      @cell-click="handleEdit"
    >
      <el-table-column label="日期" width="140">
        <template slot-scope="scope">
          <el-input
            ref="flag"
            v-if="'flag'"
            v-model="scope.row.date"
            @blur="blur"
          />
          <span v-else>{{ scope.row.date }}</span>
        </template>
      </el-table-column>
      <el-table-column label="日期" width="140">
        <template slot-scope="scope">
          <el-input v-if="scope.row.iseditor" v-model="scope.row.date" />

          <span v-show="!scope.row.iseditor">{{ scope.row.date }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="120">
        <template slot-scope="scope">
          <div class="none">
            <el-input type="text" v-model="scope.row.name" />
          </div>
          <span v-show="!scope.row.iseditor">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="地址" width="260">
        <template slot-scope="scope">
          <div class="none">
            <el-input type="text" v-model="scope.row.address" />
          </div>
          <span v-show="!scope.row.iseditor">{{ scope.row.address }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="sex" label="性别" width="120">
        <template slot-scope="scope">
          <div class="none">
            <el-input type="text" v-model="scope.row.sex" />
          </div>
          <span v-show="!scope.row.iseditor">{{ scope.row.sex }}</span>
        </template>
      </el-table-column>
      <el-table-column label="年龄" width="120">
        <template slot-scope="scope">
          <div class="none">
            <el-input type="text" v-model="scope.row.age" />
          </div>
          <span v-show="!scope.row.iseditor">{{ scope.row.age }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: "",
      columnData: [
        {
          label: "日期",
          prop: "date",
          edit: true,
        },
        {
          label: "姓名",
          prop: "name",
          edit: true,
        },
        {
          label: "地址",
          prop: "address",
        },
        {
          label: "性别",
          prop: "sex",
        },
        {
          label: "年级",
          prop: "age",
        },
      ],
      tableData: [
        {
          date: "2016-05-02",
          name: "王小狗",
          address: "上海市普陀区金沙江路 1518 弄",
          sex: "女",
          age: null,
        },
        {
          date: "2016-05-04",
          name: "王小猫",
          address: "上海市普陀区金沙江路 1517 弄",
          sex: null,
          age: "29",
        },
        {
          date: "2016-05-01",
          name: "王小猪",
          address: "上海市普陀区金沙江路 1519 弄",
          sex: "女",
          age: "12",
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄",
          sex: "男",
          age: null,
        },
      ],
      aa: {
        name: "刘傲波",
        age: "18",
        gender: "男",
      },
      columData: [{ label: "姓名" }],
    };
  },
  computed: {
    data() {
      return this.tableData.map((item) => Object.values(item));
    },
  },
  methods: {
    addRow() {
      this.tableData.push({
        date: "",
        name: "",
        address: " ",
        sex: "",
        age: "",
      });
    },
    rowStyle({ row }) {
      let stylejson = {};
      if (row) {
        stylejson.height = "40px";
        return stylejson;
      }
    },
    handleSerialEdit(row, column) {
      this.value = "serial" + column.property + row.index;
      console.log(row.index,this.value);
      this.$nextTick(() => {
        if (this.$refs.flag[0]) {
          this.$refs.flag[0].focus();
        }
      });
    },
    changeInput(row, column, cell, event) {
      cell.children[0].children[0].classList.remove("none");
      cell.children[0].children[1].classList.add("none");
    },
    leaveTable(row, column, cell, event) {
      cell.children[0].children[0].classList.add("none");
      cell.children[0].children[1].classList.remove("none");
    },
    blur() {
      this.value = "";
    },
    tableRowClassName({row,rowIndex}) {
      row.index=rowIndex
    }
  },
};
</script>


<style>
.none {
  display: none;
}
.block {
  display: block;
}
</style>
