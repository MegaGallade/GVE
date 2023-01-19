const dataSetting = {
  common: {
    elcol: 24,
    yearDaysDefault: 364,
    textMap: {
      update: "编辑",
      create: "新建",
    },
    formatTimeList: ['start_date', 'end_date', 'this_create_time', 'this_modify_time'],
    datePickerOptions: {
      shortcuts: [
        {
          text: "今天",
          onClick(picker) {
            picker.$emit("pick", new Date());
          },
        },
        {
          text: "一月后",
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 30);
            picker.$emit("pick", date);
          },
        },
        {
          text: "一年后",
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 365);
            picker.$emit("pick", date);
          },
        },
      ],
    },
    placeholder: {
      insurance: "请输入保险公司单号，如‘11209543901615991250’",
      indent: "请输入销售订单号，如‘GBICKX220818888’",
      company: "请输入单位名称，如‘XXXX有限公司’或‘人名’",
      customer: "请输入客户名称，如‘XXXX有限公司’或‘人名’",
      salesman: "请输入业务员姓名",
      serial: "请输入设备序列号，如‘f64b9684cdd9466a’",
      platform: "请输入机箱编号，如‘CGBX12DC029A’",
      uav: "请输入无人机编号，如‘6HGUP22FB085C’",
      ptz: "请输入灯组或广播编号，如‘6HGLT22FB085C’",
      remote: "请输入遥控器编号，如‘01GRC22MR075C’",
      wifi: "请输入WiFi号，如‘GBI_6200CFCF’",
      interphone: "请输入对讲机编号，如‘01GWR02NV003A’,若无则留空",
      remark: "请输入",
    },
    rules1: {
      type: [
        { required: true, message: "type is required", trigger: "change" },
      ],
      insurance: [
        { required: false, message: "type is required", trigger: "change" },
      ],
      indent: [
        { required: true, message: "请输入销售订单号", trigger: "blur" },
      ],
      company: [
        { required: true, message: "请输入对方公司或个人的名称", trigger: "blur" },
      ],
      salesman: [
        { required: true, message: "请输入销售员姓名", trigger: "blur" },
        { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
      ],

      title: [
        { required: true, message: "title is required", trigger: "blur" },
      ],
    },

  },
  insurance: {
    delayDaysDefault: 30,
    remindDaysDefault: 30,
    listQuery: {
      page: 1,
      limit: 100,
      insurance: "",
      uav: "",
      state: "",
      sort: "-id",
    },
    stateTypeOptions: [
      { value: "未激活", label: "未激活" ,text:"未激活" },
      { value: "生效中", label: "生效中" ,text:"生效中" },
      { value: "已续保", label: "已续保" ,text:"已续保" },
      { value: "已失效", label: "已失效" ,text:"已失效" },
    ],
    stateType: {
      未激活: "info",
      生效中: "success",
      已续保: "success",
      已失效: "warning",
    },
    activateDisplay: {
      false: "未激活",
      true: "已激活",
    },
    remindDisplay: {
      false: "未提醒",
      true: "已提醒",
    },
    renewalDisplay: {
      false: "未续保",
      true: "已续保",
    },
    temp: {
      id: undefined,
      insurance: "",
      indent: "",
      uav: "",
      company: "",
      salesman: "",
      state: "",
      days: undefined,
      is_activate: undefined,
      is_remind: false,
      is_renewal: false,
      start_date: undefined,
      end_date: undefined,
      serial: "",
      platform: "",
      ptz: "",
      remote: "",
      wifi: "",
      interphone: "",
      remark: "",
      change: "",
      this_is_delete: false,
      this_create_time: undefined,
      this_create_uid: "",
      this_modify_time: undefined,
      this_modify_uid: "",
    },
    tHeader: [
      "NO.",
      "保单号",
      "飞机编号",
      "订单号",
      "客户",
      "业务员",
      "状态",
      "天数",
      "激活",
      "提醒",
      "续保",
      "开始日期",
      "结束日期",
      "序列号",
      "机箱编号",
      "灯组编号",
      "遥控器编号",
      "WiFi号",
      "对讲机编号",
      "备注",
      "更改",
    ],
    filterVal: [
      "id",
      "insurance",
      "uav",
      "indent",
      "company",
      "salesman",
      "state",
      "days",
      "is_activate",
      "is_remind",
      "is_renewal",
      "start_date",
      "end_date",
      "serial",
      "platform",
      "ptz",
      "remote",
      "wifi",
      "interphone",
      "remark",
      "change",
    ]
  }
}

export default dataSetting