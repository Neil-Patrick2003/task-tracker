import { Head, router, useForm } from '@inertiajs/react';
import {
    Plus,
    HelpCircle,
    MessageSquare,
    Clock,
    CheckCircle2,
    Search,
    Filter,
    ChevronDown,
    ChevronUp,
    AlertTriangle,
    ChevronRight,
    X,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import Pagination from '@/components/pagination';
import SupportForm from '@/components/supports/SupportForm';
import type { PaginatedData } from '@/components/types';
import type { Request } from '@/components/types/models/SupportRequest';
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
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

interface Task {
    id: number;
    title: string;
}

interface Props {
    requests: PaginatedData<Request>;
    tasks: Task[];
    filters?: {
        status?: string;
        subject?: string;
    };
    sort?: string;
    submitted_requests: number;
    replied_requests: number;
    resolved_requests: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/trainee/dashboard',
    },
    {
        title: 'Support',
        href: '/trainee/support-requests',
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

export default function Support({
    requests,
    tasks,
    filters = {},
    sort,
    submitted_requests,
    replied_requests,
    resolved_requests,
}: Props) {
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState(filters.subject || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
    const [isEditing, setIsEditing] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<Request | null>(
        null,
    );
    const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
    const [requestToResolve, setRequestToResolve] = useState<Request | null>(
        null,
    );

    const { patch, processing } = useForm({});

    // Check if any filters are active
    const hasActiveFilters = statusFilter !== 'all' || searchQuery;

    const handleStatusFilter = (value: string) => {
        setStatusFilter(value);

        const params: any = {
            filter: {
                ...(value !== 'all' && { status: value }),
                ...(searchQuery && { subject: searchQuery }),
            },
        };

        // Only add sort if it exists
        if (sort) {
            params.sort = sort;
        }

        router.get('/trainee/support-requests', params, {
            preserveState: true,
            replace: true,
        });
    };

    const handleSearch = (value: string) => {
        setSearchQuery(value);

        const params: any = {
            filter: {
                ...(statusFilter !== 'all' && { status: statusFilter }),
                ...(value && { subject: value }),
            },
        };

        // Only add sort if it exists
        if (sort) {
            params.sort = sort;
        }

        router.get('/trainee/support-requests', params, {
            preserveState: true,
            replace: true,
        });
    };

    const handleClearFilters = () => {
        setSearchQuery('');
        setStatusFilter('all');

        router.get(
            '/trainee/support-requests',
            {},
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const handleOpenModal = () => {
        setIsEditing(false);
        setSelectedRequest(null);
        setIsOpenModal(true);
    };

    const toggleExpand = (id: number) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const handleMarkAsResolve = (request: Request) => {
        setRequestToResolve(request);
        setIsResolveModalOpen(true);
    };

    const confirmResolve = () => {
        if (requestToResolve) {
            patch(`/trainee/support-requests/${requestToResolve.id}/resolve`, {
                onSuccess: () => {
                    setIsResolveModalOpen(false);
                    setRequestToResolve(null);
                    setExpandedId(null);
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Support Requests" />
            <SupportForm
                open={isOpenModal}
                onOpenChange={setIsOpenModal}
                initialData={selectedRequest}
                isEditing={isEditing}
                tasks={tasks}
            />

            {/* Resolve Confirmation Modal */}
            <Dialog
                open={isResolveModalOpen}
                onOpenChange={setIsResolveModalOpen}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                            Mark as Resolved
                        </DialogTitle>
                        <DialogDescription>
                            Are you sure you want to mark this support request
                            as resolved?
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <p className="text-sm text-muted-foreground">
                            <span className="font-medium text-foreground">
                                Request:
                            </span>{' '}
                            {requestToResolve?.subject}
                        </p>
                    </div>
                    <DialogFooter className="gap-2">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsResolveModalOpen(false);
                                setRequestToResolve(null);
                            }}
                            disabled={processing}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="default"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={confirmResolve}
                            disabled={processing}
                        >
                            {processing
                                ? 'Processing...'
                                : 'Yes, Mark as Resolved'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Support Requests
                        </h1>
                        <p className="text-muted-foreground">
                            Request help and track support from your supervisor
                        </p>
                    </div>
                    <Button onClick={handleOpenModal}>
                        <Plus className="mr-2 h-4 w-4" />
                        New Request
                    </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Pending
                            </CardTitle>
                            <Clock className="h-4 w-4 text-yellow-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-600">
                                {submitted_requests}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Awaiting supervisor response
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
                                Supervisor has responded
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

                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="relative max-w-sm flex-1">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search requests..."
                                className="pl-9"
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </div>
                        <Select
                            value={statusFilter}
                            onValueChange={handleStatusFilter}
                        >
                            <SelectTrigger className="w-[180px]">
                                <Filter className="mr-2 h-4 w-4" />
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="Submitted">
                                    Submitted
                                </SelectItem>
                                <SelectItem value="Replied">Replied</SelectItem>
                                <SelectItem value="Resolved">
                                    Resolved
                                </SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Clear Filters Button - Only show when filters are active */}
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
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                                Active filters:
                            </span>
                            <div className="flex flex-wrap gap-2">
                                {filters.status && (
                                    <Badge
                                        variant="secondary"
                                        className="gap-1"
                                    >
                                        Status: {filters.status}
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
                                {filters.subject && (
                                    <Badge
                                        variant="secondary"
                                        className="gap-1"
                                    >
                                        Search: "{filters.subject}"
                                        <button
                                            onClick={() => handleSearch('')}
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

                <Card className="flex-1">
                    <CardHeader>
                        <CardTitle>Support Request History</CardTitle>
                        <CardDescription>
                            {requests.data.length} request
                            {requests.data.length !== 1 ? 's' : ''} found
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {requests.data.length === 0 ? (
                            <div className="flex h-[200px] items-center justify-center text-muted-foreground">
                                No support requests found. Click "New Request"
                                if you need assistance.
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
                                                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                                                        <h3 className="font-semibold">
                                                            {request.subject}
                                                        </h3>
                                                        {getSupportStatusBadge(
                                                            request.status,
                                                        )}
                                                    </div>
                                                    <p className="line-clamp-1 text-sm text-muted-foreground">
                                                        {request.description}
                                                    </p>
                                                    <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                                                        <span>
                                                            Submitted:{' '}
                                                            {new Date(
                                                                request.created_at,
                                                            ).toLocaleDateString()}
                                                        </span>
                                                        <span>
                                                            Related to:{' '}
                                                            {request?.task
                                                                ?.title ||
                                                                'No task'}
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
                                                    {request.status !==
                                                        'Resolved' && (
                                                        <div className="flex justify-end">
                                                            <Button
                                                                variant="secondary"
                                                                className="cursor-pointer bg-green-600 text-white hover:bg-green-700"
                                                                onClick={() =>
                                                                    handleMarkAsResolve(
                                                                        request,
                                                                    )
                                                                }
                                                            >
                                                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                                                Mark as Resolved
                                                            </Button>
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
                    {requests.last_page > 1 && (
                        <CardFooter>
                            <Pagination
                                links={requests.links}
                                current_page={requests.current_page}
                                last_page={requests.last_page}
                            />
                        </CardFooter>
                    )}
                </Card>
            </div>
        </AppLayout>
    );
}
