// resources/js/pages/trainee/dashboard.tsx

import { Head } from '@inertiajs/react';
import {
    ClipboardList,
    Clock,
    CheckCircle2,
    AlertCircle,
    MessageSquare,
    TrendingUp,
    CalendarDays,
    Loader2,
} from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import type { BreadcrumbItem } from '@/types';

interface Stats {
    totalTasks: number;
    totalHours: number;
    completedTasks: number;
    ongoingTasks: number;
    pendingSupport: number;
    supervisorReplies: number;
    completionRate: number;
}

interface WeeklyActivity {
    day: string;
    count: number;
}

interface RecentTask {
    id: number;
    title: string;
    date: string;
    hours: number;
    status: string;
    hasChallenge: boolean;
}

interface RecentRequest {
    id: number;
    title: string;
    status: string;
    date: string;
}

interface Props {
    stats: Stats;
    weeklyActivity: WeeklyActivity[];
    recentTasks: RecentTask[];
    recentRequests: RecentRequest[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/trainee/dashboard',
    },
];

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'Completed':
            return (
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                    Completed
                </Badge>
            );
        case 'Ongoing':
            return (
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                    Ongoing
                </Badge>
            );
        default:
            return <Badge variant="secondary">{status}</Badge>;
    }
};

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

export default function TraineeDashboard({
    stats,
    weeklyActivity,
    recentTasks,
    recentRequests,
}: Props) {
    const [hoveredBar, setHoveredBar] = useState<number | null>(null);

    // Find max value for scaling the bars
    const maxCount = Math.max(...weeklyActivity.map((item) => item.count), 1);
    const scaleFactor = maxCount > 0 ? 80 / maxCount : 1; // Scale to max height of 80px

    const dayNames = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Intern Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                {/* Welcome Section */}
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Welcome back, Intern!
                    </h1>
                    <p className="text-muted-foreground">
                        Here's an overview of your OJT progress
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Tasks
                            </CardTitle>
                            <ClipboardList className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.totalTasks}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Tasks submitted this OJT
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Hours
                            </CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.totalHours}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Hours rendered
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Completed
                            </CardTitle>
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.completedTasks}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                <span className="text-green-600">
                                    {stats.ongoingTasks} ongoing
                                </span>
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Support Requests
                            </CardTitle>
                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.pendingSupport}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                <span className="text-blue-600">
                                    {stats.supervisorReplies} replies
                                </span>
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Progress Overview */}
                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Task Completion</CardTitle>
                                <CardDescription>
                                    Your task completion rate
                                </CardDescription>
                            </div>
                            <TrendingUp className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4">
                                <div className="text-4xl font-bold text-green-600">
                                    {stats.completionRate}%
                                </div>
                                <div className="flex-1">
                                    <div className="h-3 w-full rounded-full bg-gray-200">
                                        <div
                                            className="h-3 rounded-full bg-green-600"
                                            style={{
                                                width: `${stats.completionRate}%`,
                                            }}
                                        />
                                    </div>
                                    <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                                        <span>
                                            {stats.completedTasks} completed
                                        </span>
                                        <span>
                                            {stats.ongoingTasks} ongoing
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Weekly Activity</CardTitle>
                                <CardDescription>
                                    Tasks submitted this week
                                </CardDescription>
                            </div>
                            <CalendarDays className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <TooltipProvider>
                                <div className="flex h-20 items-end gap-2">
                                    {weeklyActivity.map((item, i) => (
                                        <Tooltip key={i}>
                                            <TooltipTrigger asChild>
                                                <div
                                                    className="flex flex-1 cursor-pointer flex-col items-center gap-1"
                                                    onMouseEnter={() =>
                                                        setHoveredBar(i)
                                                    }
                                                    onMouseLeave={() =>
                                                        setHoveredBar(null)
                                                    }
                                                >
                                                    <div
                                                        className="w-full rounded-t bg-primary/80 transition-all hover:bg-primary"
                                                        style={{
                                                            height: `${Math.max(item.count * scaleFactor, 4)}px`,
                                                            opacity:
                                                                hoveredBar === i
                                                                    ? 1
                                                                    : 0.8,
                                                        }}
                                                    />
                                                    <span className="text-xs text-muted-foreground">
                                                        {item.day}
                                                    </span>
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent
                                                side="top"
                                                className="border bg-white shadow-lg dark:bg-gray-800"
                                            >
                                                <div className="text-sm">
                                                    <p className="font-medium">
                                                        {dayNames[i]}
                                                    </p>
                                                    <p className="text-muted-foreground">
                                                        {item.count} task
                                                        {item.count !== 1
                                                            ? 's'
                                                            : ''}
                                                    </p>
                                                </div>
                                            </TooltipContent>
                                        </Tooltip>
                                    ))}
                                </div>
                            </TooltipProvider>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Activity */}
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Recent Tasks */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Tasks</CardTitle>
                            <CardDescription>
                                Your latest task entries
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentTasks.map((task) => (
                                    <div
                                        key={task.id}
                                        className="flex items-center justify-between border-b pb-3 last:border-0"
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">
                                                    {task.title}
                                                </span>
                                                {task.hasChallenge && (
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger>
                                                                <AlertCircle className="h-4 w-4 text-yellow-500" />
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>
                                                                    Has
                                                                    challenge
                                                                    encountered
                                                                </p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                )}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {task.date} • {task.hours} hours
                                            </div>
                                        </div>
                                        {getStatusBadge(task.status)}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Support Requests */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Support Requests</CardTitle>
                            <CardDescription>
                                Status of your support requests
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentRequests.map((request) => (
                                    <div
                                        key={request.id}
                                        className="flex items-center justify-between border-b pb-3 last:border-0"
                                    >
                                        <div className="flex-1">
                                            <div className="font-medium">
                                                {request.title}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {request.date}
                                            </div>
                                        </div>
                                        {getSupportStatusBadge(request.status)}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
