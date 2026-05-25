{
  "type": "工程感流程图 / 决策图",
  "goal": "生成一张嵌入式项目9阶段开发流程图，展示从需求到报告的完整pipeline，包含Gate门控检查",
  "canvas": {
    "aspect_ratio": "3:4 portrait",
    "background": "deep slate #0F172A with subtle 1px grid #1E293B at 32px spacing",
    "outer_padding": "60px"
  },
  "title_strip": {
    "title": "Embedded Master 开发流程",
    "subtitle": "9阶段 + 6道门控",
    "position": "top-left, JetBrains Mono / SF Mono, light gray"
  },
  "flow_direction": "top-to-bottom",
  "shape_legend": {
    "start_end": {
      "shape": "filled solid circle (start) and target / bullseye circle (end)",
      "color": "cyan #22D3EE for start, rose #FB7185 for end"
    },
    "process": {
      "shape": "rectangle with corner radius 8px",
      "color": "emerald #34D399 border + 12% fill"
    },
    "decision": {
      "shape": "diamond (rotated square)",
      "color": "amber #FBBF24 border + 12% fill",
      "labels": "通过 / 否决 on outgoing arrows"
    }
  },
  "nodes": {
    "items": [
      { "id": "S", "type": "start_end", "label": "用户需求" },
      { "id": "N1", "type": "process", "label": "阶段1: 需求分析" },
      { "id": "G1", "type": "decision", "label": "Gate1: 需求冻结?" },
      { "id": "N2", "type": "process", "label": "阶段2: 架构设计" },
      { "id": "G2", "type": "decision", "label": "Gate2: 架构选定?" },
      { "id": "N3", "type": "process", "label": "阶段3: 器件选型" },
      { "id": "G3", "type": "decision", "label": "Gate3: 选型验证?" },
      { "id": "N4", "type": "process", "label": "阶段4: 约束输出" },
      { "id": "G4", "type": "decision", "label": "Gate4: 约束完整?" },
      { "id": "N5", "type": "process", "label": "阶段5: 图表输出" },
      { "id": "G5", "type": "decision", "label": "Gate5: 图表验证?" },
      { "id": "N6", "type": "process", "label": "阶段6: 软件设计" },
      { "id": "G6", "type": "decision", "label": "Gate6: 设计评审?" },
      { "id": "N7", "type": "process", "label": "阶段7: 编码实现" },
      { "id": "N8", "type": "process", "label": "阶段8: 测试验证" },
      { "id": "N9", "type": "process", "label": "阶段9: 报告生成" },
      { "id": "E", "type": "start_end", "label": "交付物" }
    ]
  },
  "edges": {
    "items": [
      { "from": "S", "to": "N1" },
      { "from": "N1", "to": "G1" },
      { "from": "G1", "to": "N2", "label": "通过" },
      { "from": "G1", "to": "N1", "label": "否决: 修订" },
      { "from": "N2", "to": "G2" },
      { "from": "G2", "to": "N3", "label": "通过" },
      { "from": "G2", "to": "N2", "label": "否决: 修订" },
      { "from": "N3", "to": "G3" },
      { "from": "G3", "to": "N4", "label": "通过" },
      { "from": "G3", "to": "N3", "label": "否决: 修订" },
      { "from": "N4", "to": "G4" },
      { "from": "G4", "to": "N5", "label": "通过" },
      { "from": "G4", "to": "N4", "label": "否决: 修订" },
      { "from": "N5", "to": "G5" },
      { "from": "G5", "to": "N6", "label": "通过" },
      { "from": "G5", "to": "N5", "label": "否决: 修订" },
      { "from": "N6", "to": "G6" },
      { "from": "G6", "to": "N7", "label": "通过" },
      { "from": "G6", "to": "N6", "label": "否决: 修订" },
      { "from": "N7", "to": "N8" },
      { "from": "N8", "to": "N9" },
      { "from": "N9", "to": "E" }
    ],
    "edge_style": {
      "default": "solid line 1.5px slate #64748B with filled triangle arrowhead",
      "yes_branch": "thin solid line in emerald #34D399 + label 通过 near origin in mono 9pt",
      "no_branch": "thin solid line in rose #FB7185 + label 否决 near origin in mono 9pt"
    }
  },
  "legend": {
    "enabled": true,
    "position": "bottom-right",
    "content": "图例: 圆形=开始/结束, 矩形=阶段, 菱形=门控, 绿色=通过, 红色=否决/修订"
  }
}
