/**
 * Embedded Master - 嵌入式项目全流程开发 Agent
 *
 * 能力覆盖：
 * - 9阶段工作流 + 6道Gate门控
 * - 硬件选型知识库（国产生态、供应链风险、下载源）
 * - 独立评审 Agent（5维度打分）
 * - 编译烧录调试（stm32-master 内嵌）
 * - 代码模板（GPIO/I2C/SPI/UART/ADC/TIM/CAN）
 * - 专家人格（固件工程师/代码审查/技术文档）
 * - 反模式检测（12条禁止+12条借口）
 * - 经验累积记录
 * - Word报告生成
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const statusManager = require('./scripts/status-manager');
const gateChecker = require('./scripts/gate-checker');
const antiPattern = require('./scripts/anti-pattern');
const experienceLogger = require('./scripts/experience-logger');

const SKILL_DIR = __dirname;

/**
 * 初始化项目
 */
function initProject(projectPath, projectName, workMode = 'professional') {
  // 初始化状态
  const status = statusManager.initStatus(projectPath, projectName, workMode);

  // 初始化经验日志
  experienceLogger.initExperienceLog(projectPath);

  // 创建目录结构
  const fs = require('fs');
  const path = require('path');

  const dirs = [
    path.join(projectPath, 'docs', 'embedded'),
    path.join(projectPath, 'docs', 'embedded', 'datasheets'),
    path.join(projectPath, 'docs', 'embedded', 'footprints')
  ];

  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  return status;
}

/**
 * 检查是否为迭代模式
 */
function isIterationMode(projectPath) {
  return statusManager.isIterationMode(projectPath);
}

/**
 * 获取当前进度
 */
function getProgress(projectPath) {
  const status = statusManager.loadStatus(projectPath);
  if (!status) {
    return null;
  }
  return statusManager.getProgressDisplay(status);
}

/**
 * 进入下一阶段
 */
function advanceToNextStage(projectPath) {
  const status = statusManager.loadStatus(projectPath);
  if (!status) {
    throw new Error('项目未初始化');
  }

  const currentStage = status.currentStage;
  const stageOrder = [
    'requirements',
    'architecture',
    'detailed_design',
    'constraints',
    'diagrams',
    'software_design',
    'coding',
    'testing',
    'report'
  ];

  const currentIndex = stageOrder.indexOf(currentStage);
  if (currentIndex === -1 || currentIndex >= stageOrder.length - 1) {
    return null; // 已经是最后阶段
  }

  const nextStage = stageOrder[currentIndex + 1];

  // 检查当前阶段Gate是否通过
  if (!statusManager.isStageCompleted(projectPath, currentStage)) {
    throw new Error(`当前阶段 ${currentStage} 的Gate未通过，不能进入下一阶段`);
  }

  // 更新状态
  statusManager.updateStageStatus(projectPath, nextStage, 'in_progress');

  return nextStage;
}

/**
 * 执行Gate检查
 */
function checkGate(projectPath, gateNumber) {
  return gateChecker.checkGate(projectPath, gateNumber);
}

/**
 * 获取Gate检查清单
 */
function getGateChecklist(gateNumber) {
  return gateChecker.getGateChecklist(gateNumber);
}

/**
 * 标记Gate通过
 */
function passGate(projectPath, stageName) {
  return statusManager.passGate(projectPath, stageName);
}

/**
 * 标记Gate失败
 */
function failGate(projectPath, stageName) {
  return statusManager.failGate(projectPath, stageName);
}

/**
 * 检测反模式
 */
function checkAntiPattern(text) {
  return antiPattern.checkForWarnings(text);
}

/**
 * 获取反模式检查清单
 */
function getAntiPatternChecklist() {
  return antiPattern.getAntiPatternChecklist();
}

/**
 * 添加经验记录
 */
function addExperience(projectPath, type, record) {
  const handlers = {
    datasheet: experienceLogger.addDatasheetRecord,
    footprint: experienceLogger.addFootprintRecord,
    purchase: experienceLogger.addPurchaseRecord,
    failedSource: experienceLogger.addFailedSourceRecord,
    debug: experienceLogger.addDebugExperience,
    selection: experienceLogger.addSelectionExperience
  };

  const handler = handlers[type];
  if (!handler) {
    throw new Error(`未知的经验类型: ${type}`);
  }

  return handler(projectPath, record);
}

/**
 * 查询经验
 */
function queryExperience(projectPath, type, query) {
  const handlers = {
    datasheet: experienceLogger.queryDatasheetExperience,
    failedSource: experienceLogger.queryFailedSource,
    debug: experienceLogger.queryDebugExperience
  };

  const handler = handlers[type];
  if (!handler) {
    throw new Error(`未知的查询类型: ${type}`);
  }

  return handler(projectPath, query);
}

/**
 * 检测用户消息中的迭代关键词
 */
function detectIterationType(message) {
  const keywords = {
    bug_fix: ['不对', '有问题', '不工作', '报错', '不准', '修复', '修一下', 'fix', 'bug'],
    feature_addition: ['加一个', '增加', '加上', '新增', '添加', '支持', 'add'],
    hardware_change: ['换成', '替换成', '改用', '换掉', '替代', 'replace'],
    optimization: ['优化', '改进', '提升', '改善', '精度', '速度', '功耗', 'optimize']
  };

  for (const [type, words] of Object.entries(keywords)) {
    for (const word of words) {
      if (message.includes(word)) {
        return type;
      }
    }
  }

  return null;
}

/**
 * 检测是否为新建模式关键词
 */
function detectNewProjectKeywords(message) {
  const keywords = [
    '我要做个',
    '我想做一个',
    '用STM32',
    '用ESP32',
    '用Arduino',
    '帮我做一个',
    '帮我分析',
    '做一个'
  ];

  return keywords.some(keyword => message.includes(keyword));
}

/**
 * 检测是否包含路径
 */
function detectPath(message) {
  const pathPatterns = [
    /在\s+([a-zA-Z]:\\[^\s]+)/,
    /在\s+([a-zA-Z]:\/[^\s]+)/,
    /在\s+([a-zA-Z]:\\[^\s]+\\[^\s]+)/,
    /路径[：:]\s*([^\s]+)/
  ];

  for (const pattern of pathPatterns) {
    const match = message.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return null;
}

/**
 * 生成需求文档模板
 */
function generateRequirementsTemplate(projectName) {
  return {
    projectName: projectName,
    mcu: '',
    inputs: [],
    outputs: [],
    interfaces: [],
    constraints: {
      power: '',
      size: '',
      cost: ''
    },
    scenarios: [],
    risks: [],
    changelog: []
  };
}

/**
 * 生成需求Markdown
 */
function generateRequirementsMarkdown(req) {
  let md = `# ${req.projectName} 需求文档\n\n`;
  md += `## 项目名称\n${req.projectName}\n\n`;
  md += `## 主控芯片\n${req.mcu || '待确认'}\n\n`;

  md += `## 输入模块\n`;
  if (req.inputs.length > 0) {
    md += `| 模块 | 接口 | 电压 | 引脚 |\n`;
    md += `|------|------|------|------|\n`;
    req.inputs.forEach(input => {
      md += `| ${input.module} | ${input.interface} | ${input.voltage} | ${input.pin} |\n`;
    });
  } else {
    md += `待确认\n`;
  }
  md += '\n';

  md += `## 输出模块\n`;
  if (req.outputs.length > 0) {
    md += `| 模块 | 接口 | 电压 | 引脚 |\n`;
    md += `|------|------|------|------|\n`;
    req.outputs.forEach(output => {
      md += `| ${output.module} | ${output.interface} | ${output.voltage} | ${output.pin} |\n`;
    });
  } else {
    md += `待确认\n`;
  }
  md += '\n';

  md += `## 约束条件\n`;
  md += `- 供电: ${req.constraints.power || '待确认'}\n`;
  md += `- 尺寸: ${req.constraints.size || '待确认'}\n`;
  md += `- 成本: ${req.constraints.cost || '待确认'}\n\n`;

  md += `## 使用场景\n`;
  if (req.scenarios.length > 0) {
    req.scenarios.forEach(scenario => {
      md += `- ${scenario}\n`;
    });
  } else {
    md += `待确认\n`;
  }
  md += '\n';

  md += `## 风险\n`;
  if (req.risks.length > 0) {
    req.risks.forEach(risk => {
      md += `- ${risk}\n`;
    });
  } else {
    md += `待确认\n`;
  }

  return md;
}

/**
 * 保存需求文档
 */
function saveRequirements(projectPath, requirements) {
  const fs = require('fs');
  const path = require('path');

  const dir = path.join(projectPath, 'docs', 'embedded');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // 保存JSON
  const jsonPath = path.join(projectPath, 'requirements.json');
  fs.writeFileSync(jsonPath, JSON.stringify(requirements, null, 2), 'utf-8');

  // 保存Markdown
  const mdPath = path.join(dir, '01-requirements.md');
  const mdContent = generateRequirementsMarkdown(requirements);
  fs.writeFileSync(mdPath, mdContent, 'utf-8');

  return {
    jsonPath,
    mdPath
  };
}

/**
 * 加载需求文档
 */
function loadRequirements(projectPath) {
  const fs = require('fs');
  const path = require('path');

  const jsonPath = path.join(projectPath, 'requirements.json');
  if (fs.existsSync(jsonPath)) {
    const content = fs.readFileSync(jsonPath, 'utf-8');
    return JSON.parse(content);
  }

  return null;
}

/**
 * 更新需求文档
 */
function updateRequirements(projectPath, updates) {
  const requirements = loadRequirements(projectPath);
  if (!requirements) {
    throw new Error('requirements.json 不存在');
  }

  // 合并更新
  Object.assign(requirements, updates);

  // 添加changelog
  if (!requirements.changelog) {
    requirements.changelog = [];
  }

  requirements.changelog.push({
    version: requirements.changelog.length + 1,
    date: new Date().toISOString().split('T')[0],
    type: 'update',
    description: '需求更新',
    changes: updates
  });

  return saveRequirements(projectPath, requirements);
}

/**
 * 备份需求文档
 */
function backupRequirements(projectPath) {
  const jsonPath = path.join(projectPath, 'requirements.json');
  if (!fs.existsSync(jsonPath)) return null;

  let version = 1;
  while (fs.existsSync(path.join(projectPath, `requirements.v${version}.json`))) {
    version++;
  }

  const backupPath = path.join(projectPath, `requirements.v${version}.json`);
  fs.copyFileSync(jsonPath, backupPath);
  return backupPath;
}

// ============================================================
// 知识库 API
// ============================================================

/**
 * 加载参考知识文件
 */
function loadReference(name) {
  const refPath = path.join(SKILL_DIR, 'references', name);
  if (!fs.existsSync(refPath)) return null;
  return fs.readFileSync(refPath, 'utf-8');
}

/**
 * 获取国产芯片生态地图
 */
function getDomesticSources() {
  return loadReference('domestic-sources.md');
}

/**
 * 获取供应链风险评估指南
 */
function getSourcingAndRisk() {
  return loadReference('sourcing-and-risk.md');
}

/**
 * 获取下载源经验记录
 */
function getDownloadSources() {
  return loadReference('download-sources.md');
}

/**
 * 获取设计工作流定义
 */
function getDesignWorkflow() {
  return loadReference('design-workflow.md');
}

/**
 * 获取评审清单
 */
function getReviewChecklists() {
  return loadReference('review-checklists.md');
}

/**
 * 获取输出模板
 */
function getOutputTemplate() {
  return loadReference('output-template.md');
}

// ============================================================
// Agent 人格 API
// ============================================================

/**
 * 加载专家人格定义
 */
function loadPersona(name) {
  const personaPath = path.join(SKILL_DIR, 'agents', `${name}.md`);
  if (!fs.existsSync(personaPath)) return null;
  return fs.readFileSync(personaPath, 'utf-8');
}

/**
 * 获取硬件评审 Agent
 */
function getHardwareReviewer() {
  return loadPersona('hardware-reviewer');
}

/**
 * 获取固件工程师人格
 */
function getFirmwareEngineer() {
  return loadPersona('embedded-firmware-engineer');
}

/**
 * 获取代码审查员人格
 */
function getCodeReviewer() {
  return loadPersona('code-reviewer');
}

/**
 * 获取技术文档工程师人格
 */
function getTechnicalWriter() {
  return loadPersona('technical-writer');
}

// ============================================================
// 编译烧录调试 API（stm32-master 内嵌）
// ============================================================

/**
 * 编译并烧录 STM32 项目
 */
function buildFlash(projectPath, skipBuild = false, skipSafety = false) {
  const scriptPath = path.join(SKILL_DIR, 'scripts', 'build_flash.ps1');
  let cmd = `powershell -ExecutionPolicy Bypass -File "${scriptPath}" -ProjectDir "${projectPath}"`;
  if (skipBuild) cmd += ' -SkipBuild';
  if (skipSafety) cmd += ' -SkipSafetyCheck';
  return execSync(cmd, { encoding: 'utf-8', timeout: 120000 });
}

/**
 * GPIO 安全检查
 */
function checkGpioSafety(projectPath) {
  const scriptPath = path.join(SKILL_DIR, 'scripts', 'check_gpio_safety.ps1');
  const cmd = `powershell -ExecutionPolicy Bypass -File "${scriptPath}" -ProjectDir "${projectPath}"`;
  return execSync(cmd, { encoding: 'utf-8', timeout: 30000 });
}

/**
 * 启动调试会话
 */
function startDebug(projectPath, options = {}) {
  const scriptPath = path.join(SKILL_DIR, 'scripts', 'start_debug.ps1');
  let cmd = `powershell -ExecutionPolicy Bypass -File "${scriptPath}" -ProjectDir "${projectPath}"`;
  if (options.gdbClient) cmd += ' -GDBClient';
  if (options.rtt) cmd += ' -RTT';
  if (options.shell) cmd += ' -Shell';
  if (options.skipBuild) cmd += ' -SkipBuild';
  return execSync(cmd, { encoding: 'utf-8', timeout: 30000 });
}

/**
 * 获取代码模板列表
 */
function listTemplates() {
  const tmplDir = path.join(SKILL_DIR, 'templates');
  if (!fs.existsSync(tmplDir)) return [];
  return fs.readdirSync(tmplDir).filter(f => f.endsWith('.tmpl'));
}

/**
 * 读取代码模板
 */
function loadTemplate(name) {
  const tmplPath = path.join(SKILL_DIR, 'templates', name);
  if (!fs.existsSync(tmplPath)) return null;
  return fs.readFileSync(tmplPath, 'utf-8');
}

module.exports = {
  // 初始化
  initProject,
  isIterationMode,

  // 状态管理
  getProgress,
  advanceToNextStage,

  // Gate检查
  checkGate,
  getGateChecklist,
  passGate,
  failGate,

  // 反模式检测
  checkAntiPattern,
  getAntiPatternChecklist,

  // 经验记录
  addExperience,
  queryExperience,

  // 模式检测
  detectIterationType,
  detectNewProjectKeywords,
  detectPath,

  // 需求管理
  generateRequirementsTemplate,
  saveRequirements,
  loadRequirements,
  updateRequirements,
  backupRequirements,

  // 知识库
  loadReference,
  getDomesticSources,
  getSourcingAndRisk,
  getDownloadSources,
  getDesignWorkflow,
  getReviewChecklists,
  getOutputTemplate,

  // Agent人格
  loadPersona,
  getHardwareReviewer,
  getFirmwareEngineer,
  getCodeReviewer,
  getTechnicalWriter,

  // 编译烧录调试
  buildFlash,
  checkGpioSafety,
  startDebug,
  listTemplates,
  loadTemplate
};
