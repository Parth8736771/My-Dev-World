export const MenuOption = {
    WORKSPACE: "Workspace",
    PROJECT: "Project",
    TASK: "Task",
    ALL: "All",
} as const;

// models/workspace.ts
export interface TASK {
    id: number;
    name?: string;
    description: string;
    tag: string;
    categoryId: number;
    priority: number;
    workspaceId: number;
    projectId: number;
    createdDate: string;
    taskLink: string | null;
    status: string;
}

export interface PROJECT {
    id: number;
    name: string;
    description: string;
    tag: string;
    categoryId: number;
    priority: number;
    workspaceId: number;
    createdDate: string;
    taskLink: string | null;
    tasks: TASK[];
}

export interface WORKSPACE {
    id: number;
    name: string;
    description: string;
    tag: string;
    categoryId: number;
    priority: number;
    createdDate: string;
    projects: PROJECT[];
}

export interface FormData {
    name: string;
    description: string;
    tag: string;
    categoryId: number;
    priority: number;
    workspaceId: number;
    projectId: number;
    taskLink: string | null;
}
