interface Task {
    id: number;
    title: string;
}

export interface Request {
    id: number;
    subject: string;
    description: string;
    status: string;
    task_id: number;
    ojt_id: number;
    task: Task | null;
    created_at: string;
    updated_at: string;

}
