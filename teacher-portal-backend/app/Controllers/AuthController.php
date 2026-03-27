<?php

namespace App\Controllers;

use App\Models\AuthUserModel;
use App\Libraries\JWTHelper;

class AuthController extends BaseController
{
    private AuthUserModel $userModel;

    public function __construct()
    {
        $this->userModel = new AuthUserModel();
    }

    // ─── POST /api/auth/register ───────────────────────────────────────
    public function register()
    {
        $rules = [
            'email'      => 'required|valid_email|is_unique[auth_user.email]',
            'first_name' => 'required|min_length[2]|max_length[100]',
            'last_name'  => 'required|min_length[2]|max_length[100]',
            'password'   => 'required|min_length[8]',
        ];

        $data = $this->request->getJSON(true) ?? $this->request->getPost();

        if (!$this->validate($rules, $data)) {
            return $this->error('Validation failed.', 422, $this->validator->getErrors());
        }

        $userId = $this->userModel->insert([
            'email'      => strtolower(trim($data['email'])),
            'first_name' => trim($data['first_name']),
            'last_name'  => trim($data['last_name']),
            'password'   => password_hash($data['password'], PASSWORD_BCRYPT),
            'is_active'  => 1,
        ]);

        if (!$userId) {
            return $this->error('Registration failed. Please try again.', 500);
        }

        $user  = $this->userModel->find($userId);
        $token = JWTHelper::generateToken([
            'user_id'    => $user['id'],
            'email'      => $user['email'],
            'first_name' => $user['first_name'],
            'last_name'  => $user['last_name'],
        ]);

        unset($user['password']);

        return $this->success([
            'user'  => $user,
            'token' => $token,
        ], 'Registration successful.', 201);
    }

    // ─── POST /api/auth/login ──────────────────────────────────────────
    public function login()
    {
        $data = $this->request->getJSON(true) ?? $this->request->getPost();

        if (empty($data['email']) || empty($data['password'])) {
            return $this->error('Email and password are required.', 422);
        }

        $user = $this->userModel->findByEmail(strtolower(trim($data['email'])));

        if (!$user || !password_verify($data['password'], $user['password'])) {
            return $this->error('Invalid credentials.', 401);
        }

        if (!$user['is_active']) {
            return $this->error('Account is deactivated.', 403);
        }

        $token = JWTHelper::generateToken([
            'user_id'    => $user['id'],
            'email'      => $user['email'],
            'first_name' => $user['first_name'],
            'last_name'  => $user['last_name'],
        ]);

        unset($user['password']);

        return $this->success([
            'user'  => $user,
            'token' => $token,
        ], 'Login successful.');
    }

    // ─── GET /api/users  (protected) ──────────────────────────────────
    public function users()
    {
        $users = $this->userModel->getUsersWithTeachers();
        return $this->success($users, 'Users fetched successfully.');
    }

    // ─── GET /api/profile  (protected) ────────────────────────────────
    public function profile()
    {
        $authUser = $this->getAuthUser();
        $user = $this->userModel->find($authUser->user_id);

        if (!$user) {
            return $this->error('User not found.', 404);
        }

        unset($user['password']);
        return $this->success($user, 'Profile fetched.');
    }
}
