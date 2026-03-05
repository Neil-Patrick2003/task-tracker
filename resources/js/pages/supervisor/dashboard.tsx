import { Head } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { 
    Users, 
    ClipboardList, 
    Clock, 
    MessageSquare,
    TrendingUp,
    Award,
    AlertCircle,
    ArrowRight,
    CheckCircle2,
    Calendar
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/supervisor/dashboard',
    },
];

// Static data for demonstration
const stats = {
    totalInterns: 5,
    totalTasks: 87,
    totalHours: 520,
    pendingSupport: 3,
    completionRate: 82,
};

const interns = [
    { id: 1, name: 'John Doe', tasks: 24, hours: 156, completionRate: 75, pendingSupport: 1 },
    { id: 2, name: 'Jane Smith', tasks: 28, hours: 168, completionRate: 89, pendingSupport: 0 },
    { id: 3, name: 'Mike Johnson', tasks: 15, hours: 96, completionRate: 80, pendingSupport: 1 },
    { id: 4, name: 'Sarah Williams', tasks: 12, hours: 64, completionRate: 70, pendingSupport: 1 },
    { id: 5, name: 'Chris Brown', tasks: 8, hours: 36, completionRate: 85, pendingSupport: 0 },
];

const topPerformer = interns.reduce((prev, current) => 
    prev.tasks > current.tasks ? prev : current
);

const recentTasks = [
    { id: 1, intern: 'John Doe', title: 'API Integration', status: 'Ongoing', date: '2026-03-05' },
    { id: 2, intern: 'Jane Smith', title: 'Database Optimization', status: 'Completed', date: '2026-03-05' },
    { id: 3, intern: 'Mike Johnson', title: 'UI Component Library', status: 'Completed', date: '2026-03-04' },
    { id: 4, intern: 'Sarah Williams', title: 'Testing Setup', status: 'Ongoing', date: '2026-03-04' },
];

const pendingSupportRequests = [
    { id: 1, intern: 'John Doe', title: 'Need help with API authentication', date: '2026-03-05' },
    { id: 2, intern: 'Mike Johnson', title: 'Database connection issues', date: '2026-03-04' },
    { id: 3, intern: 'Sarah Williams', title: 'Clarification on requirements', date: '2026-03-03' },
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

export default function SupervisorDashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Supervisor Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                {/* Welcome Section */}
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Welcome, Sir Bryan!</h1>
                    <p className="text-muted-foreground">
                        Here's an overview of your OJT interns' performance
                    </p>
                </div>

                {/* Overview Stats */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Interns</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalInterns}</div>
                            <p className="text-xs text-muted-foreground">
                                Active OJT trainees
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
                            <ClipboardList className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalTasks}</div>
                            <p className="text-xs text-muted-foreground">
                                Submitted by all interns
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
                                Accumulated OJT hours
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending Support</CardTitle>
                            <MessageSquare className="h-4 w-4 text-yellow-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-600">{stats.pendingSupport}</div>
                            <p className="text-xs text-muted-foreground">
                                Awaiting your response
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                            <TrendingUp className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{stats.completionRate}%</div>
                            <p className="text-xs text-muted-foreground">
                                Overall task completion
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Top Performer & Quick Actions */}
                <div className="grid gap-4 md:grid-cols-2">
                    <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Award className="h-5 w-5 text-yellow-600" />
                                Top Performer
                            </CardTitle>
                            <CardDescription>Intern with most completed tasks</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4">
                                <div className="h-16 w-16 rounded-full bg-yellow-200 flex items-center justify-center text-2xl font-bold text-yellow-700">
                                    {topPerformer.name.charAt(0)}
                                </div>
                                <div>
                                    <div className="text-xl font-bold">{topPerformer.name}</div>
                                    <div className="text-sm text-muted-foreground">
                                        {topPerformer.tasks} tasks • {topPerformer.hours} hours • {topPerformer.completionRate}% completion
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <AlertCircle className="h-5 w-5 text-yellow-500" />
                                Pending Support Requests
                            </CardTitle>
                            <CardDescription>Interns waiting for your help</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {pendingSupportRequests.slice(0, 3).map((request) => (
                                    <div key={request.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                                        <div>
                                            <div className="font-medium text-sm">{request.title}</div>
                                            <div className="text-xs text-muted-foreground">{request.intern} • {request.date}</div>
                                        </div>
                                        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">🟡 Pending</Badge>
                                    </div>
                                ))}
                            </div>
                            <Button variant="outline" className="w-full mt-4" asChild>
                                <Link href="/supervisor/support">
                                    View All Requests
                                    <ArrowRight className="h-4 w-4 ml-2" />
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
                            <CardDescription>Track each intern's progress</CardDescription>
                        </div>
                        <Button variant="outline" asChild>
                            <Link href="/supervisor/interns">
                                View All
                                <ArrowRight className="h-4 w-4 ml-2" />
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-3 px-4 font-medium">Intern</th>
                                        <th className="text-center py-3 px-4 font-medium">Tasks</th>
                                        <th className="text-center py-3 px-4 font-medium">Hours</th>
                                        <th className="text-center py-3 px-4 font-medium">Completion Rate</th>
                                        <th className="text-center py-3 px-4 font-medium">Support</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {interns.map((intern) => (
                                        <tr key={intern.id} className="border-b last:border-0 hover:bg-accent/50">
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                                                        {intern.name.charAt(0)}
                                                    </div>
                                                    <span className="font-medium">{intern.name}</span>
                                                </div>
                                            </td>
                                            <td className="text-center py-3 px-4">{intern.tasks}</td>
                                            <td className="text-center py-3 px-4">{intern.hours}</td>
                                            <td className="text-center py-3 px-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                        <div 
                                                            className="h-full bg-green-500 rounded-full"
                                                            style={{ width: `${intern.completionRate}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-sm">{intern.completionRate}%</span>
                                                </div>
                                            </td>
                                            <td className="text-center py-3 px-4">
                                                {intern.pendingSupport > 0 ? (
                                                    <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                                                        {intern.pendingSupport} pending
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
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Recent Task Submissions</CardTitle>
                            <CardDescription>Latest tasks from all interns</CardDescription>
                        </div>
                        <Button variant="outline" asChild>
                            <Link href="/supervisor/tasks">
                                View All Tasks
                                <ArrowRight className="h-4 w-4 ml-2" />
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentTasks.map((task) => (
                                <div key={task.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-medium">
                                            {task.intern.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-medium">{task.title}</div>
                                            <div className="text-sm text-muted-foreground flex items-center gap-2">
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
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
