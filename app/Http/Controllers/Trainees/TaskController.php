<?php

namespace App\Http\Controllers\Trainees;

use App\Http\Controllers\Controller;
use App\Models\Challenge;
use App\Models\SupportRequest;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class TaskController extends Controller
{
    public function index(Request $request)
    {

        $total_task = Task::where('ojt_id', Auth::id())->count();

        $total_hours = Task::where('ojt_id', Auth::id())
            ->sum('hoursRendered');

        $completed_task = Task::where('ojt_id', Auth::id())
            ->where('status', 'completed')
            ->count();

        $in_progress_tasks = Task::where('ojt_id', Auth::id())
            ->where('status', 'In Progress')
            ->count();


        $tasks = QueryBuilder::for(Task::class)
            ->with('challenges', 'requests')
            ->where('ojt_id', '=', Auth::id())
            ->orderBy('date', 'desc')
            ->allowedFilters([
                AllowedFilter::partial('status'),
                AllowedFilter::partial('title'),
            ])
            ->allowedSorts([
                'title',
                'date',
                'status',
            ])
            ->paginate(20);


        return Inertia::render('trainee/tasks/index', [
            'tasks' => $tasks,
            'query' => [
                ...$request->only(['sort', 'perPage', 'page']),
                'filter' => $request->input('filter', []),
            ],
            'total_tasks' => $total_task,
            'total_hours' => $total_hours,
            'completed_tasks' => $completed_task,
            'in_progress_tasks' => $in_progress_tasks,

        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'date' => 'required|date',
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:1000',
            'hoursRendered' => 'required|integer|min:0|max:24',
            'status' => 'required|string|in:Ongoing,Completed,Pending,Blocked',
            'challengesEncountered' => 'nullable|string|max:1000',
            'supportNeeded' => 'nullable|boolean',
            'supportSubject' => 'required_if:supportNeeded,true|string|max:255|nullable',
            'supportDescription' => 'required_if:supportNeeded,true|string|max:1000|nullable',
        ]);

        // Create Task
        $task = Task::create([
            'date' => $request->date,
            'title' => $request->title,
            'description' => $request->description,
            'hoursRendered' => $request->hoursRendered,
            'status' => $request->status,
            'ojt_id' => Auth::id(),
        ]);

        // Create Challenge if provided
        if ($request->filled('challengesEncountered')) {
            Challenge::create([
                'description' => $request->challengesEncountered,
                'task_id' => $task->id,
                'ojt_id' => Auth::id(),
            ]);
        }

        // Create Support Request if needed
        if ($request->boolean('supportNeeded')) {
            SupportRequest::create([
                'subject' => $request->supportSubject,
                'description' => $request->supportDescription,
                'status' => 'Pending',
                'task_id' => $task->id,
                'ojt_id' => Auth::id(),
            ]);
        }

        return redirect()->back()->with('success', 'Task created successfully.');
    }

    public function update(Request $request, $id)
    {
        $task = Task::with('challenges', 'requests')->where('ojt_id', Auth::id())->findOrFail($id);

        $request->validate([
            'date' => 'required|date',
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:1000',
            'hoursRendered' => 'required|integer|min:0|max:24',
            'status' => 'required|string|in:Ongoing,Completed,Pending,Blocked',
            'challengesEncountered' => 'nullable|string|max:1000',
            'supportNeeded' => 'nullable|boolean',
            'supportSubject' => 'required_if:supportNeeded,true|string|max:255|nullable',
            'supportDescription' => 'required_if:supportNeeded,true|string|max:1000|nullable',
        ]);

        // Update Task
        $task->update([
            'date' => $request->date,
            'title' => $request->title,
            'description' => $request->description,
            'hoursRendered' => $request->hoursRendered,
            'status' => $request->status,
        ]);

        // Update or Create Challenge
        if ($request->filled('challengesEncountered')) {
            if ($task->challenges) {
                // Update existing challenge
                $task->challenges->update([
                    'description' => $request->challengesEncountered,
                ]);
            } else {
                // Create new challenge
                Challenge::create([
                    'description' => $request->challengesEncountered,
                    'task_id' => $task->id,
                    'ojt_id' => Auth::id(),
                ]);
            }
        } else {
            // Delete challenge if exists and field is empty
            if ($task->challenges) {
                $task->challenges->delete();
            }
        }

        // Update or Create Support Request
        if ($request->boolean('supportNeeded')) {
            if ($task->requests) {
                // Update existing support request
                $task->requests->update([
                    'subject' => $request->supportSubject,
                    'description' => $request->supportDescription,
                    // Keep existing status or set to Pending if you want to reset
                    'status' => $task->requests->status ?? 'Pending',
                ]);
            } else {
                // Create new support request
                SupportRequest::create([
                    'subject' => $request->supportSubject,
                    'description' => $request->supportDescription,
                    'status' => 'Pending',
                    'task_id' => $task->id,
                    'ojt_id' => Auth::id(),
                ]);
            }
        } else {
            // Delete support request if exists and support is not needed
            if ($task->requests) {
                $task->requests->delete();
            }
        }

        return redirect()->back()->with('success', 'Task updated successfully.');
    }

    public function destroy($id)
    {
        $task = Task::with('challenges', 'requests')->where('ojt_id', Auth::id())->findOrFail($id);

        // Delete related records first (though cascade delete should handle this if set up)
        if ($task->challenges) {
            $task->challenges->delete();
        }

        if ($task->requests) {
            $task->requests->delete();
        }

        // Delete the task
        $task->delete();

        return redirect()->back()->with('success', 'Task deleted successfully.');
    }

    // Optional: Method to get a single task for editing
    public function edit($id)
    {
        $task = Task::with('challenges', 'requests')
            ->where('ojt_id', Auth::id())
            ->findOrFail($id);

        return response()->json($task);
    }
}
