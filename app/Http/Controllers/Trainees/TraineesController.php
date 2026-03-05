<?php

namespace App\Http\Controllers\Trainees;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class TraineesController extends Controller
{
    public function index()
    {
         return Inertia::render('trainee/dashboard');
    }
}
