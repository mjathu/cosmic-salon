@component('mail::message')

Dear {{ $booking->customer->full_name }},

@if ($updated === true)

Your booking is **updated**. Please find the new booking details below. 

@elseif ($booking->status === 'booked')

Thank you for making a booking with us. Plese find the booking details below.

@elseif ($booking->status === 'cancelled')

Your booking is **cancelled**. Please find the booking details below.

@elseif ($booking->status === 'completed')

Your booking is **completed**. Thank you for choosing our service. 

@endif

##### Booking Details
Date: {{ $booking->date }} <br>
Time: {{ $time }} <br>
Staff Name: {{ $booking->staff->full_name }} <br>
Price: ${{ number_format($booking->price, 2) }} <br>
@if ($booking->status === 'completed') 
Payment Method: {{ $booking->payment->paymentMethod ? 'Card ending in ' . $booking->payment->paymentMethod->last_digits : 'Cash' }} <br>
Payment Reference: {{ strtoupper($booking->payment->payment_reference) }}
@endif

##### Services
@foreach ($booking->services as $service)
- {{ $service->name }} | ${{ number_format($service->price, 2) }} | {{ $service->duration }} Minutes
@endforeach

Thanks,<br>
{{ config('app.name') }}
@endcomponent
