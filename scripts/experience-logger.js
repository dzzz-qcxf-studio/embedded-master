/**
 * 经验记录器 - 管理项目经验累积
 */

const fs = require('fs');
const path = require('path');

const EXPERIENCE_FILE = 'experience-log.md';

/**
 * 经验记录模板
 */
const EXPERIENCE_TEMPLATE = `# 经验累积记录

使用规则：
1. 操作前先查阅本文件，如果已有经验记录，直接使用已验证的方法
2. 操作成功后，将新记录追加到对应分类下
3. 如果已记录的方法失效，标注失效日期并补充新的可用方法

## Datasheet 下载记录

| 器件型号 | 源站点 | URL | 验证日期 |
|----------|--------|-----|----------|

## 封装文件下载记录

| 器件型号 | 源站点 | 格式 | URL | 验证日期 |
|----------|--------|------|-----|----------|

## 采购链接记录

| 器件型号 | 供应商 | URL | 单价 | 验证日期 |
|----------|--------|-----|------|----------|

## 已知失败源（避免重复尝试）

| 器件/厂商 | 失败源 | 失败原因 | 记录日期 |
|-----------|--------|----------|----------|

## 调试经验记录

| 问题类型 | 现象 | 解决方案 | 验证日期 |
|----------|------|----------|----------|

## 选型经验记录

| 器件类型 | 推荐型号 | 适用场景 | 备注 | 记录日期 |
|----------|----------|----------|------|----------|
`;

/**
 * 获取经验文件路径
 */
function getExperiencePath(projectPath) {
  return path.join(projectPath, 'docs', 'embedded', EXPERIENCE_FILE);
}

/**
 * 初始化经验文件（如果不存在）
 */
function initExperienceLog(projectPath) {
  const expPath = getExperiencePath(projectPath);
  const dir = path.dirname(expPath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(expPath)) {
    fs.writeFileSync(expPath, EXPERIENCE_TEMPLATE, 'utf-8');
  }

  return expPath;
}

/**
 * 读取经验文件
 */
function loadExperienceLog(projectPath) {
  const expPath = getExperiencePath(projectPath);
  if (fs.existsSync(expPath)) {
    return fs.readFileSync(expPath, 'utf-8');
  }
  return null;
}

/**
 * 保存经验文件
 */
function saveExperienceLog(projectPath, content) {
  const expPath = getExperiencePath(projectPath);
  fs.writeFileSync(expPath, content, 'utf-8');
  return expPath;
}

/**
 * 添加Datasheet下载记录
 */
function addDatasheetRecord(projectPath, record) {
  const content = loadExperienceLog(projectPath);
  if (!content) {
    initExperienceLog(projectPath);
    return addDatasheetRecord(projectPath, record);
  }

  const date = new Date().toISOString().split('T')[0];
  const newLine = `| ${record器件型号} | ${record.source} | ${record.url} | ${date} |`;

  // 找到Datasheet下载记录表格的末尾
  const sectionHeader = '## Datasheet 下载记录';
  const nextSection = '## 封装文件下载记录';

  const startIndex = content.indexOf(sectionHeader);
  const endIndex = content.indexOf(nextSection);

  if (startIndex === -1 || endIndex === -1) {
    throw new Error('无法找到Datasheet下载记录部分');
  }

  // 在表格末尾添加新记录
  const before = content.substring(0, endIndex);
  const after = content.substring(endIndex);

  const newContent = before + newLine + '\n' + after;
  saveExperienceLog(projectPath, newContent);

  return true;
}

/**
 * 添加封装文件下载记录
 */
function addFootprintRecord(projectPath, record) {
  const content = loadExperienceLog(projectPath);
  if (!content) {
    initExperienceLog(projectPath);
    return addFootprintRecord(projectPath, record);
  }

  const date = new Date().toISOString().split('T')[0];
  const newLine = `| ${record器件型号} | ${record.source} | ${record.format} | ${record.url} | ${date} |`;

  const sectionHeader = '## 封装文件下载记录';
  const nextSection = '## 采购链接记录';

  const startIndex = content.indexOf(sectionHeader);
  const endIndex = content.indexOf(nextSection);

  if (startIndex === -1 || endIndex === -1) {
    throw new Error('无法找到封装文件下载记录部分');
  }

  const before = content.substring(0, endIndex);
  const after = content.substring(endIndex);

  const newContent = before + newLine + '\n' + after;
  saveExperienceLog(projectPath, newContent);

  return true;
}

/**
 * 添加采购链接记录
 */
function addPurchaseRecord(projectPath, record) {
  const content = loadExperienceLog(projectPath);
  if (!content) {
    initExperienceLog(projectPath);
    return addPurchaseRecord(projectPath, record);
  }

  const date = new Date().toISOString().split('T')[0];
  const newLine = `| ${record器件型号} | ${record.supplier} | ${record.url} | ${record.price} | ${date} |`;

  const sectionHeader = '## 采购链接记录';
  const nextSection = '## 已知失败源';

  const startIndex = content.indexOf(sectionHeader);
  const endIndex = content.indexOf(nextSection);

  if (startIndex === -1 || endIndex === -1) {
    throw new Error('无法找到采购链接记录部分');
  }

  const before = content.substring(0, endIndex);
  const after = content.substring(endIndex);

  const newContent = before + newLine + '\n' + after;
  saveExperienceLog(projectPath, newContent);

  return true;
}

/**
 * 添加失败源记录
 */
function addFailedSourceRecord(projectPath, record) {
  const content = loadExperienceLog(projectPath);
  if (!content) {
    initExperienceLog(projectPath);
    return addFailedSourceRecord(projectPath, record);
  }

  const date = new Date().toISOString().split('T')[0];
  const newLine = `| ${record器件型号} | ${record.source} | ${record.reason} | ${date} |`;

  const sectionHeader = '## 已知失败源';
  const nextSection = '## 调试经验记录';

  const startIndex = content.indexOf(sectionHeader);
  const endIndex = content.indexOf(nextSection);

  if (startIndex === -1 || endIndex === -1) {
    throw new Error('无法找到已知失败源部分');
  }

  const before = content.substring(0, endIndex);
  const after = content.substring(endIndex);

  const newContent = before + newLine + '\n' + after;
  saveExperienceLog(projectPath, newContent);

  return true;
}

/**
 * 添加调试经验记录
 */
function addDebugExperience(projectPath, record) {
  const content = loadExperienceLog(projectPath);
  if (!content) {
    initExperienceLog(projectPath);
    return addDebugExperience(projectPath, record);
  }

  const date = new Date().toISOString().split('T')[0];
  const newLine = `| ${record.problemType} | ${record现象} | ${record.solution} | ${date} |`;

  const sectionHeader = '## 调试经验记录';
  const nextSection = '## 选型经验记录';

  const startIndex = content.indexOf(sectionHeader);
  const endIndex = content.indexOf(nextSection);

  if (startIndex === -1 || endIndex === -1) {
    throw new Error('无法找到调试经验记录部分');
  }

  const before = content.substring(0, endIndex);
  const after = content.substring(endIndex);

  const newContent = before + newLine + '\n' + after;
  saveExperienceLog(projectPath, newContent);

  return true;
}

/**
 * 添加选型经验记录
 */
function addSelectionExperience(projectPath, record) {
  const content = loadExperienceLog(projectPath);
  if (!content) {
    initExperienceLog(projectPath);
    return addSelectionExperience(projectPath, record);
  }

  const date = new Date().toISOString().split('T')[0];
  const newLine = `| ${record器件类型} | ${record.recommended} | ${record.scenario} | ${record.notes || ''} | ${date} |`;

  // 选型经验记录是最后一个部分，直接追加到文件末尾
  const newContent = content + newLine + '\n';
  saveExperienceLog(projectPath, newContent);

  return true;
}

/**
 * 查询Datasheet下载经验
 */
function queryDatasheetExperience(projectPath, component型号) {
  const content = loadExperienceLog(projectPath);
  if (!content) return null;

  const sectionHeader = '## Datasheet 下载记录';
  const nextSection = '## 封装文件下载记录';

  const startIndex = content.indexOf(sectionHeader);
  const endIndex = content.indexOf(nextSection);

  if (startIndex === -1 || endIndex === -1) return null;

  const section = content.substring(startIndex, endIndex);
  const lines = section.split('\n').filter(line => line.startsWith('|') && !line.startsWith('|--'));

  // 跳过表头
  const records = lines.slice(1).map(line => {
    const parts = line.split('|').map(p => p.trim()).filter(p => p);
    return {
      component: parts[0],
      source: parts[1],
      url: parts[2],
      date: parts[3]
    };
  });

  // 查找匹配的记录
  const match = records.find(r =>
    r.component === component型号 ||
    r.component.includes(component型号) ||
    component型号.includes(r.component)
  );

  return match || null;
}

/**
 * 查询失败源记录
 */
function queryFailedSource(projectPath, component型号, source) {
  const content = loadExperienceLog(projectPath);
  if (!content) return null;

  const sectionHeader = '## 已知失败源';
  const nextSection = '## 调试经验记录';

  const startIndex = content.indexOf(sectionHeader);
  const endIndex = content.indexOf(nextSection);

  if (startIndex === -1 || endIndex === -1) return null;

  const section = content.substring(startIndex, endIndex);
  const lines = section.split('\n').filter(line => line.startsWith('|') && !line.startsWith('|--'));

  const records = lines.slice(1).map(line => {
    const parts = line.split('|').map(p => p.trim()).filter(p => p);
    return {
      component: parts[0],
      source: parts[1],
      reason: parts[2],
      date: parts[3]
    };
  });

  // 查找匹配的记录
  const match = records.find(r =>
    (r.component === component型号 || r.component.includes(component型号)) &&
    r.source === source
  );

  return match || null;
}

/**
 * 查询调试经验
 */
function queryDebugExperience(projectPath, problemType) {
  const content = loadExperienceLog(projectPath);
  if (!content) return null;

  const sectionHeader = '## 调试经验记录';
  const nextSection = '## 选型经验记录';

  const startIndex = content.indexOf(sectionHeader);
  const endIndex = content.indexOf(nextSection);

  if (startIndex === -1 || endIndex === -1) return null;

  const section = content.substring(startIndex, endIndex);
  const lines = section.split('\n').filter(line => line.startsWith('|') && !line.startsWith('|--'));

  const records = lines.slice(1).map(line => {
    const parts = line.split('|').map(p => p.trim()).filter(p => p);
    return {
      problemType: parts[0],
      phenomenon: parts[1],
      solution: parts[2],
      date: parts[3]
    };
  });

  // 查找匹配的记录
  const matches = records.filter(r =>
    r.problemType === problemType ||
    r.problemType.includes(problemType) ||
    problemType.includes(r.problemType)
  );

  return matches.length > 0 ? matches : null;
}

module.exports = {
  EXPERIENCE_TEMPLATE,
  initExperienceLog,
  loadExperienceLog,
  saveExperienceLog,
  addDatasheetRecord,
  addFootprintRecord,
  addPurchaseRecord,
  addFailedSourceRecord,
  addDebugExperience,
  addSelectionExperience,
  queryDatasheetExperience,
  queryFailedSource,
  queryDebugExperience
};
