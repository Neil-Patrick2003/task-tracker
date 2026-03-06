import { Head, router, useForm } from '@inertiajs/react';
import {
    Search,
    Filter,
    MessageSquare,
    Clock,
    CheckCircle2,
    User,
    Send,
    ChevronDown,
    ChevronUp,
    AlertCircle,
    X,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import Select from 'react-select';
import PaginationPrevNext from '@/components/pagination';
import type { PaginatedData } from '@/components/types';
import type { Request } from '@/components/types/models/SupportRequest';
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
import { Input } from '@/components/ui/input';
import {
    Select as ShadcnSelect,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

interface Trainee {
    id: number;
    name: string;
}

interface Props {
    requests: PaginatedData<Request>;
    trainees: Trainee[];
    query?: {
        filter?: {
            status?: string;
            subject?: string;
            trainee_name?: string;
        };
        sort?: string;
        page?: number;
        perPage?: number;
    };
    all_requests: number;
    submitted_requests: number;
    replied_requests: number;
    resolved_requests: number;
}

interface TraineeOption {
    value: string;
    label: string;
}

interface ReplyFormData {
    reply: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/supervisor/dashboard',
    },
    {
        title: 'Support Requests',
        href: '/supervisor/support',
    },
];

const getSupportStatusBadge = (status: string) => {
    switch (status) {
        case 'Submitted':
            return (
                <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                    🟡 Submitted
                </Badge>
            );
        case 'Replied':
            return (
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                    🔵 Replied
                </Badge>
            );
        case 'Resolved':
            return (
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                    🟢 Resolved
                </Badge>
            );
        default:
            return <Badge variant="secondary">{status}</Badge>;
    }
};

const getSelectStyles = (isDark: boolean) => ({
    control: (base: any, state: any) => ({
        ...base,
        backgroundColor: isDark ? '#1f2937' : 'white',
        borderColor: state.isFocused
            ? (isDark ? '#3b82f6' : '#3b82f6')
            : (isDark ? '#374151' : '#e5e7eb'),
        width: '180px',
        '&:hover': {
            borderColor: isDark ? '#4b5563' : '#d1d5db',
        },
    }),
    menu: (base: any) => ({
        ...base,
        backgroundColor: isDark ? '#1f2937' : 'white',
    }),
    option: (base: any, state: any) => ({
        ...base,
        backgroundColor: state.isSelected
            ? (isDark ? '#3b82f6' : '#3b82f6')
            : state.isFocused
                ? (isDark ? '#374151' : '#f3f4f6')
                : 'transparent',
        color: state.isSelected
            ? 'white'
            : (isDark ? '#f3f4f6' : '#111827'),
    }),
    singleValue: (base: any) => ({
        ...base,
        color: isDark ? '#f3f4f6' : '#111827',
    }),
    input: (base: any) => ({
        ...base,
        color: isDark ? '#f3f4f6' : '#111827',
    }),
    placeholder: (base: any) => ({
        ...base,
        color: isDark ? '#9ca3af' : '#6b7280',
    }),
    dropdownIndicator: (base: any) => ({
        ...base,
        color: isDark ? '#9ca3af' : '#6b7280',
    }),
    clearIndicator: (base: any) => ({
        ...base,
        color: isDark ? '#9ca3af' : '#6b7280',
        '&:hover': {
            color: isDark ? '#ef4444' : '#dc2626',
        },
    }),
});

export default function SupervisorSupport({
                                              requests,
                                              trainees,
                                              query,
                                              all_requests,
                                              submitted_requests,
                                              replied_requests,
                                              resolved_requests,
                                          }: Props) {
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState(
        query?.filter?.subject || '',
    );
    const [internFilter, setInternFilter] = useState<TraineeOption | null>(
        query?.filter?.trainee_name
            ? {
                value: query.filter.trainee_name,
                label: query.filter.trainee_name,
            }
            : null,
    );
    const [statusFilter, setStatusFilter] = useState(
        query?.filter?.status || 'all',
    );
    const [activeRequestId, setActiveRequestId] = useState<number | null>(null);
    const [isDarkMode, setIsDarkMode] = useState(
        document.documentElement.classList.contains('dark'),
    );

    useEffect(() => {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    setIsDarkMode(
                        document.documentElement.classList.contains('dark'),
                    );
                }
            });
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class'],
        });

        return () => observer.disconnect();
    }, []);

    const replyForm = useForm<ReplyFormData>({
        reply: '',
    });

    const resolveForm = useForm({});

    const traineeOptions: TraineeOption[] = trainees.map((trainee) => ({
        value: trainee.name,
        label: trainee.name,
    }));

    const handleStatusFilter = (value: string) => {
        setStatusFilter(value);
        router.get(
            '/supervisor/support-requests',
            {
                filter: {
                    status: value !== 'all' ? value : undefined,
                    subject: searchQuery || undefined,
                    trainee_name: internFilter?.value || undefined,
                },
            },
            { preserveState: true, replace: true },
        );
    };

    const handleInternFilter = (option: TraineeOption | null) => {
        setInternFilter(option);
        router.get(
            '/supervisor/support-requests',
            {
                filter: {
                    trainee_name: option?.value || undefined,
                    status: statusFilter !== 'all' ? statusFilter : undefined,
                    subject: searchQuery || undefined,
                },
            },
            { preserveState: true, replace: true },
        );
    };

    const handleSearch = (value: string) => {
        setSearchQuery(value);
        router.get(
            '/supervisor/support-requests',
            {
                filter: {
                    subject: value || undefined,
                    status: statusFilter !== 'all' ? statusFilter : undefined,
                    trainee_name: internFilter?.value || undefined,
                },
            },
            { preserveState: true, replace: true },
        );
    };

    const toggleExpand = (id: number) => {
        if (expandedId === id) {
            setExpandedId(null);
            setActiveRequestId(null);
            replyForm.reset();
        } else {
            setExpandedId(id);
            setActiveRequestId(id);
            replyForm.setData('reply', '');
        }
    };

    const handleSendReply = (requestId: number) => {
        replyForm.post(`/supervisor/support-requests/${requestId}/reply`, {
            onSuccess: () => {
                replyForm.reset();
                setExpandedId(null);
                setActiveRequestId(null);
            },
        });
    };

    const handleMarkAsResolved = (requestId: number) => {
        resolveForm.post(`/supervisor/support-requests/${requestId}/resolve`, {
            onSuccess: () => {
                setExpandedId(null);
                setActiveRequestId(null);
            },
        });
    };

    const handlePageChange = (page: number) => {
        router.get(
            '/supervisor/support-requests',
            {
                page,
                filter: {
                    status: statusFilter !== 'all' ? statusFilter : undefined,
                    subject: searchQuery || undefined,
                    trainee_name: internFilter?.value || undefined,
                },
            },
            { preserveState: true },
        );
    };

    const clearFilters = () => {
        setSearchQuery('');
        setInternFilter(null);
        setStatusFilter('all');
        router.get(
            '/supervisor/support-requests',
            {},
            { preserveState: true, replace: true },
        );
    };

    const hasActiveFilters =
        searchQuery || internFilter || statusFilter !== 'all';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Support Requests" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Support Requests
                    </h1>
                    <p className="text-muted-foreground">
                        View and respond to intern support requests
                    </p>
                </div>

                {/* Stats */}
                <div className="grid gap-4 md:grid-cols-4">

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                All Requests
                            </CardTitle>
                            <MessageSquare className="h-4 w-4 text-gray-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-600">
                                {all_requests}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Total support requests
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Submitted
                            </CardTitle>
                            <Clock className="h-4 w-4 text-yellow-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-600">
                                {submitted_requests}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Awaiting your response
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Replied
                            </CardTitle>
                            <MessageSquare className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">
                                {replied_requests}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Response sent
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Resolved
                            </CardTitle>
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                {resolved_requests}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Issues resolved
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative max-w-sm flex-1">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search requests by subject..."
                            className="pl-9"
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                        {searchQuery && (
                            <button
                                onClick={() => handleSearch('')}
                                className="absolute top-1/2 right-3 -translate-y-1/2"
                            >
                                <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                            </button>
                        )}
                    </div>

                    <Select
                        options={traineeOptions}
                        value={internFilter}
                        onChange={handleInternFilter}
                        placeholder="Filter by Intern"
                        isClearable
                        styles={getSelectStyles(isDarkMode)}
                        className="text-sm"
                    />

                    <ShadcnSelect
                        value={statusFilter}
                        onValueChange={handleStatusFilter}
                    >
                        <SelectTrigger className="w-[150px]">
                            <Filter className="mr-2 h-4 w-4" />
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="Submitted">Submitted</SelectItem>
                            <SelectItem value="Replied">Replied</SelectItem>
                            <SelectItem value="Resolved">Resolved</SelectItem>
                        </SelectContent>
                    </ShadcnSelect>

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

                {/* Request List */}
                <Card className="flex-1">
                    <CardHeader>
                        <CardTitle>Support Request List</CardTitle>
                        <CardDescription>
                            Showing {requests.from} to {requests.to} of{' '}
                            {requests.total} requests
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {requests.data.length === 0 ? (
                            <div className="flex h-[200px] items-center justify-center text-muted-foreground">
                                No support requests found matching your filters.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {requests.data.map((request) => (
                                    <div
                                        key={request.id}
                                        className="overflow-hidden rounded-lg border"
                                    >
                                        <div
                                            className="cursor-pointer p-4 transition-colors hover:bg-accent/50"
                                            onClick={() =>
                                                toggleExpand(request.id)
                                            }
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="mb-1 flex items-center gap-2">
                                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium">
                                                            {request.user?.name?.charAt(
                                                                0,
                                                            ) || 'U'}
                                                        </div>
                                                        <div>
                                                            <h3 className="font-semibold">
                                                                {
                                                                    request.subject
                                                                }
                                                            </h3>
                                                            <span className="text-sm text-muted-foreground">
                                                                {
                                                                    request.user
                                                                        ?.name
                                                                }
                                                            </span>
                                                        </div>
                                                        <div className="ml-2">
                                                            {getSupportStatusBadge(
                                                                request.status,
                                                            )}
                                                        </div>
                                                    </div>
                                                    <p className="mt-2 ml-10 line-clamp-1 text-sm text-muted-foreground">
                                                        {request.description}
                                                    </p>
                                                    <div className="mt-2 ml-10 flex items-center gap-4 text-xs text-muted-foreground">
                                                        <span>
                                                            Related:{' '}
                                                            {request.task
                                                                ?.title ||
                                                                'No task'}
                                                        </span>
                                                        <span>
                                                            Submitted:{' '}
                                                            {new Date(
                                                                request.created_at,
                                                            ).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                >
                                                    {expandedId ===
                                                    request.id ? (
                                                        <ChevronUp className="h-4 w-4" />
                                                    ) : (
                                                        <ChevronDown className="h-4 w-4" />
                                                    )}
                                                </Button>
                                            </div>
                                        </div>

                                        {expandedId === request.id && (
                                            <div className="border-t bg-accent/30 p-4">
                                                <div className="space-y-4">
                                                    <div>
                                                        <h4 className="mb-2 flex items-center gap-2 text-sm font-medium">
                                                            <AlertCircle className="h-4 w-4 text-yellow-500" />
                                                            Intern's Issue:
                                                        </h4>
                                                        <p className="rounded border bg-white p-3 text-sm">
                                                            {
                                                                request.description
                                                            }
                                                        </p>
                                                    </div>

                                                    {request?.response
                                                        ?.message && (
                                                        <div>
                                                            <h4 className="mb-2 flex items-center gap-2 text-sm font-medium">
                                                                <MessageSquare className="h-4 w-4 text-blue-500" />
                                                                Your Reply:
                                                            </h4>
                                                            <p className="rounded border border-blue-200 bg-blue-50 p-3 text-sm">
                                                                {
                                                                    request
                                                                        ?.response
                                                                        ?.message
                                                                }
                                                            </p>
                                                        </div>
                                                    )}

                                                    {request.status ===
                                                        'Submitted' && (
                                                        <div className="space-y-3">
                                                            <textarea
                                                                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                                                                placeholder="Type your response to the intern..."
                                                                value={
                                                                    activeRequestId ===
                                                                    request.id
                                                                        ? replyForm
                                                                              .data
                                                                              .reply
                                                                        : ''
                                                                }
                                                                onChange={(e) =>
                                                                    replyForm.setData(
                                                                        'reply',
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                            />
                                                            {replyForm.errors
                                                                .reply && (
                                                                <p className="text-sm text-red-500">
                                                                    {
                                                                        replyForm
                                                                            .errors
                                                                            .reply
                                                                    }
                                                                </p>
                                                            )}
                                                            <div className="flex items-center gap-2">
                                                                <Button
                                                                    onClick={() =>
                                                                        handleSendReply(
                                                                            request.id,
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        !replyForm.data.reply?.trim() ||
                                                                        replyForm.processing
                                                                    }
                                                                >
                                                                    <Send className="mr-2 h-4 w-4" />
                                                                    {replyForm.processing
                                                                        ? 'Sending...'
                                                                        : 'Send Reply'}
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {request.status ===
                                                        'Replied' && (
                                                            <div className='flex justify-end'>
                                                                <Button
                                                                    variant="secondary"
                                                                    className="border-green-600 text-green-600 hover:bg-green-50 cursor-pointer"
                                                                    onClick={() =>
                                                                        handleMarkAsResolved(
                                                                            request.id,
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        resolveForm.processing
                                                                    }
                                                                >
                                                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                                                    {resolveForm.processing
                                                                        ? 'Processing...'
                                                                        : 'Mark as Resolved'}
                                                                </Button>
                                                            </div>
                                                    )}

                                                    {request.status ===
                                                        'Resolved' && (
                                                        <div className="flex items-center gap-2 rounded bg-green-50 p-3 text-sm text-green-600">
                                                            <CheckCircle2 className="h-4 w-4" />
                                                            This issue has been
                                                            resolved.
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>

                    {/* Pagination */}
                    {requests.last_page > 1 && (
                        <CardContent className="border-t px-6 py-4">
                            <PaginationPrevNext
                                links={requests.links}
                                current_page={requests.current_page}
                                last_page={requests.last_page}
                            />
                        </CardContent>
                    )}
                </Card>
            </div>
        </AppLayout>
    );
}
