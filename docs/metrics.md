# 指标与埋点（首版最小集）

## 目标指标
- D1/D7 留存（目标：D1≥40%，D7≥15%）
- 出片转化率（进入出片 -> 导出）≥50%
- 打卡完成率（进入打卡 -> 保存）≥60%
- 每日一句开启率 ≥30%

## 事件建议（本地或匿名统计）
- app_open, permission_granted(photos)
- template_preview, export_success
- mood_checkin, mood_card_generated
- lock_enabled, daily_quote_enabled

> 首版若不上线统计 SDK，可用开发日志自测；上架后再切合规统计方案。