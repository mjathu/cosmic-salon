@component('mail::message')

<p>
    Dear {{ $user->full_name }},
</p>

<p>
    Please click on the link below to verify your email.
</p>

@component('mail::button', ['url' => $url])
Verify
@endcomponent

Thanks,<br>
Cosmic Salon Team
@endcomponent
