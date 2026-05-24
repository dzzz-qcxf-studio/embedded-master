/**
 * 状态管理器 - 管理项目进度状态
 */

const fs = require('fs');
const path = require('path');

const STATUS_FILE = 'project_status.json';

/**
 * 创建初始状态
 */
function createInitialStatus(projectName, workMode = 'professional') {
  return {
    project: projectName,
    mode: 'new',
    workMode: workMode,
    currentStage: 'requirements',
    stages: {
      requirements: { status: 'in_progress', gate: 'pending' },
      architecture: { status: 'pending', gate: 'pending' },
      detailed_design: { status: 'pending', gate: 'pending' },
      constraints: { status: 'pending', gate: 'pending' },
      diagrams: { status: 'pending', gate: 'pending' },
      software_design: { status: 'pending', gate: 'pending' },
      coding: { status: 'pending', gate: 'pending' },
      testing: { status: 'pending', gate: 'pending' },
      report: { status: 'pending', gate: 'pending' }
    },
    lastUpdated: new Date().toISOString()
  };
}

/**
 * 读取状态文件
 */
function loadStatus(projectPath) {
  const statusPath = path.join(projectPath, 'docs', 'embedded', STATUS_FILE);
  if (fs.existsSync(statusPath)) {
    const content = fs.readFileSync(statusPath, 'utf-8');
    return JSON.parse(content);
  }
  return null;
}

/**
 * 保存状态文件
 */
function saveStatus(projectPath, status) {
  const dir = path.join(projectPath, 'docs', 'embedded');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  status.lastUpdated = new Date().toISOString();
  const statusPath = path.join(dir, STATUS_FILE);
  fs.writeFileSync(statusPath, JSON.stringify(status, null, 2), 'utf-8');
  return statusPath;
}

/**
 * 初始化状态（如果不存在）
 */
function initStatus(projectPath, projectName, workMode) {
  let status = loadStatus(projectPath);
  if (!status) {
    status = createInitialStatus(projectName, workMode);
    saveStatus(projectPath, status);
  }
  return status;
}

/**
 * 更新阶段状态
 */
function updateStageStatus(projectPath, stageName, status, gateStatus = null) {
  const statusObj = loadStatus(projectPath);
  if (!statusObj) {
    throw new Error('状态文件不存在，请先初始化');
  }

  if (statusObj.stages[stageName]) {
    statusObj.stages[stageName].status = status;
    if (gateStatus) {
      statusObj.stages[stageName].gate = gateStatus;
    }
  }

  // 更新当前阶段
  if (status === 'in_progress') {
    statusObj.currentStage = stageName;
  }

  saveStatus(projectPath, statusObj);
  return statusObj;
}

/**
 * 标记Gate通过
 */
function passGate(projectPath, stageName) {
  return updateStageStatus(projectPath, stageName, 'completed', 'passed');
}

/**
 * 标记Gate失败
 */
function failGate(projectPath, stageName) {
  return updateStageStatus(projectPath, stageName, 'in_progress', 'failed');
}

/**
 * 获取进度显示文本
 */
function getProgressDisplay(status) {
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

  const stageLabels = {
    requirements: '需求分析',
    architecture: '架构设计',
    detailed_design: '详细设计',
    constraints: '约束输出',
    diagrams: '图表输出',
    software_design: '软件设计',
    coding: '编码实现',
    testing: '测试验证',
    report: '报告生成'
  };

  const stageIcons = {
    completed: '✅',
    in_progress: '🔄',
    pending: '⬜'
  };

  let display = `📊 项目进度：${status.project} [${status.workMode === 'professional' ? '专业模式' : '快速模式'}]\n\n`;

  const progressItems = stageOrder.map(stage => {
    const stageStatus = status.stages[stage];
    const icon = stageIcons[stageStatus.status] || '⬜';
    return `${icon} ${stageLabels[stage]}`;
  });

  display += progressItems.join(' → ');

  // 显示当前阶段的Gate状态
  const currentStage = status.stages[status.currentStage];
  if (currentStage && currentStage.gate !== 'pending') {
    const gateIcon = currentStage.gate === 'passed' ? '✓' : '✗';
    display += `\n\n当前阶段Gate: ${gateIcon}`;
  }

  return display;
}

/**
 * 检查阶段是否完成
 */
function isStageCompleted(projectPath, stageName) {
  const status = loadStatus(projectPath);
  if (!status) return false;
  return status.stages[stageName]?.status === 'completed' && status.stages[stageName]?.gate === 'passed';
}

/**
 * 获取下一个阶段
 */
function getNextStage(projectPath) {
  const status = loadStatus(projectPath);
  if (!status) return null;

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

  for (const stage of stageOrder) {
    if (status.stages[stage].status !== 'completed') {
      return stage;
    }
  }

  return null; // 所有阶段完成
}

/**
 * 检查是否为迭代模式
 */
function isIterationMode(projectPath) {
  const reqPath = path.join(projectPath, 'requirements.json');
  return fs.existsSync(reqPath);
}

/**
 * 重置状态（用于测试）
 */
function resetStatus(projectPath) {
  const statusPath = path.join(projectPath, 'docs', 'embedded', STATUS_FILE);
  if (fs.existsSync(statusPath)) {
    fs.unlinkSync(statusPath);
  }
}

module.exports = {
  createInitialStatus,
  loadStatus,
  saveStatus,
  initStatus,
  updateStageStatus,
  passGate,
  failGate,
  getProgressDisplay,
  isStageCompleted,
  getNextStage,
  isIterationMode,
  resetStatus
};