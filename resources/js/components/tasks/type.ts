// components/tasks/type.ts
export type TaskData = {
    id: number;
    date: string;
    title: string;
    description: string;
    hoursRendered: number;
    status: string;
    challenges?: {
        description: string;
    } | null;
    requests?: {
        subject: string;
        description: string;
        status: string;
    } | null;
    ojt_id: number;
    created_at: string;
    updated_at: string;
};

export type TaskFormData = {
    date: string;
    title: string;
    description: string;
    hoursRendered: number;
    status: string;
    challengesEncountered: string;
    supportNeeded: boolean;
    supportSubject: string;
    supportDescription: string;
};

