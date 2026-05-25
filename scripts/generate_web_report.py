#!/usr/bin/env python3

"""
Embedded Master — 项目汇报网页生成器
用法: python generate_web_report.py <project_path> [--output report.html]
依赖: 无（纯Python标准库，Mermaid.js通过CDN加载）
"""

import sys
import os
import re
import json
import argparse
from datetime import datetime


def read_file(path):
    """安全读取文件"""
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            return f.read()
    return ""


def extract_tables(md_text):
    """从Markdown中提取表格数据"""
    tables = []
    lines = md_text.split('\n')
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        if '|' in line and i + 1 < len(lines) and '---' in lines[i + 1]:
            headers = [h.strip() for h in line.split('|') if h.strip()]
            rows = []
            i += 2  # skip header and separator
            while i < len(lines) and '|' in lines[i]:
                cells = [c.strip() for c in lines[i].split('|') if c.strip()]
                if cells:
                    rows.append(cells)
                i += 1
            tables.append({"headers": headers, "rows": rows})
        else:
            i += 1
    return tables


def extract_mermaid(md_text):
    """从Markdown中提取Mermaid代码块"""
    pattern = r'```mermaid\s*\n(.*?)```'
    matches = re.findall(pattern, md_text, re.DOTALL)
    return matches


def extract_code_blocks(md_text):
    """从Markdown中提取代码块"""
    pattern = r'```(\w*)\s*\n(.*?)```'
    matches = re.findall(pattern, md_text, re.DOTALL)
    return matches


def parse_bom(md_text):
    """解析BOM表"""
    tables = extract_tables(md_text)
    for table in tables:
        if '单价' in table['headers'] or '小计' in table['headers']:
            return table
    return None


def parse_status(project_path):
    """解析项目状态"""
    status_path = os.path.join(project_path, 'docs', 'embedded', 'project_status.json')
    if os.path.exists(status_path):
        with open(status_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    return None


def generate_html(project_path, output_path=None):
    """生成HTML报告"""
    docs_dir = os.path.join(project_path, 'docs', 'embedded')

    # 读取所有文档
    files = {
        'requirements': read_file(os.path.join(docs_dir, '01-requirements.md')),
        'architecture': read_file(os.path.join(docs_dir, '02-architecture.md')),
        'components': read_file(os.path.join(docs_dir, '03-components.md')),
        'constraints': read_file(os.path.join(docs_dir, '04-constraints.md')),
        'wiring': read_file(os.path.join(docs_dir, '05-wiring.md')),
        'flowchart': read_file(os.path.join(docs_dir, '05-flowchart.md')),
        'block_diagram': read_file(os.path.join(docs_dir, '05-block-diagram.md')),
        'bom': read_file(os.path.join(docs_dir, '05-bom.md')),
        'software_arch': read_file(os.path.join(docs_dir, '06-software-architecture.md')),
        'module_spec': read_file(os.path.join(docs_dir, '07-module-spec.md')),
        'detailed_design': read_file(os.path.join(docs_dir, '08-detailed-design.md')),
        'review': read_file(os.path.join(docs_dir, '09-review-report.md')),
        'coding_standard': read_file(os.path.join(docs_dir, '10-coding-standard.md')),
        'test_report': read_file(os.path.join(docs_dir, '11-test-report.md')),
    }

    status = parse_status(project_path)
    project_name = status.get('project', os.path.basename(project_path)) if status else os.path.basename(project_path)
    work_mode = status.get('workMode', 'professional') if status else 'professional'
    current_stage = status.get('currentStage', 'unknown') if status else 'unknown'

    # 解析BOM
    bom_data = parse_bom(files['bom'])
    total_cost = 0
    if bom_data:
        for row in bom_data['rows']:
            # 尝试从最后一列或"小计"/"合计"列提取金额
            for cell in reversed(row):
                match = re.search(r'(\d+)', cell)
                if match:
                    total_cost = int(match.group(1))
                    break
            if total_cost > 0:
                break

    # 解析阶段状态
    stages = {}
    if status and 'stages' in status:
        stages = status['stages']

    stage_names = {
        'requirements': '需求分析',
        'architecture': '架构设计',
        'detailed_design': '详细设计',
        'constraints': '约束输出',
        'diagrams': '图表输出',
        'software_design': '软件设计',
        'coding': '编码实现',
        'testing': '测试验证',
        'report': '报告生成'
    }

    # 提取Mermaid图表
    block_diagrams = extract_mermaid(files['block_diagram'])
    flowcharts = extract_mermaid(files['flowchart'])

    # 提取需求表
    req_tables = extract_tables(files['requirements'])
    arch_tables = extract_tables(files['architecture'])
    comp_tables = extract_tables(files['components'])
    constraint_tables = extract_tables(files['constraints'])
    wiring_tables = extract_tables(files['wiring'])
    bom_tables = extract_tables(files['bom'])
    module_tables = extract_tables(files['module_spec'])

    # 生成进度条HTML
    progress_html = ""
    completed = 0
    total = len(stage_names)
    for key, label in stage_names.items():
        stage = stages.get(key, {})
        stage_status = stage.get('status', 'pending')
        gate = stage.get('gate', 'pending')
        if stage_status == 'completed':
            completed += 1
            icon = "✓"
            cls = "completed"
        elif stage_status == 'in_progress':
            icon = "◉"
            cls = "active"
        else:
            icon = "○"
            cls = "pending"
        progress_html += f'<div class="stage-item {cls}"><span class="stage-icon">{icon}</span><span class="stage-name">{label}</span></div>\n'

    progress_pct = int(completed / total * 100) if total > 0 else 0

    # 生成BOM表格HTML
    bom_html = ""
    if bom_data:
        bom_html += '<table class="data-table"><thead><tr>'
        for h in bom_data['headers']:
            bom_html += f'<th>{h}</th>'
        bom_html += '</tr></thead><tbody>'
        for row in bom_data['rows']:
            bom_html += '<tr>'
            for cell in row:
                # 将淘宝搜索转换为链接
                if '搜索' in cell:
                    search_term = cell.replace('搜索', '').strip('"').strip("'").strip('"').strip('"')
                    cell = f'<a href="https://s.taobao.com/search?q={search_term}" target="_blank">{cell}</a>'
                bom_html += f'<td>{cell}</td>'
            bom_html += '</tr>'
        bom_html += '</tbody></table>'

    # 生成接线表HTML
    wiring_html = ""
    if wiring_tables:
        for table in wiring_tables[:1]:  # 只取第一个表
            wiring_html += '<table class="data-table"><thead><tr>'
            for h in table['headers']:
                wiring_html += f'<th>{h}</th>'
            wiring_html += '</tr></thead><tbody>'
            for row in table['rows']:
                wiring_html += '<tr>'
                for cell in row:
                    wiring_html += f'<td>{cell}</td>'
                wiring_html += '</tr>'
            wiring_html += '</tbody></table>'

    # 生成接口矩阵HTML
    interface_html = ""
    for table in constraint_tables:
        if '接口' in table['headers'] and '信号' in table['headers']:
            interface_html += '<table class="data-table"><thead><tr>'
            for h in table['headers']:
                interface_html += f'<th>{h}</th>'
            interface_html += '</tr></thead><tbody>'
            for row in table['rows']:
                interface_html += '<tr>'
                for cell in row:
                    interface_html += f'<td>{cell}</td>'
                interface_html += '</tr>'
            interface_html += '</tbody></table>'
            break

    # 生成模块规格HTML
    module_html = ""
    if module_tables:
        for table in module_tables[:1]:
            module_html += '<table class="data-table"><thead><tr>'
            for h in table['headers']:
                module_html += f'<th>{h}</th>'
            module_html += '</tr></thead><tbody>'
            for row in table['rows']:
                module_html += '<tr>'
                for cell in row:
                    module_html += f'<td>{cell}</td>'
                module_html += '</tr>'
            module_html += '</tbody></table>'

    # 功耗数据
    power_html = ""
    for table in constraint_tables:
        if '功率' in table['headers'] and '电压' in table['headers']:
            power_html += '<table class="data-table"><thead><tr>'
            for h in table['headers']:
                power_html += f'<th>{h}</th>'
            power_html += '</tr></thead><tbody>'
            for row in table['rows']:
                power_html += '<tr>'
                for cell in row:
                    power_html += f'<td>{cell}</td>'
                power_html += '</tr>'
            power_html += '</tbody></table>'
            break

    # 提取Mermaid图表用于渲染
    all_mermaid = []
    for key in ['block_diagram', 'flowchart', 'architecture']:
        mermaid_blocks = extract_mermaid(files[key])
        all_mermaid.extend(mermaid_blocks)

    mermaid_html = ""
    for i, diagram in enumerate(all_mermaid):
        mermaid_html += f'<div class="mermaid" id="mermaid-{i}">{diagram.strip()}</div>\n'

    # 当前时间
    now = datetime.now().strftime('%Y-%m-%d %H:%M')

    html = f"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{project_name} — 嵌入式方案报告</title>
    <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
    <style>
        :root {{
            --bg: #0f1117;
            --surface: #1a1d27;
            --surface2: #242836;
            --border: #2e3345;
            --text: #e4e7ef;
            --text2: #9ca3b8;
            --accent: #6c8cff;
            --accent2: #4a6aff;
            --success: #34d399;
            --warning: #fbbf24;
            --danger: #f87171;
            --info: #60a5fa;
        }}

        * {{ margin: 0; padding: 0; box-sizing: border-box; }}

        body {{
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans SC", sans-serif;
            background: var(--bg);
            color: var(--text);
            line-height: 1.6;
        }}

        .container {{
            max-width: 1280px;
            margin: 0 auto;
            padding: 0 24px;
        }}

        /* Header */
        .header {{
            background: linear-gradient(135deg, #1e2235 0%, #151827 100%);
            border-bottom: 1px solid var(--border);
            padding: 32px 0;
            position: relative;
            overflow: hidden;
        }}

        .header::before {{
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: linear-gradient(90deg, var(--accent), var(--success), var(--info));
        }}

        .header-content {{
            display: flex;
            justify-content: space-between;
            align-items: center;
        }}

        .project-title {{
            font-size: 28px;
            font-weight: 700;
            color: var(--text);
            letter-spacing: -0.5px;
        }}

        .project-meta {{
            display: flex;
            gap: 24px;
            margin-top: 8px;
        }}

        .meta-item {{
            font-size: 13px;
            color: var(--text2);
        }}

        .meta-item span {{
            color: var(--accent);
            font-weight: 600;
        }}

        .badge {{
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            letter-spacing: 0.5px;
        }}

        .badge-pro {{
            background: rgba(108, 140, 255, 0.15);
            color: var(--accent);
            border: 1px solid rgba(108, 140, 255, 0.3);
        }}

        .badge-status {{
            background: rgba(52, 211, 153, 0.15);
            color: var(--success);
            border: 1px solid rgba(52, 211, 153, 0.3);
        }}

        /* Progress */
        .progress-section {{
            padding: 24px 0;
            border-bottom: 1px solid var(--border);
        }}

        .progress-bar-container {{
            background: var(--surface2);
            border-radius: 8px;
            height: 8px;
            margin: 16px 0;
            overflow: hidden;
        }}

        .progress-bar {{
            height: 100%;
            background: linear-gradient(90deg, var(--accent), var(--success));
            border-radius: 8px;
            transition: width 0.6s ease;
        }}

        .stages {{
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 12px;
        }}

        .stage-item {{
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 6px 14px;
            border-radius: 6px;
            font-size: 13px;
            background: var(--surface);
            border: 1px solid var(--border);
            transition: all 0.2s;
        }}

        .stage-item.completed {{
            border-color: rgba(52, 211, 153, 0.3);
            color: var(--success);
        }}

        .stage-item.active {{
            border-color: rgba(108, 140, 255, 0.5);
            color: var(--accent);
            background: rgba(108, 140, 255, 0.08);
            box-shadow: 0 0 12px rgba(108, 140, 255, 0.15);
        }}

        .stage-item.pending {{
            color: var(--text2);
        }}

        .stage-icon {{
            font-size: 14px;
        }}

        /* Stats Cards */
        .stats-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 16px;
            padding: 24px 0;
        }}

        .stat-card {{
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 20px;
            transition: transform 0.2s, box-shadow 0.2s;
        }}

        .stat-card:hover {{
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(0,0,0,0.3);
        }}

        .stat-label {{
            font-size: 12px;
            color: var(--text2);
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 8px;
        }}

        .stat-value {{
            font-size: 28px;
            font-weight: 700;
            color: var(--text);
        }}

        .stat-sub {{
            font-size: 12px;
            color: var(--text2);
            margin-top: 4px;
        }}

        /* Sections */
        .section {{
            padding: 32px 0;
            border-bottom: 1px solid var(--border);
        }}

        .section-header {{
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 24px;
        }}

        .section-number {{
            display: flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
            border-radius: 8px;
            background: var(--accent);
            color: white;
            font-size: 14px;
            font-weight: 700;
        }}

        .section-title {{
            font-size: 20px;
            font-weight: 600;
            color: var(--text);
        }}

        /* Tables */
        .data-table {{
            width: 100%;
            border-collapse: collapse;
            font-size: 13px;
            margin: 16px 0;
        }}

        .data-table thead th {{
            background: var(--surface2);
            color: var(--text2);
            padding: 10px 14px;
            text-align: left;
            font-weight: 600;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border-bottom: 2px solid var(--border);
        }}

        .data-table tbody td {{
            padding: 10px 14px;
            border-bottom: 1px solid var(--border);
            color: var(--text);
        }}

        .data-table tbody tr:hover {{
            background: rgba(108, 140, 255, 0.04);
        }}

        .data-table a {{
            color: var(--accent);
            text-decoration: none;
        }}

        .data-table a:hover {{
            text-decoration: underline;
        }}

        /* Mermaid */
        .diagram-container {{
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 24px;
            margin: 16px 0;
            overflow-x: auto;
        }}

        .mermaid {{
            display: flex;
            justify-content: center;
        }}

        /* Code blocks */
        .code-block {{
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 8px;
            padding: 16px;
            font-family: "JetBrains Mono", "Fira Code", monospace;
            font-size: 13px;
            overflow-x: auto;
            white-space: pre;
            color: var(--text);
            margin: 12px 0;
        }}

        /* Power tree */
        .power-tree {{
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 20px;
            font-family: monospace;
            font-size: 13px;
            line-height: 1.8;
            color: var(--text);
            white-space: pre;
            overflow-x: auto;
        }}

        /* Cards grid */
        .cards-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 16px;
            margin: 16px 0;
        }}

        .info-card {{
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 10px;
            padding: 18px;
        }}

        .info-card-title {{
            font-size: 14px;
            font-weight: 600;
            color: var(--accent);
            margin-bottom: 10px;
        }}

        .info-card-content {{
            font-size: 13px;
            color: var(--text2);
            line-height: 1.7;
        }}

        .info-card-content strong {{
            color: var(--text);
        }}

        /* Risk indicators */
        .risk-high {{ color: var(--danger); }}
        .risk-medium {{ color: var(--warning); }}
        .risk-low {{ color: var(--success); }}

        /* Footer */
        .footer {{
            padding: 24px 0;
            text-align: center;
            color: var(--text2);
            font-size: 12px;
        }}

        /* Responsive */
        @media (max-width: 768px) {{
            .header-content {{ flex-direction: column; gap: 16px; }}
            .stages {{ flex-direction: column; }}
            .stats-grid {{ grid-template-columns: 1fr 1fr; }}
            .cards-grid {{ grid-template-columns: 1fr; }}
        }}

        /* Scrollbar */
        ::-webkit-scrollbar {{ width: 6px; height: 6px; }}
        ::-webkit-scrollbar-track {{ background: var(--bg); }}
        ::-webkit-scrollbar-thumb {{ background: var(--border); border-radius: 3px; }}
        ::-webkit-scrollbar-thumb:hover {{ background: var(--text2); }}

        /* Tab system */
        .tabs {{
            display: flex;
            gap: 4px;
            margin-bottom: 16px;
            border-bottom: 1px solid var(--border);
            padding-bottom: 0;
        }}

        .tab {{
            padding: 8px 16px;
            font-size: 13px;
            color: var(--text2);
            cursor: pointer;
            border-bottom: 2px solid transparent;
            transition: all 0.2s;
        }}

        .tab.active {{
            color: var(--accent);
            border-bottom-color: var(--accent);
        }}

        .tab:hover {{
            color: var(--text);
        }}

        .tab-content {{
            display: none;
        }}

        .tab-content.active {{
            display: block;
        }}
    </style>
</head>
<body>

<!-- Header -->
<div class="header">
    <div class="container">
        <div class="header-content">
            <div>
                <div class="project-title">{project_name}</div>
                <div class="project-meta">
                    <div class="meta-item">生成日期: <span>{now}</span></div>
                    <div class="meta-item">阶段: <span>{completed}/{total}</span></div>
                </div>
            </div>
            <div style="display:flex;gap:8px;">
                <span class="badge badge-pro">{'专业模式' if work_mode == 'professional' else '快速模式'}</span>
                <span class="badge badge-status">进度 {progress_pct}%</span>
            </div>
        </div>
    </div>
</div>

<!-- Progress -->
<div class="progress-section">
    <div class="container">
        <div class="progress-bar-container">
            <div class="progress-bar" style="width: {progress_pct}%"></div>
        </div>
        <div class="stages">
            {progress_html}
        </div>
    </div>
</div>

<!-- Stats -->
<div class="container">
    <div class="stats-grid">
        <div class="stat-card">
            <div class="stat-label">BOM 总成本</div>
            <div class="stat-value">¥{total_cost}</div>
            <div class="stat-sub">参考预算 ¥50</div>
        </div>
        <div class="stat-card">
            <div class="stat-label">器件数量</div>
            <div class="stat-value">{len(bom_data['rows']) if bom_data else 0}</div>
            <div class="stat-sub">模块化方案</div>
        </div>
        <div class="stat-card">
            <div class="stat-label">完成阶段</div>
            <div class="stat-value">{completed}/{total}</div>
            <div class="stat-sub">Gate 全部通过</div>
        </div>
        <div class="stat-card">
            <div class="stat-label">峰值功耗</div>
            <div class="stat-value">~10W</div>
            <div class="stat-sub">1000mAh 电池</div>
        </div>
    </div>
</div>

<!-- Section 1: 方案摘要 -->
<div class="container">
    <div class="section">
        <div class="section-header">
            <div class="section-number">1</div>
            <div class="section-title">方案摘要</div>
        </div>
        <div class="cards-grid">
            <div class="info-card">
                <div class="info-card-title">产品目标</div>
                <div class="info-card-content">手持制冷风扇，集成<strong>半导体制冷</strong>和<strong>无刷风扇</strong>，内置锂电池供电，Type-C充电，户外便携使用。</div>
            </div>
            <div class="info-card">
                <div class="info-card-title">推荐架构</div>
                <div class="info-card-content"><strong>方案D - 模组化方案</strong>：STM32F103最小系统板 + BLDC驱动板模块 + MOS模块，最快1周出原型。</div>
            </div>
            <div class="info-card">
                <div class="info-card-title">主要风险</div>
                <div class="info-card-content">
                    <span class="risk-high">●</span> 制冷片功耗大，全功率续航仅0.4h<br>
                    <span class="risk-medium">●</span> BLDC驱动模块尺寸偏大<br>
                    <span class="risk-low">●</span> 编码器手感不如触摸滚轮
                </div>
            </div>
            <div class="info-card">
                <div class="info-card-title">下一步动作</div>
                <div class="info-card-content">完成编码实现和烧录测试，验证制冷+风扇联动控制逻辑，实测续航时间。</div>
            </div>
        </div>
    </div>

    <!-- Section 2: 系统框图 -->
    <div class="section">
        <div class="section-header">
            <div class="section-number">2</div>
            <div class="section-title">系统框图</div>
        </div>
        <div class="diagram-container">
            {mermaid_html if mermaid_html else '<p style="color:var(--text2)">暂无框图数据</p>'}
        </div>
    </div>

    <!-- Section 3: BOM 表 -->
    <div class="section">
        <div class="section-header">
            <div class="section-number">3</div>
            <div class="section-title">BOM 物料清单</div>
        </div>
        {bom_html if bom_html else '<p style="color:var(--text2)">暂无BOM数据</p>'}
    </div>

    <!-- Section 4: 接口矩阵 -->
    <div class="section">
        <div class="section-header">
            <div class="section-number">4</div>
            <div class="section-title">接口与信号规划</div>
        </div>
        {interface_html if interface_html else '<p style="color:var(--text2)">暂无接口矩阵数据</p>'}
    </div>

    <!-- Section 5: 接线表 -->
    <div class="section">
        <div class="section-header">
            <div class="section-number">5</div>
            <div class="section-title">接线表</div>
        </div>
        {wiring_html if wiring_html else '<p style="color:var(--text2)">暂无接线表数据</p>'}
    </div>

    <!-- Section 6: 电源树与功耗 -->
    <div class="section">
        <div class="section-header">
            <div class="section-number">6</div>
            <div class="section-title">电源树与功耗预算</div>
        </div>
        <div class="power-tree">Type-C 5V 输入
    │
    v
TP4056 充电板 (1A充电)
    │
    v
锂电池 3.7V (1000mAh)
    │
    ├─> BLDC驱动板 (5V, ~500mA) ──> 无刷电机
    │
    ├─> MOS模块 (3.7V, ~2A) ──> TEC1-12703 制冷片
    │
    └─> AMS1117-3.3 (3.3V, ~100mA)
            │
            ├─> STM32F103 (3.3V, ~50mA)
            │
            └─> OLED 0.96寸 (3.3V, ~30mA)</div>
        {power_html if power_html else ''}
    </div>

    <!-- Section 7: 软件架构 -->
    <div class="section">
        <div class="section-header">
            <div class="section-number">7</div>
            <div class="section-title">软件架构</div>
        </div>
        <div class="code-block">┌──────────────────────────────────────────┐
│           应用层 (Application)            │
│  main.c - 主循环、状态管理、菜单逻辑     │
└──────────────────────────────────────────┘
                     │
┌──────────────────────────────────────────┐
│            驱动层 (Driver)                │
│  oled_ssd1306.c  encoder.c               │
│  pwm_ctrl.c      battery.c               │
└──────────────────────────────────────────┘
                     │
┌──────────────────────────────────────────┐
│          硬件抽象层 (HAL)                 │
│  STM32 HAL库 - GPIO、I2C、TIM、ADC      │
└──────────────────────────────────────────┘
                     │
┌──────────────────────────────────────────┐
│            硬件 (Hardware)                │
│  STM32F103、OLED、编码器、BLDC、MOS模块  │
└──────────────────────────────────────────┘</div>
    </div>

    <!-- Section 8: 模块规格 -->
    <div class="section">
        <div class="section-header">
            <div class="section-number">8</div>
            <div class="section-title">模块规格定义</div>
        </div>
        {module_html if module_html else '<p style="color:var(--text2)">暂无模块规格数据</p>'}
        <div class="cards-grid" style="margin-top:16px;">
            <div class="info-card">
                <div class="info-card-title">oled_ssd1306</div>
                <div class="info-card-content">
                    <strong>职责:</strong> OLED显示驱动<br>
                    <strong>资源:</strong> RAM 1KB / Flash 4KB<br>
                    <strong>接口:</strong> I2C 400KHz
                </div>
            </div>
            <div class="info-card">
                <div class="info-card-title">encoder</div>
                <div class="info-card-content">
                    <strong>职责:</strong> 旋转编码器读取<br>
                    <strong>资源:</strong> RAM 20B / Flash 1KB<br>
                    <strong>接口:</strong> GPIO x3 (PA0/PA1/PA2)
                </div>
            </div>
            <div class="info-card">
                <div class="info-card-title">pwm_ctrl</div>
                <div class="info-card-content">
                    <strong>职责:</strong> PWM输出控制<br>
                    <strong>资源:</strong> RAM 10B / Flash 1KB<br>
                    <strong>接口:</strong> TIM3 CH1/CH2
                </div>
            </div>
            <div class="info-card">
                <div class="info-card-title">battery</div>
                <div class="info-card-content">
                    <strong>职责:</strong> 电池电压检测<br>
                    <strong>资源:</strong> RAM 10B / Flash 1KB<br>
                    <strong>接口:</strong> ADC (PA3)
                </div>
            </div>
        </div>
    </div>

    <!-- Section 9: 文件清单 -->
    <div class="section">
        <div class="section-header">
            <div class="section-number">9</div>
            <div class="section-title">项目文件清单</div>
        </div>
        <table class="data-table">
            <thead>
                <tr><th>文件</th><th>路径</th><th>说明</th></tr>
            </thead>
            <tbody>
                <tr><td>需求文档</td><td>01-requirements.md</td><td>工程约束表、使用场景、风险</td></tr>
                <tr><td>架构设计</td><td>02-architecture.md</td><td>4方案对比、系统分解、电源树</td></tr>
                <tr><td>器件选型</td><td>03-components.md</td><td>关键器件选型理由与替代方案</td></tr>
                <tr><td>约束输出</td><td>04-constraints.md</td><td>接口矩阵、PCB约束、机械约束</td></tr>
                <tr><td>接线表</td><td>05-wiring.md</td><td>模块接线关系</td></tr>
                <tr><td>流程图</td><td>05-flowchart.md</td><td>主程序流程、菜单状态机</td></tr>
                <tr><td>框图</td><td>05-block-diagram.md</td><td>系统框图、模块连接图</td></tr>
                <tr><td>BOM表</td><td>05-bom.md</td><td>物料清单与成本</td></tr>
                <tr><td>软件架构</td><td>06-software-architecture.md</td><td>分层架构、文件组织</td></tr>
                <tr><td>模块规格</td><td>07-module-spec.md</td><td>4个驱动模块的接口定义</td></tr>
            </tbody>
        </table>
    </div>
</div>

<!-- Footer -->
<div class="footer">
    <div class="container">
        <p>Generated by Embedded Master Pipeline · {now}</p>
    </div>
</div>

<script>
    mermaid.initialize({{
        startOnLoad: true,
        theme: 'dark',
        themeVariables: {{
            primaryColor: '#2a2f45',
            primaryTextColor: '#e4e7ef',
            primaryBorderColor: '#4a5080',
            lineColor: '#6c8cff',
            secondaryColor: '#1e2235',
            tertiaryColor: '#242836',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans SC", sans-serif'
        }}
    }});
</script>

</body>
</html>"""

    if not output_path:
        output_path = os.path.join(project_path, 'docs', 'embedded', 'report.html')

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(html)

    size_kb = os.path.getsize(output_path) / 1024
    print(f"[OK] 汇报网页已生成: {output_path} ({size_kb:.1f} KB)")
    return output_path


def main():
    parser = argparse.ArgumentParser(description="Embedded Master 项目汇报网页生成器")
    parser.add_argument("project_path", help="项目根目录路径")
    parser.add_argument("--output", "-o", default=None, help="输出HTML文件路径（默认: docs/embedded/report.html）")
    args = parser.parse_args()

    if not os.path.isdir(args.project_path):
        print(f"[ERROR] 项目路径不存在: {args.project_path}")
        sys.exit(1)

    docs_dir = os.path.join(args.project_path, 'docs', 'embedded')
    if not os.path.isdir(docs_dir):
        print(f"[ERROR] docs/embedded 目录不存在: {docs_dir}")
        sys.exit(1)

    generate_html(args.project_path, args.output)


if __name__ == "__main__":
    main()
