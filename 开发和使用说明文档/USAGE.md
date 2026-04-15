# 使用说明文档

> Auto-Backup-Openclaw-User-Data 技能使用指南

---

## 目录

1. [简介](#简介)
2. [工作空间自动检测](#工作空间自动检测)
3. [安装](#安装)
4. [使用方法](#使用方法)
5. [命令说明](#命令说明)
6. [交互式配置](#交互式配置)
7. [定时任务配置](#定时任务配置)
8. [安全警告](#安全警告)
9. [配置说明](#配置说明)
10. [ZIP加密功能](#zip加密功能)
11. [消息通知配置](#消息通知配置)
12. [常见问题](#常见问题)

---

## 简介

本技能用于自动备份 OpenClaw 用户数据目录，支持：

- 自动备份 `.openclaw` 目录（全量或选择性备份）
- 自动压缩为 ZIP 文件并按规则命名
- 支持定时自动执行
- 提供完整的日志记录和消息通知
- 支持备份文件保留策略管理

---

## 工作空间自动检测

### 首次配置自动检测

首次使用本技能时，系统会自动检测您的OpenClaw工作空间：

**检测机制**：
- 自动扫描 `~/.openclaw/` 目录
- 识别所有 `workspace-*` 目录
- 检测 `memory` 目录
- 将检测结果写入配置文件作为默认值

**示例检测结果**：
```json
{
  "backup": {
    "targets": ["workspace", "workspace-01", "workspace-02", "workspace-news", "memory"]
  }
}
```

### 建议

首次配置建议使用交互式配置：
```
/backup_config
选择 [1] 交互式配置
```

交互式配置会列出实际存在的workspace，供您确认和调整。

### 手动调整

如需调整备份的工作空间，可：

1. **交互式配置**：Step 1.1文件选择步骤
2. **手动修改配置文件**：编辑 `config.json` 中的 `backup.targets`

```json
{
  "backup": {
    "targets": ["workspace", "workspace-01", "memory"]
  }
}
```

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
  - 通知渠道：feishu(2个目标)
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

#### 交互式配置步骤（7步）

**Step 1/7: 备份范围**
```
[1] 全量备份 .openclaw
[2] 选择性备份

请回复选项编号：
```

**如果选择"选择性备份"（Step 1/7 - Step 1.2/7）**：

系统会列出 `~/.openclaw/` 目录下的文件和文件夹：
```
Step 1/7: 选择备份文件
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 文件列表（目录 + 文件）：

📁 文件夹：
  [1] [ ] 📁 workspace
  [2] [ ] 📁 workspace-1
  [3] [ ] 📁 workspace-2
  [4] [ ] 📁 workspace-3

📄 文件：
  [5] [ ] 📄 openclaw.json
  [6] [ ] 📄 openclaw.json.bak

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 选择说明：
  选择样式：输入编号，用空格分隔，如：1 3 5 7
  示例：选择第 1、3、5 项 → 输入 1 3 5

请输入要备份的文件/文件夹编号：1 2 3 4
```

用户选择后，进入确认界面：
```
Step 1/7: 确认选择
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

您已选择以下文件/文件夹：

  [√] 📁 workspace
  [√] 📁 workspace-news
  [√] 📁 workspace-hr
  [√] 📁 workspace-tech

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

共选择 4 项

请确认选择：
  [1] 确认，继续配置
  [2] 取消，重新选择

请回复 1 或 2：
```

**Step 2/7: 备份时间**
```
当前设置: 每天凌晨 3:00

是否修改执行时间？
  [y] 是，修改时间
  [n] 否，保持默认

请回复 y 或 n：
```

如果选择 y，则：
```
请输入执行时间（格式：HH:MM，如 03:00）：
```

**Step 3/7: 存储路径**
```
当前设置: ~/.openclaw/workspace/Auto-Backup-Openclaw-User-Data/backups

是否修改存储路径？
  [y] 是，修改路径
  [n] 否，保持默认

请回复 y 或 n：
```

**Step 4/7: 保留策略**
```
请选择清理模式：

[1] 按天数保留
    保留最近 N 天的备份（默认 30 天）

[2] 按份数保留
    保留最近 N 份备份（默认 10 份）

请回复选项编号：
```

**Step 5/7: 通知渠道**
```
正在检测 OpenClaw 已配置的渠道...

✅ 已检测到可用渠道：

  [1] feishu - 飞书
  [2] telegram - Telegram
  [3] discord - Discord

请选择要启用的通知渠道（输入编号，可多选，如：1 2）：
```

**Step 6/7: 配置推送目标**

对于每个选择的渠道，会显示可用的推送目标：

```
配置 飞书 推送目标
----------------------------------------

飞书 推送目标列表：

  [1] 📢 客户部（群组）
  [2] 📢 通知群（群组）
  [3] 👤 主人（用户）

请选择推送目标（输入编号，可多选，如：1 2 3）：
```

**完成配置**：
```
✅ 配置完成！
----------------------------------------

备份范围: 选择性备份

已选项目标：
  - workspace
  - workspace-1
  - workspace-2
  - workspace-3

执行时间: 每天 03:00
保留策略: 10 份
通知渠道: 飞书

📁 配置文件: ~/.openclaw/workspace/Auto-Backup-Openclaw-User-Data/config.json

💡 可用命令:
  /backup_now     - 立即执行备份
  /backup_status  - 查看备份状态
  /backup_list    - 列出备份文件
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

## 定时任务配置

本 skill 支持两种定时执行方式，请根据实际需求选择：

### 方式对比

| 特性 | HEARTBEAT 心跳 | Cron 定时任务 |
|------|---------------|---------------|
| 定时精度 | 约 30 分钟漂移 | 精确到分钟 |
| 运行上下文 | 主会话（共享） | 隔离会话 |
| 配置复杂度 | 较简单 | 需 CLI 配置 |
| 推送控制 | 需手动实现 | 内置支持 |
| 适用场景 | 周期性监控检查 | 精确时间执行 |

### 方式一：HEARTBEAT 心跳（推荐新手）

适用于周期性监控检查，不要求精确执行时间。

**配置步骤**：

1. 查看项目根目录中的 `HEARTBEAT_prompt_example.md` 文件
2. 根据模板内容，修改你的 Agent 工作区的 `HEARTBEAT.md` 文件
3. 修改模板中的配置变量（备份时间、skill 路径、推送目标等）
4. 确保 Gateway 正在运行：`openclaw gateway start`

**详细说明**：见 [HEARTBEAT_prompt_example.md](HEARTBEAT_prompt_example.md)

### 方式二：Cron 定时任务（推荐高级用户）

适用于需要精确时间执行的场景（如每天凌晨 3:20）。

**配置步骤**：

1. 查看项目根目录中的 `cron_prompt_example.md` 文件
2. 准备配置信息：
   - skill 脚本目录路径
   - 飞书群组 ID（格式：`oc_xxx`）
   - Telegram Bot Token 和 Chat ID
3. 编辑 `~/.openclaw/cron/jobs.json` 或使用 CLI 命令：
   ```bash
   openclaw cron add --name "每日备份" --cron "20 3 * * *" ...
   ```
4. 重启 Gateway：`openclaw gateway restart`

**详细说明**：见 [cron_prompt_example.md](cron_prompt_example.md)

---

## ⚠️ 安全警告

### 敏感文件风险

备份可能包含以下敏感文件（默认不强制排除）：

- **密钥文件**：*.key, *.pem, *.p12, *.pfx
- **环境变量**：.env, .env.local, .env.*.local
- **凭证文件**：credentials.json, secrets.json
- **Token文件**：*.token, *.secret, *_token.json
- **SSH密钥**：id_rsa, id_dsa, *.ppk

### 默认行为

系统默认**不启用**敏感文件排除，仅排除临时文件：
- 排除目录：logs, cache, tmp, node_modules
- 排除模式：*.log, *.tmp, .DS_Store, Thumbs.db

### 如何启用敏感文件排除

通过交互式配置启用：
```
/backup_config
选择 [1] 交互式配置
Step 7: 敏感文件排除配置
选择 [1] 启用排除
```

或手动编辑配置文件：
```json
{
  "backup": {
    "exclude": ["logs", "cache", "*.key", ".ssh"],
    "excludePatterns": ["*.pem", ".env", "credentials.json"]
  }
}
```

### 建议

根据实际需求决定是否启用敏感文件排除：
- ✅ **启用**：保护敏感数据，防止备份泄露
- ⚠️ **不启用**：完整备份所有数据，需妥善保管备份文件

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
| `notification.targets` | 推送目标配置 | `{}` |

### Cron 表达式示例

| 表达式 | 说明 |
|--------|------|
| `0 3 * * *` | 每天凌晨 3:00 |
| `0 4 * * *` | 每天凌晨 4:00 |
| `0 3 * * 0` | 每周日凌晨 3:00 |
| `0 3 1 * *` | 每月1日凌晨 3:00 |

---

## ZIP加密功能

### 加密说明

本技能支持AES-256加密，保护备份文件安全性。

### 启用加密

通过交互式配置启用：
```
/backup_config
选择 [1] 交互式配置
Step 8: ZIP加密配置
选择 [1] 启用加密
```

### 密码管理

**密码存储**：存储在config.json配置文件中

**密码设置方式**：
1. **自定义密码**：用户输入密码（至少8位）
2. **随机密码**：系统生成16位随机密码

### 解密兼容性

✅ **支持工具**：
- 7-Zip（Windows/Linux）
- WinRAR（Windows/macOS）
- PeaZip（全平台）

❌ **不支持工具**：
- macOS Finder原生解压
- Windows资源管理器原生解压
- Linux unzip命令（部分版本）

### 解密方法

**Windows**：
```
右键文件 → 7-Zip → 解压 → 输入密码
```

**macOS**：
```
打开WinRAR或7-Zip → 选择文件 → 解压 → 输入密码
```

**Linux**：
```bash
7z x backup.zip -p密码
```

### ⚠️ 重要风险

1. **密码丢失风险**：密码丢失将无法解密备份文件
2. **配置文件风险**：config.json损坏或丢失将无法找回密码
3. **建议**：将密码备份到密码管理器或其他安全位置

---

## 消息通知配置

### 配置结构

消息通知配置包含以下字段：

```json
{
  "notification": {
    "enabled": true,
    "channels": ["feishu", "telegram"],
    "targets": {
      "feishu": [
        { "type": "group", "id": "oc_xxx", "name": "开发群" },
        { "type": "user", "id": "ou_xxx", "name": "主人" }
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

### 字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| `enabled` | boolean | 是否启用通知 |
| `channels` | array | 通知渠道列表（feishu/telegram/discord/slack） |
| `targets` | object | 每个渠道的具体推送目标 |
| `onSuccess` | boolean | 备份成功时是否发送通知 |
| `onFailure` | boolean | 备份失败时是否发送通知 |

### 推送目标字段

每个推送目标包含：

| 字段 | 类型 | 说明 |
|------|------|------|
| `type` | string | `group`（群组）或 `user`（用户） |
| `id` | string | 目标 ID |
| `name` | string | 目标名称（用于显示，可选） |

### 如何获取推送目标 ID

#### 飞书

**群组 ID**：
1. 在飞书群聊中，点击群设置
2. 查看群信息，找到群 ID（格式：`oc_xxx`）

**用户 ID**：
1. 在飞书中查看用户资料
2. 找到 Open ID（格式：`ou_xxx`）

#### Telegram

**群组 ID**：
1. 将 @userinfobot 添加到群组
2. 它会返回群组 ID（格式：`-100xxx`）

### 推送目标来源

交互式配置中的推送目标来自 OpenClaw 配置文件：

```
~/.openclaw/openclaw.json
```

系统会自动读取 `bindings` 配置中的群组和用户信息。

### 通知行为说明

| 场景 | 行为 |
|------|------|
| 已配置 `targets` | 向指定的用户/群组发送通知 |
| 未配置 `targets` | 尝试通过当前对话发送通知 |
| 推送失败 | 通过当前对话提醒用户 |

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

### Q: 没有收到通知？

1. 检查通知是否启用：`/backup_status`
2. 检查 OpenClaw 是否配置了对应渠道
3. 运行 `/backup_config` 重新配置推送目标

### Q: 如何关闭通知？

修改配置文件：
```json
"notification": {
  "enabled": false
}
```

或运行 `/backup_config`，在通知渠道步骤不选择任何渠道。

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

- **作者**：水木开发团队-Jack·Huang
- **邮箱**：jack698698@gmail.com
- **版本**：1.1.0.20260414

---

**文档版本**：v1.1.0.20260414
**更新日期**：2026-04-14
**作者**：水木开发团队-Jack·Huang