# diagram-js-grid-bg
A visual grid background for diagram-js, base on diagram-js-grid.

一个提供给 diagram-js 使用的虚拟网格背景，基于 `diagram-js-grid` 项目。

## How to use 如何使用

1. Clone this repository.
2. Copy the `GridLine` directory to your own project.
3. `import` it.


1. 克隆这个项目.
2. 将 `GridLine` 这个目录复制到你自己的项目中.
3. 使用 `import` 导入这个模块.


```js
import Modeler from 'bpmn-js/lib/Modeler'
import GridLineModule from '@/xxx/GridLine'


const modeler = new Modeler({
  container: '#container',
  additionalModules: [
    // ...
    GridLineModule
  ]
})
```

## Configurations 配置项

This plugin module supports five custom configurations.

| name             | desc    | type   | default               | required |
|------------------|---------|--------|-----------------------|----------|
| smallGridSpacing | 最小网格边长  | number | 10                    | false    |
| gridSpacing      | 大号网格边长  | number | smallGridSpacing * 10 | false    |
| gridLineStroke   | 网格边框宽度  | number | 0.5                   | false    |
| gridLineOpacity  | 网格边框透明度 | number | 0.4                   | false    |
| gridLineColor    | 网格边框颜色  | string | #ccc                  | false    |


## Preview 效果预览

#### 1. default 默认效果

![default](./screenshot/CPT2306161011-1338x1047.gif)

#### 2. custom config 自定义配置

```js
import Modeler from 'bpmn-js/lib/Modeler'
import GridLineModule from '@/xxx/GridLine'


const modeler = new Modeler({
  container: '#container',
  additionalModules: [
    // ...
    GridLineModule
  ],
  gridLine: {
    smallGridSpacing: 20,
    gridSpacing: 80,
    gridLineStroke: 1,
    gridLineOpacity: 0.2,
    gridLineColor: '#20e512'
  }
})
```

![custom](./screenshot/CPT2306161015-1328x988.gif)
