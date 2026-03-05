<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    // Trainee/Intern routes
    Route::prefix('trainee')->name('trainee.')->group(function () {
        Route::inertia('dashboard', 'trainee/dashboard')->name('dashboard');
        Route::inertia('tasks', 'trainee/tasks/index')->name('tasks');
        Route::inertia('support', 'trainee/support/index')->name('support');
    });

    // Supervisor routes
    Route::prefix('supervisor')->name('supervisor.')->group(function () {
        Route::inertia('dashboard', 'supervisor/dashboard')->name('dashboard');
        Route::inertia('tasks', 'supervisor/tasks/index')->name('tasks');
        Route::inertia('support', 'supervisor/support/index')->name('support');
        Route::inertia('interns', 'supervisor/interns/index')->name('interns');
    });
});

require __DIR__.'/settings.php';
