import { Head } from '@inertiajs/react';
import { useState } from 'react';
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
    Send
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/trainee/dashboard',
    },
    {
        title: 'Support',
        href: '/trainee/support',
    },
];

// Static support request data
const initialRequests = [
    {
        id: 1,
        title: 'Need help with API authentication',
        description: 'I am having trouble understanding how to implement JWT token refresh. The tokens keep expiring and users get logged out unexpectedly.',
        relatedTask: 'API Integration for User Module',
        status: 'Replied',
        dateSubmitted: '2026-03-04',
        supervisorReply: 'For JWT token refresh, you should implement a refresh token endpoint. When the access token expires, use the refresh token to get a new access token. I\'ll schedule a call to walk you through this.',
        replyDate: '2026-03-05',
    },
    {
        id: 2,
        title: 'Database connection issues',
        description: 'The database connection keeps timing out when running complex queries. I\'ve tried increasing the timeout but it doesn\'t seem to help.',
        relatedTask: 'Database Schema Design',
        status: 'Pending',
        dateSubmitted: '2026-03-05',
        supervisorReply: '',
        replyDate: '',
    },
    {
        id: 3,
        title: 'Clarification on project requirements',
        description: 'I need clarification on the user role permissions. Should interns be able to see other interns\' tasks or only their own?',
        relatedTask: 'Frontend Dashboard Components',
        status: 'Resolved',
        dateSubmitted: '2026-03-01',
        supervisorReply: 'Interns should only see their own tasks. Only supervisors can view all intern tasks. This is for privacy and proper role-based access control.',
        replyDate: '2026-03-02',
    },
    {
        id: 4,
        title: 'Testing framework configuration',
        description: 'Having issues setting up the testing framework with TypeScript paths. The imports don\'t resolve correctly in test files.',
        relatedTask: 'Unit Testing Setup',
        status: 'Resolved',
        dateSubmitted: '2026-02-28',
        supervisorReply: 'You need to update jest.config.js with moduleNameMapper to match your tsconfig paths. Check the documentation for the exact syntax.',
        replyDate: '2026-03-01',
    },
];

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

export default function Support() {
    const [requests, setRequests] = useState(initialRequests);
    const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        relatedTask: '',
    });

    const pendingCount = requests.filter(r => r.status === 'Pending').length;
    const repliedCount = requests.filter(r => r.status === 'Replied').length;
    const resolvedCount = requests.filter(r => r.status === 'Resolved').length;

    const filteredRequests = requests.filter((request) => {
        const matchesSearch = request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            request.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleSubmitRequest = () => {
        const newRequest = {
            id: requests.length + 1,
            ...formData,
            status: 'Pending',
            dateSubmitted: new Date().toISOString().split('T')[0],
            supervisorReply: '',
            replyDate: '',
        };
        setRequests([newRequest, ...requests]);
        setIsNewRequestOpen(false);
        setFormData({ title: '', description: '', relatedTask: '' });
    };

    const toggleExpand = (id: number) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Support Requests" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Support Requests</h1>
                        <p className="text-muted-foreground">
                            Request help and track support from your supervisor
                        </p>
                    </div>
                    <Button onClick={() => setIsNewRequestOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        New Request
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending</CardTitle>
                            <Clock className="h-4 w-4 text-yellow-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
                            <p className="text-xs text-muted-foreground">
                                Awaiting supervisor response
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Replied</CardTitle>
                            <MessageSquare className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">{repliedCount}</div>
                            <p className="text-xs text-muted-foreground">
                                Supervisor has responded
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{resolvedCount}</div>
                            <p className="text-xs text-muted-foreground">
                                Issues resolved
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search requests..."
                            className="pl-9"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[150px]">
                            <Filter className="h-4 w-4 mr-2" />
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Replied">Replied</SelectItem>
                            <SelectItem value="Resolved">Resolved</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Request List */}
                <Card className="flex-1">
                    <CardHeader>
                        <CardTitle>Support Request History</CardTitle>
                        <CardDescription>
                            {filteredRequests.length} request{filteredRequests.length !== 1 ? 's' : ''} found
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {filteredRequests.length === 0 ? (
                            <div className="flex h-[200px] items-center justify-center text-muted-foreground">
                                No support requests found. Click "New Request" if you need assistance.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredRequests.map((request) => (
                                    <div key={request.id} className="rounded-lg border overflow-hidden">
                                        <div 
                                            className="p-4 cursor-pointer hover:bg-accent/50 transition-colors"
                                            onClick={() => toggleExpand(request.id)}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                                                        <h3 className="font-semibold">{request.title}</h3>
                                                        {getSupportStatusBadge(request.status)}
                                                    </div>
                                                    <p className="text-sm text-muted-foreground line-clamp-1">{request.description}</p>
                                                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                                        <span>Related: {request.relatedTask}</span>
                                                        <span>Submitted: {request.dateSubmitted}</span>
                                                    </div>
                                                </div>
                                                <Button variant="ghost" size="icon">
                                                    {expandedId === request.id ? (
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
                                                        <h4 className="font-medium text-sm mb-2">Your Issue:</h4>
                                                        <p className="text-sm text-gray-900 bg-white p-3 rounded border">{request.description}</p>
                                                    </div>

                                                    {request.supervisorReply && (
                                                        <div>
                                                            <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                                                                <MessageSquare className="h-4 w-4 text-blue-500" />
                                                                Supervisor Reply ({request.replyDate}):
                                                            </h4>
                                                            <p className="text-sm text-gray-900 bg-blue-50 p-3 rounded border border-blue-200">
                                                                {request.supervisorReply}
                                                            </p>
                                                        </div>
                                                    )}

                                                    {request.status === 'Pending' && (
                                                        <div className="flex items-center gap-2 text-sm text-yellow-600 bg-yellow-50 p-3 rounded">
                                                            <Clock className="h-4 w-4" />
                                                            Waiting for supervisor response...
                                                        </div>
                                                    )}

                                                    {request.status === 'Replied' && (
                                                        <Button 
                                                            variant="outline" 
                                                            size="sm"
                                                            onClick={() => {
                                                                setRequests(requests.map(r => 
                                                                    r.id === request.id ? { ...r, status: 'Resolved' } : r
                                                                ));
                                                            }}
                                                        >
                                                            <CheckCircle2 className="h-4 w-4 mr-2" />
                                                            Mark as Resolved
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* New Request Modal */}
                <Dialog open={isNewRequestOpen} onOpenChange={setIsNewRequestOpen}>
                    <DialogContent className="max-w-lg">
                        <DialogHeader>
                            <DialogTitle>New Support Request</DialogTitle>
                            <DialogDescription>
                                Describe the issue you need help with. Your supervisor will be notified.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Issue Title</Label>
                                <Input
                                    id="title"
                                    placeholder="Brief description of the issue"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="relatedTask">Related Task (Optional)</Label>
                                <Input
                                    id="relatedTask"
                                    placeholder="Which task is this related to?"
                                    value={formData.relatedTask}
                                    onChange={(e) => setFormData({ ...formData, relatedTask: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Detailed Description</Label>
                                <textarea
                                    id="description"
                                    className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    placeholder="Explain your issue in detail. The more context you provide, the better help you'll receive."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsNewRequestOpen(false)}>Cancel</Button>
                            <Button onClick={handleSubmitRequest}>
                                <Send className="h-4 w-4 mr-2" />
                                Submit Request
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
