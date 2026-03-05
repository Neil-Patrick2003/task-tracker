import { Head } from '@inertiajs/react';
import { 
    ClipboardList, 
    Clock, 
    CheckCircle2, 
    AlertCircle, 
    MessageSquare,
    TrendingUp,
    CalendarDays,
    Loader2
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/trainee/dashboard',
    },
];

// Static data for demonstration
const stats = {
    totalTasks: 24,
    totalHours: 156,
    completedTasks: 18,
    ongoingTasks: 6,
    pendingSupport: 2,
    supervisorReplies: 3,
};

const recentTasks = [
    {
        id: 1,
        title: 'Database Schema Design',
        date: '2026-03-05',
        hours: 4,
        status: 'Completed',
        hasChallenge: false,
    },
    {
        id: 2,
        title: 'API Integration for User Module',
        date: '2026-03-04',
        hours: 6,
        status: 'Ongoing',
        hasChallenge: true,
    },
    {
        id: 3,
        title: 'Frontend Dashboard Components',
        date: '2026-03-03',
        hours: 5,
        status: 'Completed',
        hasChallenge: false,
    },
    {
        id: 4,
        title: 'Unit Testing Setup',
        date: '2026-03-02',
        hours: 3,
        status: 'Completed',
        hasChallenge: true,
    },
];

const supportRequests = [
    {
        id: 1,
        title: 'Need help with API authentication',
        status: 'Replied',
        date: '2026-03-04',
    },
    {
        id: 2,
        title: 'Database connection issues',
        status: 'Pending',
        date: '2026-03-05',
    },
    {
        id: 3,
        title: 'Clarification on project requirements',
        status: 'Resolved',
        date: '2026-03-01',
    },
];

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'Completed':
            return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>;
        case 'Ongoing':
            return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Ongoing</Badge>;
        default:
            return <Badge variant="secondary">{status}</Badge>;
    }
};

const getSupportStatusBadge = (status: string) => {
    switch (status) {
        case 'Pending':
            return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">🟡 Pending</Badge>;
        case 'Replied':
            return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">🔵 Replied</Badge>;
        case 'Resolved':
            return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">🟢 Resolved</Badge>;
        default:
            return <Badge variant="secondary">{status}</Badge>;
    }
};

export default function TraineeDashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Intern Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                {/* Welcome Section */}
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Welcome back, Intern!</h1>
                    <p className="text-muted-foreground">
                        Here's an overview of your OJT progress
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
                            <ClipboardList className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalTasks}</div>
                            <p className="text-xs text-muted-foreground">
                                Tasks submitted this OJT
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalHours}</div>
                            <p className="text-xs text-muted-foreground">
                                Hours rendered
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Completed</CardTitle>
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.completedTasks}</div>
                            <p className="text-xs text-muted-foreground">
                                <span className="text-green-600">{stats.ongoingTasks} ongoing</span>
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Support Requests</CardTitle>
                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.pendingSupport}</div>
                            <p className="text-xs text-muted-foreground">
                                <span className="text-blue-600">{stats.supervisorReplies} replies</span>
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
                                <CardDescription>Your task completion rate</CardDescription>
                            </div>
                            <TrendingUp className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4">
                                <div className="text-4xl font-bold text-green-600">
                                    {Math.round((stats.completedTasks / stats.totalTasks) * 100)}%
                                </div>
                                <div className="flex-1">
                                    <div className="h-3 w-full rounded-full bg-gray-200">
                                        <div 
                                            className="h-3 rounded-full bg-green-600" 
                                            style={{ width: `${(stats.completedTasks / stats.totalTasks) * 100}%` }}
                                        />
                                    </div>
                                    <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                                        <span>{stats.completedTasks} completed</span>
                                        <span>{stats.ongoingTasks} ongoing</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Weekly Activity</CardTitle>
                                <CardDescription>Tasks submitted this week</CardDescription>
                            </div>
                            <CalendarDays className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-end gap-2 h-20">
                                {[3, 5, 2, 4, 6, 3, 1].map((count, i) => (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                        <div 
                                            className="w-full bg-primary/80 rounded-t" 
                                            style={{ height: `${count * 12}px` }}
                                        />
                                        <span className="text-xs text-muted-foreground">
                                            {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Activity */}
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Recent Tasks */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Tasks</CardTitle>
                            <CardDescription>Your latest task entries</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentTasks.map((task) => (
                                    <div key={task.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">{task.title}</span>
                                                {task.hasChallenge && (
                                                    <AlertCircle className="h-4 w-4 text-yellow-500" />
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
                            <CardDescription>Status of your support requests</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {supportRequests.map((request) => (
                                    <div key={request.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                                        <div className="flex-1">
                                            <div className="font-medium">{request.title}</div>
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
