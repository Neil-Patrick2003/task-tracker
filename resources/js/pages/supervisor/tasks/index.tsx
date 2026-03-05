import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { 
    Search,
    Filter,
    Calendar,
    Clock,
    CheckCircle2,
    Loader2,
    AlertCircle,
    User,
    Eye
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/supervisor/dashboard',
    },
    {
        title: 'Tasks',
        href: '/supervisor/tasks',
    },
];

// Static task data from all interns
const allTasks = [
    {
        id: 1,
        intern: 'John Doe',
        date: '2026-03-05',
        title: 'API Integration for User Module',
        description: 'Integrated REST API endpoints for user authentication and profile management.',
        hoursRendered: 6,
        status: 'Ongoing',
        challengesEncountered: 'Had issues with JWT token refresh mechanism',
        supportNeeded: true,
        supportDetails: 'Need clarification on token expiry handling',
    },
    {
        id: 2,
        intern: 'Jane Smith',
        date: '2026-03-05',
        title: 'Database Optimization',
        description: 'Optimized database queries and added proper indexing for better performance.',
        hoursRendered: 5,
        status: 'Completed',
        challengesEncountered: '',
        supportNeeded: false,
        supportDetails: '',
    },
    {
        id: 3,
        intern: 'Mike Johnson',
        date: '2026-03-04',
        title: 'UI Component Library',
        description: 'Built reusable React components for the component library.',
        hoursRendered: 7,
        status: 'Completed',
        challengesEncountered: 'Component styling conflicts',
        supportNeeded: false,
        supportDetails: '',
    },
    {
        id: 4,
        intern: 'Sarah Williams',
        date: '2026-03-04',
        title: 'Testing Setup',
        description: 'Set up Jest and React Testing Library for unit testing.',
        hoursRendered: 4,
        status: 'Ongoing',
        challengesEncountered: 'TypeScript path configuration issues',
        supportNeeded: true,
        supportDetails: 'Need help with Jest TypeScript setup',
    },
    {
        id: 5,
        intern: 'Chris Brown',
        date: '2026-03-04',
        title: 'Documentation Update',
        description: 'Updated technical documentation and API specs.',
        hoursRendered: 3,
        status: 'Completed',
        challengesEncountered: '',
        supportNeeded: false,
        supportDetails: '',
    },
    {
        id: 6,
        intern: 'John Doe',
        date: '2026-03-03',
        title: 'Database Schema Design',
        description: 'Designed the database schema for the new feature module.',
        hoursRendered: 4,
        status: 'Completed',
        challengesEncountered: '',
        supportNeeded: false,
        supportDetails: '',
    },
    {
        id: 7,
        intern: 'Jane Smith',
        date: '2026-03-03',
        title: 'Frontend Dashboard',
        description: 'Implemented dashboard components with charts and data visualization.',
        hoursRendered: 6,
        status: 'Completed',
        challengesEncountered: 'Chart library configuration',
        supportNeeded: false,
        supportDetails: '',
    },
    {
        id: 8,
        intern: 'Mike Johnson',
        date: '2026-03-03',
        title: 'Code Review',
        description: 'Reviewed pull requests and provided feedback.',
        hoursRendered: 2,
        status: 'Completed',
        challengesEncountered: '',
        supportNeeded: false,
        supportDetails: '',
    },
];

const interns = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Williams', 'Chris Brown'];

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'Completed':
            return <Badge className="bg-green-100 text-green-800 hover:bg-green-100"><CheckCircle2 className="h-3 w-3 mr-1" />Completed</Badge>;
        case 'Ongoing':
            return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100"><Loader2 className="h-3 w-3 mr-1" />Ongoing</Badge>;
        default:
            return <Badge variant="secondary">{status}</Badge>;
    }
};

export default function SupervisorTasks() {
    const [tasks] = useState(allTasks);
    const [searchQuery, setSearchQuery] = useState('');
    const [internFilter, setInternFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedTask, setSelectedTask] = useState<typeof allTasks[0] | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const filteredTasks = tasks.filter((task) => {
        const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.intern.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesIntern = internFilter === 'all' || task.intern === internFilter;
        const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
        return matchesSearch && matchesIntern && matchesStatus;
    });

    const totalHours = filteredTasks.reduce((sum, task) => sum + task.hoursRendered, 0);
    const completedCount = filteredTasks.filter(t => t.status === 'Completed').length;
    const ongoingCount = filteredTasks.filter(t => t.status === 'Ongoing').length;
    const withChallenges = filteredTasks.filter(t => t.challengesEncountered).length;

    const openTaskDetail = (task: typeof allTasks[0]) => {
        setSelectedTask(task);
        setIsDetailOpen(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Task Monitoring" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Task Monitoring</h1>
                    <p className="text-muted-foreground">
                        View and monitor all submitted tasks from interns
                    </p>
                </div>

                {/* Stats */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                    <Calendar className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold">{filteredTasks.length}</div>
                                    <p className="text-xs text-muted-foreground">Total Tasks</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                                    <Clock className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold">{totalHours}</div>
                                    <p className="text-xs text-muted-foreground">Total Hours</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold">{completedCount}</div>
                                    <p className="text-xs text-muted-foreground">Completed</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100">
                                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold">{withChallenges}</div>
                                    <p className="text-xs text-muted-foreground">With Challenges</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search tasks or intern..."
                            className="pl-9"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Select value={internFilter} onValueChange={setInternFilter}>
                        <SelectTrigger className="w-[180px]">
                            <User className="h-4 w-4 mr-2" />
                            <SelectValue placeholder="Filter by Intern" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Interns</SelectItem>
                            {interns.map((intern) => (
                                <SelectItem key={intern} value={intern}>{intern}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[150px]">
                            <Filter className="h-4 w-4 mr-2" />
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                            <SelectItem value="Ongoing">Ongoing</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Task List */}
                <Card className="flex-1">
                    <CardHeader>
                        <CardTitle>Submitted Tasks</CardTitle>
                        <CardDescription>
                            {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''} found
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {filteredTasks.length === 0 ? (
                            <div className="flex h-[200px] items-center justify-center text-muted-foreground">
                                No tasks found matching your filters.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredTasks.map((task) => (
                                    <div key={task.id} className="rounded-lg border p-4 hover:bg-accent/50 transition-colors">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                                                        {task.intern.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold">{task.title}</h3>
                                                        <span className="text-sm text-muted-foreground">{task.intern}</span>
                                                    </div>
                                                    <div className="ml-2 flex gap-2">
                                                        {getStatusBadge(task.status)}
                                                        {task.supportNeeded && (
                                                            <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                                                                <AlertCircle className="h-3 w-3 mr-1" />
                                                                Support Needed
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                                <p className="text-sm text-muted-foreground mt-2 ml-10">{task.description}</p>
                                                <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2 ml-10">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        {task.date}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        {task.hoursRendered} hours
                                                    </span>
                                                </div>
                                                {task.challengesEncountered && (
                                                    <div className="mt-2 ml-10 p-2 bg-yellow-50 rounded text-sm text-gray-900">
                                                        <span className="font-medium">Challenges:</span> {task.challengesEncountered}
                                                    </div>
                                                )}
                                            </div>
                                            <Button variant="outline" size="sm" onClick={() => openTaskDetail(task)}>
                                                <Eye className="h-4 w-4 mr-1" />
                                                View Details
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Task Detail Modal */}
                <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Task Details</DialogTitle>
                            <DialogDescription>
                                Full details of the submitted task
                            </DialogDescription>
                        </DialogHeader>
                        {selectedTask && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-medium">
                                        {selectedTask.intern.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-lg">{selectedTask.intern}</div>
                                        <div className="text-sm text-muted-foreground">Submitted on {selectedTask.date}</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 bg-accent rounded-lg">
                                        <div className="text-sm text-muted-foreground">Task Title</div>
                                        <div className="font-medium">{selectedTask.title}</div>
                                    </div>
                                    <div className="p-3 bg-accent rounded-lg">
                                        <div className="text-sm text-muted-foreground">Hours Rendered</div>
                                        <div className="font-medium">{selectedTask.hoursRendered} hours</div>
                                    </div>
                                </div>

                                <div>
                                    <div className="text-sm text-muted-foreground mb-1">Description</div>
                                    <p className="p-3 bg-accent rounded-lg">{selectedTask.description}</p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="text-sm text-muted-foreground">Status:</div>
                                    {getStatusBadge(selectedTask.status)}
                                </div>

                                {selectedTask.challengesEncountered && (
                                    <div>
                                        <div className="text-sm text-muted-foreground mb-1">Challenges Encountered</div>
                                        <p className="p-3 bg-yellow-50 rounded-lg border border-yellow-200 text-gray-900">
                                            {selectedTask.challengesEncountered}
                                        </p>
                                    </div>
                                )}

                                {selectedTask.supportNeeded && (
                                    <div>
                                        <div className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                                            <AlertCircle className="h-4 w-4 text-yellow-500" />
                                            Support Requested
                                        </div>
                                        <p className="p-3 bg-yellow-50 rounded-lg border border-yellow-200 text-gray-900">
                                            {selectedTask.supportDetails}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
