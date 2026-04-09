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
    const modelMessage = await convertToModelMessages(history)
    const tools: Record<string, any> = {}

    //native tools
    for(const t of selectedTools.filter(t => t.type === "native") as any){
        if(t.value === "webSearch") tools.webSearch = webSearch()
    }

    const toolList = Object.entries(tools)?.map(([name]) => `- ${name}`)?.join("\n")

    const systemPrompt = `You are a helpfull assistant. IMPORTANT: Only respond to the user's MOST RECENT message.
    **Must Use the following instructions:
    ${instructions}
    ${toolList ? `**Available tools: \n${toolList}` : ""}`.trim()

    const result = streamText({
        model: openRouter.chat(model),
        system: systemPrompt,
        messages: modelMessage,
        tools: Object.keys(tools).length > 0 ? tools : undefined,
        stopWhen: stepCountIs(5),
        ...jsonOutput,
    })

    return result
}