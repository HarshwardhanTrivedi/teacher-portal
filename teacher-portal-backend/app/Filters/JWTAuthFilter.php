<?php

namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use App\Libraries\JWTHelper;
use Exception;

class JWTAuthFilter implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        $authHeader = $request->getHeaderLine('Authorization');

        if (empty($authHeader) || !preg_match('/Bearer\s+(.+)/', $authHeader, $matches)) {
            return response()->setJSON([
                'status'  => false,
                'message' => 'Authorization token required.',
            ])->setStatusCode(401);
        }

        $token = $matches[1];

        try {
            $decoded = JWTHelper::validateToken($token);
            // Attach decoded payload to request for downstream use
            $request->decoded = $decoded;
        } catch (Exception $e) {
            return response()->setJSON([
                'status'  => false,
                'message' => 'Invalid or expired token: ' . $e->getMessage(),
            ])->setStatusCode(401);
        }
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        // nothing
    }
}
