<?php

namespace App\Controllers;

use App\Models\AuthUserModel;
use App\Models\TeacherModel;

class TeacherController extends BaseController
{
    private AuthUserModel $userModel;
    private TeacherModel  $teacherModel;

    public function __construct()
    {
        $this->userModel    = new AuthUserModel();
        $this->teacherModel = new TeacherModel();
    }

    // ─── POST /api/teachers ────────────────────────────────────────────
    // Single endpoint: creates auth_user + teacher record atomically
    public function create()
    {
        $data = $this->request->getJSON(true) ?? $this->request->getPost();

        // Validate auth_user fields
        $userRules = [
            'email'      => 'required|valid_email|is_unique[auth_user.email]',
            'first_name' => 'required|min_length[2]|max_length[100]',
            'last_name'  => 'required|min_length[2]|max_length[100]',
            'password'   => 'required|min_length[8]',
        ];

        // Validate teacher fields
        $teacherRules = [
            'university_name' => 'required|min_length[2]|max_length[200]',
            'gender'          => 'required|in_list[male,female,other]',
            'year_joined'     => 'required|integer|greater_than[1900]',
            'department'      => 'required|min_length[2]|max_length[150]',
        ];

        $allRules = array_merge($userRules, $teacherRules);

        if (!$this->validate($allRules, $data)) {
            return $this->error('Validation failed.', 422, $this->validator->getErrors());
        }

        // Transaction: insert both tables atomically
        $db = \Config\Database::connect();
        $db->transBegin();

        try {
            // 1. Insert auth_user
            $userId = $this->userModel->insert([
                'email'      => strtolower(trim($data['email'])),
                'first_name' => trim($data['first_name']),
                'last_name'  => trim($data['last_name']),
                'password'   => password_hash($data['password'], PASSWORD_BCRYPT),
                'is_active'  => 1,
            ]);

            if (!$userId) {
                throw new \Exception('Failed to create user account.');
            }

            // 2. Insert teacher with FK user_id
            $teacherId = $this->teacherModel->insert([
                'user_id'         => $userId,
                'university_name' => trim($data['university_name']),
                'gender'          => $data['gender'],
                'year_joined'     => (int) $data['year_joined'],
                'department'      => trim($data['department']),
                'phone'           => $data['phone'] ?? null,
                'bio'             => $data['bio'] ?? null,
            ]);

            if (!$teacherId) {
                throw new \Exception('Failed to create teacher record.');
            }

            $db->transCommit();

            // Fetch complete record to return
            $result = $this->teacherModel->getTeacherWithUser($teacherId);

            return $this->success($result, 'Teacher created successfully.', 201);
        } catch (\Exception $e) {
            $db->transRollback();
            return $this->error($e->getMessage(), 500);
        }
    }

    // ─── GET /api/teachers ────────────────────────────────────────────
    public function index()
    {
        $teachers = $this->teacherModel->getTeachersWithUsers();
        return $this->success($teachers, 'Teachers fetched successfully.');
    }

    // ─── GET /api/teachers/:id ────────────────────────────────────────
    public function show($id = null)
    {
        $teacher = $this->teacherModel->getTeacherWithUser((int) $id);

        if (!$teacher) {
            return $this->error('Teacher not found.', 404);
        }

        return $this->success($teacher, 'Teacher fetched successfully.');
    }

    // ─── PUT /api/teachers/:id ────────────────────────────────────────
    public function update($id = null)
    {
        $teacher = $this->teacherModel->find((int) $id);

        if (!$teacher) {
            return $this->error('Teacher not found.', 404);
        }

        $data = $this->request->getJSON(true) ?? $this->request->getRawInput();

        $updatableTeacher = array_filter([
            'university_name' => $data['university_name'] ?? null,
            'gender'          => $data['gender'] ?? null,
            'year_joined'     => isset($data['year_joined']) ? (int) $data['year_joined'] : null,
            'department'      => $data['department'] ?? null,
            'phone'           => $data['phone'] ?? null,
            'bio'             => $data['bio'] ?? null,
        ], fn($v) => $v !== null);

        $updatableUser = array_filter([
            'first_name' => $data['first_name'] ?? null,
            'last_name'  => $data['last_name'] ?? null,
        ], fn($v) => $v !== null);

        $db = \Config\Database::connect();
        $db->transBegin();

        try {
            if (!empty($updatableTeacher)) {
                $this->teacherModel->update((int) $id, $updatableTeacher);
            }
            if (!empty($updatableUser)) {
                $this->userModel->update($teacher['user_id'], $updatableUser);
            }
            $db->transCommit();

            $result = $this->teacherModel->getTeacherWithUser((int) $id);
            return $this->success($result, 'Teacher updated successfully.');
        } catch (\Exception $e) {
            $db->transRollback();
            return $this->error($e->getMessage(), 500);
        }
    }

    // ─── DELETE /api/teachers/:id ─────────────────────────────────────
    public function delete($id = null)
    {
        $teacher = $this->teacherModel->find((int) $id);

        if (!$teacher) {
            return $this->error('Teacher not found.', 404);
        }

        // Deleting auth_user cascades to teacher (FK ON DELETE CASCADE)
        $this->userModel->delete($teacher['user_id']);

        return $this->success(null, 'Teacher deleted successfully.');
    }
}
