import { Head, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Select from 'react-select';
import {
    Search,
    User,
    Clock,
    CheckCircle2,
    TrendingUp,
    CalendarDays,
    MessageSquare,
    Eye,
    ClipboardList,
    X,
    Pencil,
    Plus,
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import type { BreadcrumbItem } from '@/types';
import type { PaginatedData } from '@/components/types';
import type { User as UserType } from '@/types';
import InternFormData from '@/components/interns/InternFormData';

interface Intern extends UserType {
    tasks?: {
        id: number;
        title: string;
        description: string;
        status: string;
        hoursRendered: number;
        date: string;
        created_at: string;
    }[];
    support_requests?: {
        id: number;
        subject: string;
        description: string;
        status: string;
        created_at: string;
    }[];
}

interface Props {
    interns: PaginatedData<Intern>;
    query?: {
        filter?: {
            name?: string;
        };
        sort?: string;
        page?: number;
        perPage?: number;
    };
    all_interns: number;
    avg_completion: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/supervisor/dashboard',
    },
    {
        title: 'Interns',
        href: '/supervisor/interns',
    },
];

const getCompletionBadge = (rate: number) => {
    if (rate >= 85)
        return <Badge className="bg-green-100 text-green-800">Excellent</Badge>;
    if (rate >= 70)
        return <Badge className="bg-blue-100 text-blue-800">Good</Badge>;
    if (rate >= 50)
        return <Badge className="bg-yellow-100 text-yellow-800">Fair</Badge>;
    return <Badge className="bg-red-100 text-red-800">Needs Improvement</Badge>;
};

export default function SupervisorInterns({
    interns,
    query,
    all_interns,
    avg_completion,
}: Props) {
    const [searchQuery, setSearchQuery] = useState(query?.filter?.name || '');
    const [selectedIntern, setSelectedIntern] = useState<Intern | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
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

    const handleSearch = (value: string) => {
        setSearchQuery(value);
        router.get(
            '/supervisor/interns',
            {
                filter: { name: value || undefined },
            },
            { preserveState: true, replace: true },
        );
    };

    const handlePageChange = (page: number) => {
        router.get(
            '/supervisor/interns',
            {
                page,
                filter: { name: searchQuery || undefined },
            },
            { preserveState: true },
        );
    };

    const openInternDetail = (intern: Intern) => {
        setSelectedIntern(intern);
        setIsDetailOpen(true);
    };

    const calculateInternStats = (intern: Intern) => {
        const tasks = intern.tasks || [];
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(
            (t) => t.status === 'Completed',
        ).length;
        const ongoingTasks = tasks.filter(
            (t) => t.status === 'Ongoing' || t.status === 'Pending',
        ).length;
        const totalHours = tasks.reduce(
            (sum, t) => sum + (t.hoursRendered || 0),
            0,
        );
        const completionRate =
            totalTasks > 0
                ? Math.round((completedTasks / totalTasks) * 100)
                : 0;

        const supportRequests = intern.support_requests || [];
        const pendingSupport = supportRequests.filter(
            (s) => s.status === 'Submitted' || s.status === 'Replied',
        ).length;
        const resolvedSupport = supportRequests.filter(
            (s) => s.status === 'Resolved',
        ).length;

        // Calculate daily consistency (simplified)
        const uniqueDays = new Set(tasks.map((t) => t.date)).size;
        const totalDays = 30; // Example: last 30 days
        const dailyConsistency = Math.min(
            100,
            Math.round((uniqueDays / totalDays) * 100),
        );

        return {
            totalTasks,
            completedTasks,
            ongoingTasks,
            totalHours,
            completionRate,
            pendingSupport,
            resolvedSupport,
            dailyConsistency,
        };
    };

    const getRecentTasks = (intern: Intern) => {
        return (intern.tasks || [])
            .sort(
                (a, b) =>
                    new Date(b.created_at).getTime() -
                    new Date(a.created_at).getTime(),
            )
            .slice(0, 3);
    };

    const totalHours = interns.data.reduce((sum, intern) => {
        const tasks = intern.tasks || [];
        return sum + tasks.reduce((s, t) => s + (t.hoursRendered || 0), 0);
    }, 0);

    const pendingSupportTotal = interns.data.reduce((sum, intern) => {
        const supportRequests = intern.support_requests || [];
        return (
            sum +
            supportRequests.filter(
                (s) => s.status === 'Submitted' || s.status === 'Replied',
            ).length
        );
    }, 0);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const handleAddNew = () => {
        setIsEditing(false);
        setSelectedIntern(null);
        setIsModalOpen(true);
    };

    const handleEdit = (intern: Intern) => {
        setIsEditing(true);
        setSelectedIntern(intern);
        setIsModalOpen(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <InternFormData
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                initialData={selectedIntern}
                isEditing={isEditing}
            />
            <Head title="Intern Performance" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex justify-between">
                    {/* Header */}
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Intern Performance
                        </h1>
                        <p className="text-muted-foreground">
                            Track and monitor individual intern progress and
                            performance
                        </p>
                    </div>
                    <Button variant="default" onClick={handleAddNew}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add New Intern
                    </Button>
                </div>

                {/* Summary Stats */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                    <User className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold">
                                        {all_interns}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Total Interns
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
                                        {totalHours}
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
                                    <TrendingUp className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold">
                                        {Math.round(avg_completion)}%
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Avg Completion
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100">
                                    <MessageSquare className="h-5 w-5 text-yellow-600" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold">
                                        {pendingSupportTotal}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Pending Support
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Search */}
                <div className="flex items-center gap-4">
                    <div className="relative max-w-sm flex-1">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search interns by name..."
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
                </div>

                {/* Interns Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {interns.data.map((intern) => {
                        const stats = calculateInternStats(intern);
                        const recentTasks = getRecentTasks(intern);

                        return (
                            <Card
                                key={intern.id}
                                className="transition-shadow hover:shadow-md"
                            >
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-medium">
                                                {intern.name
                                                    ?.split(' ')
                                                    .map((n) => n?.[0])
                                                    .join('') || 'U'}
                                            </div>
                                            <div>
                                                <CardTitle className="text-lg">
                                                    {intern.name}
                                                </CardTitle>
                                                <CardDescription>
                                                    {intern.email}
                                                </CardDescription>
                                            </div>
                                        </div>
                                        {getCompletionBadge(
                                            stats.completionRate,
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {/* Progress Bar */}
                                        <div>
                                            <div className="mb-1 flex justify-between text-sm">
                                                <span className="text-muted-foreground">
                                                    Completion Rate
                                                </span>
                                                <span className="font-medium">
                                                    {stats.completionRate}%
                                                </span>
                                            </div>
                                            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                                                <div
                                                    className="h-full rounded-full bg-green-500 transition-all"
                                                    style={{
                                                        width: `${stats.completionRate}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        {/* Stats Grid */}
                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                            <div className="flex items-center gap-2">
                                                <ClipboardList className="h-4 w-4 text-muted-foreground" />
                                                <span>
                                                    {stats.totalTasks} tasks
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-4 w-4 text-muted-foreground" />
                                                <span>
                                                    {stats.totalHours} hours
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                <span>
                                                    {stats.completedTasks}{' '}
                                                    completed
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                                                <span>
                                                    {stats.dailyConsistency}%
                                                    consistent
                                                </span>
                                            </div>
                                        </div>

                                        {/* Support Status */}
                                        {stats.pendingSupport > 0 && (
                                            <div className="flex items-center gap-2 rounded bg-yellow-50 p-2 text-sm text-yellow-700">
                                                <MessageSquare className="h-4 w-4" />
                                                {stats.pendingSupport} pending
                                                support request
                                                {stats.pendingSupport > 1
                                                    ? 's'
                                                    : ''}
                                            </div>
                                        )}

                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                className="flex-1"
                                                onClick={() =>
                                                    openInternDetail(intern)
                                                }
                                            >
                                                <Eye className="mr-2 h-4 w-4" />
                                                View
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() =>
                                                    handleEdit(intern)
                                                }
                                                className="border-blue-200 hover:bg-blue-50"
                                            >
                                                <Pencil className="h-4 w-4 text-blue-600" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Pagination */}
                {interns.last_page > 1 && (
                    <CardFooter className="flex items-center justify-between px-6 py-4">
                        <div className="text-sm text-muted-foreground">
                            Page {interns.current_page} of {interns.last_page}
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    handlePageChange(interns.current_page - 1)
                                }
                                disabled={interns.current_page === 1}
                            >
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    handlePageChange(interns.current_page + 1)
                                }
                                disabled={
                                    interns.current_page === interns.last_page
                                }
                            >
                                Next
                            </Button>
                        </div>
                    </CardFooter>
                )}

                {/* Intern Detail Modal */}
                <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>
                                Intern Performance Details
                            </DialogTitle>
                            <DialogDescription>
                                Comprehensive view of intern's OJT progress
                            </DialogDescription>
                        </DialogHeader>
                        {selectedIntern && (
                            <div className="space-y-6">
                                {(() => {
                                    const stats =
                                        calculateInternStats(selectedIntern);
                                    const recentTasks =
                                        getRecentTasks(selectedIntern);

                                    return (
                                        <>
                                            {/* Intern Info */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-medium">
                                                        {selectedIntern.name
                                                            ?.split(' ')
                                                            .map((n) => n?.[0])
                                                            .join('') || 'U'}
                                                    </div>
                                                    <div>
                                                        <div className="text-xl font-semibold">
                                                            {
                                                                selectedIntern.name
                                                            }
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {
                                                                selectedIntern.email
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        setIsDetailOpen(false);
                                                        handleEdit(
                                                            selectedIntern,
                                                        );
                                                    }}
                                                    className="border-blue-200 hover:bg-blue-50"
                                                >
                                                    <Pencil className="mr-2 h-4 w-4 text-blue-600" />
                                                    Edit Profile
                                                </Button>
                                            </div>

                                            {/* Performance Stats */}
                                            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                                                <div className="rounded-lg bg-accent p-3 text-center">
                                                    <div className="text-2xl font-bold">
                                                        {stats.totalTasks}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        Total Tasks
                                                    </div>
                                                </div>
                                                <div className="rounded-lg bg-accent p-3 text-center">
                                                    <div className="text-2xl font-bold">
                                                        {stats.totalHours}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        Total Hours
                                                    </div>
                                                </div>
                                                <div className="rounded-lg bg-green-50 p-3 text-center">
                                                    <div className="text-2xl font-bold text-green-600">
                                                        {stats.completionRate}%
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        Completion Rate
                                                    </div>
                                                </div>
                                                <div className="rounded-lg bg-blue-50 p-3 text-center">
                                                    <div className="text-2xl font-bold text-blue-600">
                                                        {stats.dailyConsistency}
                                                        %
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        Daily Consistency
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Task Breakdown */}
                                            <div>
                                                <h4 className="mb-3 font-medium">
                                                    Task Breakdown
                                                </h4>
                                                <div className="flex items-center gap-4">
                                                    <div className="flex-1">
                                                        <div className="mb-1 flex justify-between text-sm">
                                                            <span>
                                                                Completed:{' '}
                                                                {
                                                                    stats.completedTasks
                                                                }
                                                            </span>
                                                            <span>
                                                                Ongoing:{' '}
                                                                {
                                                                    stats.ongoingTasks
                                                                }
                                                            </span>
                                                        </div>
                                                        <div className="flex h-3 w-full overflow-hidden rounded-full bg-gray-200">
                                                            <div
                                                                className="h-full bg-green-500"
                                                                style={{
                                                                    width: `${(stats.completedTasks / stats.totalTasks) * 100 || 0}%`,
                                                                }}
                                                            />
                                                            <div
                                                                className="h-full bg-blue-500"
                                                                style={{
                                                                    width: `${(stats.ongoingTasks / stats.totalTasks) * 100 || 0}%`,
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Support Requests */}
                                            <div>
                                                <h4 className="mb-3 font-medium">
                                                    Support Request Summary
                                                </h4>
                                                <div className="flex gap-4">
                                                    <div className="flex items-center gap-2 rounded bg-yellow-50 p-2">
                                                        <Badge className="bg-yellow-100 text-yellow-800">
                                                            {
                                                                stats.pendingSupport
                                                            }
                                                        </Badge>
                                                        <span className="text-sm">
                                                            Pending
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 rounded bg-green-50 p-2">
                                                        <Badge className="bg-green-100 text-green-800">
                                                            {
                                                                stats.resolvedSupport
                                                            }
                                                        </Badge>
                                                        <span className="text-sm">
                                                            Resolved
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Recent Tasks */}
                                            <div>
                                                <h4 className="mb-3 font-medium">
                                                    Recent Tasks
                                                </h4>
                                                <div className="space-y-2">
                                                    {recentTasks.map(
                                                        (task, i) => (
                                                            <div
                                                                key={i}
                                                                className="flex items-center justify-between rounded bg-accent p-2"
                                                            >
                                                                <div>
                                                                    <div className="text-sm font-medium">
                                                                        {
                                                                            task.title
                                                                        }
                                                                    </div>
                                                                    <div className="text-xs text-muted-foreground">
                                                                        {new Date(
                                                                            task.date ||
                                                                                task.created_at,
                                                                        ).toLocaleDateString()}
                                                                    </div>
                                                                </div>
                                                                <Badge
                                                                    className={
                                                                        task.status ===
                                                                        'Completed'
                                                                            ? 'bg-green-100 text-green-800'
                                                                            : 'bg-blue-100 text-blue-800'
                                                                    }
                                                                >
                                                                    {
                                                                        task.status
                                                                    }
                                                                </Badge>
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                        </>
                                    );
                                })()}
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
