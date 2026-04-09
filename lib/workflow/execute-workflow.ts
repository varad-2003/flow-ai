import { Edge, Node } from "@xyflow/react";
import { UIMessage } from "ai";
import { NodeTypeEnum } from "./node-config";
import { ExecutorContextType } from "@/types/workflow";

export async function executeWorkflow(
    nodes: Node[],
    edges: Edge[],
    userInput: string,
    messages: UIMessage[],
    channel: any,
    workflowRunId: string,
){
    const startNode = nodes.find(node => node.type === NodeTypeEnum.START)
    if(!startNode) throw new Error("Start node not found in the workflow")

    const context: ExecutorContextType = {
        outputs: {
            [startNode.id]: { input: userInput },
        },
        history: messages || [],
        workflowRunId,
        channel,
    }
}