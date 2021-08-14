@component('mail::message')

Dear {{ $user->full_name }},

Please click on the link below to verify your email and setup your account.

@component('mail::button', ['url' => $url])
Setup Account
@endcomponent

Thanks,<br>
{{ config('app.name') }}
@endcomponent
