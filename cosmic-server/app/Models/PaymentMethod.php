<?php

namespace App\Models;

use Helpers;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PaymentMethod extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'card_reference',
        'user_id',
        'fingerprint',
        'brand',
        'last_digits',
        'exp_month',
        'exp_year',
        'default'
    ];

    protected $dates = ['deleted_at'];

    protected $appends = [
        'hashid',
        'expiry',
        'card_number'
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
        'default' => 'boolean'
    ];

    public function getHashidAttribute()
    {
        return (!is_null($this->attributes['id'])) ? Helpers::encodeId($this->attributes['id']) : $this->attributes['id'];
    }

    public function getExpiryAttribute()
    {
        return rtrim($this->attributes['exp_month'] . '/' . $this->attributes['exp_year']);
    }

    public function getCardNumberAttribute()
    {
        return 'XXXX-XXXX-XXXX-'.$this->attributes['last_digits'];
    }

    public function scopeDefault($query)
    {
        return $query->where('default', true);
    }

    /*--------------------------- Relationships -----------------------------------*/

    public function user()
    {
        return $this->belongsTo(User::class)->withTrashed();
    }


}
