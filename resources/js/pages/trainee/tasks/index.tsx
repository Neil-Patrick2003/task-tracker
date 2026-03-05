import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { 
    Plus, 
    Pencil, 
    Trash2, 
    Search,
    Filter,
    Calendar,
    Clock,
    AlertCircle,
    CheckCircle2,
    Loader2,
    X
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/trainee/dashboard',
    },
    {
        title: 'Tasks',
        href: '/trainee/tasks',
    },
];

// Static task data
const initialTasks = [
    {
        id: 1,
        date: '2026-03-05',
        title: 'Database Schema Design',
        description: 'Designed and implemented the database schema for the task tracker module including users, tasks, and support requests tables.',
        hoursRendered: 4,
        status: 'Completed',
        challengesEncountered: '',
        supportNeeded: false,
        supportDetails: '',
        lastUpdated: '2026-03-05 14:30',
    },
    {
        id: 2,
        date: '2026-03-04',
        title: 'API Integration for User Module',
        description: 'Integrated REST API endpoints for user authentication and profile management.',
        hoursRendered: 6,
        status: 'Ongoing',
        challengesEncountered: 'Had issues with JWT token refresh mechanism',
        supportNeeded: true,
        supportDetails: 'Need clarification on token expiry handling',
        lastUpdated: '2026-03-04 17:45',
    },
    {
        id: 3,
        date: '2026-03-03',
        title: 'Frontend Dashboard Components',
        description: 'Built reusable React components for the analytics dashboard.',
        hoursRendered: 5,
        status: 'Completed',
        challengesEncountered: '',
        supportNeeded: false,
        supportDetails: '',
        lastUpdated: '2026-03-03 16:00',
    },
    {
        id: 4,
        date: '2026-03-02',
        title: 'Unit Testing Setup',
        description: 'Configured Jest and React Testing Library for frontend unit testing.',
        hoursRendered: 3,
        status: 'Completed',
        challengesEncountered: 'Configuration issues with TypeScript paths',
        supportNeeded: false,
        supportDetails: '',
        lastUpdated: '2026-03-02 15:20',
    },
    {
        id: 5,
        date: '2026-03-01',
        title: 'Code Review and Documentation',
        description: 'Reviewed pull requests and updated technical documentation.',
        hoursRendered: 4,
        status: 'Completed',
        challengesEncountered: '',
        supportNeeded: false,
        supportDetails: '',
        lastUpdated: '2026-03-01 17:00',
    },
];

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

export default function Tasks() {
    const [tasks, setTasks] = useState(initialTasks);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<typeof initialTasks[0] | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Form state for new/edit task
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        title: '',
        description: '',
        hoursRendered: 0,
        status: 'Ongoing',
        challengesEncountered: '',
        supportNeeded: false,
        supportDetails: '',
    });

    const filteredTasks = tasks.filter((task) => {
        const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const totalHours = tasks.reduce((sum, task) => sum + task.hoursRendered, 0);
    const completedTasks = tasks.filter(t => t.status === 'Completed').length;
    const ongoingTasks = tasks.filter(t => t.status === 'Ongoing').length;

    const handleAddTask = () => {
        const newTask = {
            id: tasks.length + 1,
            ...formData,
            lastUpdated: new Date().toISOString().replace('T', ' ').slice(0, 16),
        };
        setTasks([newTask, ...tasks]);
        setIsAddModalOpen(false);
        resetForm();
    };

    const handleEditTask = () => {
        if (!selectedTask) return;
        setTasks(tasks.map(task => 
            task.id === selectedTask.id 
                ? { ...task, ...formData, lastUpdated: new Date().toISOString().replace('T', ' ').slice(0, 16) }
                : task
        ));
        setIsEditModalOpen(false);
        setSelectedTask(null);
        resetForm();
    };

    const handleDeleteTask = () => {
        if (!selectedTask) return;
        setTasks(tasks.filter(task => task.id !== selectedTask.id));
        setIsDeleteModalOpen(false);
        setSelectedTask(null);
    };

    const openEditModal = (task: typeof initialTasks[0]) => {
        setSelectedTask(task);
        setFormData({
            date: task.date,
            title: task.title,
            description: task.description,
            hoursRendered: task.hoursRendered,
            status: task.status,
            challengesEncountered: task.challengesEncountered,
            supportNeeded: task.supportNeeded,
            supportDetails: task.supportDetails,
        });
        setIsEditModalOpen(true);
    };

    const openDeleteModal = (task: typeof initialTasks[0]) => {
        setSelectedTask(task);
        setIsDeleteModalOpen(true);
    };

    const resetForm = () => {
        setFormData({
            date: new Date().toISOString().split('T')[0],
            title: '',
            description: '',
            hoursRendered: 0,
            status: 'Ongoing',
            challengesEncountered: '',
            supportNeeded: false,
            supportDetails: '',
        });
    };

    const TaskForm = ({ onSubmit, submitLabel }: { onSubmit: () => void; submitLabel: string }) => (
        <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="hours">Hours Rendered</Label>
                    <Input
                        id="hours"
                        type="number"
                        min="0"
                        max="24"
                        value={formData.hoursRendered}
                        onChange={(e) => setFormData({ ...formData, hoursRendered: Number(e.target.value) })}
                    />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="title">Task Title</Label>
                <Input
                    id="title"
                    placeholder="Enter task title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="description">Task Description</Label>
                <textarea
                    id="description"
                    className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder="Describe what you worked on..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Ongoing">Ongoing</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="challenges">Challenges Encountered</Label>
                <textarea
                    id="challenges"
                    className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder="Any challenges faced? (optional)"
                    value={formData.challengesEncountered}
                    onChange={(e) => setFormData({ ...formData, challengesEncountered: e.target.value })}
                />
            </div>
            <div className="space-y-4">
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="supportNeeded"
                        checked={formData.supportNeeded}
                        onCheckedChange={(checked) => setFormData({ ...formData, supportNeeded: checked as boolean })}
                    />
                    <Label htmlFor="supportNeeded" className="cursor-pointer">Support Needed</Label>
                </div>
                {formData.supportNeeded && (
                    <div className="space-y-2">
                        <Label htmlFor="supportDetails">Support Details</Label>
                        <textarea
                            id="supportDetails"
                            className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            placeholder="Describe the support you need..."
                            value={formData.supportDetails}
                            onChange={(e) => setFormData({ ...formData, supportDetails: e.target.value })}
                        />
                    </div>
                )}
            </div>
            <DialogFooter>
                <Button type="button" onClick={onSubmit}>{submitLabel}</Button>
            </DialogFooter>
        </div>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Tasks" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">My Tasks</h1>
                        <p className="text-muted-foreground">
                            Record and manage your daily OJT tasks
                        </p>
                    </div>
                    <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={() => { resetForm(); setIsAddModalOpen(true); }}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Task
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>Add New Task Entry</DialogTitle>
                                <DialogDescription>
                                    Record your daily task. Fill in all the required details.
                                </DialogDescription>
                            </DialogHeader>
                            <TaskForm onSubmit={handleAddTask} submitLabel="Add Task" />
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Stats Summary */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                    <Calendar className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold">{tasks.length}</div>
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
                                    <div className="text-2xl font-bold">{completedTasks}</div>
                                    <p className="text-xs text-muted-foreground">Completed</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100">
                                    <Loader2 className="h-5 w-5 text-yellow-600" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold">{ongoingTasks}</div>
                                    <p className="text-xs text-muted-foreground">Ongoing</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search tasks..."
                            className="pl-9"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
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
                        <CardTitle>Task Entries</CardTitle>
                        <CardDescription>
                            {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''} found
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {filteredTasks.length === 0 ? (
                            <div className="flex h-[200px] items-center justify-center text-muted-foreground">
                                No tasks found. Click "Add Task" to get started.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredTasks.map((task) => (
                                    <div key={task.id} className="rounded-lg border p-4 hover:bg-accent/50 transition-colors">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-semibold">{task.title}</h3>
                                                    {getStatusBadge(task.status)}
                                                    {task.supportNeeded && (
                                                        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                                                            <AlertCircle className="h-3 w-3 mr-1" />
                                                            Support Needed
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        {task.date}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        {task.hoursRendered} hours
                                                    </span>
                                                    <span>Last updated: {task.lastUpdated}</span>
                                                </div>
                                                {task.challengesEncountered && (
                                                    <div className="mt-2 p-2 bg-yellow-50 rounded text-sm text-gray-900">
                                                        <span className="font-medium">Challenges:</span> {task.challengesEncountered}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 ml-4">
                                                <Button variant="ghost" size="icon" onClick={() => openEditModal(task)}>
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => openDeleteModal(task)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Edit Modal */}
                <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Edit Task Entry</DialogTitle>
                            <DialogDescription>
                                Update your task details. Changes will be auto-timestamped.
                            </DialogDescription>
                        </DialogHeader>
                        <TaskForm onSubmit={handleEditTask} submitLabel="Save Changes" />
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation Modal */}
                <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Delete Task Entry</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete "{selectedTask?.title}"? This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="gap-2">
                            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
                            <Button variant="destructive" onClick={handleDeleteTask}>Delete Task</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
