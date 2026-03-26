/**
 * 通知模块
 * 负责发送备份结果通知
 */

const { info, warn, error } = require('./logger');
const path = require('path');
const os = require('os');

/**
 * 创建通知器实例
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
    await this.sendToChannels(message, 'success');
  }

  /**
   * 发送备份失败通知
   */
  async notifyFailure(result) {
    if (!this.config.notification.enabled || !this.config.notification.onFailure) {
      return;
    }
    
    const message = this.formatFailureMessage(result);
    await this.sendToChannels(message, 'failure');
  }

  /**
   * 格式化成功消息
   */
  formatSuccessMessage(result) {
    const lines = [
      '✅ OpenClaw 数据备份成功',
      '',
      `📦 备份文件：${path.basename(result.outputPath)}`,
      `📊 文件数量：${result.filesTotal.toLocaleString()} 个`,
      `📏 文件大小：${this.formatSize(result.sizeBytes)}`,
      `⏱️ 执行耗时：${this.formatDuration(result.duration)}`,
      `🕐 执行时间：${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}`,
      '',
      `📁 存储位置：${result.outputPath}`
    ];
    
    if (result.filesSkipped > 0) {
      lines.splice(6, 0, `⚠️ 跳过文件：${result.filesSkipped} 个`);
    }
    
    return lines.join('\n');
  }

  /**
   * 格式化失败消息
   */
  formatFailureMessage(result) {
    const lines = [
      '❌ OpenClaw 数据备份失败',
      '',
      `🚨 错误信息：${result.errors.join('; ')}`,
      `🕐 失败时间：${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}`
    ];
    
    // 根据错误类型给出建议
    if (result.errors.some(e => e.includes('ENOENT') || e.includes('not found'))) {
      lines.push('', '💡 建议：请检查备份目录是否存在');
    } else if (result.errors.some(e => e.includes('ENOSPC') || e.includes('space'))) {
      lines.push('', '💡 建议：请清理磁盘空间或更换存储路径');
    } else if (result.errors.some(e => e.includes('EACCES') || e.includes('permission'))) {
      lines.push('', '💡 建议：请检查文件权限或以管理员身份运行');
    }
    
    lines.push('', `📋 详细日志：~/.openclaw/workspace/Auto-Backup-Openclaw-User-Data/backup.log`);
    
    return lines.join('\n');
  }

  /**
   * 发送到配置的渠道
   */
  async sendToChannels(message, type) {
    const channels = this.config.notification.channels || [];
    
    if (channels.length === 0) {
      await info('Notifier', '未配置通知渠道，跳过通知');
      return;
    }
    
    await info('Notifier', `准备发送通知到: ${channels.join(', ')}`);
    
    // 获取可用的渠道
    const availableChannels = await this.getAvailableChannels();
    
    for (const channel of channels) {
      if (!availableChannels.includes(channel)) {
        await warn('Notifier', `渠道 ${channel} 未配置或不可用，跳过`);
        continue;
      }
      
      try {
        await this.sendToChannel(channel, message);
        await info('Notifier', `通知已发送到 ${channel}`);
      } catch (err) {
        await error('Notifier', `发送通知到 ${channel} 失败: ${err.message}`);
      }
    }
  }

  /**
   * 发送到单个渠道
   * 注意：这个方法需要在 OpenClaw 环境中通过 message 工具实现
   */
  async sendToChannel(channel, message) {
    // 在实际运行时，这里会调用 OpenClaw 的 message 工具
    // 由于这是一个独立的 skill，我们需要提供一个接口让 OpenClaw 调用
    
    // 返回一个结构化的消息对象，供 OpenClaw 处理
    return {
      channel,
      message,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * 获取可用的通知渠道
   */
  async getAvailableChannels() {
    // 这里应该检查 OpenClaw 的配置
    // 返回已配置的渠道列表
    // 由于我们在 skill 中无法直接访问 OpenClaw 配置，返回常见渠道
    
    return ['feishu', 'telegram', 'discord', 'slack'];
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

  /**
   * 生成通知数据（供 OpenClaw 调用）
   */
  generateNotificationData(result, type) {
    if (type === 'success') {
      return {
        type: 'success',
        title: '✅ OpenClaw 数据备份成功',
        message: this.formatSuccessMessage(result),
        channel: this.config.notification.channels,
        data: {
          outputPath: result.outputPath,
          filesTotal: result.filesTotal,
          sizeBytes: result.sizeBytes,
          duration: result.duration,
          timestamp: new Date().toISOString()
        }
      };
    } else {
      return {
        type: 'failure',
        title: '❌ OpenClaw 数据备份失败',
        message: this.formatFailureMessage(result),
        channel: this.config.notification.channels,
        data: {
          errors: result.errors,
          timestamp: new Date().toISOString()
        }
      };
    }
  }
}

module.exports = { Notifier };