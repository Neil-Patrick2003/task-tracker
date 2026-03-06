import type { Task } from '@/components/types/models/Task';

export interface Intern {
    id:number
    name: string;
    username: string | null;
    email: string;
    task: Task | null;
}
