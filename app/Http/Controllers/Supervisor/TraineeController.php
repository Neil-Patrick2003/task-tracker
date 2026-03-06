<?php

namespace App\Http\Controllers\Supervisor;

use App\Http\Controllers\Controller;
use App\Models\SupportRequest;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class TraineeController extends Controller
{
    public function index(Request $request)
    {
        $all_interns = User::where('role', 'Intern')->count();


        $total_tasks = Task::count();

        $completed_tasks = Task::where('status', 'Completed')->count();



        $avg_completion = $total_tasks > 0
            ? ($completed_tasks / $total_tasks) * 100
            : 0;

        $interns = QueryBuilder::for(User::class)
            ->with([ 'tasks' ])
            ->orderBy('created_at', 'desc')
            ->allowedFilters([
                AllowedFilter::partial('name'),
            ])
            ->allowedSorts([
                'name',
            ])
            ->paginate(20)
            ->withQueryString();



        return Inertia::render('supervisor/interns/index', [
            'interns' => $interns,
            'query' => [
                ...$request->only(['sort', 'perPage', 'page']),
                'filter' => $request->input('filter', []),

            ],
            'all_interns' => $all_interns,
            'avg_completion' => $avg_completion,


        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
        ]);

        // Create intern account
        $intern = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'Intern',
            'email_verified_at' => now(),
        ]);

        return redirect()->back()->with('success', 'Intern account created successfully.');
    }

    public function update(Request $request, $id)
    {
        $intern = User::where('role', 'Intern')->findOrFail($id);

        $rules = [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $id,
        ];

        // Add password validation if password is provided
        if ($request->filled('password')) {
            $rules['password'] = 'required|string|min:8|confirmed';
        }

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        // Prepare update data
        $updateData = [
            'name' => $request->name,
            'email' => $request->email,
        ];

        // Update password if provided
        if ($request->filled('password')) {
            $updateData['password'] = Hash::make($request->password);
        }

        // Update intern
        $intern->update($updateData);

        return redirect()->back()->with('success', 'Intern account updated successfully.');
    }

    public function destroy($id)
    {
        $intern = User::where('role', 'Intern')->findOrFail($id);

        // Delete related records (optional - depends on your database relationships)
        // If you have cascade delete set up in migrations, this will happen automatically

        $intern->delete();

        return redirect()->back()->with('success', 'Intern account deleted successfully.');
    }

}
