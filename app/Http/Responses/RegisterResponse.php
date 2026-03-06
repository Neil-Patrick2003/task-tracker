<?php

namespace App\Http\Responses;

use Laravel\Fortify\Contracts\RegisterResponse as RegisterResponseContract;

class RegisterResponse implements RegisterResponseContract
{
    public function toResponse($request)
    {
        $user = $request->user();

        if ($user->role === 'intern') {
            return redirect()->route('trainee.dashboard');
        }

        if ($user->role === 'supervisor') {
            return redirect()->route('supervisor.dashboard');
        }

        abort(403, 'Unauthorized role.');
    }
}
