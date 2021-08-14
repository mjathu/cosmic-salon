@component('mail::message')

Dear {{ $booking->staff->full_name }},

@if ($updated === true)

Your booking with **{{ $booking->customer->full_name }}** is updated. 

@elseif ($booking->status === 'booked')

You have a booking with **{{ $booking->customer->full_name }}** for the services detailed below.

@elseif ($booking->status === 'cancelled')

Your booking with **{{ $booking->customer->full_name }}** is cancelled.

@elseif ($booking->status === 'completed')

Your booking with **{{ $booking->customer->full_name }}** is completed.

@endif

##### Booking Details
Date: {{ $booking->date }} <br>
Time: {{ $time }} <br>
Customer Name: {{ $booking->customer->full_name }} <br>

##### Services
@foreach ($booking->services as $service)
- {{ $service->name }} | ${{ number_format($service->price, 2) }} | {{ $service->duration }} Minutes
@endforeach

Thanks,<br>
{{ config('app.name') }}
@endcomponent
