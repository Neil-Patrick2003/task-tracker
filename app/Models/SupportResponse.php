<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SupportResponse extends Model
{
    protected $guarded = [];

    public function request(): BelongsTo
    {
        return $this->belongsTo(SUpportRequest::class);
    }

    public function supervisor(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
