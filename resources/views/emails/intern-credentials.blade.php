{{-- resources/views/emails/intern-credentials.blade.php --}}
    <!DOCTYPE html>
<html>
<head>
    <title>Your Intern Account Credentials</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 5px;
        }
        .header {
            background-color: #4f46e5;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
        }
        .content {
            padding: 20px;
            background-color: #f9fafb;
        }
        .credentials {
            background-color: white;
            border: 1px solid #e5e7eb;
            padding: 15px;
            margin: 20px 0;
            border-radius: 5px;
        }
        .footer {
            text-align: center;
            padding: 20px;
            font-size: 12px;
            color: #6b7280;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #4f46e5;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 15px;
        }
    </style>
</head>
<body>
<div class="container">
    <div class="header">
        <h1>Welcome to OJT Task Tracker</h1>
    </div>

    <div class="content">
        <h2>Hello {{ $intern->name }},</h2>

        <p>Your intern account has been created successfully. Below are your login credentials:</p>

        <div class="credentials">
            <p><strong>Email:</strong> {{ $intern->email }}</p>
            <p><strong>Password:</strong> {{ $password }}</p>
        </div>

        <p>Please login and change your password immediately for security purposes.</p>

        <a href="{{ route('login') }}" class="button">Login to Your Account</a>

        <p style="margin-top: 20px; font-size: 14px; color: #6b7280;">
            <strong>Note:</strong> For security reasons, we recommend changing your password after your first login.
        </p>
    </div>

    <div class="footer">
        <p>This is an automated message. Please do not reply to this email.</p>
        <p>&copy; {{ date('Y') }} OJT Task Tracker. All rights reserved.</p>
    </div>
</div>
</body>
</html>
