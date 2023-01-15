<template>
  <div>
    <el-input
      type="textarea"
      :autosize="{ minRows: 2, maxRows: 15 }"
      placeholder="请输入内容"
      v-model="sheet"
    >
    </el-input>
    <div class="left">
      <el-button type="primary" @click="all">全部</el-button>
      <h2>-----------</h2>

      <el-button @click="del">删除</el-button>
      <el-button @click="get">查询</el-button>
      <el-input v-model="id" placeholder="请输入ID" class="input"> </el-input>
      <el-input v-model="indent" placeholder="请输入订单号" class="input">
      </el-input>
      <el-input v-model="insurance" placeholder="请输入保险" class="input">
      </el-input>
      <el-input v-model="uav" placeholder="请输入客户" class="input">
      </el-input>
      <el-button @click="add">添加</el-button>
      <el-button @click="update">修改</el-button>
    </div>
    <div class="right">
      <table>
        <tr>
          <th>ID</th>
          <th>订单</th>
          <th>保险</th>
          <th>公司</th>
        </tr>
        <tr v-for="(item, index) in sheet" :key="index">
          <td>{{ item.id }}</td>
          <td>{{ item.indent }}</td>
          <td>{{ item.insurance }}</td>
          <td>{{ item.uav }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      id: "",
      indent: "",
      insurance: "",
      uav: "",
      sheet: [],
    };
  },
  methods: {
    all() {
      axios
        .get("http://127.0.0.1:8081/insurance/all")
        .then((res) => {
          this.sheet = JSON.stringify(res.data);
        })
        .catch((err) => {
          console.log("获取数据失败" + err);
        });
    },
    get() {
      axios
        .get("http://127.0.0.1:8081/insurance/get", {
          params: {
            // id: this.id,
            insurance: this.insurance,
            uav: this.uav,
            sort:''
          },
        })
        .then((res) => {
          this.sheet = JSON.stringify(res.data);
          console.log(res.data);
        })
        .catch((err) => {
          console.log("获取数据失败" + err);
        });
    },
    del() {
      axios
        .get("http://127.0.0.1:8081/insurance/del", {
          params: {
            id: this.id,
          },
        })
        .then((res) => {
          if (res.data.status == 200) {
            this.all();
          } else {
            this.$message({
              message: "删除失败",
              type: "error",
            });
          }
        })
        .catch((err) => {
          console.log("获取数据失败" + err);
        });
    },
    add() {
      axios
        .get("http://127.0.0.1:8081/insurance/add", {
          params: {
            id: this.id,
            indent: this.indent,
            insurance: this.insurance,
            uav: this.uav,
          },
        })
        .then((res) => {
          if (res.data.status == 200) {
            this.get();
          } else {
            this.$message({
              message: "添加失败",
              type: "error",
            });
          }
        })
        .catch((err) => {
          console.log("获取数据失败" + err);
        });
    },
    update() {
      axios
        .get("http://127.0.0.1:8081/insurance/update", {
          params: {
            id: this.id,
            // indent: this.indent,
            insurance: this.insurance,
            uav: this.uav,
          },
        })
        .then((res) => {
          if (res.data.status == 200) {
            this.get();
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
  },
};
</script>

<style>
</style>