---
name: auto-backup-openclaw-user-data
description: |
  OpenClaw 用户数据自动备份技能。支持全量/选择性备份、定时执行、ZIP 压缩、日志记录、消息通知和保留策略管理。
  
  **触发场景**：
  (1) 用户要求备份 OpenClaw 数据
  (2) 用户要求设置定时备份
  (3) 用户询问备份配置、状态、日志
  (4) 用户执行 /backup_now、/backup_status、/backup_config、/backup_list、/backup_clean 等命令
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

用户：列出所有备份文件
助手：[执行 /backup_list]

用户：清理旧备份
助手：[执行 /backup_clean]
```

## 执行流程

### /backup_now

1. 检查是否有正在进行的备份
2. 读取配置
3. 收集待备份文件
4. 执行 ZIP 压缩
5. 生成符合命名规则的文件名
6. 移动到指定存储目录
7. 执行保留策略清理
8. 记录日志
9. 发送通知

### /backup_config

1. 检查配置文件是否存在，不存在则创建默认配置
2. 显示配置菜单：
   - [1] 交互式配置
   - [2] 手动修改配置文件
   - [3] 重置为默认配置
3. 根据用户选择执行相应操作

### HEARTBEAT 定时检查

当 HEARTBEAT 触发时，检查是否到达备份时间，如到达则自动执行备份。

## 文件结构

```
~/.openclaw/workspace/Auto-Backup-Openclaw-User-Data/
├── config.json       # 用户配置
├── backup.log        # 备份日志
└── backups/          # 备份文件存储
    └── auto-backup-openclaw-user-data_YYYYMMDD_HHMM_vX.X.X_XX.zip
```