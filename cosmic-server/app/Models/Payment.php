<?php

namespace App\Models;

use Helpers;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Payment extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'booking_id',
        'customer_id',
        'payment_method_id',
        'date',
        'payment_reference',
        'transaction_reference',
        'price'
    ];

    protected $dates = ['deleted_at'];

    protected $appends = [
        'hashid'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'id'
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'price' => 'double'
    ];

    public function getHashidAttribute()
    {
        return (!is_null($this->attributes['id'])) ? Helpers::encodeId($this->attributes['id']) : $this->attributes['id'];
    }

    /*--------------------------- Relationships -----------------------------------*/

    public function customer()
    {
        return $this->belongsTo(User::class, 'customer_id')->withTrashed();
    }

    public function booking()
    {
        return $this->belongsTo(Booking::class, 'booking_id')->withTrashed();
    }

    public function paymentMethod()
    {
        return $this->belongsTo(PaymentMethod::class, 'payment_method_id')->withTrashed();
    }
}
