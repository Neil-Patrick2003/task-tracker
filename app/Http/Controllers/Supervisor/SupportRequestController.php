<?php

namespace App\Http\Controllers\Supervisor;

use App\Http\Controllers\Controller;
use App\Models\SupportRequest;
use App\Models\SupportResponse;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class SupportRequestController extends Controller
{
    public function index(Request $request)
    {
        $all_requests = SupportRequest::count();
        $submitted_requests = SupportRequest::where('status', 'Submitted')->count();
        $replied_request = SupportRequest::where('status', 'Replied')->count();
        $resolved_request = SupportRequest::where('status', 'Resolved')->count();

        $trainees = User::where('role', 'trainee')->get();

        $requests = QueryBuilder::for(SupportRequest::class)
            ->with(['user', 'task', 'response'])
            ->orderBy('created_at', 'desc')
            ->allowedFilters([
                AllowedFilter::partial('status'),
                AllowedFilter::partial('subject'),
                AllowedFilter::callback('trainee_name', function ($query, $value) {
                    $query->whereHas('user', function ($q) use ($value) {
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


        return Inertia::render('supervisor/support/index', [
            'trainees' => $trainees,
            'requests' => $requests,
            'query' => [
                ...$request->only(['sort', 'perPage', 'page']),
                'filter' => $request->input('filter', []),

            ],
            'all_requests' => $all_requests,
            'submitted_requests' => $submitted_requests,
            'replied_requests' => $replied_request,
            'resolved_requests' => $resolved_request,
        ]);
    }

    public function reply(Request $request, $id)
    {
        $supportRequest = SupportRequest::findOrFail($id);

        $request->validate([
            'reply' => 'required|string|max:2000',
        ]);

        SupportResponse::create([
            'message' => $request->reply,
            'support_request_id' => $supportRequest->id,
            'supervisor_id' => auth()->id(),
        ]);

        $supportRequest->update([
            'status' => 'Replied',
        ]);

        return redirect()->back()->with('success', 'Reply sent successfully.');
    }

    public function resolve($id)
    {
        $supportRequest = SupportRequest::findOrFail($id);

        $supportRequest->update([
            'status' => 'Resolved',
        ]);

        return redirect()->back()->with('success', 'Request marked as resolved.');
    }
}
