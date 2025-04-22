import { Node, NodePropsArg } from './VDom';

declare global {
  namespace JSX {
    // Define the element type
    interface Element extends Node {}
    
    // Define intrinsic elements (HTML tags)
    interface IntrinsicElements {
        div: NodePropsArg;
        section: NodePropsArg;
        h1: NodePropsArg;
        p: NodePropsArg;
        span: NodePropsArg;
        a: NodePropsArg;
        button: NodePropsArg;
        input: NodePropsArg;
        form: NodePropsArg;
        img: NodePropsArg;
        ul: NodePropsArg;
        ol: NodePropsArg;
        li: NodePropsArg;
        // Allow any other HTML element
        [elemName: string]: NodePropsArg;
    }
  }
}
