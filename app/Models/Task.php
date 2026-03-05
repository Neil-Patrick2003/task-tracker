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
        return $this->hasOne(Challenge::class);
    }

    public function requests()
    {
        return $this->hasOne(SupportRequest::Class);
    }


    public function ojt()
    {
        return $this->belongsTo(User::class, 'ojt_id');
    }


}
