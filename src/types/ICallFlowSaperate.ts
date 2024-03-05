export default interface ICallFlowSaperate{
    id: string;
    type: string;
    position?:{
      x: number;
      y: number;
    };
    data?:{
      label: string;
    };
    source?: string;
    sourceHandle?: string;
    target?: string;
    targetHandle?: null | any;
    animated?: boolean;
    style?:{
      stroke: string;
    }
  }
