# 数据模型（本地）

## 实体
- Template 模板（Web 首版以 docs/new 为准）
  - id: string
  - name: string
  - styleTag: ['治愈','元气','温柔','梦幻']
  - ratio: '1:1'|'4:5'|'9:16'|'3:4'
  - layers: Layer[]（文本/图层/贴纸描述）
  - version: number
- Project 手账作品
  - id, templateId, photos[], texts{}, stickers[], filter, exportedAt
- MoodRecord 情绪记录
  - id, date, mood(1..5), color(hex), note(<=120), cardProjectId

## 模板 JSON（示例，更多见 `docs/new/mockup-templates.json`）
```json
{
  "id": "tpl_cute_01",
  "name": "樱花手账",
  "styleTag": "温柔",
  "ratio": "4:5",
  "version": 1,
  "layers": [
    { "type": "image", "key": "photo1", "frame": {"x":0.08,"y":0.12,"w":0.84,"h":0.5}, "mask":"rounded" },
    { "type": "text", "key": "title", "font":"CuteRounded", "size":24, "color":"#333", "align":"center", "frame": {"x":0.1,"y":0.66,"w":0.8,"h":0.08} },
    { "type": "sticker", "key": "sticker1", "asset":"sakura_01", "frame": {"x":0.12,"y":0.78,"w":0.2,"h":0.1} }
  ]
}
```