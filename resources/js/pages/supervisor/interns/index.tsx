import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { 
    Search,
    User,
    Clock,
    CheckCircle2,
    TrendingUp,
    CalendarDays,
    MessageSquare,
    Eye,
    ClipboardList
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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

// Static intern data
const internsData = [
    {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@email.com',
        startDate: '2026-01-15',
        totalTasks: 24,
        completedTasks: 18,
        ongoingTasks: 6,
        totalHours: 156,
        completionRate: 75,
        pendingSupport: 1,
        resolvedSupport: 3,
        dailyConsistency: 85, // percentage of days with task submissions
        recentTasks: [
            { title: 'API Integration', date: '2026-03-05', status: 'Ongoing' },
            { title: 'Database Schema', date: '2026-03-03', status: 'Completed' },
            { title: 'Code Review', date: '2026-03-02', status: 'Completed' },
        ],
    },
    {
        id: 2,
        name: 'Jane Smith',
        email: 'jane.smith@email.com',
        startDate: '2026-01-15',
        totalTasks: 28,
        completedTasks: 25,
        ongoingTasks: 3,
        totalHours: 168,
        completionRate: 89,
        pendingSupport: 0,
        resolvedSupport: 2,
        dailyConsistency: 92,
        recentTasks: [
            { title: 'Database Optimization', date: '2026-03-05', status: 'Completed' },
            { title: 'Frontend Dashboard', date: '2026-03-03', status: 'Completed' },
            { title: 'Performance Testing', date: '2026-03-02', status: 'Completed' },
        ],
    },
    {
        id: 3,
        name: 'Mike Johnson',
        email: 'mike.johnson@email.com',
        startDate: '2026-02-01',
        totalTasks: 15,
        completedTasks: 12,
        ongoingTasks: 3,
        totalHours: 96,
        completionRate: 80,
        pendingSupport: 1,
        resolvedSupport: 1,
        dailyConsistency: 78,
        recentTasks: [
            { title: 'UI Components', date: '2026-03-04', status: 'Completed' },
            { title: 'Code Review', date: '2026-03-03', status: 'Completed' },
            { title: 'Documentation', date: '2026-03-01', status: 'Ongoing' },
        ],
    },
    {
        id: 4,
        name: 'Sarah Williams',
        email: 'sarah.williams@email.com',
        startDate: '2026-02-15',
        totalTasks: 12,
        completedTasks: 8,
        ongoingTasks: 4,
        totalHours: 64,
        completionRate: 67,
        pendingSupport: 1,
        resolvedSupport: 0,
        dailyConsistency: 70,
        recentTasks: [
            { title: 'Testing Setup', date: '2026-03-04', status: 'Ongoing' },
            { title: 'Bug Fixes', date: '2026-03-03', status: 'Completed' },
            { title: 'Feature Implementation', date: '2026-03-01', status: 'Ongoing' },
        ],
    },
    {
        id: 5,
        name: 'Chris Brown',
        email: 'chris.brown@email.com',
        startDate: '2026-02-20',
        totalTasks: 8,
        completedTasks: 7,
        ongoingTasks: 1,
        totalHours: 36,
        completionRate: 88,
        pendingSupport: 0,
        resolvedSupport: 1,
        dailyConsistency: 65,
        recentTasks: [
            { title: 'Documentation', date: '2026-03-04', status: 'Completed' },
            { title: 'Code Review', date: '2026-03-03', status: 'Completed' },
            { title: 'Research', date: '2026-03-02', status: 'Completed' },
        ],
    },
];

const getCompletionBadge = (rate: number) => {
    if (rate >= 85) return <Badge className="bg-green-100 text-green-800">Excellent</Badge>;
    if (rate >= 70) return <Badge className="bg-blue-100 text-blue-800">Good</Badge>;
    if (rate >= 50) return <Badge className="bg-yellow-100 text-yellow-800">Fair</Badge>;
    return <Badge className="bg-red-100 text-red-800">Needs Improvement</Badge>;
};

export default function SupervisorInterns() {
    const [interns] = useState(internsData);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIntern, setSelectedIntern] = useState<typeof internsData[0] | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const filteredInterns = interns.filter((intern) =>
        intern.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        intern.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const openInternDetail = (intern: typeof internsData[0]) => {
        setSelectedIntern(intern);
        setIsDetailOpen(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Intern Performance" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Intern Performance</h1>
                    <p className="text-muted-foreground">
                        Track and monitor individual intern progress and performance
                    </p>
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
                                    <div className="text-2xl font-bold">{interns.length}</div>
                                    <p className="text-xs text-muted-foreground">Total Interns</p>
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
                                        {interns.reduce((sum, i) => sum + i.totalHours, 0)}
                                    </div>
                                    <p className="text-xs text-muted-foreground">Total Hours</p>
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
                                        {Math.round(interns.reduce((sum, i) => sum + i.completionRate, 0) / interns.length)}%
                                    </div>
                                    <p className="text-xs text-muted-foreground">Avg Completion</p>
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
                                        {interns.reduce((sum, i) => sum + i.pendingSupport, 0)}
                                    </div>
                                    <p className="text-xs text-muted-foreground">Pending Support</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Search */}
                <div className="flex items-center gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search interns..."
                            className="pl-9"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Interns Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredInterns.map((intern) => (
                        <Card key={intern.id} className="hover:shadow-md transition-shadow">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-medium">
                                            {intern.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg">{intern.name}</CardTitle>
                                            <CardDescription>{intern.email}</CardDescription>
                                        </div>
                                    </div>
                                    {getCompletionBadge(intern.completionRate)}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {/* Progress Bar */}
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-muted-foreground">Completion Rate</span>
                                            <span className="font-medium">{intern.completionRate}%</span>
                                        </div>
                                        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-green-500 rounded-full transition-all"
                                                style={{ width: `${intern.completionRate}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div className="flex items-center gap-2">
                                            <ClipboardList className="h-4 w-4 text-muted-foreground" />
                                            <span>{intern.totalTasks} tasks</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-muted-foreground" />
                                            <span>{intern.totalHours} hours</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                                            <span>{intern.completedTasks} completed</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <CalendarDays className="h-4 w-4 text-muted-foreground" />
                                            <span>{intern.dailyConsistency}% consistent</span>
                                        </div>
                                    </div>

                                    {/* Support Status */}
                                    {intern.pendingSupport > 0 && (
                                        <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded text-sm text-yellow-700">
                                            <MessageSquare className="h-4 w-4" />
                                            {intern.pendingSupport} pending support request{intern.pendingSupport > 1 ? 's' : ''}
                                        </div>
                                    )}

                                    <Button 
                                        variant="outline" 
                                        className="w-full"
                                        onClick={() => openInternDetail(intern)}
                                    >
                                        <Eye className="h-4 w-4 mr-2" />
                                        View Full Profile
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Intern Detail Modal */}
                <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Intern Performance Details</DialogTitle>
                            <DialogDescription>
                                Comprehensive view of intern's OJT progress
                            </DialogDescription>
                        </DialogHeader>
                        {selectedIntern && (
                            <div className="space-y-6">
                                {/* Intern Info */}
                                <div className="flex items-center gap-4">
                                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-medium">
                                        {selectedIntern.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div>
                                        <div className="text-xl font-semibold">{selectedIntern.name}</div>
                                        <div className="text-sm text-muted-foreground">{selectedIntern.email}</div>
                                        <div className="text-sm text-muted-foreground">Started: {selectedIntern.startDate}</div>
                                    </div>
                                </div>

                                {/* Performance Stats */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="text-center p-3 bg-accent rounded-lg">
                                        <div className="text-2xl font-bold">{selectedIntern.totalTasks}</div>
                                        <div className="text-xs text-muted-foreground">Total Tasks</div>
                                    </div>
                                    <div className="text-center p-3 bg-accent rounded-lg">
                                        <div className="text-2xl font-bold">{selectedIntern.totalHours}</div>
                                        <div className="text-xs text-muted-foreground">Total Hours</div>
                                    </div>
                                    <div className="text-center p-3 bg-green-50 rounded-lg">
                                        <div className="text-2xl font-bold text-green-600">{selectedIntern.completionRate}%</div>
                                        <div className="text-xs text-muted-foreground">Completion Rate</div>
                                    </div>
                                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                                        <div className="text-2xl font-bold text-blue-600">{selectedIntern.dailyConsistency}%</div>
                                        <div className="text-xs text-muted-foreground">Daily Consistency</div>
                                    </div>
                                </div>

                                {/* Task Breakdown */}
                                <div>
                                    <h4 className="font-medium mb-3">Task Breakdown</h4>
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1">
                                            <div className="flex justify-between text-sm mb-1">
                                                <span>Completed: {selectedIntern.completedTasks}</span>
                                                <span>Ongoing: {selectedIntern.ongoingTasks}</span>
                                            </div>
                                            <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden flex">
                                                <div 
                                                    className="h-full bg-green-500"
                                                    style={{ width: `${(selectedIntern.completedTasks / selectedIntern.totalTasks) * 100}%` }}
                                                />
                                                <div 
                                                    className="h-full bg-blue-500"
                                                    style={{ width: `${(selectedIntern.ongoingTasks / selectedIntern.totalTasks) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Support Requests */}
                                <div>
                                    <h4 className="font-medium mb-3">Support Request Summary</h4>
                                    <div className="flex gap-4">
                                        <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded">
                                            <Badge className="bg-yellow-100 text-yellow-800">{selectedIntern.pendingSupport}</Badge>
                                            <span className="text-sm">Pending</span>
                                        </div>
                                        <div className="flex items-center gap-2 p-2 bg-green-50 rounded">
                                            <Badge className="bg-green-100 text-green-800">{selectedIntern.resolvedSupport}</Badge>
                                            <span className="text-sm">Resolved</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Recent Tasks */}
                                <div>
                                    <h4 className="font-medium mb-3">Recent Tasks</h4>
                                    <div className="space-y-2">
                                        {selectedIntern.recentTasks.map((task, i) => (
                                            <div key={i} className="flex items-center justify-between p-2 bg-accent rounded">
                                                <div>
                                                    <div className="font-medium text-sm">{task.title}</div>
                                                    <div className="text-xs text-muted-foreground">{task.date}</div>
                                                </div>
                                                <Badge 
                                                    className={task.status === 'Completed' 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-blue-100 text-blue-800'
                                                    }
                                                >
                                                    {task.status}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
