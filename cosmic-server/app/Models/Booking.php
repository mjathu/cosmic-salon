<?php

namespace App\Models;

use Helpers;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Booking extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'customer_id',
        'staff_id',
        'date',
        'start_time',
        'end_time',
        'price',
        'status'
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

    public function staff()
    {
        return $this->belongsTo(User::class, 'staff_id')->withTrashed();
    }

    public function services()
    {
        return $this->belongsToMany(Service::class)->withTimestamps();
    }

}
