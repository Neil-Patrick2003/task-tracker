import { Head, Link, usePage } from '@inertiajs/react';
import {
    Users,
    ClipboardList,
    Clock,
    MessageSquare,
    TrendingUp,
    Award,
    AlertCircle,
    ArrowRight,
    Calendar
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { BreadcrumbItem } from '@/types';

interface Stats {
    totalInterns: number;
    totalTasks: number;
    totalHours: number;
    pendingSupport: number;
    completionRate: number;
}

interface TopPerformer {
    name: string;
    tasks: number;
    hours: number;
    completionRate: number;
}

interface Intern {
    id: number;
    name: string;
    tasks: number;
    hours: number;
    completionRate: number;
    pendingSupport: number;
}

interface PendingRequest {
    id: number;
    intern: string;
    title: string;
    date: string;
}

interface RecentTask {
    id: number;
    intern: string;
    title: string;
    status: string;
    date: string;
}

interface MonthlyProgress {
    month: string;
    total_tasks: number;
    completed_tasks: number;
}

interface Props {
    stats: Stats;
    topPerformer: TopPerformer | null;
    interns: Intern[];
    pendingSupportRequests: PendingRequest[];
    recentTasks: RecentTask[];
    monthlyProgress: MonthlyProgress[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/supervisor/dashboard',
    },
];

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'Completed':
            return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>;
        case 'Ongoing':
            return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Ongoing</Badge>;
        case 'Pending':
            return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
        default:
            return <Badge variant="secondary">{status}</Badge>;
    }
};

export default function SupervisorDashboard({
                                                stats,
                                                topPerformer,
                                                interns,
                                                pendingSupportRequests,
                                                recentTasks
                                            }: Props) {

    const { auth } = usePage().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Supervisor Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                {/* Welcome Section */}
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Welcome, Sir {auth?.user?.name}!
                    </h1>
                    <p className="text-muted-foreground">
                        Here's an overview of your OJT interns' performance
                    </p>
                </div>

                {/* Overview Stats */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Interns
                            </CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.totalInterns}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Active OJT trainees
                            </p>
                        </CardContent>
                    </Card>
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
                                Submitted by all interns
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
                                Accumulated OJT hours
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Pending Support
                            </CardTitle>
                            <MessageSquare className="h-4 w-4 text-yellow-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-600">
                                {stats.pendingSupport}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Awaiting your response
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Completion Rate
                            </CardTitle>
                            <TrendingUp className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                {stats.completionRate}%
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Overall task completion
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Top Performer & Quick Actions */}
                <div className="grid gap-4 md:grid-cols-2">
                    {topPerformer && (
                        <Card className="border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50 dark:border-white/10 dark:bg-white/10 dark:from-transparent dark:to-transparent">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Award className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
                                    Top Performer
                                </CardTitle>
                                <CardDescription className="dark:text-gray-400">
                                    Intern with most completed tasks
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-4">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-200 text-2xl font-bold text-yellow-700 dark:bg-white/20 dark:text-yellow-400">
                                        {topPerformer.name?.charAt(0) || 'U'}
                                    </div>
                                    <div>
                                        <div className="text-xl font-bold dark:text-white">
                                            {topPerformer.name}
                                        </div>
                                        <div className="text-sm text-muted-foreground dark:text-gray-400">
                                            {topPerformer.tasks} tasks •{' '}
                                            {topPerformer.hours} hours •{' '}
                                            {topPerformer.completionRate}%
                                            completion
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <AlertCircle className="h-5 w-5 text-yellow-500" />
                                Pending Support Requests
                            </CardTitle>
                            <CardDescription>
                                Interns waiting for your help
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {pendingSupportRequests.length > 0 ? (
                                <div className="space-y-3">
                                    {pendingSupportRequests.map((request) => (
                                        <div
                                            key={request.id}
                                            className="flex items-center justify-between border-b pb-2 last:border-0"
                                        >
                                            <div>
                                                <div className="text-sm font-medium">
                                                    {request.title}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {request.intern} •{' '}
                                                    {request.date}
                                                </div>
                                            </div>
                                            <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                                                🟡 Pending
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="py-4 text-center text-sm text-muted-foreground">
                                    No pending support requests
                                </p>
                            )}
                            <Button
                                variant="outline"
                                className="mt-4 w-full"
                                asChild
                            >
                                <Link href="/supervisor/support-requests">
                                    View All Requests
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Intern Performance Table */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Intern Performance Summary</CardTitle>
                            <CardDescription>
                                Track each intern's progress
                            </CardDescription>
                        </div>
                        <Button variant="outline" asChild>
                            <Link href="/supervisor/interns">
                                View All
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {interns.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="px-4 py-3 text-left font-medium">
                                                Intern
                                            </th>
                                            <th className="px-4 py-3 text-center font-medium">
                                                Tasks
                                            </th>
                                            <th className="px-4 py-3 text-center font-medium">
                                                Hours
                                            </th>
                                            <th className="px-4 py-3 text-center font-medium">
                                                Completion Rate
                                            </th>
                                            <th className="px-4 py-3 text-center font-medium">
                                                Support
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {interns.map((intern) => (
                                            <tr
                                                key={intern.id}
                                                className="border-b last:border-0 hover:bg-accent/50"
                                            >
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium">
                                                            {intern.name.charAt(
                                                                0,
                                                            )}
                                                        </div>
                                                        <span className="font-medium">
                                                            {intern.name}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    {intern.tasks}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    {intern.hours}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <div className="h-2 w-16 overflow-hidden rounded-full bg-gray-200">
                                                            <div
                                                                className="h-full rounded-full bg-green-500"
                                                                style={{
                                                                    width: `${intern.completionRate}%`,
                                                                }}
                                                            />
                                                        </div>
                                                        <span className="text-sm">
                                                            {
                                                                intern.completionRate
                                                            }
                                                            %
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    {intern.pendingSupport >
                                                    0 ? (
                                                        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                                                            {
                                                                intern.pendingSupport
                                                            }{' '}
                                                            pending
                                                        </Badge>
                                                    ) : (
                                                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                                            None
                                                        </Badge>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="py-8 text-center text-sm text-muted-foreground">
                                No interns found
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Recent Task Submissions</CardTitle>
                            <CardDescription>
                                Latest tasks from all interns
                            </CardDescription>
                        </div>
                        <Button variant="outline" asChild>
                            <Link href="/supervisor/tasks">
                                View All Tasks
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {recentTasks.length > 0 ? (
                            <div className="space-y-4">
                                {recentTasks.map((task) => (
                                    <div
                                        key={task.id}
                                        className="flex items-center justify-between border-b pb-3 last:border-0"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-medium">
                                                {task.intern.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-medium">
                                                    {task.title}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <span>{task.intern}</span>
                                                    <span>•</span>
                                                    <Calendar className="h-3 w-3" />
                                                    <span>{task.date}</span>
                                                </div>
                                            </div>
                                        </div>
                                        {getStatusBadge(task.status)}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="py-8 text-center text-sm text-muted-foreground">
                                No recent tasks
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
