<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Task extends Model
{
    protected $guarded = [];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function challenges(){
        return $this->hasMany(Challenge::class);
    }

    public function requests()
    {
        return $this->hasMany(SupportRequest::Class);
    }


}
