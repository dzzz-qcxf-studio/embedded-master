{
  "type": "技术系统架构图（暗色工程感）",
  "goal": "生成一张用于 README 的嵌入式项目开发工具架构概览图",
  "canvas": {
    "aspect_ratio": "16:9",
    "background": "deep slate #0F172A with subtle 1px grid lines #1E293B at 32px spacing",
    "outer_padding": "60px"
  },
  "title_strip": {
    "title": "Embedded Master Architecture",
    "subtitle": "End-to-End Embedded Development Pipeline",
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
      { "id": "R1", "label": "Pipeline", "color_border": "cyan dashed" },
      { "id": "R2", "label": "Intelligence", "color_border": "emerald dashed" },
      { "id": "R3", "label": "Infrastructure", "color_border": "violet dashed" }
    ]
  },
  "nodes": {
    "items": [
      { "id": "N1", "label": "Requirements", "role": "Pipeline Stages", "region": "R1" },
      { "id": "N2", "label": "Architecture", "role": "Pipeline Stages", "region": "R1" },
      { "id": "N3", "label": "Components", "role": "Pipeline Stages", "region": "R1" },
      { "id": "N4", "label": "Constraints", "role": "Pipeline Stages", "region": "R1" },
      { "id": "N5", "label": "Diagrams", "role": "Pipeline Stages", "region": "R1" },
      { "id": "N6", "label": "Software Design", "role": "Pipeline Stages", "region": "R1" },
      { "id": "N7", "label": "Coding", "role": "Pipeline Stages", "region": "R1" },
      { "id": "N8", "label": "Testing", "role": "Pipeline Stages", "region": "R1" },
      { "id": "N9", "label": "Report", "role": "Pipeline Stages", "region": "R1" },
      { "id": "N10", "label": "Gate Checker", "role": "Gate Control", "region": "R2" },
      { "id": "N11", "label": "Anti-Pattern", "role": "Gate Control", "region": "R2" },
      { "id": "N12", "label": "HW Reviewer", "role": "Sub-Agents", "region": "R2" },
      { "id": "N13", "label": "FW Engineer", "role": "Sub-Agents", "region": "R2" },
      { "id": "N14", "label": "Code Reviewer", "role": "Sub-Agents", "region": "R2" },
      { "id": "N15", "label": "Tech Writer", "role": "Sub-Agents", "region": "R2" },
      { "id": "N16", "label": "Domestic Sources", "role": "Knowledge Base", "region": "R3" },
      { "id": "N17", "label": "Supply Chain Risk", "role": "Knowledge Base", "region": "R3" },
      { "id": "N18", "label": "STM32 Templates", "role": "Knowledge Base", "region": "R3" },
      { "id": "N19", "label": "Build & Flash", "role": "Tools", "region": "R3" },
      { "id": "N20", "label": "Word / HTML Report", "role": "Output", "region": "R3" }
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
      { "from": "N3", "to": "N4" },
      { "from": "N4", "to": "N5" },
      { "from": "N5", "to": "N6" },
      { "from": "N6", "to": "N7" },
      { "from": "N7", "to": "N8" },
      { "from": "N8", "to": "N9" },
      { "from": "N10", "to": "N1", "label": "gate" },
      { "from": "N10", "to": "N3", "label": "gate" },
      { "from": "N12", "to": "N2", "label": "review" },
      { "from": "N14", "to": "N7", "label": "review" },
      { "from": "N16", "to": "N3", "label": "data" },
      { "from": "N19", "to": "N7", "label": "build" },
      { "from": "N9", "to": "N20", "label": "generate" }
    ],
    "edge_style": {
      "default": "solid line 1.5px slate #64748B with filled triangle arrowhead"
    }
  },
  "legend": {
    "enabled": true,
    "position": "bottom-right",
    "content": "color → role mapping: cyan=Pipeline, amber=Gate, emerald=Agent, violet=KB, orange=Tools, rose=Output"
  }
}
