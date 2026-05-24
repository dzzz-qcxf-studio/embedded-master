/**
 * 反模式检测器 - 检测AI的偷懒行为和不合理借口
 */

/**
 * 禁止行为列表
 */
const FORBIDDEN_BEHAVIORS = [
  {
    id: 1,
    pattern: /凭记忆|我记得|据我所知|应该/i,
    message: '参数必须来自datasheet，不能凭记忆',
    severity: 'high'
  },
  {
    id: 2,
    pattern: /跳过需求|不需要确认|直接开始/i,
    message: '需求必须用户确认，不能跳过',
    severity: 'high'
  },
  {
    id: 3,
    pattern: /没有替代|不需要备选|这个最好/i,
    message: '关键选型必须有替代方案',
    severity: 'medium'
  },
  {
    id: 4,
    pattern: /不用考虑风险|风险很低|没问题/i,
    message: '必须评估供应链风险',
    severity: 'medium'
  },
  {
    id: 5,
    pattern: /不用算成本|成本差不多|价格不重要/i,
    message: '必须做成本分析',
    severity: 'medium'
  },
  {
    id: 6,
    pattern: /不用评审|直接输出|跳过评审/i,
    message: '必须通过设计评审',
    severity: 'high'
  },
  {
    id: 7,
    pattern: /一次性|全部列出|批量问/i,
    message: '专业模式必须单问题逐一确认',
    severity: 'medium'
  },
  {
    id: 8,
    pattern: /跳过架构|不需要架构|直接选型/i,
    message: '必须先设计再选型',
    severity: 'high'
  },
  {
    id: 9,
    pattern: /跳过约束|不需要约束|直接画图/i,
    message: '必须输出接口矩阵/电源树',
    severity: 'high'
  },
  {
    id: 10,
    pattern: /不用测试|跳过测试|编译就行/i,
    message: '必须验证功能',
    severity: 'high'
  },
  {
    id: 11,
    pattern: /不用处理错误|不会出错|忽略异常/i,
    message: '必须处理错误路径',
    severity: 'medium'
  },
  {
    id: 12,
    pattern: /不用解释|直接列出来|不需要理由/i,
    message: '每个选择必须说明理由',
    severity: 'medium'
  }
];

/**
 * 合理化借口表
 */
const RATIONALIZATIONS = [
  {
    excuse: /这个芯片我很熟|不用查手册|我知道参数/i,
    correction: '参数必须来自datasheet，不能凭记忆',
    rule: 'FORBIDDEN_1'
  },
  {
    excuse: /这个方案肯定|没问题的|最好的选择/i,
    correction: '必须给出替代方案，不能只给一个',
    rule: 'FORBIDDEN_3'
  },
  {
    excuse: /用户没说|没有要求|不需要考虑/i,
    correction: '必须主动考虑供应链/成本/认证',
    rule: 'FORBIDDEN_4'
  },
  {
    excuse: /先做出来|之后再说|快速完成/i,
    correction: '需求必须冻结后才能选型',
    rule: 'FORBIDDEN_2'
  },
  {
    excuse: /成本差不多|价格类似|不用比较/i,
    correction: '必须做成本分析',
    rule: 'FORBIDDEN_5'
  },
  {
    excuse: /风险很低|很安全|不会有问题/i,
    correction: '必须评估供应链风险',
    rule: 'FORBIDDEN_4'
  },
  {
    excuse: /不用评审|直接输出|跳过评审/i,
    correction: '必须通过设计评审',
    rule: 'FORBIDDEN_6'
  },
  {
    excuse: /用户一次说完|批量问|效率更高/i,
    correction: '专业模式必须单问题逐一确认',
    rule: 'FORBIDDEN_7'
  },
  {
    excuse: /测试可以跳过|不用验证|编译通过就行/i,
    correction: '必须验证功能',
    rule: 'FORBIDDEN_10'
  },
  {
    excuse: /约束不重要|不需要约束|直接画图/i,
    correction: '必须输出接口矩阵/电源树',
    rule: 'FORBIDDEN_9'
  },
  {
    excuse: /编译通过就行|没有错误就行|静态检查不用/i,
    correction: '必须通过静态检查和安全检查',
    rule: 'FORBIDDEN_10'
  },
  {
    excuse: /用户应该知道|不用说明|显而易见/i,
    correction: '必须提供完整的接线说明和原理图',
    rule: 'FORBIDDEN_12'
  }
];

/**
 * 检测文本中的禁止行为
 */
function detectForbiddenBehaviors(text) {
  const detected = [];

  for (const behavior of FORBIDDEN_BEHAVIORS) {
    if (behavior.pattern.test(text)) {
      detected.push({
        id: behavior.id,
        message: behavior.message,
        severity: behavior.severity,
        matchedText: text.match(behavior.pattern)?.[0] || ''
      });
    }
  }

  return detected;
}

/**
 * 检测文本中的合理化借口
 */
function detectRationalizations(text) {
  const detected = [];

  for (const rationalization of RATIONALIZATIONS) {
    if (rationalization.excuse.test(text)) {
      detected.push({
        excuse: text.match(rationalization.excuse)?.[0] || '',
        correction: rationalization.correction,
        rule: rationalization.rule
      });
    }
  }

  return detected;
}

/**
 * 生成反模式警告
 */
function generateWarning(detectedBehaviors, detectedRationalizations) {
  let warning = '';

  if (detectedBehaviors.length > 0) {
    warning += '⚠️ 检测到禁止行为：\n';
    detectedBehaviors.forEach(b => {
      warning += `  - ${b.message} (严重程度: ${b.severity})\n`;
    });
  }

  if (detectedRationalizations.length > 0) {
    warning += '\n⚠️ 检测到合理化借口：\n';
    detectedRationalizations.forEach(r => {
      warning += `  - 借口: "${r.excuse}"\n`;
      warning += `    纠正: ${r.correction}\n`;
    });
  }

  return warning;
}

/**
 * 检查是否需要警告
 */
function checkForWarnings(text) {
  const behaviors = detectForbiddenBehaviors(text);
  const rationalizations = detectRationalizations(text);

  if (behaviors.length > 0 || rationalizations.length > 0) {
    return generateWarning(behaviors, rationalizations);
  }

  return null;
}

/**
 * 获取反模式检查清单（用于显示）
 */
function getAntiPatternChecklist() {
  return `## 反模式检查清单

### 禁止行为（12条）

1. ❌ 凭记忆给参数 → ✅ 参数必须来自datasheet
2. ❌ 跳过需求冻结 → ✅ 需求必须用户确认
3. ❌ 只列器件不解释取舍 → ✅ 每个选择必须说明理由
4. ❌ 不给替代方案 → ✅ 关键选型必须有备选
5. ❌ 不考虑供应链风险 → ✅ 必须评估生命周期/库存/交期
6. ❌ 不做成本分析 → ✅ 必须估算BOM成本
7. ❌ 跳过评审直接输出 → ✅ 必须通过设计评审
8. ❌ 一次性问多个问题 → ✅ 专业模式单问题逐一确认
9. ❌ 跳过架构设计 → ✅ 必须先设计再选型
10. ❌ 跳过约束输出 → ✅ 必须输出接口矩阵/电源树
11. ❌ 跳过测试 → ✅ 必须验证功能
12. ❌ 不考虑异常情况 → ✅ 必须处理错误路径

### 合理化借口表（12条）

| 借口 | 纠正 |
|------|------|
| "这个芯片我很熟不用查手册" | 参数必须来自datasheet |
| "这个方案肯定没问题" | 必须给出替代方案 |
| "用户没说就不考虑" | 主动考虑供应链/成本/认证 |
| "先做出来再说" | 需求必须冻结后才能选型 |
| "这个成本差不多" | 必须做成本分析 |
| "这个风险很低" | 必须评估供应链风险 |
| "这个评审可以跳过" | 必须通过设计评审 |
| "用户一次说完比较好" | 专业模式必须单问题逐一确认 |
| "这个测试可以跳过" | 测试必须验证功能 |
| "这个约束不重要" | 约束必须完整输出 |
| "编译通过就行了" | 必须通过静态检查和安全检查 |
| "用户应该知道怎么连接" | 必须提供完整的接线说明和原理图 |`;
}

module.exports = {
  FORBIDDEN_BEHAVIORS,
  RATIONALIZATIONS,
  detectForbiddenBehaviors,
  detectRationalizations,
  generateWarning,
  checkForWarnings,
  getAntiPatternChecklist
};
