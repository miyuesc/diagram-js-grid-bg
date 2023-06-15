import { ModuleDeclaration } from 'didi'
import GridLine from './GridLine'

// 使用 paletteProvider 同名参数 覆盖 默认 paletteProvider 构造函数
const gridLine: ModuleDeclaration = {
  __init__: ['gridLineBg'],
  gridLineBg: ['type', GridLine]
}

export default gridLine
