import { Head } from '@inertiajs/react';
import { useState } from 'react';
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
    AlertCircle
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
        href: '/supervisor/dashboard',
    },
    {
        title: 'Support Requests',
        href: '/supervisor/support',
    },
];

// Static support request data
const initialRequests = [
    {
        id: 1,
        intern: 'John Doe',
        title: 'Need help with API authentication',
        description: 'I am having trouble understanding how to implement JWT token refresh. The tokens keep expiring and users get logged out unexpectedly.',
        relatedTask: 'API Integration for User Module',
        status: 'Pending',
        dateSubmitted: '2026-03-05',
        supervisorReply: '',
        replyDate: '',
    },
    {
        id: 2,
        intern: 'Mike Johnson',
        title: 'Database connection issues',
        description: 'The database connection keeps timing out when running complex queries. I\'ve tried increasing the timeout but it doesn\'t seem to help.',
        relatedTask: 'Database Optimization',
        status: 'Pending',
        dateSubmitted: '2026-03-04',
        supervisorReply: '',
        replyDate: '',
    },
    {
        id: 3,
        intern: 'Sarah Williams',
        title: 'Clarification on project requirements',
        description: 'I need clarification on the user role permissions. Should interns be able to see other interns\' tasks or only their own?',
        relatedTask: 'Frontend Dashboard',
        status: 'Pending',
        dateSubmitted: '2026-03-03',
        supervisorReply: '',
        replyDate: '',
    },
    {
        id: 4,
        intern: 'Jane Smith',
        title: 'Testing framework configuration',
        description: 'Having issues setting up the testing framework with TypeScript paths. The imports don\'t resolve correctly in test files.',
        relatedTask: 'Unit Testing Setup',
        status: 'Replied',
        dateSubmitted: '2026-02-28',
        supervisorReply: 'You need to update jest.config.js with moduleNameMapper to match your tsconfig paths. Check the documentation for the exact syntax.',
        replyDate: '2026-03-01',
    },
    {
        id: 5,
        intern: 'Chris Brown',
        title: 'Git workflow questions',
        description: 'What\'s the preferred branching strategy for this project? Should I create feature branches from develop or main?',
        relatedTask: 'Code Review',
        status: 'Resolved',
        dateSubmitted: '2026-02-25',
        supervisorReply: 'We use GitFlow. Create feature branches from develop. Name them feature/your-feature-name. Always create a PR for code review before merging.',
        replyDate: '2026-02-26',
    },
];

const interns = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Williams', 'Chris Brown'];

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

export default function SupervisorSupport() {
    const [requests, setRequests] = useState(initialRequests);
    const [searchQuery, setSearchQuery] = useState('');
    const [internFilter, setInternFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<typeof initialRequests[0] | null>(null);
    const [replyText, setReplyText] = useState('');

    const pendingCount = requests.filter(r => r.status === 'Pending').length;
    const repliedCount = requests.filter(r => r.status === 'Replied').length;
    const resolvedCount = requests.filter(r => r.status === 'Resolved').length;

    const filteredRequests = requests.filter((request) => {
        const matchesSearch = request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            request.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            request.intern.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesIntern = internFilter === 'all' || request.intern === internFilter;
        const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
        return matchesSearch && matchesIntern && matchesStatus;
    });

    const toggleExpand = (id: number) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const openReplyModal = (request: typeof initialRequests[0]) => {
        setSelectedRequest(request);
        setReplyText(request.supervisorReply || '');
        setIsReplyModalOpen(true);
    };

    const handleSendReply = () => {
        if (!selectedRequest || !replyText.trim()) return;
        
        setRequests(requests.map(r => 
            r.id === selectedRequest.id 
                ? { 
                    ...r, 
                    supervisorReply: replyText, 
                    replyDate: new Date().toISOString().split('T')[0],
                    status: 'Replied'
                } 
                : r
        ));
        setIsReplyModalOpen(false);
        setSelectedRequest(null);
        setReplyText('');
    };

    const markAsResolved = (id: number) => {
        setRequests(requests.map(r => 
            r.id === id ? { ...r, status: 'Resolved' } : r
        ));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Support Requests" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Support Requests</h1>
                    <p className="text-muted-foreground">
                        View and respond to intern support requests
                    </p>
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
                                Awaiting your response
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
                                Response sent
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
                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search requests..."
                            className="pl-9"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Select value={internFilter} onValueChange={setInternFilter}>
                        <SelectTrigger className="w-[180px]">
                            <User className="h-4 w-4 mr-2" />
                            <SelectValue placeholder="Filter by Intern" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Interns</SelectItem>
                            {interns.map((intern) => (
                                <SelectItem key={intern} value={intern}>{intern}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
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
                        <CardTitle>Support Request List</CardTitle>
                        <CardDescription>
                            {filteredRequests.length} request{filteredRequests.length !== 1 ? 's' : ''} found
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {filteredRequests.length === 0 ? (
                            <div className="flex h-[200px] items-center justify-center text-muted-foreground">
                                No support requests found matching your filters.
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
                                                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                                                            {request.intern.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <h3 className="font-semibold">{request.title}</h3>
                                                            <span className="text-sm text-muted-foreground">{request.intern}</span>
                                                        </div>
                                                        <div className="ml-2">
                                                            {getSupportStatusBadge(request.status)}
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground mt-2 ml-10 line-clamp-1">{request.description}</p>
                                                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2 ml-10">
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
                                                        <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                                                            <AlertCircle className="h-4 w-4 text-yellow-500" />
                                                            Intern's Issue:
                                                        </h4>
                                                        <p className="text-sm bg-white p-3 rounded border">{request.description}</p>
                                                    </div>

                                                    {request.supervisorReply && (
                                                        <div>
                                                            <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                                                                <MessageSquare className="h-4 w-4 text-blue-500" />
                                                                Your Reply ({request.replyDate}):
                                                            </h4>
                                                            <p className="text-sm bg-blue-50 p-3 rounded border border-blue-200">
                                                                {request.supervisorReply}
                                                            </p>
                                                        </div>
                                                    )}

                                                    <div className="flex items-center gap-2">
                                                        {request.status === 'Pending' && (
                                                            <Button onClick={() => openReplyModal(request)}>
                                                                <Send className="h-4 w-4 mr-2" />
                                                                Reply
                                                            </Button>
                                                        )}
                                                        {request.status === 'Replied' && (
                                                            <>
                                                                <Button variant="outline" onClick={() => openReplyModal(request)}>
                                                                    <Send className="h-4 w-4 mr-2" />
                                                                    Edit Reply
                                                                </Button>
                                                                <Button 
                                                                    variant="outline" 
                                                                    className="text-green-600 border-green-600 hover:bg-green-50"
                                                                    onClick={() => markAsResolved(request.id)}
                                                                >
                                                                    <CheckCircle2 className="h-4 w-4 mr-2" />
                                                                    Mark as Resolved
                                                                </Button>
                                                            </>
                                                        )}
                                                        {request.status === 'Resolved' && (
                                                            <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded">
                                                                <CheckCircle2 className="h-4 w-4" />
                                                                This issue has been resolved.
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Reply Modal */}
                <Dialog open={isReplyModalOpen} onOpenChange={setIsReplyModalOpen}>
                    <DialogContent className="max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Reply to Support Request</DialogTitle>
                            <DialogDescription>
                                Respond to {selectedRequest?.intern}'s request
                            </DialogDescription>
                        </DialogHeader>
                        {selectedRequest && (
                            <div className="space-y-4 py-4">
                                <div>
                                    <Label className="text-sm text-muted-foreground">Issue:</Label>
                                    <p className="mt-1 text-sm p-3 bg-accent rounded">{selectedRequest.title}</p>
                                </div>
                                <div>
                                    <Label className="text-sm text-muted-foreground">Details:</Label>
                                    <p className="mt-1 text-sm p-3 bg-accent rounded">{selectedRequest.description}</p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="reply">Your Reply</Label>
                                    <textarea
                                        id="reply"
                                        className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                        placeholder="Type your response to the intern..."
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                    />
                                </div>
                            </div>
                        )}
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsReplyModalOpen(false)}>Cancel</Button>
                            <Button onClick={handleSendReply} disabled={!replyText.trim()}>
                                <Send className="h-4 w-4 mr-2" />
                                Send Reply
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
