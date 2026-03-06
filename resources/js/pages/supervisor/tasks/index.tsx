import { Head, router } from '@inertiajs/react';
import {
    Search,
    Filter,
    Calendar,
    Clock,
    CheckCircle2,
    Loader2,
    AlertCircle,
    User,
    Eye,
    X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import ReactSelect from 'react-select';
import Pagination from '@/components/pagination';
import type { PaginatedData } from '@/components/types';
import type { Task } from '@/components/types/models/Task';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
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
import AppLayout from '@/layouts/app-layout';
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

interface Trainee {
    id: number;
    name: string;
}

interface Props {
    trainees: Trainee[];
    tasks: PaginatedData<Task>;
    total_tasks: number;
    total_hours: number;
    completed_task: number;
    with_challenges: number;
    query?: {
        sort?: string | null;
        perPage?: number | string;
        page?: number | string;
        filter?: {
            status?: string;
            title?: string;
            trainee_name?: string;
        };
    };
}

// Option type for react-select
interface TraineeOption {
    value: string;
    label: string;
}

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'Completed':
            return (
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    Completed
                </Badge>
            );
        case 'In Progress':
            return (
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                    <Loader2 className="mr-1 h-3 w-3" />
                    In Progress
                </Badge>
            );
        default:
            return <Badge variant="secondary">{status}</Badge>;
    }
};

export default function SupervisorTasks({
    trainees,
    tasks,
    total_tasks,
    total_hours,
    completed_task,
    with_challenges,
    query,
}: Props) {
    // Initialize state with query parameters
    const [searchValue, setSearchValue] = useState(
        query?.filter?.trainee_name ?? '',
    );
    const [titleFilter, setTitleFilter] = useState(query?.filter?.title ?? '');
    const [statusFilter, setStatusFilter] = useState(
        query?.filter?.status ?? 'all',
    );
    const [selectedTrainee, setSelectedTrainee] =
        useState<TraineeOption | null>(
            query?.filter?.trainee_name
                ? {
                      value: query.filter.trainee_name,
                      label: query.filter.trainee_name,
                  }
                : null,
        );
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    // Prepare trainee options for react-select
    const traineeOptions: TraineeOption[] = trainees.map((trainee) => ({
        value: trainee.name,
        label: trainee.name,
    }));

    // Check if any filters are active
    const hasActiveFilters = Object.keys(query?.filter || {}).length > 0;

    // Debounced search for title
    useEffect(() => {
        const timer = setTimeout(() => {
            const params: any = {
                sort: query?.sort,
                page: 1,
                filter: {
                    ...(statusFilter !== 'all' && { status: statusFilter }),
                    ...(titleFilter && { title: titleFilter }),
                    ...(selectedTrainee?.value && {
                        trainee_name: selectedTrainee.value,
                    }),
                },
            };

            // Remove empty filter object
            if (Object.keys(params.filter).length === 0) {
                delete params.filter;
            }

            router.get('/supervisor/tasks', params, {
                preserveState: true,
                replace: true,
                preserveScroll: true,
            });
        }, 500);

        return () => clearTimeout(timer);
    }, [titleFilter, statusFilter, selectedTrainee, query?.sort]);

    const handleStatusFilter = (value: string) => {
        setStatusFilter(value);
    };

    const handleTitleSearch = (value: string) => {
        setTitleFilter(value);
    };

    const handleTraineeChange = (option: TraineeOption | null) => {
        setSelectedTrainee(option);
        setSearchValue(option?.value || '');
    };

    const handleClearFilters = () => {
        setSearchValue('');
        setTitleFilter('');
        setStatusFilter('all');
        setSelectedTrainee(null);

        router.get(
            '/supervisor/tasks',
            {},
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const openTaskDetail = (task: Task) => {
        setSelectedTask(task);
        setIsDetailOpen(true);
    };

    // Custom styles for react-select to match shadcn/ui
    const selectStyles = {
        control: (base: any) => ({
            ...base,
            minHeight: '36px',
            height: '36px',
            borderColor: 'hsl(var(--input))',
            backgroundColor: 'hsl(var(--background))',
            '&:hover': {
                borderColor: 'hsl(var(--ring))',
            },
        }),
        valueContainer: (base: any) => ({
            ...base,
            padding: '0 8px',
            height: '36px',
        }),
        input: (base: any) => ({
            ...base,
            margin: 0,
            padding: 0,
            color: 'hsl(var(--foreground))',
        }),
        singleValue: (base: any) => ({
            ...base,
            color: 'hsl(var(--foreground))',
        }),
        menu: (base: any) => ({
            ...base,
            backgroundColor: 'hsl(var(--background))',
            border: '1px solid hsl(var(--border))',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        }),
        option: (base: any, state: any) => ({
            ...base,
            backgroundColor: state.isFocused
                ? 'hsl(var(--accent))'
                : 'hsl(var(--background))',
            color: 'hsl(var(--foreground))',
            '&:active': {
                backgroundColor: 'hsl(var(--accent))',
            },
        }),
        placeholder: (base: any) => ({
            ...base,
            color: 'hsl(var(--muted-foreground))',
        }),
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Task Monitoring" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Task Monitoring
                    </h1>
                    <p className="text-muted-foreground">
                        View and monitor all submitted tasks from interns
                    </p>
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
                                        {completed_task}
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
                                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold">
                                        {with_challenges}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        With Challenges
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="relative max-w-sm flex-1">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                type="text"
                                value={titleFilter}
                                onChange={(e) =>
                                    handleTitleSearch(e.target.value)
                                }
                                placeholder="Search by task title..."
                                className="h-9 pl-8 text-sm"
                            />
                        </div>

                        <div className="w-[250px]">
                            <ReactSelect
                                options={traineeOptions}
                                value={selectedTrainee}
                                onChange={handleTraineeChange}
                                placeholder="Filter by trainee..."
                                isClearable
                                styles={selectStyles}
                                className="text-sm"
                            />
                        </div>

                        <Select
                            value={statusFilter}
                            onValueChange={handleStatusFilter}
                        >
                            <SelectTrigger className="w-[150px]">
                                <Filter className="mr-2 h-4 w-4" />
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="In Progress">In Progress</SelectItem>
                                <SelectItem value="Completed">
                                    Completed
                                </SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Clear Filters Button */}
                        {hasActiveFilters && (
                            <Button
                                variant="ghost"
                                onClick={handleClearFilters}
                                className="gap-2"
                            >
                                <X className="h-4 w-4" />
                                Clear Filters
                            </Button>
                        )}
                    </div>

                    {/* Active Filters Display */}
                    {hasActiveFilters && (
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                                Active filters:
                            </span>
                            <div className="flex flex-wrap gap-2">
                                {query?.filter?.status && (
                                    <Badge
                                        variant="secondary"
                                        className="gap-1"
                                    >
                                        Status: {query.filter.status}
                                        <button
                                            onClick={() =>
                                                handleStatusFilter('all')
                                            }
                                            className="ml-1 hover:text-destructive"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                )}
                                {query?.filter?.title && (
                                    <Badge
                                        variant="secondary"
                                        className="gap-1"
                                    >
                                        Title: "{query.filter.title}"
                                        <button
                                            onClick={() =>
                                                handleTitleSearch('')
                                            }
                                            className="ml-1 hover:text-destructive"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                )}
                                {query?.filter?.trainee_name && (
                                    <Badge
                                        variant="secondary"
                                        className="gap-1"
                                    >
                                        Trainee: {query.filter.trainee_name}
                                        <button
                                            onClick={() =>
                                                handleTraineeChange(null)
                                            }
                                            className="ml-1 hover:text-destructive"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Task List - Using tasks from backend */}
                <Card className="flex-1">
                    <CardHeader>
                        <CardTitle>Submitted Tasks</CardTitle>
                        <CardDescription>
                            {tasks.data.length} task
                            {tasks.data.length !== 1 ? 's' : ''} found
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {tasks.data.length === 0 ? (
                            <div className="flex h-[200px] items-center justify-center text-muted-foreground">
                                No tasks found matching your filters.
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
                                                <div className="mb-1 flex items-center gap-2">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium">
                                                        {task.ojt?.name?.charAt(
                                                            0,
                                                        ) || 'U'}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold">
                                                            {task.title}
                                                        </h3>
                                                        <span className="text-sm text-muted-foreground">
                                                            {task.ojt?.name ||
                                                                'Unknown'}
                                                        </span>
                                                    </div>
                                                    <div className="ml-2 flex gap-2">
                                                        {getStatusBadge(
                                                            task.status,
                                                        )}
                                                        {task.requests && (
                                                            <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                                                                <AlertCircle className="mr-1 h-3 w-3" />
                                                                Support Needed
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                                <p className="mt-2 ml-10 text-sm text-muted-foreground">
                                                    {task.description}
                                                </p>
                                                <div className="mt-2 ml-10 flex items-center gap-4 text-xs text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        {new Date(
                                                            task.date,
                                                        ).toLocaleDateString()}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        {task.hoursRendered}{' '}
                                                        hours
                                                    </span>
                                                </div>
                                                {task.challenges &&
                                                    task.challenges.length >
                                                        0 && (
                                                        <div className="mt-2 ml-10 rounded bg-yellow-50 p-2 text-sm text-gray-900">
                                                            <span className="font-medium">
                                                                Challenges:
                                                            </span>{' '}
                                                            {task.challenges
                                                                .map(
                                                                    (c) =>
                                                                        c.description,
                                                                )
                                                                .join(', ')}
                                                        </div>
                                                    )}
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    openTaskDetail(task)
                                                }
                                            >
                                                <Eye className="mr-1 h-4 w-4" />
                                                View Details
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>

                    {/* Pagination */}
                    {tasks.last_page > 1 && (
                        <CardContent>
                            <Pagination
                                links={tasks.links}
                                current_page={tasks.current_page}
                                last_page={tasks.last_page}
                            />
                        </CardContent>
                    )}
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
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-medium">
                                        {selectedTask.ojt?.name?.charAt(0) ||
                                            'U'}
                                    </div>
                                    <div>
                                        <div className="text-lg font-semibold">
                                            {selectedTask.ojt?.name ||
                                                'Unknown'}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            Submitted on{' '}
                                            {new Date(
                                                selectedTask.date,
                                            ).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="rounded-lg bg-accent p-3">
                                        <div className="text-sm text-muted-foreground">
                                            Task Title
                                        </div>
                                        <div className="font-medium">
                                            {selectedTask.title}
                                        </div>
                                    </div>
                                    <div className="rounded-lg bg-accent p-3">
                                        <div className="text-sm text-muted-foreground">
                                            Hours Rendered
                                        </div>
                                        <div className="font-medium">
                                            {selectedTask.hoursRendered} hours
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className="mb-1 text-sm text-muted-foreground">
                                        Description
                                    </div>
                                    <p className="rounded-lg bg-accent p-3">
                                        {selectedTask.description}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="text-sm text-muted-foreground">
                                        Status:
                                    </div>
                                    {getStatusBadge(selectedTask.status)}
                                </div>

                                {selectedTask?.challenges && (
                                    <div>
                                        <div className="mb-1 text-sm text-muted-foreground">
                                            Challenges
                                        </div>
                                        {Array.isArray(
                                            selectedTask.challenges,
                                        ) ? (
                                            selectedTask.challenges.map(
                                                (challenge, index) => (
                                                    <p
                                                        key={index}
                                                        className="mb-2 rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-gray-900"
                                                    >
                                                        {challenge.description}
                                                    </p>
                                                ),
                                            )
                                        ) : (
                                            <p className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-gray-900">
                                                {
                                                    selectedTask.challenges
                                                        .description
                                                }
                                            </p>
                                        )}
                                    </div>
                                )}

                                {selectedTask.requests && (
                                    <div className="mt-2">
                                        <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                                            <AlertCircle className="h-4 w-4 text-yellow-500" />
                                            Support Request
                                        </div>
                                        {Array.isArray(
                                            selectedTask.requests,
                                        ) ? (
                                            selectedTask.requests.map(
                                                (request, index) => (
                                                    <div
                                                        key={index}
                                                        className="mb-2 rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-gray-900"
                                                    >
                                                        <p className="font-medium">
                                                            {request.subject}
                                                        </p>
                                                        <p className="mt-1 text-sm">
                                                            {
                                                                request.description
                                                            }
                                                        </p>
                                                        <Badge className="mt-2">
                                                            {request.status}
                                                        </Badge>
                                                    </div>
                                                ),
                                            )
                                        ) : (
                                            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-gray-900">
                                                <p className="font-medium">
                                                    {
                                                        selectedTask.requests
                                                            .subject
                                                    }
                                                </p>
                                                <p className="mt-1 text-sm">
                                                    {
                                                        selectedTask.requests
                                                            .description
                                                    }
                                                </p>
                                                <Badge className="mt-2">
                                                    {
                                                        selectedTask.requests
                                                            .status
                                                    }
                                                </Badge>
                                            </div>
                                        )}
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
