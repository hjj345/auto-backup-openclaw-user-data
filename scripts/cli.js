/**
 * CLI 模块
 * 命令行接口入口
 */

const fs = require('fs-extra');
const path = require('path');
const os = require('os');

const { 
  loadConfig, 
  saveConfig, 
  resetConfig, 
  getConfigPaths, 
  configExists,
  ensureConfigDir,
  updateConfig,
  BACKUPS_DIR 
} = require('./config');
const { info, warn, error, readLogs } = require('./logger');
const { BackupManager, initBackupManager, OPENCLAW_ROOT } = require('./backup');
const { Cleaner } = require('./cleaner');
const { describeCron } = require('./scheduler');

/**
 * CLI 命令处理器
 */
class CLI {
  constructor() {
    this.backupManager = null;
  }

  /**
   * 初始化
   */
  async init() {
    this.backupManager = await initBackupManager();
  }

  /**
   * 执行命令
   */
  async execute(command, args = {}) {
    // 确保初始化
    if (!this.backupManager) {
      await this.init();
    }

    switch (command) {
      case 'now':
      case 'backup_now':
        return this.cmdBackupNow(args);
      
      case 'status':
      case 'backup_status':
        return this.cmdBackupStatus();
      
      case 'config':
      case 'backup_config':
        return this.cmdBackupConfig(args);
      
      case 'list':
      case 'backup_list':
        return this.cmdBackupList(args);
      
      case 'clean':
      case 'backup_clean':
        return this.cmdBackupClean(args);
      
      case 'help':
        return this.cmdHelp();
      
      default:
        return this.outputError(`未知命令: ${command}`);
    }
  }

  /**
   * /backup_now - 立即执行备份
   */
  async cmdBackupNow(args) {
    const output = [];
    output.push('🔄 开始执行备份...');
    output.push('');
    
    try {
      const options = {
        full: args.full !== false,
        targets: args.targets
      };
      
      const result = await this.backupManager.execute(options);
      
      if (result.success) {
        output.push('✅ 备份完成！');
        output.push('');
        output.push(`📁 文件：${path.basename(result.outputPath)}`);
        output.push(`📊 文件数量：${result.filesTotal} 个`);
        output.push(`📏 大小：${this.formatSize(result.sizeBytes)}`);
        output.push(`⏱️ 耗时：${this.formatDuration(result.duration)}`);
        
        if (result.cleanResult && result.cleanResult.deleted > 0) {
          output.push(`🗑️ 清理旧备份：${result.cleanResult.deleted} 个`);
        }
      } else {
        output.push('❌ 备份失败！');
        output.push('');
        output.push(`错误：${result.errors.join('; ')}`);
      }
      
      return this.outputSuccess(output.join('\n'), result);
    } catch (err) {
      return this.outputError(`备份失败: ${err.message}`);
    }
  }

  /**
   * /backup_status - 查看备份状态
   */
  async cmdBackupStatus() {
    const output = [];
    
    try {
      const status = await this.backupManager.getStatus();
      
      output.push('📊 备份状态');
      output.push('━'.repeat(40));
      output.push('');
      
      // 调度状态
      output.push('🔄 调度状态');
      output.push(`  - 定时备份：${status.schedule.enabled ? '已启用' : '已禁用'}`);
      
      if (status.schedule.enabled) {
        output.push(`  - 执行时间：${describeCron(status.schedule.cron)}`);
        output.push(`  - 下次执行：${status.schedule.nextRun || '计算中...'}`);
      }
      
      if (status.schedule.lastRun) {
        output.push(`  - 上次执行：${new Date(status.schedule.lastRun).toLocaleString('zh-CN')}`);
      }
      
      output.push('');
      
      // 备份统计
      output.push('📦 备份统计');
      output.push(`  - 总备份数：${status.backups.count} 个`);
      output.push(`  - 总大小：${status.backups.totalSize}`);
      
      if (status.backups.newestBackup) {
        output.push(`  - 最近备份：${status.backups.newestBackup}`);
      }
      
      output.push('');
      
      // 存储位置
      output.push('📁 存储位置');
      output.push(`  ${this.backupManager.config.output.path}`);
      output.push('');
      
      // 当前配置
      output.push('⚙️ 当前配置');
      output.push(`  - 备份模式：${status.config.mode === 'full' ? '全量备份' : '选择性备份'}`);
      output.push(`  - 保留策略：${status.config.retention.mode === 'days' ? `${status.config.retention.days} 天` : `${status.config.retention.count} 份`}`);
      output.push(`  - 通知渠道：${status.config.notification.join(', ')}`);
      
      return this.outputSuccess(output.join('\n'), status);
    } catch (err) {
      return this.outputError(`获取状态失败: ${err.message}`);
    }
  }

  /**
   * /backup_config - 配置向导
   */
  async cmdBackupConfig(args) {
    const output = [];
    
    try {
      // 检查配置文件是否存在
      const exists = await configExists();
      
      if (args.mode === 'show') {
        // 显示当前配置
        const config = await loadConfig();
        output.push('📋 当前配置');
        output.push('━'.repeat(40));
        output.push('');
        output.push('```json');
        output.push(JSON.stringify(config, null, 2));
        output.push('```');
        output.push('');
        output.push(`📁 配置文件：${getConfigPaths().configFile}`);
        
        return this.outputSuccess(output.join('\n'), { config });
      }
      
      if (args.mode === 'reset') {
        // 重置配置
        await resetConfig();
        output.push('✅ 配置已重置为默认值');
        output.push(`📁 配置文件：${getConfigPaths().configFile}`);
        
        return this.outputSuccess(output.join('\n'));
      }
      
      if (args.mode === 'manual') {
        // 手动配置指引
        output.push('📝 手动修改配置文件');
        output.push('━'.repeat(40));
        output.push('');
        output.push('配置文件路径：');
        output.push(`  ${getConfigPaths().configFile}`);
        output.push('');
        output.push('操作步骤：');
        output.push('  1. 使用文本编辑器打开配置文件');
        output.push('  2. 修改需要的配置项');
        output.push('  3. 保存文件');
        output.push('  4. 运行 /backup_config 验证配置');
        output.push('');
        output.push('💡 提示：修改后运行验证确保格式正确');
        
        return this.outputSuccess(output.join('\n'));
      }
      
      if (args.mode === 'interactive' || !args.mode) {
        // 交互式配置 - 返回配置菜单
        output.push('📋 备份配置向导');
        output.push('━'.repeat(40));
        output.push('');
        output.push('请选择配置方式：');
        output.push('');
        output.push('[1] 交互式配置（推荐）');
        output.push('[2] 手动修改配置文件');
        output.push('[3] 重置为默认配置');
        output.push('[4] 查看当前配置');
        output.push('');
        output.push('请输入选项编号或具体配置项，例如：');
        output.push('  - backup_config 1  （选择交互式配置）');
        output.push('  - backup_config mode=partial  （设置备份模式）');
        output.push('  - backup_config time=03:00  （设置执行时间）');
        output.push('  - backup_config days=30  （设置保留天数）');
        
        return this.outputSuccess(output.join('\n'));
      }
      
      // 快捷配置
      if (args.mode === 'set' && args.key && args.value !== undefined) {
        const config = await loadConfig();
        
        // 根据键更新配置
        switch (args.key) {
          case 'mode':
            config.backup.mode = args.value;
            break;
          case 'time':
            const [hour, minute] = args.value.split(':').map(Number);
            config.schedule.cron = `${minute || 0} ${hour || 3} * * *`;
            break;
          case 'days':
            config.retention.mode = 'days';
            config.retention.days = parseInt(args.value);
            break;
          case 'count':
            config.retention.mode = 'count';
            config.retention.count = parseInt(args.value);
            break;
          default:
            return this.outputError(`未知的配置项: ${args.key}`);
        }
        
        await saveConfig(config);
        output.push(`✅ 已更新配置：${args.key} = ${args.value}`);
        
        return this.outputSuccess(output.join('\n'), { config });
      }
      
      // 选项式配置
      if (args.option) {
        switch (args.option) {
          case '1':
            // 交互式配置的详细步骤
            return this.interactiveConfig();
          
          case '2':
            return this.cmdBackupConfig({ mode: 'manual' });
          
          case '3':
            return this.cmdBackupConfig({ mode: 'reset' });
          
          case '4':
            return this.cmdBackupConfig({ mode: 'show' });
          
          default:
            return this.outputError(`无效的选项: ${args.option}`);
        }
      }
      
    } catch (err) {
      return this.outputError(`配置失败: ${err.message}`);
    }
  }

  /**
   * 交互式配置
   */
  async interactiveConfig() {
    const output = [];
    
    output.push('📋 交互式配置向导');
    output.push('━'.repeat(40));
    output.push('');
    output.push('Step 1/5: 备份范围');
    output.push('  [1] 全量备份 .openclaw');
    output.push('  [2] 选择性备份');
    output.push('');
    output.push('请回复选项编号继续配置：');
    
    // 注意：这是一个交互式的开始，需要用户响应后继续
    // 实际实现中，这里会保存状态并等待用户下一步输入
    
    return this.outputSuccess(output.join('\n'), { 
      step: 1, 
      total: 5,
      type: 'interactive' 
    });
  }

  /**
   * /backup_list - 列出备份文件
   */
  async cmdBackupList(args) {
    const output = [];
    
    try {
      const config = await loadConfig();
      const cleaner = new Cleaner(config);
      const stats = await cleaner.getStats();
      
      output.push('📦 备份文件列表');
      output.push('━'.repeat(60));
      output.push('');
      
      if (stats.count === 0) {
        output.push('暂无备份文件');
        output.push('');
        output.push(`📁 存储目录：${config.output.path}`);
        
        return this.outputSuccess(output.join('\n'), stats);
      }
      
      output.push('#    文件名                                          大小');
      output.push('─'.repeat(60));
      
      const files = args.all ? stats.files : stats.files.slice(0, 10);
      
      files.forEach((file, index) => {
        const num = String(index + 1).padStart(2, '0');
        const name = file.name.length > 40 ? file.name.substring(0, 37) + '...' : file.name;
        output.push(`${num}   ${name.padEnd(45)} ${file.size}`);
      });
      
      output.push('');
      output.push(`共 ${stats.count} 个备份文件，总计 ${stats.totalSize}`);
      
      if (stats.count > 10 && !args.all) {
        output.push('');
        output.push('💡 使用 --all 查看全部备份文件');
      }
      
      return this.outputSuccess(output.join('\n'), stats);
    } catch (err) {
      return this.outputError(`获取备份列表失败: ${err.message}`);
    }
  }

  /**
   * /backup_clean - 清理旧备份
   */
  async cmdBackupClean(args) {
    const output = [];
    
    try {
      const config = await loadConfig();
      const cleaner = new Cleaner(config);
      
      // 预览模式
      if (args.preview || args.dryRun) {
        const preview = await cleaner.getPreview();
        
        output.push('🗑️ 清理预览');
        output.push('━'.repeat(40));
        output.push('');
        output.push(`当前备份数：${preview.total} 个`);
        output.push(`将要删除：${preview.toDeleteCount} 个`);
        output.push(`将会保留：${preview.toKeepCount} 个`);
        
        if (preview.toDeleteCount > 0) {
          output.push('');
          output.push('将要删除的文件：');
          preview.toDeleteFiles.slice(0, 5).forEach(f => {
            output.push(`  - ${f.name} (${f.size})`);
          });
          if (preview.toDeleteFiles.length > 5) {
            output.push(`  ... 还有 ${preview.toDeleteFiles.length - 5} 个`);
          }
        }
        
        output.push('');
        output.push('💡 使用 --confirm 执行实际清理');
        
        return this.outputSuccess(output.join('\n'), preview);
      }
      
      // 执行清理
      const result = await cleaner.execute();
      
      if (result.skipped) {
        output.push('⚠️ 保留策略未启用');
        output.push('请在配置中启用 retention.enabled');
      } else {
        output.push('🗑️ 清理完成');
        output.push('━'.repeat(40));
        output.push('');
        output.push(`✅ 删除：${result.deleted} 个`);
        output.push(`📁 保留：${result.kept} 个`);
      }
      
      return this.outputSuccess(output.join('\n'), result);
    } catch (err) {
      return this.outputError(`清理失败: ${err.message}`);
    }
  }

  /**
   * /help - 帮助
   */
  async cmdHelp() {
    const output = [];
    
    output.push('📖 Auto Backup OpenClaw User Data - 命令帮助');
    output.push('━'.repeat(50));
    output.push('');
    output.push('可用命令：');
    output.push('');
    output.push('/backup_now         立即执行备份');
    output.push('  --full            全量备份（默认）');
    output.push('  --partial         选择性备份');
    output.push('');
    output.push('/backup_status      查看备份状态');
    output.push('');
    output.push('/backup_config      配置向导');
    output.push('  [1]               交互式配置');
    output.push('  [2]               手动配置');
    output.push('  [3]               重置配置');
    output.push('  [4]               查看配置');
    output.push('');
    output.push('/backup_list        列出备份文件');
    output.push('  --all             显示全部');
    output.push('');
    output.push('/backup_clean       清理旧备份');
    output.push('  --preview         预览模式');
    output.push('  --confirm         确认执行');
    output.push('');
    output.push('📁 配置文件：~/.openclaw/workspace/Auto-Backup-Openclaw-User-Data/config.json');
    output.push('📋 日志文件：~/.openclaw/workspace/Auto-Backup-Openclaw-User-Data/backup.log');
    
    return this.outputSuccess(output.join('\n'));
  }

  /**
   * 格式化成功输出
   */
  outputSuccess(message, data = null) {
    return {
      success: true,
      message,
      data
    };
  }

  /**
   * 格式化错误输出
   */
  outputError(message) {
    return {
      success: false,
      message,
      error: message
    };
  }

  /**
   * 格式化文件大小
   */
  formatSize(bytes) {
    if (!bytes || bytes === 0) return '0 B';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  }

  /**
   * 格式化执行时长
   */
  formatDuration(ms) {
    if (!ms) return '0ms';
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)} 秒`;
    return `${Math.floor(ms / 60000)} 分 ${Math.floor((ms % 60000) / 1000)} 秒`;
  }
}

/**
 * 创建 CLI 实例并执行命令
 */
async function runCommand(command, args = {}) {
  const cli = new CLI();
  return cli.execute(command, args);
}

module.exports = {
  CLI,
  runCommand
};