<?php

use App\Http\Controllers\Supervisor\SupportRequestController;
use App\Http\Controllers\Supervisor\TraineeController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    // Trainee/Intern routes
    Route::middleware(['auth', 'verified', 'role:Intern'])->prefix('trainee')->name('trainee.')->group(function () {
        Route::get('dashboard', [\App\Http\Controllers\Trainees\TraineesController::class, 'index'])->name('dashboard');
        Route::get('tasks', [\App\Http\Controllers\Trainees\TaskController::class, 'index'])->name('tasks');
        Route::post('tasks', [\App\Http\Controllers\Trainees\TaskController::class, 'store'])->name('tasks.store');
        Route::put('tasks/{id}', [\App\Http\Controllers\Trainees\TaskController::class, 'update'])->name('tasks.update');
        Route::delete('tasks/{id}', [\App\Http\Controllers\Trainees\TaskController::class, 'destroy'])->name('tasks.destroy');
        Route::get('support-requests', [\App\Http\Controllers\Trainees\SupportController::class, 'index'])->name('support');
        Route::post('support-requests', [\App\Http\Controllers\Trainees\SupportController::class, 'store'])->name('support.store');
        Route::put('support-requests', [\App\Http\Controllers\Trainees\SupportController::class, 'update'])->name('support.update');
        Route::delete('support-requests', [\App\Http\Controllers\Trainees\SupportController::class, 'destroy'])->name('support.destroy');
        Route::patch('support-requests/{id}/resolve', [\App\Http\Controllers\Trainees\SupportController::class, 'resolved'])->name('support.resolve');
    });

    // Supervisor routes
    Route::middleware(['auth', 'verified', 'role:Supervisor'])->prefix('supervisor')->name('supervisor.')->group(function () {
        Route::get('dashboard', [\App\Http\Controllers\Supervisor\SupervisorController::class, 'index'])->name('dashboard');
        Route::get('tasks', [\App\Http\Controllers\Supervisor\TaskController::class, 'index'])->name('tasks');
        Route::get('support-requests', [\App\Http\Controllers\Supervisor\SupportRequestController::class, 'index'])->name('support');
        Route::post('support-requests/{id}/reply', [SupportRequestController::class, 'reply'])->name('support-requests.reply');
        Route::post('support-requests/{id}/resolve', [SupportRequestController::class, 'resolve'])->name('support-requests.resolve');
        Route::get('interns', [\App\Http\Controllers\Supervisor\TraineeController::class, 'index'])->name('interns');
        Route::post('interns', [\App\Http\Controllers\Supervisor\TraineeController::class, 'store'])->name('interns.store');
        Route::put('/interns/{id}', [TraineeController::class, 'update'])->name('.interns.update');
        Route::delete('/interns/{id}', [TraineeController::class, 'destroy'])->name('supervisor.interns.destroy');

    });
});

require __DIR__.'/settings.php';
