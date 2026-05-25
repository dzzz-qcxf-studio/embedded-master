{
  "type": "技术系统架构图（暗色工程感）",
  "goal": "生成一张用于 README 的嵌入式项目开发工具架构概览图",
  "canvas": {
    "aspect_ratio": "16:9",
    "background": "deep slate #0F172A with subtle 1px grid lines #1E293B at 32px spacing",
    "outer_padding": "60px"
  },
  "title_strip": {
    "title": "Embedded Master 架构图",
    "subtitle": "端到端嵌入式开发流程",
    "position": "top-left, large mono font (JetBrains Mono / SF Mono), light gray text"
  },
  "color_semantics": {
    "palette": [
      { "role": "Pipeline Stages", "color": "cyan #22D3EE", "use_for": "9个开发阶段" },
      { "role": "Gate Control", "color": "amber #FBBF24", "use_for": "6道门控检查" },
      { "role": "Sub-Agents", "color": "emerald #34D399", "use_for": "专业评审Agent" },
      { "role": "Knowledge Base", "color": "violet #A78BFA", "use_for": "知识库和参考文档" },
      { "role": "Tools", "color": "orange #FB923C", "use_for": "编译烧录调试工具" },
      { "role": "Output", "color": "rose #FB7185", "use_for": "交付物输出" }
    ]
  },
  "regions": {
    "items": [
      { "id": "R1", "label": "Pipeline 流水线", "color_border": "cyan dashed" },
      { "id": "R2", "label": "Intelligence 智能层", "color_border": "emerald dashed" },
      { "id": "R3", "label": "Infrastructure 基础设施", "color_border": "violet dashed" }
    ]
  },
  "nodes": {
    "items": [
      { "id": "N1", "label": "需求分析", "role": "Pipeline Stages", "region": "R1" },
      { "id": "N2", "label": "架构设计", "role": "Pipeline Stages", "region": "R1" },
      { "id": "N3", "label": "器件选型", "role": "Pipeline Stages", "region": "R1" },
      { "id": "N4", "label": "约束输出", "role": "Pipeline Stages", "region": "R1" },
      { "id": "N5", "label": "图表输出", "role": "Pipeline Stages", "region": "R1" },
      { "id": "N6", "label": "软件设计", "role": "Pipeline Stages", "region": "R1" },
      { "id": "N7", "label": "编码实现", "role": "Pipeline Stages", "region": "R1" },
      { "id": "N8", "label": "测试验证", "role": "Pipeline Stages", "region": "R1" },
      { "id": "N9", "label": "报告生成", "role": "Pipeline Stages", "region": "R1" },
      { "id": "N10", "label": "Gate 门控", "role": "Gate Control", "region": "R2" },
      { "id": "N12", "label": "硬件评审", "role": "Sub-Agents", "region": "R2" },
      { "id": "N13", "label": "固件工程师", "role": "Sub-Agents", "region": "R2" },
      { "id": "N14", "label": "代码审查", "role": "Sub-Agents", "region": "R2" },
      { "id": "N15", "label": "技术文档", "role": "Sub-Agents", "region": "R2" },
      { "id": "N16", "label": "国产生态", "role": "Knowledge Base", "region": "R3" },
      { "id": "N17", "label": "供应链风险", "role": "Knowledge Base", "region": "R3" },
      { "id": "N18", "label": "STM32模板", "role": "Knowledge Base", "region": "R3" },
      { "id": "N19", "label": "编译烧录", "role": "Tools", "region": "R3" },
      { "id": "N20", "label": "Word/HTML报告", "role": "Output", "region": "R3" }
    ]
  },
  "node_style": {
    "shape": "rounded rectangle, corner radius 8px",
    "fill": "background color of role × 12% opacity",
    "border": "1.5px solid in role color",
    "label": "label text in JetBrains Mono 11pt, color = role color lighter shade"
  },
  "edges": {
    "items": [
      { "from": "N1", "to": "N2" },
      { "from": "N2", "to": "N3" },
      {from": "N3", "to": "N4" },
      { "from": "N4", "to": "N5" },
      { "from": "N5", "to": "N6" },
      { "from": "N6", "to": "N7" },
      { "from": "N7", "to": "N8" },
      { "from": "N8", "to": "N9" }
    ],
    "edge_style": {
      "default": "solid line 1.5px slate #64748B with filled triangle arrowhead"
    }
  },
  "legend": {
    "enabled": true,
    "position": "bottom-right",
    "content": "颜色含义: cyan=流水线, amber=门控, emerald=Agent, violet=知识库, orange=工具, rose=输出"
  }
}
