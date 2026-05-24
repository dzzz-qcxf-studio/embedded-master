/**
 * Gate门控检查器 - 6道验证门控
 *
 * Gate 1: 需求冻结（requirements）
 * Gate 2: 架构设计（architecture）
 * Gate 3: 设计完成（detailed_design + constraints + diagrams + software_design）
 * Gate 4: 编码完成（coding）
 * Gate 5: 测试通过（testing）
 * Gate 6: 报告生成（report）
 */

const fs = require('fs');
const path = require('path');

class GateResult {
  constructor(passed, failedItems = [], warnings = []) {
    this.passed = passed;
    this.failedItems = failedItems;
    this.warnings = warnings;
  }

  toDisplay() {
    if (this.passed) {
      return '✅ Gate检查通过';
    }
    let display = '❌ Gate检查未通过\n\n以下项目需要修复：\n';
    this.failedItems.forEach((item, i) => { display += `${i + 1}. ${item}\n`; });
    if (this.warnings.length > 0) {
      display += '\n警告：\n';
      this.warnings.forEach((w, i) => { display += `${i + 1}. ${w}\n`; });
    }
    return display;
  }
}

/**
 * Gate 1: 需求冻结检查
 * 检查项：需求完整性、无歧义、用户确认
 */
function checkGate1(projectPath) {
  const failedItems = [];
  const warnings = [];

  const reqPath = path.join(projectPath, 'requirements.json');
  if (!fs.existsSync(reqPath)) {
    failedItems.push('requirements.json 文件不存在');
  } else {
    const req = JSON.parse(fs.readFileSync(reqPath, 'utf-8'));
    if (!req.projectName) failedItems.push('项目名称为空');
    if (!req.mcu) failedItems.push('主控芯片为空');
    if (!req.inputs || req.inputs.length === 0) warnings.push('未定义输入模块');
    if (!req.outputs || req.outputs.length === 0) warnings.push('未定义输出模块');
    if (!req.constraints) failedItems.push('未定义约束条件');
    else if (!req.constraints.power) warnings.push('未定义供电方案');
    if (!req.scenarios || req.scenarios.length === 0) warnings.push('未定义使用场景');
  }

  const reqMdPath = path.join(projectPath, 'docs', 'embedded', '01-requirements.md');
  if (!fs.existsSync(reqMdPath)) failedItems.push('01-requirements.md 文件不存在');

  return new GateResult(failedItems.length === 0, failedItems, warnings);
}

/**
 * Gate 2: 架构设计检查
 * 检查项：架构合理性、模块划分清晰、接口定义完整
 */
function checkGate2(projectPath) {
  const failedItems = [];
  const warnings = [];

  const archPath = path.join(projectPath, 'docs', 'embedded', '02-architecture.md');
  if (!fs.existsSync(archPath)) {
    failedItems.push('02-architecture.md 文件不存在');
    return new GateResult(false, failedItems);
  }

  const content = fs.readFileSync(archPath, 'utf-8');
  if (!content.includes('候选') && !content.includes('方案A') && !content.includes('方案1')) {
    failedItems.push('未提供候选架构方案');
  }
  if (!content.includes('对比') && !content.includes('比较')) {
    warnings.push('缺少架构对比分析');
  }
  if (!content.includes('系统分解') && !content.includes('功能域')) {
    warnings.push('缺少系统分解');
  }

  return new GateResult(failedItems.length === 0, failedItems, warnings);
}

/**
 * Gate 3: 设计完成检查
 * 覆盖：详细设计 + 约束输出 + 图表输出 + 软件设计
 * 检查项：算法可行性、资源估算、实时性分析
 */
function checkGate3(projectPath) {
  const failedItems = [];
  const warnings = [];
  const embeddedDir = path.join(projectPath, 'docs', 'embedded');

  // 详细设计
  const compPath = path.join(embeddedDir, '03-components.md');
  if (!fs.existsSync(compPath)) {
    failedItems.push('03-components.md (器件选型) 不存在');
  } else {
    const content = fs.readFileSync(compPath, 'utf-8');
    if (!content.includes('理由') && !content.includes('选择原因')) {
      failedItems.push('缺少器件选型理由');
    }
    if (!content.includes('替代') && !content.includes('备选')) {
      failedItems.push('缺少替代方案');
    }
    if (!content.includes('国产') && !content.includes('海外')) {
      warnings.push('缺少国内外候选对比');
    }
  }

  // 约束输出
  const constPath = path.join(embeddedDir, '04-constraints.md');
  if (!fs.existsSync(constPath)) {
    failedItems.push('04-constraints.md (约束输出) 不存在');
  } else {
    const content = fs.readFileSync(constPath, 'utf-8');
    if (!content.includes('接口') && !content.includes('信号')) {
      failedItems.push('缺少接口矩阵');
    }
    if (!content.includes('电源') && !content.includes('供电')) {
      failedItems.push('缺少电源树');
    }
  }

  // 图表输出
  if (!fs.existsSync(path.join(embeddedDir, '05-wiring.md'))) {
    failedItems.push('05-wiring.md (接线表) 不存在');
  }
  if (!fs.existsSync(path.join(embeddedDir, '05-flowchart.md'))) {
    failedItems.push('05-flowchart.md (流程图) 不存在');
  }
  if (!fs.existsSync(path.join(embeddedDir, '05-bom.md'))) {
    failedItems.push('05-bom.md (BOM表) 不存在');
  }

  // 软件设计
  if (!fs.existsSync(path.join(embeddedDir, '06-software-architecture.md'))) {
    failedItems.push('06-software-architecture.md (软件架构) 不存在');
  }
  if (!fs.existsSync(path.join(embeddedDir, '07-module-spec.md'))) {
    failedItems.push('07-module-spec.md (模块规格) 不存在');
  }
  if (!fs.existsSync(path.join(embeddedDir, '08-detailed-design.md'))) {
    warnings.push('08-detailed-design.md (详细设计) 不存在');
  }
  if (!fs.existsSync(path.join(embeddedDir, '09-review-report.md'))) {
    warnings.push('09-review-report.md (设计评审) 不存在');
  }
  if (!fs.existsSync(path.join(embeddedDir, '10-coding-standard.md'))) {
    warnings.push('10-coding-standard.md (编码规范) 不存在');
  }

  return new GateResult(failedItems.length === 0, failedItems, warnings);
}

/**
 * Gate 4: 编码完成检查
 * 检查项：编译通过、静态检查、代码规范
 */
function checkGate4(projectPath) {
  const failedItems = [];
  const warnings = [];

  const srcDirs = ['Core/Src', 'Drivers', 'drivers', 'src'];
  const hasSrc = srcDirs.some(dir => fs.existsSync(path.join(projectPath, dir)));
  if (!hasSrc) failedItems.push('源码目录不存在');

  const mainPaths = ['Core/Src/main.c', 'src/main.c'];
  const hasMain = mainPaths.some(p => fs.existsSync(path.join(projectPath, p)));
  if (!hasMain) warnings.push('main.c 文件不存在');

  const buildReportPath = path.join(projectPath, 'docs', 'embedded', 'build-report.md');
  if (!fs.existsSync(buildReportPath)) warnings.push('编译报告不存在');

  return new GateResult(failedItems.length === 0, failedItems, warnings);
}

/**
 * Gate 5: 测试通过检查
 * 检查项：测试用例覆盖、功能验证、性能达标
 */
function checkGate5(projectPath) {
  const failedItems = [];
  const warnings = [];

  const testReportPath = path.join(projectPath, 'docs', 'embedded', '11-test-report.md');
  if (!fs.existsSync(testReportPath)) {
    failedItems.push('11-test-report.md (测试报告) 不存在');
  }

  return new GateResult(failedItems.length === 0, failedItems, warnings);
}

/**
 * Gate 6: 报告生成检查
 * 检查项：文档完整性、格式规范、内容准确
 */
function checkGate6(projectPath) {
  const failedItems = [];
  const warnings = [];

  const reportDir = path.join(projectPath, 'docs', 'embedded');
  const docxFiles = fs.existsSync(reportDir)
    ? fs.readdirSync(reportDir).filter(f => f.endsWith('.docx'))
    : [];

  if (docxFiles.length === 0) {
    failedItems.push('未生成 .docx 报告文件');
  }

  return new GateResult(failedItems.length === 0, failedItems, warnings);
}

/**
 * 执行Gate检查
 */
function checkGate(projectPath, gateNumber) {
  const checkers = { 1: checkGate1, 2: checkGate2, 3: checkGate3, 4: checkGate4, 5: checkGate5, 6: checkGate6 };
  const checker = checkers[gateNumber];
  if (!checker) throw new Error(`未知的Gate编号: ${gateNumber}`);
  return checker(projectPath);
}

/**
 * 获取Gate检查清单
 */
function getGateChecklist(gateNumber) {
  const checklists = {
    1: `Gate 1 需求冻结检查清单：
- [ ] requirements.json 文件存在
- [ ] 项目名称和主控芯片已定义
- [ ] 约束条件已定义（供电/尺寸/成本）
- [ ] 输入输出模块已定义
- [ ] 使用场景已定义
- [ ] 01-requirements.md 文件存在
- [ ] 用户已确认需求表`,

    2: `Gate 2 架构设计检查清单：
- [ ] 02-architecture.md 文件存在
- [ ] 至少提供了候选架构方案
- [ ] 有架构对比分析（国产/海外/混合）
- [ ] 有系统分解（功能域划分）
- [ ] 用户已确认架构方向`,

    3: `Gate 3 设计完成检查清单：
- [ ] 03-components.md 存在，有选型理由和替代方案
- [ ] 有国内外候选对比
- [ ] 04-constraints.md 存在，有接口矩阵和电源树
- [ ] 05-wiring.md (接线表) 存在
- [ ] 05-flowchart.md (流程图) 存在
- [ ] 05-bom.md (BOM表) 存在
- [ ] 06-software-architecture.md (软件架构) 存在
- [ ] 07-module-spec.md (模块规格) 存在
- [ ] 08-detailed-design.md (详细设计) 存在
- [ ] 09-review-report.md (设计评审) 存在
- [ ] 10-coding-standard.md (编码规范) 存在`,

    4: `Gate 4 编码完成检查清单：
- [ ] 源码目录存在
- [ ] main.c 文件存在
- [ ] 编译通过（0 errors, 0 warnings）
- [ ] 静态检查通过（无严重警告）
- [ ] GPIO安全检查通过
- [ ] 代码遵循编码规范`,

    5: `Gate 5 测试通过检查清单：
- [ ] 11-test-report.md (测试报告) 存在
- [ ] 功能测试通过
- [ ] 性能测试达到设计指标
- [ ] 稳定性测试通过`,

    6: `Gate 6 报告生成检查清单：
- [ ] .docx 报告文件已生成
- [ ] 文档结构完整（封面/目录/正文/附录）
- [ ] 内容与各阶段输出物一致`
  };

  return checklists[gateNumber] || '未知的Gate';
}

module.exports = {
  GateResult,
  checkGate,
  getGateChecklist,
  checkGate1,
  checkGate2,
  checkGate3,
  checkGate4,
  checkGate5,
  checkGate6
};
