<?php

namespace App\Http\Controllers\Trainees;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class SupportController extends Controller
{
    public function index()
    {
        return Inertia::render('trainee/support/index');
    }
}
