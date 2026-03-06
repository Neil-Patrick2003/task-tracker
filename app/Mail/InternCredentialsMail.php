<?php
// app/Mail/InternCredentialsMail.php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class InternCredentialsMail extends Mailable
{
    use Queueable, SerializesModels;

    public $intern;
    public $password;

    public function __construct(User $intern, $password)
    {
        $this->intern = $intern;
        $this->password = $password;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Your Intern Account Credentials',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.intern-credentials',
        );
    }
}
