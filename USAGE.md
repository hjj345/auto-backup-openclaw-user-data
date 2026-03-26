# 使用说明文档

> Auto-Backup-Openclaw-User-Data 技能使用指南

---

## 目录

1. [简介](#简介)
2. [安装](#安装)
3. [使用方法](#使用方法)
4. [命令说明](#命令说明)
5. [配置说明](#配置说明)
6. [常见问题](#常见问题)

---

## 简介

本技能用于自动备份 OpenClaw 用户数据目录，支持：

- 自动备份 `.openclaw` 目录（全量或选择性备份）
- 自动压缩为 ZIP 文件并按规则命名
- 支持定时自动执行
- 提供完整的日志记录和消息通知
- 支持备份文件保留策略管理

---

## 安装

### 方法一：通过 .zip 文件安装

```bash
openclaw skill install /path/to/auto-backup-openclaw-user-data.zip
```

### 方法二：通过目录安装

```bash
openclaw skill install /path/to/auto-backup-openclaw-user-data
```

### 方法三：通过 ClawHub 安装

```bash
openclaw skill install auto-backup-openclaw-user-data
```

---

## 使用方法

### 命令行交互方式

本技能通过 **OpenClaw 对话窗口** 使用命令，支持以下渠道：

| 渠道 | 使用方式 |
|------|----------|
| 飞书 | 在飞书群或私聊中直接发送命令 |
| Telegram | 在 Telegram 对话中发送命令 |
| Discord | 在 Discord 频道中发送命令 |
| 终端 | 在 OpenClaw 终端中输入命令 |

### 命令格式

```
/backup_<命令> [参数]
```

**示例**：
```
/backup_now
/backup_status
/backup_config 1
```

---

## 命令说明

### 1. /backup_now - 立即备份

**功能**：立即执行一次备份

**用法**：
```
/backup_now           # 全量备份（默认）
/backup_now --full    # 全量备份
```

**输出示例**：
```
开始执行备份...

备份完成！

文件：auto-backup-openclaw-user-data_20260326_1530_v2026.3.23-2_01.zip
文件数量：1234 个
大小：125.6 MB
耗时：15.5 秒
```

---

### 2. /backup_status - 查看状态

**功能**：查看备份状态和统计信息

**用法**：
```
/backup_status
```

**输出示例**：
```
备份状态
----------------------------------------

调度状态
  - 定时备份：已启用
  - 执行时间：每天凌晨 3:00
  - 下次执行：2026-03-27 03:00

备份统计
  - 总备份数：15 个
  - 总大小：1.8 GB
  - 最近备份：2026-03-26 03:00

存储位置
  ~/.openclaw/workspace/Auto-Backup-Openclaw-User-Data/backups

当前配置
  - 备份模式：全量备份
  - 保留策略：10 份
  - 通知渠道：feishu
```

---

### 3. /backup_config - 配置向导

**功能**：配置备份选项

**用法**：
```
/backup_config        # 显示配置菜单
/backup_config 1      # 交互式配置
/backup_config 2      # 手动配置说明
/backup_config 3      # 重置为默认配置
/backup_config 4      # 查看当前配置
```

**配置菜单**：
```
备份配置向导
----------------------------------------

[1] 交互式配置（推荐）
[2] 手动修改配置文件
[3] 重置为默认配置
[4] 查看当前配置
```

**快捷配置**：
```
/backup_config mode=partial    # 设置为选择性备份
/backup_config time=03:00      # 设置执行时间为凌晨3点
/backup_config days=30         # 设置保留30天
/backup_config count=10        # 设置保留10份
```

---

### 4. /backup_list - 列出备份

**功能**：列出所有备份文件

**用法**：
```
/backup_list          # 显示最近10个
/backup_list --all    # 显示全部
```

**输出示例**：
```
备份文件列表
--------------------------------------------------------------

#    文件名                                    大小
--------------------------------------------------------------
01   auto-backup-..._20260326_0300_...zip     125 MB
02   auto-backup-..._20260325_0300_...zip     124 MB
03   auto-backup-..._20260324_0300_...zip     123 MB

共 15 个备份文件，总计 1.8 GB
```

---

### 5. /backup_clean - 清理旧备份

**功能**：清理超出保留策略的旧备份

**用法**：
```
/backup_clean           # 执行清理
/backup_clean --preview # 预览模式（不实际删除）
```

**预览输出**：
```
清理预览
----------------------------------------

当前备份数：15 个
将要删除：5 个
将会保留：10 个

将要删除的文件：
  - auto-backup-..._20260301_0300_...zip (125 MB)
  - auto-backup-..._20260302_0300_...zip (124 MB)
  ...

使用 --confirm 执行实际清理
```

---

## 配置说明

### 配置文件位置

```
~/.openclaw/workspace/Auto-Backup-Openclaw-User-Data/config.json
```

### 主要配置项

| 配置项 | 说明 | 默认值 |
|--------|------|--------|
| `backup.mode` | 备份模式：`full`（全量）或 `partial`（选择性） | `full` |
| `schedule.cron` | 定时执行时间（cron表达式） | `0 3 * * *` |
| `retention.count` | 保留备份数量 | `10` |
| `notification.channels` | 通知渠道 | `["feishu"]` |

### Cron 表达式示例

| 表达式 | 说明 |
|--------|------|
| `0 3 * * *` | 每天凌晨 3:00 |
| `0 4 * * *` | 每天凌晨 4:00 |
| `0 3 * * 0` | 每周日凌晨 3:00 |
| `0 3 1 * *` | 每月1日凌晨 3:00 |

---

## 常见问题

### Q: 如何修改备份时间？

```
/backup_config
选择 [1] 交互式配置
按提示修改备份时间
```

### Q: 备份文件保存在哪里？

默认保存在：
```
~/.openclaw/workspace/Auto-Backup-Openclaw-User-Data/backups/
```

可通过配置修改存储路径。

### Q: 如何查看备份日志？

日志文件位置：
```
~/.openclaw/workspace/Auto-Backup-Openclaw-User-Data/backup.log
```

### Q: 定时备份没有执行？

1. 检查定时是否启用：`/backup_status`
2. 检查 HEARTBEAT 配置是否正确
3. 查看日志了解详情

### Q: 如何关闭通知？

修改配置文件：
```json
"notification": {
  "enabled": false
}
```

---

## 文件说明

```
~/.openclaw/workspace/Auto-Backup-Openclaw-User-Data/
├── config.json     # 配置文件
├── backup.log      # 日志文件
└── backups/        # 备份存储目录
```

---

## 技术支持

- **作者**：Jack·Huang
- **邮箱**：jack698698@gmail.com
- **版本**：1.0.0.20260326

---

**文档版本**：v1.0.0.20260326  
**更新日期**：2026-03-26