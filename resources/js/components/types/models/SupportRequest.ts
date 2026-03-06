import type { Response } from './/../models/SupprtResponse'

interface Task {
    id: number;
    title: string;
}

interface User {
    id: number;
    name: string;
}

export interface Request {
    id: number;
    subject: string;
    description: string;
    status: string;
    task_id: number;
    ojt_id: number;
    task: Task | null;
    response: Response | null;
    created_at: string;
    updated_at: string;
    user: User | null

}
