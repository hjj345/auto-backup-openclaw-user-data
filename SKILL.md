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

## 版本

- **当前版本**：v1.0.1.20260326
- **更新日期**：2026-03-26

## 功能

- **自动备份**：定时备份 `.openclaw` 目录
- **选择性备份**：支持全量或部分备份
- **ZIP 压缩**：自动压缩并按规则命名
- **定时调度**：支持自定义执行时间
- **日志记录**：完整记录执行过程
- **消息通知**：支持多渠道推送结果（需配置推送目标）
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

### 消息通知配置

```json
{
  "notification": {
    "enabled": true,
    "channels": ["feishu", "telegram"],
    "targets": {
      "feishu": [
        { "type": "group", "id": "oc_xxx", "name": "技术开发中心" },
        { "type": "user", "id": "ou_xxx", "name": "用户名" }
      ],
      "telegram": [
        { "type": "group", "id": "-100xxx", "name": "通知群" }
      ]
    },
    "onSuccess": true,
    "onFailure": true
  }
}
```

**注意**：消息通知需要在 OpenClaw 中先配置对应的通信渠道，详见 `references/config-schema.md`。

详细配置说明：见 [references/config-schema.md](references/config-schema.md)

## 故障排查

常见问题：见 [references/troubleshooting.md](references/troubleshooting.md)

## 更新日志

### v1.0.1.20260326 (2026-03-26)

- 新增：消息推送目标配置功能
- 新增：读取 OpenClaw 配置自动获取可用推送目标
- 新增：推送失败时通过当前对话提醒用户
- 优化：`/backup_list` 只显示本 skill 产生的备份文件
- 优化：交互式配置增加推送目标选择步骤

### v1.0.0.20260326 (2026-03-26)

- 初始版本发布