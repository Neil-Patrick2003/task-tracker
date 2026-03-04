<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('support_responses', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('message');
            $table->unsignedBigInteger('support_request_id');
            $table->unsignedBigInteger('supervisor_id');

            $table->foreign('support_request_id')->references('id')->on('support_requests')->onDelete('cascade');
            $table->foreign('supervisor_id')->references('id')->on('users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('support_responses');
    }
};
