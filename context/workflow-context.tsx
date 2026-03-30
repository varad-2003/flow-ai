import { createContext, useContext, useState } from "react";

export type WorkflowView = "edit" | "preiew"

interface WorkflowCotextType {
    view: WorkflowView;
    setView: (view: WorkflowView) => void;
}

const workflowContext = createContext<WorkflowCotextType | undefined>(
    undefined
)

export function WorkflowProvider({
    children
} : {
    children: React.ReactNode
}) {
    const [view, setView] = useState<WorkflowView>("edit")

    return(
        <workflowContext.Provider
        value={{
            view,
            setView,
        }}
        >
            {children}
        </workflowContext.Provider>
    )
}

export function useWorkflow() {
    const context = useContext(workflowContext);
    if(context === undefined){
        throw new Error("useWorkflow must be used within a WorkflowProvider")
    }
    return context;
}