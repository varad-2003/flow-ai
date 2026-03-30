import { workflow } from "@/lib/generated/prisma/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { log } from "console";
import { useRouter } from "next/navigation"
import { toast } from "sonner";

type CreateWorkflowPayload = {
    name: string;
    description?: string;
}

type WorkflowType = {
    id: string;
    name: string;
    flowObject: any;
}

export const useGetworkflows = () =>{
    return useQuery({
        queryKey: ["workflows"],
        queryFn: async () => {
            return await axios.get<{ data: workflow[]}>("/api/workflow")
            .then((res) => res.data.data)
        }
    })
}

export const useCreateWorkflow = () => {
    const router = useRouter();

    return useMutation({
        mutationFn: async ({ name, description }: CreateWorkflowPayload ) => axios.post("/api/workflow", {
            name, 
            description,
        })
        .then((res) => res.data),
        onSuccess: (data) => {
            toast.success("workflow created successfully")
            router.push(`/workflow/${data.data.id}`)
        },
        onError:(error) => {
            console.log(error);
            toast.error("Failed to create workflow")
        }
    })
}

export const useGetworkflowById = (workflowId: string) =>{
    return useQuery({
        queryKey: ["workflow", workflowId],
        queryFn: async () => {
            return await axios.get<{ data: WorkflowType}>(`/api/workflow/${workflowId}`)
            .then((res) => res.data.data)
        },
        enabled: !!workflowId,
    })

}