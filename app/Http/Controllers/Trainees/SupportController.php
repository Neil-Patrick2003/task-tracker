<?php

namespace App\Http\Controllers\Trainees;

use App\Http\Controllers\Controller;
use App\Models\SupportRequest;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class SupportController extends Controller
{
    public function index(Request $request)
    {
        $tasks = Task::where('ojt_id', Auth::id())->get();

        $submitted_requests = SupportRequest::where('status', 'Submitted')
            ->when(Auth::id(), function ($query) {
                $query->where('ojt_id', Auth::id());
            })
            ->count();

        $replied_requests = SupportRequest::where('status', 'Replied')
            ->when(Auth::id(), function ($query) {
                $query->where('ojt_id', Auth::id());
            })
            ->count();

        $resolved_requests = SupportRequest::where('status', 'Resolved')
            ->when(Auth::id(), function ($query) {
                $query->where('ojt_id', Auth::id());
            })
            ->count();


        $requests = QueryBuilder::for(SupportRequest::class)
            ->with('task', 'response')
            ->where('ojt_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->allowedFilters([
                AllowedFilter::partial('subject'),
                AllowedFilter::partial('status'),
            ])
            ->allowedSorts([
                'subject',
                'status'
            ])
            ->paginate(20)
            ->withQueryString();




        return Inertia::render('trainee/support/index', [
            'tasks' => $tasks,
            'requests' => $requests,
            'query' => [
                ...$request->only(['sort', 'perPage', 'page']),
                'filter' => $request->input('filter', []),
            ],
            'submitted_requests' => $submitted_requests,
            'replied_requests' => $replied_requests,
            'resolved_requests' => $resolved_requests,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'subject' => 'required|min:3|max:255',
            'description' => 'required|min:3|max:1000',
            'task_id' => 'required',
        ]);

        SupportRequest::create([
            'subject' => $request->subject,
            'description' => $request->description,
            'status' => 'Submitted',
            'task_id' => $request->task_id,
            'ojt_id' => Auth::id(),
        ]);

        return redirect()->back()->with('success', 'Your support request has been submitted.');
    }

    public function resolved(Request $request, $id){
        $support_request = SupportRequest::findorFail($id);

        $support_request->status = 'Resolved';

        $support_request->save();

        return redirect()->back()->with('success', 'Your support request has been resolved.');
    }

}
