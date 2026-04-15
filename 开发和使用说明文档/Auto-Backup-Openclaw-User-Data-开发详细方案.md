# "Auto-Backup-Openclaw-User-Data" OpenClaw Skill 技能开发详细方案

> **文档版本**：v1.0.0  
> **创建日期**：2026-03-26  
> **作者**：Jack·Huang (jack698698@gmail.com)  
> **状态**：待确认后执行开发

---

## 目录

1. [技能概述](#1-技能概述)
2. [技能基本信息](#2-技能基本信息)
3. [功能需求规格](#3-功能需求规格)
4. [技术架构设计](#4-技术架构设计)
5. [文件结构设计](#5-文件结构设计)
6. [核心模块设计](#6-核心模块设计)
7. [CLI 命令设计](#7-cli-命令设计)
8. [配置系统设计](#8-配置系统设计)
9. [日志系统设计](#9-日志系统设计)
10. [通知系统设计](#10-通知系统设计)
11. [保留策略设计](#11-保留策略设计)
12. [跨平台兼容性设计](#12-跨平台兼容性设计)
13. [SKILL.md 规范](#13-skillmd-规范)
14. [开发计划](#14-开发计划)
15. [测试计划](#15-测试计划)
16. [打包与分发](#16-打包与分发)
17. [安装与使用说明](#17-安装与使用说明)

---

## 1. 技能概述

### 1.1 技能简介

`Auto-Backup-Openclaw-User-Data` 是一个专注于自动备份 OpenClaw 用户数据目录的技能包。该技能能够：

- 自动备份 `.openclaw` 目录（全量或选择性备份）
- 自动压缩为 ZIP 文件并按规则命名
- 支持定时自动执行
- 提供完整的日志记录和消息通知
- 支持备份文件保留策略管理

### 1.2 核心价值

| 价值点 | 说明 |
|--------|------|
| **数据安全** | 自动备份，防止数据丢失 |
| **零干预** | 定时执行，无需人工操作 |
| **灵活性** | 支持选择性备份、自定义存储路径 |
| **可追溯** | 完整日志记录，便于问题排查 |
| **跨平台** | Windows / Linux / macOS 全支持 |

### 1.3 适用场景

- OpenClaw 用户定期数据备份
- 系统迁移前的数据备份
- 关键配置文件的版本管理
- 多 Agent 环境的数据同步

---

## 2. 技能基本信息

| 属性 | 值 |
|------|-----|
| **技能名称** | auto-backup-openclaw-user-data |
| **显示名称** | Auto Backup OpenClaw User Data |
| **版本** | v1.0.0.20260326 |
| **发布日期** | 2026-03-26 |
| **作者** | Jack·Huang |
| **邮箱** | jack698698@gmail.com |
| **许可协议** | MIT License |
| **最低 OpenClaw 版本** | v2026.3.1+ |
| **运行环境** | Node.js v18+ |

---

## 3. 功能需求规格

### 3.1 核心功能清单

| 功能模块 | 功能描述 | 优先级 |
|----------|----------|--------|
| **备份执行** | 执行目录备份并压缩 | P0 |
| **选择性备份** | 支持选择备份目录 | P0 |
| **自动命名** | 按规则命名 ZIP 文件 | P0 |
| **定时调度** | 定时自动执行备份 | P0 |
| **配置管理** | 用户配置管理 | P0 |
| **日志记录** | 执行日志记录 | P1 |
| **消息通知** | 执行结果通知 | P1 |
| **保留策略** | 旧备份清理 | P1 |
| **CLI 命令** | 命令行交互 | P1 |
| **跨平台支持** | 多操作系统支持 | P1 |

### 3.2 功能详细说明

#### 3.2.1 备份执行

```
输入：用户选择的备份目录列表
输出：压缩后的 ZIP 文件

流程：
1. 读取配置，确定备份目标
2. 遍历目标目录，收集文件列表
3. 过滤排除项（如 node_modules、临时文件）
4. 执行压缩，跳过被占用的文件
5. 按规则命名 ZIP 文件
6. 移动到指定存储目录
7. 记录日志
```

#### 3.2.2 ZIP 文件命名规则

```
格式：auto-backup-openclaw-user-data_{YYYYMMDD}_{HHMM}_{version}_{序号}.zip

示例：auto-backup-openclaw-user-data_20260326_0300_v2026.3.23-2_01.zip

组成部分：
- auto-backup-openclaw-user-data：固定前缀
- YYYYMMDD：日期（20260326）
- HHMM：时间（0300 表示凌晨3点）
- version：OpenClaw 版本号（v2026.3.23-2）
- 序号：当日备份序号（01、02、03...）
```

#### 3.2.3 选择性备份

用户可选择备份以下目录：

| 目录 | 说明 | 默认备份 |
|------|------|----------|
| `.openclaw/` | 全量备份（根目录） | ✅ |
| `workspace/` | 主工作空间 | ✅ |
| `workspace-01/` | 01工作空间 | ✅ |
| `workspace-02/` | 02工作空间 | ✅ |
| `workspace-03/` | 03工作空间 | ✅ |
| `memory/` | 记忆文件 | ✅ |
| `logs/` | 日志文件 | ❌ |
| `cache/` | 缓存文件 | ❌ |
| `tmp/` | 临时文件 | ❌ |

**排除规则**（默认不备份）：
- `node_modules/`
- `*.log`
- `*.tmp`
- `.DS_Store`
- `Thumbs.db`

#### 3.2.4 定时调度

```
默认执行时间：每天凌晨 3:00

支持配置：
- cron 表达式（高级用户）
- 简易时间选择（普通用户）

调度机制：
- 使用 OpenClaw HEARTBEAT 机制
- 心跳触发时检查是否到执行时间
- 支持手动触发（/backup_now）
```

---

## 4. 技术架构设计

### 4.1 架构概览

```
┌─────────────────────────────────────────────────────────────┐
│                    OpenClaw Runtime                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │   CLI 层    │───▶│  业务逻辑层  │───▶│  工具函数层  │     │
│  └─────────────┘    └─────────────┘    └─────────────┘     │
│         │                  │                  │             │
│         ▼                  ▼                  ▼             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │  命令解析   │    │  备份调度器  │    │  文件操作   │     │
│  │  配置交互   │    │  压缩引擎    │    │  ZIP 压缩   │     │
│  │  状态展示   │    │  清理策略    │    │  日志写入   │     │
│  └─────────────┘    └─────────────┘    └─────────────┘     │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                    存储层                            │   │
│  │  config.json │ backup.log │ backup.zip files        │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 技术选型

| 模块 | 技术方案 | 说明 |
|------|----------|------|
| **运行时** | Node.js | OpenClaw 内置运行时 |
| **压缩** | archiver | 纯 JS 实现，跨平台 |
| **文件操作** | fs-extra | Node.js 原生增强 |
| **定时调度** | HEARTBEAT | OpenClaw 内置机制 |
| **配置存储** | JSON | 简单可靠 |
| **日志** | winston / 自定义 | 按需选择 |
| **CLI** | OpenClaw 命令 | 集成到 OpenClaw |

### 4.3 依赖关系

```
auto-backup-openclaw-user-data
│
├── archiver (^6.0.0)          # ZIP 压缩
├── fs-extra (^11.0.0)         # 文件操作增强
├── dayjs (^1.11.0)            # 日期处理
└── openclaw-sdk (internal)    # OpenClaw API
```

---

## 5. 文件结构设计

### 5.1 Skill 包结构

```
auto-backup-openclaw-user-data/
│
├── SKILL.md                      # 技能说明文件（必需）
│
├── scripts/                      # 脚本目录
│   ├── backup.js                 # 主备份脚本
│   ├── compressor.js             # 压缩模块
│   ├── scheduler.js              # 调度模块
│   ├── cleaner.js                # 清理模块
│   ├── notifier.js               # 通知模块
│   └── cli.js                    # CLI 入口
│
├── lib/                          # 依赖库（打包进 skill）
│   └── archiver.min.js           # 压缩库
│
├── references/                   # 参考文档
│   ├── config-schema.md          # 配置字段说明
│   └── troubleshooting.md        # 故障排查指南
│
├── templates/                    # 模板文件
│   └── config.template.json      # 配置模板
│
└── package.json                  # 包信息（可选）
```

### 5.2 运行时目录结构

```
~/.openclaw/
│
├── workspace/                    # 主工作空间
│   └── Auto-Backup-Openclaw-User-Data/
│       ├── config.json           # 用户配置
│       ├── backup.log            # 备份日志
│       └── backups/              # 备份文件存储（默认）
│           ├── auto-backup-openclaw-user-data_20260326_0300_v2026.3.23-2_01.zip
│           └── auto-backup-openclaw-user-data_20260325_0300_v2026.3.23-2_01.zip
```

### 5.3 配置文件结构

```json
{
  "version": "1.0.0",
  "createdAt": "2026-03-26T14:00:00+08:00",
  "updatedAt": "2026-03-26T14:00:00+08:00",
  
  "backup": {
    "mode": "full",
    "targets": ["workspace", "workspace-news", "workspace-hr", "workspace-tech", "memory"],
    "exclude": ["logs", "cache", "tmp", "node_modules"],
    "excludePatterns": ["*.log", "*.tmp", ".DS_Store", "Thumbs.db"]
  },
  
  "schedule": {
    "enabled": true,
    "cron": "0 3 * * *",
    "timezone": "Asia/Shanghai"
  },
  
  "output": {
    "path": "~/.openclaw/workspace/Auto-Backup-Openclaw-User-Data/backups",
    "naming": {
      "prefix": "auto-backup-openclaw-user-data",
      "includeVersion": true,
      "includeSequence": true
    }
  },
  
  "retention": {
    "enabled": true,
    "mode": "count",
    "days": 30,
    "count": 10
  },
  
  "notification": {
    "enabled": true,
    "channels": ["feishu"],
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

## 6. 核心模块设计

### 6.1 备份模块 (backup.js)

```javascript
/**
 * 备份模块 - 核心备份逻辑
 */

class BackupManager {
  constructor(config) {
    this.config = config;
    this.compressor = new Compressor();
    this.logger = new Logger();
  }

  /**
   * 执行备份
   * @returns {Promise<BackupResult>}
   */
  async execute() {
    const startTime = Date.now();
    const result = {
      success: false,
      filesTotal: 0,
      filesSkipped: 0,
      sizeBytes: 0,
      outputPath: null,
      errors: [],
      duration: 0
    };

    try {
      // 1. 准备备份目标
      const targets = this.prepareTargets();
      
      // 2. 收集文件列表
      const files = await this.collectFiles(targets);
      result.filesTotal = files.length;
      
      // 3. 执行压缩
      const zipPath = await this.compressor.compress(files, this.config.output);
      result.outputPath = zipPath;
      result.sizeBytes = await this.getFileSize(zipPath);
      
      // 4. 记录日志
      this.logger.info(`Backup completed: ${zipPath}`);
      
      result.success = true;
    } catch (error) {
      result.errors.push(error.message);
      this.logger.error(`Backup failed: ${error.message}`);
    }

    result.duration = Date.now() - startTime;
    return result;
  }

  /**
   * 准备备份目标路径
   */
  prepareTargets() {
    const openclawRoot = path.resolve(os.homedir(), '.openclaw');
    
    if (this.config.backup.mode === 'full') {
      return [openclawRoot];
    }
    
    return this.config.backup.targets.map(t => 
      path.join(openclawRoot, t)
    );
  }

  /**
   * 收集待备份文件
   */
  async collectFiles(targets) {
    const files = [];
    const exclude = this.config.backup.excludePatterns;
    
    for (const target of targets) {
      await this.walkDirectory(target, files, exclude);
    }
    
    return files;
  }

  /**
   * 遍历目录收集文件
   */
  async walkDirectory(dir, files, exclude) {
    // 实现目录遍历，跳过排除项和被占用文件
  }
}
```

### 6.2 压缩模块 (compressor.js)

```javascript
/**
 * 压缩模块 - ZIP 文件压缩
 */

const archiver = require('archiver');
const fs = require('fs-extra');

class Compressor {
  /**
   * 压缩文件列表
   * @param {Array} files 文件列表
   * @param {Object} outputConfig 输出配置
   * @returns {Promise<string>} ZIP 文件路径
   */
  async compress(files, outputConfig) {
    const zipPath = this.generateZipPath(outputConfig);
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    return new Promise((resolve, reject) => {
      output.on('close', () => resolve(zipPath));
      archive.on('error', reject);
      
      archive.pipe(output);
      
      for (const file of files) {
        try {
          archive.file(file.path, { name: file.relativePath });
        } catch (error) {
          // 跳过被占用的文件
          if (error.code === 'EBUSY') {
            this.logger.warn(`Skipped (busy): ${file.path}`);
            continue;
          }
          throw error;
        }
      }
      
      archive.finalize();
    });
  }

  /**
   * 生成 ZIP 文件路径
   */
  generateZipPath(outputConfig) {
    const now = new Date();
    const date = now.toISOString().slice(0, 10).replace(/-/g, '');
    const time = now.toTimeString().slice(0, 5).replace(':', '');
    const version = this.getOpenClawVersion();
    const sequence = this.getNextSequence(date);
    
    const filename = `${outputConfig.naming.prefix}_${date}_${time}_${version}_${sequence}.zip`;
    return path.join(outputConfig.path, filename);
  }

  /**
   * 获取 OpenClaw 版本
   */
  getOpenClawVersion() {
    // 从 OpenClaw API 或 package.json 获取
    return 'v2026.3.23-2';
  }

  /**
   * 获取当日序号
   */
  getNextSequence(date) {
    // 检查当天已有的备份文件数量
    return '01';
  }
}
```

### 6.3 调度模块 (scheduler.js)

```javascript
/**
 * 调度模块 - 定时任务管理
 */

class Scheduler {
  constructor(config) {
    this.config = config;
    this.lastRun = null;
  }

  /**
   * 检查是否应该执行备份
   * HEARTBEAT 触发时调用
   */
  shouldRun() {
    if (!this.config.schedule.enabled) {
      return false;
    }

    const now = new Date();
    const cron = this.parseCron(this.config.schedule.cron);
    
    // 检查是否匹配 cron 表达式
    // 检查今天是否已执行
    
    return this.matchesCron(now, cron);
  }

  /**
   * 解析 cron 表达式
   */
  parseCron(expression) {
    // "0 3 * * *" => { minute: 0, hour: 3, ... }
    const parts = expression.split(' ');
    return {
      minute: parseInt(parts[0]),
      hour: parseInt(parts[1]),
      dayOfMonth: parts[2],
      month: parts[3],
      dayOfWeek: parts[4]
    };
  }

  /**
   * 获取下次执行时间
   */
  getNextRunTime() {
    // 计算下次执行时间
  }
}
```

### 6.4 清理模块 (cleaner.js)

```javascript
/**
 * 清理模块 - 旧备份文件管理
 */

class Cleaner {
  constructor(config) {
    this.config = config;
  }

  /**
   * 执行清理
   */
  async execute() {
    if (!this.config.retention.enabled) {
      return { deleted: 0, kept: 0 };
    }

    const backups = await this.getBackupFiles();
    const toDelete = this.selectToDelete(backups);
    
    for (const file of toDelete) {
      await fs.remove(file.path);
    }

    return {
      deleted: toDelete.length,
      kept: backups.length - toDelete.length
    };
  }

  /**
   * 选择要删除的备份
   */
  selectToDelete(backups) {
    if (this.config.retention.mode === 'days') {
      return this.selectByDays(backups);
    } else {
      return this.selectByCount(backups);
    }
  }

  /**
   * 按天数选择
   */
  selectByDays(backups) {
    const cutoff = Date.now() - this.config.retention.days * 86400000;
    return backups.filter(b => b.modifiedTime < cutoff);
  }

  /**
   * 按份数选择
   */
  selectByCount(backups) {
    const sorted = backups.sort((a, b) => b.modifiedTime - a.modifiedTime);
    return sorted.slice(this.config.retention.count);
  }
}
```

### 6.5 通知模块 (notifier.js)

```javascript
/**
 * 通知模块 - 执行结果推送
 */

class Notifier {
  constructor(config) {
    this.config = config;
  }

  /**
   * 发送备份成功通知
   */
  async notifySuccess(result) {
    if (!this.config.notification.enabled || !this.config.notification.onSuccess) {
      return;
    }

    const message = this.formatSuccessMessage(result);
    await this.sendToChannels(message);
  }

  /**
   * 发送备份失败通知
   */
  async notifyFailure(result) {
    if (!this.config.notification.enabled || !this.config.notification.onFailure) {
      return;
    }

    const message = this.formatFailureMessage(result);
    await this.sendToChannels(message);
  }

  /**
   * 格式化成功消息
   */
  formatSuccessMessage(result) {
    return `✅ OpenClaw 数据备份成功

📦 备份文件：${path.basename(result.outputPath)}
📊 文件数量：${result.filesTotal} 个
📏 文件大小：${this.formatSize(result.sizeBytes)}
⏱️ 执行耗时：${result.duration}ms
🕐 执行时间：${new Date().toLocaleString('zh-CN')}
`;
  }

  /**
   * 发送到配置的渠道
   */
  async sendToChannels(message) {
    const channels = this.config.notification.channels;
    
    for (const channel of channels) {
      // 使用 OpenClaw message API 发送
      await this.sendToChannel(channel, message);
    }
  }
}
```

---

## 7. CLI 命令设计

### 7.1 命令列表

| 命令 | 功能 | 示例 |
|------|------|------|
| `/backup_now` | 立即执行备份 | `/backup_now` |
| `/backup_status` | 查看备份状态 | `/backup_status` |
| `/backup_config` | 配置向导 | `/backup_config` |
| `/backup_list` | 列出备份文件 | `/backup_list` |
| `/backup_clean` | 清理旧备份 | `/backup_clean` |
| `/backup_restore` | 恢复备份（可选） | `/backup_restore <file>` |

### 7.2 命令详细设计

#### 7.2.1 /backup_now

```
功能：立即执行一次备份

参数：
  --full       全量备份（默认）
  --partial    选择性备份
  --quiet      静默模式，不发送通知

执行流程：
1. 检查是否有正在进行的备份
2. 读取配置
3. 执行备份
4. 记录日志
5. 发送通知（除非 --quiet）

输出示例：
🔄 开始执行备份...
📂 备份目标：全量备份 .openclaw
📦 压缩中... 1234 个文件
✅ 备份完成！
📁 文件：auto-backup-openclaw-user-data_20260326_1430_v2026.3.23-2_01.zip
📏 大小：125.6 MB
```

#### 7.2.2 /backup_config

```
功能：配置向导（交互式）

执行流程：
1. 显示当前配置
2. 让用户选择配置方式：
   [1] 交互式配置（推荐）
   [2] 手动修改配置文件
   [3] 重置为默认配置

交互式配置步骤：
┌─────────────────────────────────────┐
│ 📋 备份配置向导                       │
├─────────────────────────────────────┤
│                                     │
│ Step 1/5: 备份范围                   │
│ [1] 全量备份 .openclaw               │
│ [2] 选择性备份                       │
│ 请选择: 1                           │
│                                     │
│ Step 2/5: 备份时间                   │
│ 当前设置: 每天凌晨 3:00              │
│ 是否修改? [y/N]: n                  │
│                                     │
│ Step 3/5: 存储路径                   │
│ 当前: ~/.openclaw/workspace/...     │
│ 是否修改? [y/N]: n                  │
│                                     │
│ Step 4/5: 保留策略                   │
│ [1] 按天数（默认 30 天）             │
│ [2] 按份数（默认 10 份）             │
│ 请选择: 1                           │
│ 保留天数: 30                        │
│                                     │
│ Step 5/5: 通知渠道                   │
│ 可用渠道:                           │
│ [x] feishu                          │
│ [ ] telegram                        │
│ [ ] discord                         │
│ 请选择（空格切换）: [x]              │
│                                     │
│ ─────────────────────────────────── │
│ ✅ 配置已保存！                      │
│ 📁 配置文件: ~/.openclaw/workspace/  │
│    Auto-Backup-Openclaw-User-Data/  │
│    config.json                      │
└─────────────────────────────────────┘

手动修改配置文件方式：
┌─────────────────────────────────────┐
│ 📝 手动修改配置文件                   │
├─────────────────────────────────────┤
│                                     │
│ 配置文件路径：                       │
│ ~/.openclaw/workspace/              │
│   Auto-Backup-Openclaw-User-Data/   │
│   config.json                       │
│                                     │
│ 操作步骤：                           │
│ 1. 使用文本编辑器打开配置文件        │
│ 2. 修改需要的配置项                  │
│ 3. 保存文件                          │
│ 4. 运行 /backup_config 验证配置      │
│                                     │
│ 配置说明文档：                       │
│ [查看 config-schema.md]             │
│                                     │
│ 💡 提示：修改后运行验证确保格式正确  │
└─────────────────────────────────────┘
```

#### 7.2.3 /backup_status

```
功能：查看备份状态

输出示例：
┌─────────────────────────────────────┐
│ 📊 备份状态                          │
├─────────────────────────────────────┤
│                                     │
│ 🔄 调度状态                          │
│   - 定时备份：已启用                 │
│   - 执行时间：每天 03:00             │
│   - 下次执行：2026-03-27 03:00      │
│                                     │
│ 📦 备份统计                          │
│   - 总备份数：15 个                  │
│   - 总大小：1.8 GB                   │
│   - 最近备份：2026-03-26 03:00      │
│                                     │
│ 📁 存储位置                          │
│   ~/.openclaw/workspace/            │
│     Auto-Backup-Openclaw-User-Data/ │
│     backups/                        │
│                                     │
│ ⚙️ 当前配置                          │
│   - 备份模式：全量备份               │
│   - 保留策略：30 天 / 10 份          │
│   - 通知渠道：feishu                 │
│                                     │
└─────────────────────────────────────┘
```

#### 7.2.4 /backup_list

```
功能：列出备份文件

参数：
  --all       显示所有备份
  --latest N  显示最近 N 个
  --size      显示文件大小

输出示例：
┌──────────────────────────────────────────────────────┐
│ 📦 备份文件列表                                        │
├──────────────────────────────────────────────────────┤
│                                                      │
│ #   文件名                                    大小    │
│───────────────────────────────────────────────────── │
│ 01  auto-backup-..._20260326_0300_...zip    125 MB  │
│ 02  auto-backup-..._20260325_0300_...zip    124 MB  │
│ 03  auto-backup-..._20260324_0300_...zip    123 MB  │
│ ...                                                  │
│                                                      │
│ 共 15 个备份文件，总计 1.8 GB                         │
└──────────────────────────────────────────────────────┘
```

---

## 8. 配置系统设计

### 8.1 配置字段说明

| 字段路径 | 类型 | 默认值 | 说明 |
|----------|------|--------|------|
| `version` | string | "1.0.0" | 配置版本 |
| `backup.mode` | string | "full" | 备份模式：full/partial |
| `backup.targets` | array | [...] | 备份目标目录 |
| `backup.exclude` | array | [...] | 排除目录 |
| `backup.excludePatterns` | array | [...] | 排除文件模式 |
| `schedule.enabled` | boolean | true | 是否启用定时 |
| `schedule.cron` | string | "0 3 * * *" | cron 表达式 |
| `schedule.timezone` | string | "Asia/Shanghai" | 时区 |
| `output.path` | string | "..." | 输出路径 |
| `retention.enabled` | boolean | true | 是否启用清理 |
| `retention.mode` | string | "count" | 清理模式：days/count |
| `retention.days` | number | 30 | 保留天数 |
| `retention.count` | number | 10 | 保留份数 |
| `notification.enabled` | boolean | true | 是否启用通知 |
| `notification.channels` | array | ["feishu"] | 通知渠道 |
| `logging.enabled` | boolean | true | 是否启用日志 |
| `logging.level` | string | "info" | 日志级别 |

### 8.2 配置验证

```javascript
/**
 * 配置验证 Schema
 */
const configSchema = {
  version: { type: 'string', required: true },
  backup: {
    mode: { type: 'string', enum: ['full', 'partial'], required: true },
    targets: { type: 'array', items: 'string', required: false },
    exclude: { type: 'array', items: 'string', required: false }
  },
  schedule: {
    enabled: { type: 'boolean', required: true },
    cron: { type: 'string', pattern: /^[\d*]+\s+[\d*]+\s+[\d*]+\s+[\d*]+\s+[\d*]+$/, required: true }
  },
  // ... 其他字段
};

function validateConfig(config) {
  // 验证配置是否符合 schema
  // 返回 { valid: boolean, errors: [] }
}
```

### 8.3 配置迁移

```javascript
/**
 * 配置版本迁移
 */
function migrateConfig(config) {
  const currentVersion = config.version;
  
  // 未来版本升级时添加迁移逻辑
  // if (currentVersion === '1.0.0') {
  //   // 迁移到 1.1.0
  //   config.newField = 'default';
  //   config.version = '1.1.0';
  // }
  
  return config;
}
```

---

## 9. 日志系统设计

### 9.1 日志格式

```
[2026-03-26 14:30:00.123] [INFO]  [backup] 开始执行备份任务
[2026-03-26 14:30:00.456] [INFO]  [backup] 备份目标: 全量备份 .openclaw
[2026-03-26 14:30:01.789] [INFO]  [compressor] 收集文件: 1234 个
[2026-03-26 14:30:02.012] [WARN]  [compressor] 跳过被占用文件: cache/lock.tmp
[2026-03-26 14:30:15.345] [INFO]  [backup] 备份完成: auto-backup-...zip
[2026-03-26 14:30:15.678] [INFO]  [notifier] 通知已发送: feishu
[2026-03-26 14:30:15.901] [INFO]  [backup] 备份任务结束，耗时: 15678ms
```

### 9.2 日志级别

| 级别 | 说明 | 使用场景 |
|------|------|----------|
| `ERROR` | 错误 | 备份失败、文件损坏 |
| `WARN` | 警告 | 跳过文件、配置问题 |
| `INFO` | 信息 | 任务开始/结束、关键操作 |
| `DEBUG` | 调试 | 详细操作记录（开发用） |

### 9.3 日志文件管理

```javascript
/**
 * 日志配置
 */
const loggingConfig = {
  enabled: true,
  level: 'info',
  maxSize: '10MB',      // 单文件最大 10MB
  maxFiles: 5,          // 保留 5 个日志文件
  path: '~/.openclaw/workspace/Auto-Backup-Openclaw-User-Data/backup.log'
};

/**
 * 日志轮转
 * backup.log -> backup.log.1 -> backup.log.2 -> ... -> backup.log.5 (删除)
 */
```

---

## 10. 通知系统设计

### 10.1 支持的通知渠道

| 渠道 | 说明 | 配置要求 |
|------|------|----------|
| `feishu` | 飞书 | 已配置飞书机器人 |
| `telegram` | Telegram | 已配置 Telegram bot |
| `discord` | Discord | 已配置 Discord webhook |
| `slack` | Slack | 已配置 Slack webhook |

### 10.2 通知消息模板

#### 成功通知

```
✅ OpenClaw 数据备份成功

📦 备份文件：auto-backup-openclaw-user-data_20260326_0300_v2026.3.23-2_01.zip
📊 文件数量：1,234 个
📏 文件大小：125.6 MB
⏱️ 执行耗时：15.7 秒
🕐 执行时间：2026-03-26 03:00:15

📁 存储位置：~/.openclaw/workspace/Auto-Backup-Openclaw-User-Data/backups/
```

#### 失败通知

```
❌ OpenClaw 数据备份失败

🚨 错误信息：磁盘空间不足
📁 目标路径：D:/Backups/
💡 建议：请清理磁盘空间或更换存储路径

🕐 失败时间：2026-03-26 03:00:15
📋 详细日志：~/.openclaw/workspace/Auto-Backup-Openclaw-User-Data/backup.log
```

### 10.3 通知发送逻辑

```javascript
/**
 * 发送通知
 */
async function sendNotification(result) {
  const channels = config.notification.channels;
  
  // 获取 OpenClaw 已配置的渠道
  const availableChannels = await getAvailableChannels();
  
  // 过滤出可用的渠道
  const validChannels = channels.filter(c => availableChannels.includes(c));
  
  // 并发发送到所有渠道
  const promises = validChannels.map(channel => {
    return message({
      action: 'send',
      channel: channel,
      message: formatMessage(result)
    });
  });
  
  await Promise.allSettled(promises);
}
```

---

## 11. 保留策略设计

### 11.1 清理模式

#### 按天数清理

```
保留最近 N 天的备份
默认：30 天

示例：
今天是 2026-03-26
保留 30 天 = 保留 2026-02-25 之后的备份
删除：2026-02-24 及更早的备份
```

#### 按份数清理

```
保留最近 N 份备份
默认：10 份

示例：
当前有 15 个备份文件
保留 10 份 = 保留最新的 10 个
删除：最旧的 5 个
```

### 11.2 清理时机

```
触发条件：
1. 每次备份成功后自动检查
2. 手动执行 /backup_clean 命令

清理流程：
1. 扫描备份目录
2. 按修改时间排序
3. 计算需要删除的文件
4. 执行删除
5. 记录日志
```

### 11.3 清理日志

```
[2026-03-26 03:15:00] [INFO] [cleaner] 开始清理旧备份
[2026-03-26 03:15:00] [INFO] [cleaner] 当前备份数: 15
[2026-03-26 03:15:00] [INFO] [cleaner] 保留策略: 10 份
[2026-03-26 03:15:00] [INFO] [cleaner] 删除文件: auto-backup-..._20260301_0300_...zip
[2026-03-26 03:15:00] [INFO] [cleaner] 删除文件: auto-backup-..._20260302_0300_...zip
[2026-03-26 03:15:00] [INFO] [cleaner] 清理完成: 删除 5 个，保留 10 个
```

---

## 12. 跨平台兼容性设计

### 12.1 路径处理

```javascript
const path = require('path');
const os = require('os');

// 跨平台路径处理
const openclawRoot = path.join(os.homedir(), '.openclaw');

// 路径分隔符自动处理
// Windows: C:\Users\xxx\.openclaw
// Linux/macOS: /home/xxx/.openclaw
```

### 12.2 平台差异处理

```javascript
/**
 * 平台适配
 */
const platform = {
  isWindows: process.platform === 'win32',
  isMacOS: process.platform === 'darwin',
  isLinux: process.platform === 'linux'
};

/**
 * 获取默认备份路径
 */
function getDefaultBackupPath() {
  const base = path.join(os.homedir(), '.openclaw', 'workspace', 'Auto-Backup-Openclaw-User-Data', 'backups');
  
  if (platform.isWindows) {
    // Windows: 可选备份到 D:\Backups\ 等
  }
  
  return base;
}

/**
 * 处理被占用文件
 */
async function handleBusyFile(filePath) {
  try {
    await fs.access(filePath, fs.constants.R_OK);
    return true;
  } catch (error) {
    if (error.code === 'EBUSY') {
      // Windows 上文件被占用
      logger.warn(`File busy, skipped: ${filePath}`);
      return false;
    }
    throw error;
  }
}
```

### 12.3 文件权限处理

```javascript
/**
 * 设置文件权限（Linux/macOS）
 */
async function setFilePermissions(filePath) {
  if (platform.isWindows) return;
  
  // 设置权限 644
  await fs.chmod(filePath, 0o644);
}
```

---

## 13. SKILL.md 规范

### 13.1 SKILL.md 文件内容

```markdown
---
name: auto-backup-openclaw-user-data
description: |
  OpenClaw 用户数据自动备份技能。支持全量/选择性备份、定时执行、ZIP 压缩、日志记录、消息通知和保留策略管理。
  
  **触发场景**：
  (1) 用户要求备份 OpenClaw 数据
  (2) 用户要求设置定时备份
  (3) 用户询问备份配置、状态、日志
  (4) 用户执行 /backup_now、/backup_status、/backup_config 等命令
  (5) HEARTBEAT 触发定时备份检查
---

# Auto Backup OpenClaw User Data

OpenClaw 用户数据自动备份技能。

## 功能

- **自动备份**：定时备份 `.openclaw` 目录
- **选择性备份**：支持全量或部分备份
- **ZIP 压缩**：自动压缩并按规则命名
- **日志记录**：完整记录执行过程
- **消息通知**：支持多渠道推送结果
- **保留策略**：自动清理旧备份

## 命令

| 命令 | 功能 |
|------|------|
| `/backup_now` | 立即执行备份 |
| `/backup_status` | 查看备份状态 |
| `/backup_config` | 配置向导 |
| `/backup_list` | 列出备份文件 |
| `/backup_clean` | 清理旧备份 |

## 配置

配置文件位置：`~/.openclaw/workspace/Auto-Backup-Openclaw-User-Data/config.json`

详细配置说明：见 [references/config-schema.md](references/config-schema.md)

## 故障排查

常见问题：见 [references/troubleshooting.md](references/troubleshooting.md)

## 使用示例

```
用户：帮我备份一下 OpenClaw 数据
助手：好的，立即执行备份... [执行 /backup_now]

用户：设置每天凌晨3点自动备份
助手：好的，正在配置定时备份... [执行 /backup_config]

用户：查看备份状态
助手：[执行 /backup_status]
```
```

---

## 14. 开发计划

### 14.1 开发阶段

| 阶段 | 内容 | 预估时间 | 产出 |
|------|------|----------|------|
| **Phase 1** | 需求确认 | 已完成 | 本文档 |
| **Phase 2** | 搭建骨架 | 1 小时 | 目录结构、基础文件 |
| **Phase 3** | 核心开发 | 3 小时 | 备份、压缩、调度模块 |
| **Phase 4** | 配置系统 | 1 小时 | 配置管理、CLI 交互 |
| **Phase 5** | 通知日志 | 1 小时 | 日志、通知模块 |
| **Phase 6** | 测试调试 | 2 小时 | 单元测试、集成测试 |
| **Phase 7** | 文档打包 | 1 小时 | 文档完善、打包分发 |

**总预估时间**：9 小时

### 14.2 开发任务清单

#### Phase 2: 搭建骨架

- [ ] 创建 skill 目录结构
- [ ] 编写 SKILL.md
- [ ] 创建 package.json
- [ ] 创建配置模板
- [ ] 初始化各模块文件

#### Phase 3: 核心开发

- [ ] 实现 backup.js 主逻辑
- [ ] 实现 compressor.js 压缩模块
- [ ] 实现 scheduler.js 调度模块
- [ ] 实现 cleaner.js 清理模块
- [ ] 处理跨平台兼容性
- [ ] 处理被占用文件

#### Phase 4: 配置系统

- [ ] 实现配置加载/保存
- [ ] 实现配置验证
- [ ] 实现 CLI 配置向导
- [ ] 实现手动配置指引

#### Phase 5: 通知日志

- [ ] 实现日志模块
- [ ] 实现通知模块
- [ ] 实现消息模板
- [ ] 测试多渠道通知

#### Phase 6: 测试调试

- [ ] 单元测试
- [ ] 集成测试
- [ ] Windows 测试
- [ ] Linux 测试（如有环境）
- [ ] macOS 测试（如有环境）
- [ ] 边界条件测试

#### Phase 7: 文档打包

- [ ] 完善 SKILL.md
- [ ] 编写 config-schema.md
- [ ] 编写 troubleshooting.md
- [ ] 运行 package_skill.py 打包
- [ ] 测试安装流程

---

## 15. 测试计划

### 15.1 单元测试

| 模块 | 测试项 | 预期结果 |
|------|--------|----------|
| compressor | 压缩单个文件 | 生成有效 ZIP |
| compressor | 压缩目录 | 包含所有文件 |
| compressor | 文件命名 | 符合命名规则 |
| scheduler | cron 解析 | 正确解析表达式 |
| scheduler | 时间匹配 | 正确判断执行时机 |
| cleaner | 按天数清理 | 删除正确文件 |
| cleaner | 按份数清理 | 保留正确数量 |

### 15.2 集成测试

| 测试场景 | 步骤 | 预期结果 |
|----------|------|----------|
| 首次安装 | 安装 skill → 执行备份 | 自动创建目录和配置 |
| 全量备份 | /backup_now --full | 完整备份成功 |
| 选择性备份 | 配置部分目录 → 备份 | 只备份选定目录 |
| 定时备份 | 配置 cron → 等待触发 | 自动执行备份 |
| 清理策略 | 超过保留数量 → 备份 | 自动删除最旧备份 |
| 通知推送 | 备份完成 → 检查渠道 | 收到通知消息 |

### 15.3 边界条件测试

| 场景 | 测试内容 | 预期处理 |
|------|----------|----------|
| 磁盘空间不足 | 目标磁盘已满 | 记录错误，发送失败通知 |
| 文件被占用 | 备份时文件被锁定 | 跳过文件，记录日志 |
| 配置损坏 | config.json 格式错误 | 重置为默认配置 |
| 网络异常 | 通知发送失败 | 记录日志，不影响备份 |
| 权限不足 | 无写入权限 | 记录错误，提示用户 |

---

## 16. 打包与分发

### 16.1 打包流程

```bash
# 1. 确保代码在 skill 目录
cd ~/.agents/skills/auto-backup-openclaw-user-data

# 2. 运行打包脚本
python ~/.agents/skills/skill-creator/scripts/package_skill.py .

# 3. 输出文件
# auto-backup-openclaw-user-data.skill (实际是 zip 格式)
```

### 16.2 分发渠道

| 渠道 | 方式 |
|------|------|
| **ClawHub** | 发布到 https://clawhub.com |
| **GitHub** | 开源到 GitHub 仓库 |
| **本地安装** | 直接提供 .skill 文件 |

### 16.3 安装方式

#### 方式一：ClawHub 安装

```bash
openclaw skill install auto-backup-openclaw-user-data
```

#### 方式二：本地文件安装

```bash
openclaw skill install /path/to/auto-backup-openclaw-user-data.skill
```

#### 方式三：GitHub 安装

```bash
openclaw skill install https://github.com/xxx/auto-backup-openclaw-user-data
```

---

## 17. 安装与使用说明

### 17.1 安装步骤

1. 安装技能包
2. 首次使用会自动创建配置目录
3. 运行 `/backup_config` 配置备份选项
4. 备份将按配置自动执行

### 17.2 快速开始

```
# 立即执行一次备份
/backup_now

# 查看备份状态
/backup_status

# 配置备份选项
/backup_config
```

### 17.3 配置示例

```json
{
  "backup": {
    "mode": "full",
    "exclude": ["logs", "cache", "tmp"]
  },
  "schedule": {
    "enabled": true,
    "cron": "0 3 * * *"
  },
  "retention": {
    "enabled": true,
    "days": 30,
    "count": 10
  }
}
```

---

## 附录

### A. 配置字段完整说明

见：`references/config-schema.md`

### B. 故障排查指南

见：`references/troubleshooting.md`

### C. 更新日志

| 版本 | 日期 | 更新内容 |
|------|------|----------|
| v1.0.0.20260326 | 2026-03-26 | 初始版本 |

---

**文档结束**

> 本文档为开发前设计方案，确认后将按照此方案执行开发。