# Auto-Backup-Openclaw-User-Data

> OpenClaw 用户数据自动备份技能

[![Version](https://img.shields.io/badge/version-1.0.0.20260326-blue.svg)](https://github.com/yourusername/auto-backup-openclaw-user-data)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![OpenClaw](https://img.shields.io/badge/OpenClaw-v2026.3.1+-purple.svg)](https://openclaw.ai)

---

## 简介

`Auto-Backup-Openclaw-User-Data` 是一个专为 OpenClaw 设计的自动备份技能，能够自动备份用户数据目录，支持全量/选择性备份、定时执行、ZIP 压缩、日志记录、消息通知和保留策略管理。

## 功能特性

- ✅ **自动备份** - 定时备份 `.openclaw` 目录
- ✅ **选择性备份** - 支持全量或部分备份
- ✅ **ZIP 压缩** - 自动压缩并按规则命名
- ✅ **日志记录** - 完整记录执行过程
- ✅ **消息通知** - 支持多渠道推送结果
- ✅ **保留策略** - 自动清理旧备份
- ✅ **跨平台** - Windows / Linux / macOS 全支持

## 安装

### 方式一：ClawHub 安装

```bash
openclaw skill install auto-backup-openclaw-user-data
```

### 方式二：本地文件安装

```bash
openclaw skill install /path/to/auto-backup-openclaw-user-data.skill
```

### 方式三：GitHub 安装

```bash
openclaw skill install https://github.com/yourusername/auto-backup-openclaw-user-data
```

## 快速开始

### 立即执行备份

```
/backup_now
```

### 查看备份状态

```
/backup_status
```

### 配置备份选项

```
/backup_config
```

### 列出备份文件

```
/backup_list
```

### 清理旧备份

```
/backup_clean
```

## 命令说明

| 命令 | 功能 | 参数 |
|------|------|------|
| `/backup_now` | 立即执行备份 | `--full`, `--partial` |
| `/backup_status` | 查看备份状态 | - |
| `/backup_config` | 配置向导 | `[1-4]` |
| `/backup_list` | 列出备份文件 | `--all` |
| `/backup_clean` | 清理旧备份 | `--preview`, `--confirm` |

## 配置

配置文件位置：`~/.openclaw/workspace/Auto-Backup-Openclaw-User-Data/config.json`

### 默认配置

```json
{
  "backup": {
    "mode": "full",
    "exclude": ["logs", "cache", "tmp", "node_modules"]
  },
  "schedule": {
    "enabled": true,
    "cron": "0 3 * * *"
  },
  "retention": {
    "enabled": true,
    "mode": "count",
    "count": 10
  },
  "notification": {
    "enabled": true,
    "channels": ["feishu"]
  }
}
```

详细配置说明请参考 [references/config-schema.md](references/config-schema.md)

## 文件结构

```
~/.openclaw/workspace/Auto-Backup-Openclaw-User-Data/
├── config.json       # 用户配置
├── backup.log        # 备份日志
└── backups/          # 备份文件存储
    └── auto-backup-openclaw-user-data_YYYYMMDD_HHMM_vX.X.X_XX.zip
```

## ZIP 文件命名规则

```
auto-backup-openclaw-user-data_{YYYYMMDD}_{HHMM}_{version}_{序号}.zip

示例：
auto-backup-openclaw-user-data_20260326_0300_v2026.3.23-2_01.zip
```

## 故障排查

遇到问题？请参考 [references/troubleshooting.md](references/troubleshooting.md)

## 技术架构

```
auto-backup-openclaw-user-data/
├── SKILL.md              # 技能说明
├── scripts/
│   ├── backup.js         # 主备份逻辑
│   ├── compressor.js     # ZIP 压缩
│   ├── scheduler.js      # 定时调度
│   ├── cleaner.js        # 清理策略
│   ├── notifier.js       # 消息通知
│   ├── config.js         # 配置管理
│   ├── logger.js         # 日志记录
│   └── cli.js            # CLI 入口
├── references/
│   ├── config-schema.md  # 配置说明
│   └── troubleshooting.md # 故障排查
└── templates/
    └── config.template.json
```

## 依赖

- Node.js >= 18.0.0
- archiver ^6.0.0
- fs-extra ^11.0.0
- dayjs ^1.11.0

## 开发

```bash
# 克隆仓库
git clone https://github.com/yourusername/auto-backup-openclaw-user-data.git

# 安装依赖
cd auto-backup-openclaw-user-data
npm install

# 测试
npm test
```

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

[MIT License](LICENSE)

## 作者

- **Jack·Huang**
- Email: jack698698@gmail.com

## 更新日志

### v1.0.0.20260326 (2026-03-26)

- 初始版本发布
- 支持全量/选择性备份
- 支持定时执行
- 支持 ZIP 压缩和自动命名
- 支持日志记录
- 支持消息通知
- 支持保留策略管理

---

**Made with ❤️ for OpenClaw**