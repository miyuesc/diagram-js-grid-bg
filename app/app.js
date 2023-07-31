var bpmnJS = new BpmnJS({
  container: '#canvas',
  additionalModules: [
    // ...
    window['diagram-js-grid-bg']
  ]
});

bpmnJS.createDiagram();
