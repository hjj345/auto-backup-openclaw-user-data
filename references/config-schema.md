# 配置字段说明

本文档详细说明 `Auto-Backup-Openclaw-User-Data` 技能的所有配置字段。

---

## 配置文件位置

```
~/.openclaw/workspace/Auto-Backup-Openclaw-User-Data/config.json
```

---

## 配置结构

```json
{
  "version": "1.0.0",
  "createdAt": "2026-03-26T15:00:00+08:00",
  "updatedAt": "2026-03-26T15:00:00+08:00",
  
  "backup": { ... },
  "schedule": { ... },
  "output": { ... },
  "retention": { ... },
  "notification": { ... },
  "logging": { ... }
}
```

---

## 字段说明

### 顶层字段

| 字段 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `version` | string | 是 | "1.0.0" | 配置文件版本 |
| `createdAt` | string | 否 | - | 创建时间（ISO 8601） |
| `updatedAt` | string | 否 | - | 最后更新时间（ISO 8601） |

---

### backup 备份配置

| 字段 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `mode` | string | 是 | "full" | 备份模式：`full`（全量）或 `partial`（选择性） |
| `targets` | array | 否 | [...] | 选择性备份时的目标目录列表 |
| `exclude` | array | 否 | [...] | 排除的目录名列表 |
| `excludePatterns` | array | 否 | [...] | 排除的文件名模式（支持通配符） |

#### mode 备份模式

- `full`：全量备份 `.openclaw` 目录
- `partial`：选择性备份，只备份 `targets` 中指定的目录

#### targets 备份目标

仅在 `mode: "partial"` 时生效，可用的目标目录：

```
workspace          # 主工作空间
workspace-news     # 新闻工作空间
workspace-hr       # 人事工作空间
workspace-tech     # 技术工作空间
memory             # 记忆文件
```

#### exclude 排除目录

默认排除的目录：

```
logs               # 日志目录
cache              # 缓存目录
tmp                # 临时目录
node_modules       # Node.js 依赖
```

#### excludePatterns 排除模式

支持通配符：

```
*.log              # 所有 .log 文件
*.tmp              # 所有 .tmp 文件
.DS_Store          # macOS 系统文件
Thumbs.db          # Windows 缩略图缓存
```

---

### schedule 定时配置

| 字段 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `enabled` | boolean | 是 | true | 是否启用定时备份 |
| `cron` | string | 是 | "0 3 * * *" | cron 表达式 |
| `timezone` | string | 否 | "Asia/Shanghai" | 时区 |
| `lastRun` | string | 否 | null | 上次执行时间 |

#### cron 表达式格式

```
分钟 小时 日期 月份 星期
  *    *    *    *    *

示例：
"0 3 * * *"      # 每天凌晨 3:00
"0 4 * * *"      # 每天凌晨 4:00
"0 3 * * 0"      # 每周日凌晨 3:00
"0 3 1 * *"      # 每月 1 日凌晨 3:00
"*/30 * * * *"   # 每 30 分钟
```

---

### output 输出配置

| 字段 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `path` | string | 是 | ... | 备份文件存储路径 |
| `naming` | object | 否 | {...} | 命名规则 |

#### naming 命名规则

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `prefix` | string | "auto-backup-openclaw-user-data" | 文件名前缀 |
| `includeVersion` | boolean | true | 是否包含 OpenClaw 版本号 |
| `includeSequence` | boolean | true | 是否包含当日序号 |

#### 命名格式

```
{prefix}_{YYYYMMDD}_{HHMM}_{version}_{序号}.zip

示例：
auto-backup-openclaw-user-data_20260326_0300_v2026.3.23-2_01.zip
```

---

### retention 保留策略配置

| 字段 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `enabled` | boolean | 是 | true | 是否启用保留策略 |
| `mode` | string | 是 | "count" | 清理模式：`days` 或 `count` |
| `days` | number | 否 | 30 | 保留天数（mode=days 时） |
| `count` | number | 否 | 10 | 保留份数（mode=count 时） |

#### mode 清理模式

- `days`：按天数清理，保留最近 N 天的备份
- `count`：按份数清理，保留最近 N 份备份

---

### notification 通知配置

| 字段 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `enabled` | boolean | 是 | true | 是否启用通知 |
| `channels` | array | 是 | ["feishu"] | 通知渠道列表 |
| `onSuccess` | boolean | 否 | true | 备份成功时发送通知 |
| `onFailure` | boolean | 否 | true | 备份失败时发送通知 |

#### channels 可用渠道

```
feishu       # 飞书
telegram     # Telegram
discord      # Discord
slack        # Slack
```

**注意**：需要先在 OpenClaw 中配置相应的渠道。

---

### logging 日志配置

| 字段 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `enabled` | boolean | 是 | true | 是否启用日志 |
| `level` | string | 否 | "info" | 日志级别 |
| `maxSize` | string | 否 | "10MB" | 单个日志文件最大大小 |
| `maxFiles` | number | 否 | 5 | 保留的日志文件数量 |

#### level 日志级别

```
DEBUG    # 调试信息
INFO     # 一般信息
WARN     # 警告信息
ERROR    # 错误信息
```

---

## 配置示例

### 最小配置

```json
{
  "version": "1.0.0",
  "backup": {
    "mode": "full"
  },
  "schedule": {
    "enabled": true,
    "cron": "0 3 * * *"
  },
  "output": {
    "path": "~/.openclaw/workspace/Auto-Backup-Openclaw-User-Data/backups"
  },
  "retention": {
    "enabled": true,
    "mode": "count",
    "count": 10
  },
  "notification": {
    "enabled": true,
    "channels": ["feishu"]
  },
  "logging": {
    "enabled": true
  }
}
```

### 完整配置

```json
{
  "version": "1.0.0",
  "createdAt": "2026-03-26T15:00:00+08:00",
  "updatedAt": "2026-03-26T15:00:00+08:00",
  
  "backup": {
    "mode": "partial",
    "targets": ["workspace", "workspace-tech", "memory"],
    "exclude": ["logs", "cache", "tmp", "node_modules"],
    "excludePatterns": ["*.log", "*.tmp", ".DS_Store", "Thumbs.db"]
  },
  
  "schedule": {
    "enabled": true,
    "cron": "0 3 * * *",
    "timezone": "Asia/Shanghai",
    "lastRun": null
  },
  
  "output": {
    "path": "D:/Backups/openclaw",
    "naming": {
      "prefix": "auto-backup-openclaw-user-data",
      "includeVersion": true,
      "includeSequence": true
    }
  },
  
  "retention": {
    "enabled": true,
    "mode": "days",
    "days": 30,
    "count": 10
  },
  
  "notification": {
    "enabled": true,
    "channels": ["feishu", "telegram"],
    "onSuccess": true,
    "onFailure": true
  },
  
  "logging": {
    "enabled": true,
    "level": "info",
    "maxSize": "10MB",
    "maxFiles": 5
  }
}
```

---

## 配置验证

修改配置后，运行以下命令验证：

```
/backup_config
选择 [4] 查看当前配置
```

如果配置格式错误，系统会自动使用默认配置并提示错误信息。