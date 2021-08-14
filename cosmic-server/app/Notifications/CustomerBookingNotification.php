<?php

namespace App\Notifications;

use App\Enums\BookingStatus;
use App\Models\Booking;
use Helpers;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CustomerBookingNotification extends Notification
{
    use Queueable;

    public $booking;
    public $updated;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct(Booking $booking, bool $updated = false)
    {
        $this->booking = $booking;
        $this->updated = $updated;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        return (new MailMessage)->markdown('emails.customer-booking-notification', [
            'booking' => $this->booking, 
            'updated' => $this->updated,
            'time' => Helpers::convertMinToDateObj($this->booking->start_time, null, 'H:i A') . ' - ' . Helpers::convertMinToDateObj($this->booking->end_time, null, 'H:i A')
        ]);
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return [
            //
        ];
    }
}
