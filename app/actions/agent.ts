"use server"

import { convertToModelMessages, stepCountIs, streamText, UIMessage } from "ai"
import { webSearch } from "@exalabs/ai-sdk"
import { openRouter } from "@/lib/openrouter";

export async function streamAgentAction({
    model,
    instructions,
    history,
    jsonOutput,
    selectedTools,
}: {
    model: string,
    instructions: string,
    history: UIMessage[],
    jsonOutput?: any,
    selectedTools: Array<
      |  { type: "native"; value: string }
      |  { type: "mcp"; value: string; tools: []}
    >
}){

    const modelMessages = history.map(msg => {
        if(msg.role === "user"){
            const text = (msg.parts as any)?.find((p: any) => p.type === "text")?.text || ""
            return{
                role: "user",
                content: text
            }
        }
        if(msg.role === "assistant"){
            return extractAssistantContent(msg.parts)
        }
        return null
    })
    ?.filter((msg) => msg !== null)
    // const modelMessages = await convertToModelMessages(history)
    const tools: Record<string, any> = {}

    //native tools
    for(const t of selectedTools.filter(t => t.type === "native") as any){
        if(t.value === "webSearch") tools.webSearch = webSearch()
    }

    const toolList = Object.entries(tools)?.map(([name]) => `- ${name}`)?.join("\n")

    const systemPrompt = `You are a helpfull assistant.
    **Analyze the conversation flow:**
    1. Check YOUR last message - did you ask the user for information?
    2. If Yes and the user is providing that information -> treat it as a follow-up response.
    3. If No or user changes the topic -> classify the message independently as a new intent.

    **System Instructions:**
    ${instructions}

    ${toolList ? `**Available tools: \n${toolList}` : ""}`.trim()

    const result = streamText({
        model: openRouter.chat(model),
        system: systemPrompt,
        messages: modelMessages,
        tools: Object.keys(tools).length > 0 ? tools : undefined,
        stopWhen: stepCountIs(5),
        ...jsonOutput,
    })

    return result
}

function extractAssistantContent(parts: any[]){
    const content = parts?.filter((p: any) => 
        p.type === "data-workflow-node"
        && p.data.nodeType === "agent" 
    )?.map((p: any) => {
        const{ output } = p.data
        return typeof output === "string"
        ? output : output?.text
    })
        ?.filter(Boolean)
        ?.join("\n\n") || ""

    return {
        role: "assistant",
        content
    }
}

function extractAgentContent(parts: any[]) {
  const content: any[] = [];

  parts?.filter(p => p.type === "data-workflow-node"
    && p.data?.nodeType === "agent")
    ?.map(p => {
      const { type, toolCall, toolResult, output } = p.data;

      if (type === "tool-call" && toolCall) {
        content.push({
          type: "tool-call",
          toolCallId: toolCall.toolCallId,
          toolName: toolCall.name
        });
      }
      if (type === "tool-result" && toolResult) {
        content.push({
          type: "tool-result",
          toolCallId: toolResult.toolCallId,
          toolName: toolResult.name,
          result: toolResult.result
        });
      }
      if (typeof output === "string") {
        content.push({
          type: "text",
          text: output
        });
      } else if (output?.text) {
        content.push({
          type: "text",
          text: output.text
        });
      }
    });

  return {
    role: "assistant" as const,
    content: content.length > 0 ? content : ""
  };
}