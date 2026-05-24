# Embedded Master Agent

## 核心规则

1. **器件参数禁止凭记忆** — 必须来自 datasheet 或分销商页面
2. **风险清单不能为空** — 每个选型必须评估供应链风险
3. **6 道门控必须通过** — 未通过 Gate 不能进入下一阶段
4. **专业模式单问题逐一确认** — 禁止一次性列出多个问题
5. **需求必须冻结后才能选型** — 禁止跳过需求确认

## 关键文件索引

| 文件 | 用途 |
|------|------|
| `skill.md` | 主工作流规则（9阶段 + 6 Gate） |
| `index.js` | API 入口 |
| `scripts/gate-checker.js` | Gate 门控检查 |
| `scripts/anti-pattern.js` | 反模式检测 |
| `scripts/experience-logger.js` | 经验累积 |
| `scripts/status-manager.js` | 进度状态管理 |
| `scripts/build_flash.ps1` | STM32 编译烧录 |
| `scripts/check_gpio_safety.ps1` | GPIO 安全检查 |
| `scripts/start_debug.ps1` | 调试会话 |
| `references/domestic-sources.md` | 国产芯片生态地图 |
| `references/sourcing-and-risk.md` | 供应链风险评估指南 |
| `references/download-sources.md` | 下载源经验记录 |
| `references/review-checklists.md` | 硬件设计评审清单 |
| `references/verification-gates.md` | 验证门控定义 |
| `references/output-template.md` | 方案输出标准模板 |
| `references/design-workflow.md` | 设计工作流详细定义 |
| `agents/hardware-reviewer.md` | 独立评审 Agent |
| `agents/embedded-firmware-engineer.md` | 固件工程师人格 |
| `agents/code-reviewer.md` | 代码审查员人格 |
| `agents/technical-writer.md` | 技术文档工程师人格 |
| `templates/device_*.tmpl` | STM32 外设驱动模板 |
| `word-docx/word-docx.md` | Word 文档生成规范 |

## API 使用

```javascript
const em = require('C:/Users/ROG/.claude/skills/embedded-master/index.js');

// 项目管理
em.initProject(projectPath, '项目名', 'professional');
em.getProgress(projectPath);
em.advanceToNextStage(projectPath);

// Gate 检查
em.checkGate(projectPath, 1);        // 1-6
em.getGateChecklist(1);               // 1-6
em.passGate(projectPath, 'requirements');

// 知识库
em.getDomesticSources();              // 国产芯片生态
em.getSourcingAndRisk();              // 供应链风险
em.getDownloadSources();              // 下载源经验
em.getReviewChecklists();             // 评审清单
em.getOutputTemplate();               // 输出模板

// Agent 人格
em.getHardwareReviewer();             // 硬件评审
em.getFirmwareEngineer();             // 固件工程师
em.getCodeReviewer();                 // 代码审查
em.getTechnicalWriter();              // 技术文档

// 编译烧录调试
em.buildFlash(projectPath);
em.checkGpioSafety(projectPath);
em.startDebug(projectPath, { gdbClient: true });

// 代码模板
em.listTemplates();                   // 模板列表
em.loadTemplate('device_gpio.c.tmpl'); // 读取模板
```

## 反模式检测

在输出任何内容前，用 `em.checkAntiPattern(text)` 检测禁止行为。

## 贡献规范

- 新增 Gate 检查项：编辑 `scripts/gate-checker.js`
- 新增反模式规则：编辑 `scripts/anti-pattern.js`
- 新增知识库：在 `references/` 下添加 .md 文件
- 新增代码模板：在 `templates/` 下添加 .tmpl 文件
