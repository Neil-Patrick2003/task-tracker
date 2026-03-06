<?php

namespace App\Http\Responses;

use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;

class LoginResponse implements LoginResponseContract
{
    public function toResponse($request)
    {
        $user = $request->user();

        if ($user->role === 'Intern') {
            return redirect()->route('trainee.dashboard');
        }

        if ($user->role === 'Supervisor') {
            return redirect()->route('supervisor.dashboard');
        }

        abort(403, 'Unauthorized role.');
    }
}
