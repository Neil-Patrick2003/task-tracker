import type { Challenge } from '@/components/types/models/Challenge';
import type { Request} from '@/components/types/models/SupportRequest';


export interface Task {
    id: number;
    date: string;
    title: string;
    description: string;
    hoursRendered: number;
    status: string;
    challenges: Challenge | null;
    requests: Request | null;
    ojt_id: number;
    created_at: string;
    updated_at: string;
}
