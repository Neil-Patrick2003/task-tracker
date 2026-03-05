// pages/trainee/tasks.tsx
import { Head, useForm, router } from '@inertiajs/react';
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
    ChevronLeft,
    ChevronRight,
    X,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import TaskForm from '@/components/tasks/TaskForm';
import type { PaginatedData } from '@/components/types';
import type { Task } from '@/components/types/models/Task';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useDebounce } from '@/hooks/use-debounce';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';


interface Props {
    tasks:  PaginatedData<Task>;
    query?: {
        filter?: {
            status?: string;
            title?: string;
        };
        sort?: string;
        page?: number;
        perPage?: number;
    };
    total_tasks: number;
    total_hours: number;
    completed_tasks: number;
    in_progress_tasks: number;
}

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

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'Completed':
            return (
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    Completed
                </Badge>
            );
        case 'Ongoing':
            return (
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                    <Loader2 className="mr-1 h-3 w-3" />
                    Ongoing
                </Badge>
            );
        case 'Pending':
            return (
                <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                    <Loader2 className="mr-1 h-3 w-3" />
                    Pending
                </Badge>
            );
        default:
            return <Badge variant="secondary">{status}</Badge>;
    }
};

export default function Tasks({ tasks, query = {}, total_tasks, total_hours, completed_tasks, in_progress_tasks }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [searchInput, setSearchInput] = useState(query.filter?.title || '');
    const [statusInput, setStatusInput] = useState(
        query.filter?.status || 'all',
    );
    const [isEditing, setIsEditing] = useState(false);

    const debouncedSearch = useDebounce(searchInput, 500);

    const { delete: destroy, processing } = useForm({});


    useEffect(() => {
        const filters: any = {};

        if (statusInput !== 'all') {
            filters.status = statusInput;
        }

        if (debouncedSearch) {
            filters.title = debouncedSearch;
        }

        router.get(
            '/trainee/tasks',
            {
                filter: filters,
                page: 1,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    }, [debouncedSearch, statusInput]);

    const handleStatusChange = (value: string) => {
        setStatusInput(value);
    };

    const handlePageChange = (page: number) => {
        const filters: any = {};

        if (statusInput !== 'all') {
            filters.status = statusInput;
        }

        if (searchInput) {
            filters.title = searchInput;
        }

        router.get(
            '/trainee/tasks',
            {
                page,
                filter: filters,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const clearFilters = () => {
        setSearchInput('');
        setStatusInput('all');
        router.get(
            '/trainee/tasks',
            {},
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const handleOpenModal = () => {
        setIsEditing(false);
        setSelectedTask(null);
        setIsModalOpen(true);
    };

    const handleEditModal = (task: Task) => {
        setIsEditing(true);
        setSelectedTask(task);
        setIsModalOpen(true);
    };

    const handleDeleteModal = (task: Task) => {
        setSelectedTask(task);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = () => {
        if (selectedTask) {
            destroy(`/trainee/tasks/${selectedTask.id}`, {
                onSuccess: () => {
                    setIsDeleteModalOpen(false);
                    setSelectedTask(null);
                },
            });
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const hasActiveFilters = statusInput !== 'all' || searchInput;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <TaskForm
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                initialData={selectedTask}
                isEditing={isEditing}
            />

            <Head title="My Tasks" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            My Tasks
                        </h1>
                        <p className="text-muted-foreground">
                            Record and manage your daily OJT tasks
                        </p>
                    </div>
                    <Button onClick={handleOpenModal}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add new Task
                    </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                    <Calendar className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold">
                                        {total_tasks}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Total Tasks
                                    </p>
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
                                    <div className="text-2xl font-bold">
                                        {total_hours}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Total Hours
                                    </p>
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
                                    <div className="text-2xl font-bold">
                                        {completed_tasks}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Completed
                                    </p>
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
                                    <div className="text-2xl font-bold">
                                        {in_progress_tasks}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        In Progress
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative max-w-sm flex-1">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search tasks by title..."
                            className="pl-9"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
                        {searchInput && (
                            <button
                                onClick={() => setSearchInput('')}
                                className="absolute top-1/2 right-3 -translate-y-1/2"
                            >
                                <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                            </button>
                        )}
                    </div>
                    <Select
                        value={statusInput}
                        onValueChange={handleStatusChange}
                    >
                        <SelectTrigger className="w-[150px]">
                            <Filter className="mr-2 h-4 w-4" />
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                            <SelectItem value="Ongoing">Ongoing</SelectItem>
                            <SelectItem value="Pending">Pending</SelectItem>
                        </SelectContent>
                    </Select>

                    {hasActiveFilters && (
                        <Button
                            variant="ghost"
                            onClick={clearFilters}
                            size="sm"
                        >
                            Clear Filters
                        </Button>
                    )}
                </div>

                <Card className="flex-1">
                    <CardHeader>
                        <CardTitle>Task Entries</CardTitle>
                        <CardDescription>
                            Showing {tasks.from} to {tasks.to} of {tasks.total}{' '}
                            tasks
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {tasks.data.length === 0 ? (
                            <div className="flex h-[200px] items-center justify-center text-muted-foreground">
                                No tasks found. Click "Add Task" to get started.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {tasks.data.map((task) => (
                                    <div
                                        key={task.id}
                                        className="rounded-lg border p-4 transition-colors hover:bg-accent/50"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="mb-1 flex flex-wrap items-center gap-2">
                                                    <h3 className="font-semibold">
                                                        {task.title}
                                                    </h3>
                                                    {getStatusBadge(
                                                        task.status,
                                                    )}
                                                    {task.requests && (
                                                        <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
                                                            <AlertCircle className="mr-1 h-3 w-3" />
                                                            Support Requested
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className="mb-2 text-sm text-muted-foreground">
                                                    {task.description}
                                                </p>
                                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        {formatDate(task.date)}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        {task.hoursRendered}{' '}
                                                        hours
                                                    </span>
                                                    <span>
                                                        Last updated:{' '}
                                                        {formatDate(
                                                            task.updated_at,
                                                        )}
                                                    </span>
                                                </div>

                                                {task.challenges && (
                                                    <div className="mt-2 rounded bg-orange-100 p-2 text-sm dark:bg-white/10">
                                                        <span className="font-medium">
                                                            Challenges:
                                                        </span>{' '}
                                                        {
                                                            task.challenges
                                                                .description
                                                        }
                                                    </div>
                                                )}
                                            </div>
                                            <div className="ml-4 flex items-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() =>
                                                        handleEditModal(task)
                                                    }
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-red-600 hover:bg-red-50 hover:text-red-700"
                                                    onClick={() =>
                                                        handleDeleteModal(task)
                                                    }
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>

                    {tasks.last_page > 1 && (
                        <CardFooter className="flex items-center justify-between border-t px-6 py-4">
                            <div className="text-sm text-muted-foreground">
                                Page {tasks.current_page} of {tasks.last_page}
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        handlePageChange(tasks.current_page - 1)
                                    }
                                    disabled={tasks.current_page === 1}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                    Previous
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        handlePageChange(tasks.current_page + 1)
                                    }
                                    disabled={
                                        tasks.current_page === tasks.last_page
                                    }
                                >
                                    Next
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardFooter>
                    )}
                </Card>

                <Dialog
                    open={isDeleteModalOpen}
                    onOpenChange={setIsDeleteModalOpen}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Delete Task Entry</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete "
                                {selectedTask?.title}"? This action cannot be
                                undone.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setIsDeleteModalOpen(false)}
                                disabled={processing}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleDelete}
                                disabled={processing}
                            >
                                {processing ? 'Deleting...' : 'Delete Task'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
