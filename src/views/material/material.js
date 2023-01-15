const material = {
  materialTypeOptions:
    [
      {
        value: "raw", label: "原材料",
        children: [
          { value: "electronic", label: "电子", },
          { value: "hardware", label: "五金", },
          { value: "injection", label: "注塑", },
          { value: "ingredient", label: "辅料", },
          { value: "wire", label: "线材", },
          { value: "other", label: "其它", },
        ],
      },
      {
        value: "semi", label: "半成品",
        children: [
          { value: "processed", label: "加工品", },
          { value: "pcba", label: "PCBA", },
          { value: "Printing", label: "喷漆印字", },
          { value: "oxidation", label: "氧化金属", },
        ],
      },
      {
        value: "final", label: "成品",
        children: [
          { value: "suite", label: "套装", },
          { value: "single", label: "单件", },
          { value: "accessory", label: "配件", },
          { value: "pack", label: "包装", },
        ],
      },
    ],
  materialUnitOptions: [
    { value: "pcs", label: "件" },
    { value: "m", label: "米" },
    { value: "kg", label: "千克" },
  ],
 
}

export default material