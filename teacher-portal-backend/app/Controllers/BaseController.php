<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;

class BaseController extends ResourceController
{
    protected $format = 'json';

    /**
     * Standard success response.
     */
    protected function success(mixed $data = null, string $message = 'Success', int $code = 200)
    {
        $response = ['status' => true, 'message' => $message];
        if ($data !== null) {
            $response['data'] = $data;
        }
        return $this->respond($response, $code);
    }

    /**
     * Standard error response.
     */
    protected function error(string $message = 'Error', int $code = 400, mixed $errors = null)
    {
        $response = ['status' => false, 'message' => $message];
        if ($errors !== null) {
            $response['errors'] = $errors;
        }
        return $this->respond($response, $code);
    }

    /**
     * Get authenticated user payload from JWT.
     */
    protected function getAuthUser(): object
    {
        return $this->request->decoded;
    }
}
