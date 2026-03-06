<?php
// app/Http/Controllers/Supervisor/SupervisorController.php

namespace App\Http\Controllers\Supervisor;

use App\Http\Controllers\Controller;
use App\Models\SupportRequest;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class SupervisorController extends Controller
{
    public function index(Request $request)
    {
        // Basic stats
        $total_interns_count = User::where('role', 'Intern')->count();
        $total_tasks_count = Task::count();
        $total_hours = Task::sum('hoursRendered');
        $pending_support_count = SupportRequest::where('status', 'Submitted')->count();

        // Completion rate calculation
        $total_completed_tasks = Task::where('status', 'Completed')->count();
        $completion_rate = $total_tasks_count > 0
            ? round(($total_completed_tasks / $total_tasks_count) * 100, 2)
            : 0;

        // Top performer (intern with most completed tasks)
        $top_performer = User::where('role', 'Intern')
            ->withCount(['tasks as completed_tasks_count' => function ($query) {
                $query->where('status', 'Completed');
            }])
            ->withCount('tasks as total_tasks_count') // Add this to get total tasks count
            ->withSum('tasks as total_hours', 'hoursRendered')
            ->orderBy('completed_tasks_count', 'desc')
            ->first();

        // Intern performance summary for table
        $interns_performance = User::where('role', 'Intern')
            ->withCount(['tasks as total_tasks'])
            ->withCount(['tasks as completed_tasks' => function ($query) {
                $query->where('status', 'Completed');
            }])
            ->withSum('tasks as total_hours', 'hoursRendered')
            ->withCount(['support_requests as pending_support' => function ($query) {
                $query->where('status', 'Submitted');
            }])
            ->get()
            ->map(function ($intern) {
                $completion_rate = $intern->total_tasks > 0
                    ? round(($intern->completed_tasks / $intern->total_tasks) * 100, 2)
                    : 0;

                return [
                    'id' => $intern->id,
                    'name' => $intern->name,
                    'tasks' => $intern->total_tasks,
                    'hours' => $intern->total_hours ?? 0,
                    'completionRate' => $completion_rate,
                    'pendingSupport' => $intern->pending_support ?? 0,
                ];
            });

        // Latest pending support requests
        $latest_pending_requests = SupportRequest::where('status', 'Submitted')
            ->with('user:id,name')
            ->latest()
            ->take(3)
            ->get()
            ->map(function ($request) {
                return [
                    'id' => $request->id,
                    'intern' => $request->user->name ?? 'Unknown',
                    'title' => $request->subject,
                    'date' => $request->created_at->format('Y-m-d'),
                ];
            });

        // Recent tasks
        $recent_tasks = Task::with('user:id,name')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($task) {
                return [
                    'id' => $task->id,
                    'intern' => $task->ojt->name ?? 'Unknown',
                    'title' => $task->title,
                    'status' => $task->status,
                    'date' => $task->created_at->format('Y-m-d'),
                ];
            });

        return Inertia::render('supervisor/dashboard', [
            'stats' => [
                'totalInterns' => $total_interns_count,
                'totalTasks' => $total_tasks_count,
                'totalHours' => $total_hours,
                'pendingSupport' => $pending_support_count,
                'completionRate' => $completion_rate,
            ],
            'topPerformer' => $top_performer ? [
                'name' => $top_performer->name,
                'tasks' => $top_performer->completed_tasks_count ?? 0,
                'hours' => $top_performer->total_hours ?? 0,
                'completionRate' => $top_performer->total_tasks_count > 0
                    ? round(($top_performer->completed_tasks_count / $top_performer->total_tasks_count) * 100, 2)
                    : 0,
            ] : null,
            'interns' => $interns_performance,
            'pendingSupportRequests' => $latest_pending_requests,
            'recentTasks' => $recent_tasks,
        ]);
    }
}
