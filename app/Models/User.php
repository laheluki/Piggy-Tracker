<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password'
    ];

    protected $hidden = [
        'password',
    ];

    // 🔑 JWT functions
    public function getJWTIdentifier()
    {
        return $this->getKey(); // biasanya ID
    }

    public function getJWTCustomClaims()
    {
        return [];
    }

    // relasi 1 user bisa punya banyak SocialAccount
    public function socialAccounts(): HasMany
    {
        return $this->hasMany(SocialAccount::class);
    }

    // relasi 1 user bisa punya banyak Category
    public function categories(): HasMany
    {
        return $this->hasMany(Category::class);
    }

    // relasi 1 user bisa punya banyak Transaction
    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }
}
