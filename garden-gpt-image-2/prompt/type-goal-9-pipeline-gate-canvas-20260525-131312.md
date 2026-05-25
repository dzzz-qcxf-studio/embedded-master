{
  "type": "工程感流程图 / 决策图",
  "goal": "生成一张嵌入式项目9阶段开发流程图，展示从需求到报告的完整pipeline，包含Gate门控检查",
  "canvas": {
    "aspect_ratio": "3:4 portrait",
    "background": "deep slate #0F172A with subtle 1px grid #1E293B at 32px spacing",
    "outer_padding": "60px"
  },
  "title_strip": {
    "title": "Embedded Master Pipeline",
    "subtitle": "9 Stages with 6 Quality Gates",
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
      "labels": "Pass / Fail on outgoing arrows"
    }
  },
  "nodes": {
    "items": [
      { "id": "S", "type": "start_end", "label": "User Requirement" },
      { "id": "N1", "type": "process", "label": "Stage 1: Requirements Analysis" },
      { "id": "G1", "type": "decision", "label": "Gate 1: Requirements Frozen?" },
      { "id": "N2", "type": "process", "label": "Stage 2: Architecture Design" },
      { "id": "G2", "type": "decision", "label": "Gate 2: Architecture Selected?" },
      { "id": "N3", "type": "process", "label": "Stage 3: Component Selection" },
      { "id": "G3", "type": "decision", "label": "Gate 3: Components Verified?" },
      { "id": "N4", "type": "process", "label": "Stage 4: Constraint Output" },
      { "id": "G4", "type": "decision", "label": "Gate 4: Constraints Complete?" },
      { "id": "N5", "type": "process", "label": "Stage 5: Diagrams & Schematics" },
      { "id": "G5", "type": "decision", "label": "Gate 5: Diagrams Valid?" },
      { "id": "N6", "type": "process", "label": "Stage 6: Software Design" },
      { "id": "G6", "type": "decision", "label": "Gate 6: Design Reviewed?" },
      { "id": "N7", "type": "process", "label": "Stage 7: Coding & Build" },
      { "id": "N8", "type": "process", "label": "Stage 8: Testing & Validation" },
      { "id": "N9", "type": "process", "label": "Stage 9: Report Generation" },
      { "id": "E", "type": "start_end", "label": "Deliverables" }
    ]
  },
  "edges": {
    "items": [
      { "from": "S", "to": "N1" },
      { "from": "N1", "to": "G1" },
      { "from": "G1", "to": "N2", "label": "Pass" },
      { "from": "G1", "to": "N1", "label": "Fail: Revise" },
      { "from": "N2", "to": "G2" },
      { "from": "G2", "to": "N3", "label": "Pass" },
      { "from": "G2", "to": "N2", "label": "Fail: Revise" },
      { "from": "N3", "to": "G3" },
      { "from": "G3", "to": "N4", "label": "Pass" },
      { "from": "G3", "to": "N3", "label": "Fail: Revise" },
      { "from": "N4", "to": "G4" },
      { "from": "G4", "to": "N5", "label": "Pass" },
      { "from": "G4", "to": "N4", "label": "Fail: Revise" },
      { "from": "N5", "to": "G5" },
      { "from": "G5", "to": "N6", "label": "Pass" },
      { "from": "G5", "to": "N5", "label": "Fail: Revise" },
      { "from": "N6", "to": "G6" },
      { "from": "G6", "to": "N7", "label": "Pass" },
      { "from": "G6", "to": "N6", "label": "Fail: Revise" },
      { "from": "N7", "to": "N8" },
      { "from": "N8", "to": "N9" },
      { "from": "N9", "to": "E" }
    ],
    "edge_style": {
      "default": "solid line 1.5px slate #64748B with filled triangle arrowhead",
      "yes_branch": "thin solid line in emerald #34D399 + label Pass near origin in mono 9pt",
      "no_branch": "thin solid line in rose #FB7185 + label Fail near origin in mono 9pt"
    }
  },
  "legend": {
    "enabled": true,
    "position": "bottom-right",
    "content": "shape mapping: circle=start/end, rect=stage, diamond=gate. Green arrow=Pass, Red arrow=Fail/Revise"
  }
}
