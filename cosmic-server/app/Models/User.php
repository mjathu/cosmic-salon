<?php

namespace App\Models;

use App\Enums\RoleType;
use App\Notifications\ResetPasswordNotification;
use Helpers;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'password',
        'role',
        'active',
        'deleted_at'
    ];

    protected $dates = ['deleted_at'];

    protected $appends = [
        'hashid',
        'full_name'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'id',
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'active' => 'boolean'
    ];

    public function getHashidAttribute()
    {
        return (!is_null($this->attributes['id'])) ? Helpers::encodeId($this->attributes['id']) : $this->attributes['id'];
    }

    public function getFullNameAttribute()
    {
        return rtrim($this->attributes['first_name'] . ' ' . $this->attributes['last_name']);
    }

    public function sendPasswordResetNotification($token)
    {
        $url = Helpers::getResetPasswordUrl($this->email, $token);
        
        $this->notify(new ResetPasswordNotification($url));
    }

    /**
     * Scope a query to only include active users.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeActive($query)
    {
        return $query->where('active', true);
    }

    public function scopeAdmin($query)
    {
        return $query->where('role', RoleType::ADMIN);
    }

    public function scopeStaff($query)
    {
        return $query->where('role', RoleType::STAFF);
    }

    public function scopeClient($query)
    {
        return $query->where('role', RoleType::CLIENT);
    }
}
