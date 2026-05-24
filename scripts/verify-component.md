# Component Sourcing Verification - 实操指南

## 已验证的能力

### 1. 立创商城价格/库存查询

```bash
browser-harness <<'PY'
new_tab("https://www.lcsc.com/search?q=STM32F103C8T6")
wait_for_load()
result = js("document.body.innerText")
# 解析价格、库存、交期
print(result[:3000])
PY
```

**实测结果：**
- 价格：$1.4039（单片），$0.8417（1500+批量）
- 库存：6,000 片
- 交期：31-33 个工作日

### 2. AllDatasheet 搜索

```bash
browser-harness <<'PY'
new_tab("https://www.alldatasheet.com/view.jsp?Searchword=STM32F103C8T6")
wait_for_load()
result = js("document.body.innerText")
# 解析 datasheet 列表
print(result[:3000])
PY
```

**实测结果：**
- 找到 7 个 datasheet 变体
- 包含 1Mb/67P、1Mb/92P、1Mb/96P 等不同版本

### 3. 封装文件搜索（立创 EDA）

```bash
browser-harness <<'PY'
new_tab("https://pro.lceda.cn/search?keyword=STM32F103C8T6")
wait_for_load()
result = js("document.body.innerText")
print(result[:3000])
PY
```

## 实际工作流程

### Stage 3 器件选型时的操作步骤

1. **确定器件型号**（如 STM32F103C8T6）

2. **查询采购信息**
   ```bash
   browser-harness <<'PY'
   new_tab("https://www.lcsc.com/search?q=STM32F103C8T6")
   wait_for_load()
   result = js("document.body.innerText")
   # 提取：价格、库存、交期、封装
   PY
   ```

3. **查询 datasheet**
   ```bash
   browser-harness <<'PY'
   new_tab("https://www.alldatasheet.com/view.jsp?Searchword=STM32F103C8T6")
   wait_for_load()
   result = js("document.body.innerText")
   # 提取：datasheet 链接、页数、描述
   PY
   ```

4. **查询封装文件**
   ```bash
   browser-harness <<'PY'
   new_tab("https://pro.lceda.cn/search?keyword=STM32F103C8T6")
   wait_for_load()
   result = js("document.body.innerText")
   # 提取：封装库链接
   PY
   ```

5. **记录到 03-components.md**
   - 采购信息表格
   - Datasheet 链接
   - 封装文件链接
   - 供应链风险评估

## 输出格式

```markdown
## STM32F103C8T6

### 采购信息（经 browser-harness 验证）
| 渠道 | 价格 | 库存 | 交期 | 链接 | 验证日期 |
|------|------|------|------|------|----------|
| 立创商城 | $1.4039/单片, $0.8417/1500+ | 6,000 | 31-33天 | https://www.lcsc.com/... | 2026-05-24 |

### Datasheet
| 来源 | 链接 | 页数 | 状态 |
|------|------|------|------|
| AllDatasheet | https://www.alldatasheet.com/... | 67P | 可访问 |

### 封装文件
| 来源 | 格式 | 链接 | 状态 |
|------|------|------|------|
| 立创 EDA | .kicad_mod | https://pro.lceda.cn/... | 可下载 |

### 供应链风险
| 指标 | 状态 | 来源 |
|------|------|------|
| 生命周期 | 在产 | 立创商城 |
| 库存 | 充足（6,000） | 立创商城 |
| 交期 | 31-33天 | 立创商城 |
```

## 注意事项

1. **反爬处理**：部分网站有反爬机制，如果被拦截，提示用户手动操作
2. **登录要求**：淘宝等需要登录的网站，提示用户手动查看
3. **数据验证**：获取的数据必须记录验证日期，因为价格/库存会变化
4. **错误处理**：如果网站无法访问，记录到 experience-log.md 的"已知失败源"
