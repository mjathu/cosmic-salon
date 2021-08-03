@component('mail::message')
<p>
    Dear {{ $user->full_name }},
</p>

<p>
    Please click on the link below to verify your email and setup your account.
</p>

@component('mail::button', ['url' => $url])
Setup Account
@endcomponent

Thanks,<br>
{{ config('app.name') }}
@endcomponent
