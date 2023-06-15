# diagram-js-grid-bg
A visual grid backgroud for diagram-js, base on diagram-js-grid

## useage

1. clone this repository.
2. Copy dir `GridLine` to your project.
3. `import` it.


```js
import Modeler from 'bpmn-js/lib/Modeler'
import GridLineModule from 'xxx/GridLine'


const modeler = new Modeler({
  container: '#container',
  additionalModules: [
    // ...
    GridLineModule
  ]
})
```
