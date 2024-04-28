var bpmnJS = new BpmnJS({
  container: '#canvas',
  additionalModules: [
    // ...
    window['diagram-js-grid-bg']
  ]
});

bpmnJS.importXML(`<?xml version="1.0" encoding="UTF-8"?><bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" id="Definitions_Process_1712559287677" targetNamespace="http://bpmn.io/schema/bpmn"><bpmn:process id="Process_1712559287677" name="业务流程_1712559287677" isExecutable="true" /><bpmndi:BPMNDiagram id="BPMNDiagram_1"><bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1712559287677" /></bpmndi:BPMNDiagram></bpmn:definitions>`);
