<?php
// app/Http/Controllers/Trainees/TraineesController.php

namespace App\Http\Controllers\Trainees;

use App\Http\Controllers\Controller;
use App\Models\SupportRequest;
use App\Models\Task;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class TraineesController extends Controller
{
    public function index(Request $request)
    {
        $userId = auth()->id();

        // Basic stats
        $total_tasks_count = Task::where('ojt_id', $userId)->count();
        $total_hours_count = Task::where('ojt_id', $userId)->sum('hoursRendered');
        $completed_tasks_count = Task::where('status', 'Completed')
            ->where('ojt_id', $userId)
            ->count();
        $ongoing_tasks_count = Task::whereIn('status', ['Ongoing', 'Pending'])
            ->where('ojt_id', $userId)
            ->count();

        $support_requests_count = SupportRequest::where('status', 'Submitted')
            ->where('ojt_id', $userId)
            ->count();

        $supervisor_replies_count = SupportRequest::where('status', 'Replied')
            ->where('ojt_id', $userId)
            ->count();

        // Task completion rate
        $completion_rate = $total_tasks_count > 0
            ? round(($completed_tasks_count / $total_tasks_count) * 100, 2)
            : 0;

        // Weekly activity (last 7 days)

        $weekly_activity = Task::where('ojt_id', $userId)
            ->where('created_at', '>=', Carbon::now()->subDays(7))
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('DAYNAME(created_at) as day_name'),
                DB::raw('COUNT(*) as count')
            )
            ->groupBy(DB::raw('DATE(created_at)'), DB::raw('DAYNAME(created_at)'))
            ->orderBy('date')
            ->get()
            ->map(function ($item) {
                return [
                    'day' => substr($item->day_name, 0, 1),
                    'count' => $item->count,
                ];
            });

        // Fill missing days with zero
        $days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
        $activity_data = [];
        foreach ($days as $day) {
            $found = $weekly_activity->firstWhere('day', $day);
            $activity_data[] = [
                'day' => $day,
                'count' => $found ? $found['count'] : 0,
            ];
        }

        // Recent tasks
        $recent_tasks = Task::where('ojt_id', $userId)
            ->with('challenges')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($task) {
                return [
                    'id' => $task->id,
                    'title' => $task->title,
                    'date' => $task->created_at->format('M d, Y'),
                    'hours' => $task->hoursRendered,
                    'status' => $task->status,
                    'hasChallenge' => $task->challenges ? true : false,
                ];
            });

        // Recent support requests
        $recent_requests = SupportRequest::where('ojt_id', $userId)
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($request) {
                return [
                    'id' => $request->id,
                    'title' => $request->subject,
                    'status' => $request->status,
                    'date' => $request->created_at->format('M d, Y'),
                ];
            });

        return Inertia::render('trainee/dashboard', [
            'stats' => [
                'totalTasks' => $total_tasks_count,
                'totalHours' => $total_hours_count,
                'completedTasks' => $completed_tasks_count,
                'ongoingTasks' => $ongoing_tasks_count,
                'pendingSupport' => $support_requests_count,
                'supervisorReplies' => $supervisor_replies_count,
                'completionRate' => $completion_rate,
            ],
            'weeklyActivity' => $activity_data,
            'recentTasks' => $recent_tasks,
            'recentRequests' => $recent_requests,
        ]);
    }
}
