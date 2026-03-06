<?php

namespace App\Http\Controllers\Supervisor;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class SupervisorController extends Controller
{
    public function index()
    {
        return Inertia::render('supervisor/dashboard');
    }


}
