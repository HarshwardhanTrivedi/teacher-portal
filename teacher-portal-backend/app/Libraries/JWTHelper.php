<?php

namespace App\Libraries;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Exception;

class JWTHelper
{
    private static function getSecret(): string
    {
        return env('JWT_SECRET_KEY', 'default_secret_change_me');
    }

    private static function getTTL(): int
    {
        return (int) env('JWT_TIME_TO_LIVE', 3600);
    }

    /**
     * Generate a signed JWT for a given user payload.
     */
    public static function generateToken(array $payload): string
    {
        $issuedAt = time();
        $expire   = $issuedAt + self::getTTL();

        $tokenPayload = array_merge($payload, [
            'iat' => $issuedAt,
            'exp' => $expire,
        ]);

        return JWT::encode($tokenPayload, self::getSecret(), 'HS256');
    }

    /**
     * Validate a JWT and return its decoded payload.
     *
     * @throws Exception on invalid/expired token
     */
    public static function validateToken(string $token): object
    {
        return JWT::decode($token, new Key(self::getSecret(), 'HS256'));
    }
}
