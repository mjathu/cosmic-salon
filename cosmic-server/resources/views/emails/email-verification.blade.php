@component('mail::message')

Dear {{ $user->full_name }},

Please click on the link below to verify your email.

@component('mail::button', ['url' => $url])
Verify
@endcomponent

Thanks,<br>
Cosmic Salon Team
@endcomponent
