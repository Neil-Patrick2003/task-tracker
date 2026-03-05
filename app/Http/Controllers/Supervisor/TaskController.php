<?php

namespace App\Http\Controllers\Supervisor;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class TaskController extends Controller
{
    public function index(Request $request)
    {

        $total_tasks = Task::count();

        $total_hours = Task::sum('hoursRendered');

        $completed_task = Task::where('status', 'Completed')->count();

        $with_challenges = Task::whereHas('challenges')->count();


        $trainees = User::where('role', 'Trainee')->get();

        $tasks = QueryBuilder::for(Task::class)
            ->with(['challenges', 'requests', 'ojt'])
            ->orderBy('date', 'desc')
            ->allowedFilters([
                AllowedFilter::partial('status'),
                AllowedFilter::partial('title'),

                AllowedFilter::callback('trainee_name', function ($query, $value) {
                    $query->whereHas('ojt', function ($q) use ($value) {
                        $q->where('name', 'like', "%{$value}%");
                    });
                }),
            ])
            ->allowedSorts([
                'title',
                'date',
                'status',
            ])
            ->paginate(20)
            ->withQueryString();


        return Inertia::render('supervisor/tasks/index', [
            'trainees' => $trainees,
            'tasks' => $tasks,
            'query' => [
                ...$request->only(['sort', 'perPage', 'page']),
                'filter' => $request->input('filter', []),

            ],
            'total_tasks' => $total_tasks,
            'total_hours' => $total_hours,
            'completed_task' => $completed_task,
            'with_challenges' => $with_challenges,
        ]);
    }
}
