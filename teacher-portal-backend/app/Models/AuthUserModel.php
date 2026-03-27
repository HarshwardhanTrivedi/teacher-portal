<?php

namespace App\Models;

use CodeIgniter\Model;

class AuthUserModel extends Model
{
    protected $table            = 'auth_user';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;

    protected $allowedFields = [
        'email',
        'first_name',
        'last_name',
        'password',
        'is_active',
    ];

    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';

    protected $validationRules = [
        'email'      => 'required|valid_email|is_unique[auth_user.email]',
        'first_name' => 'required|min_length[2]|max_length[100]',
        'last_name'  => 'required|min_length[2]|max_length[100]',
        'password'   => 'required|min_length[8]',
    ];

    protected $validationMessages = [
        'email' => [
            'is_unique' => 'This email is already registered.',
        ],
    ];

    // Never return password in queries by default
    protected $hidden = ['password'];

    /**
     * Find a user by email (includes password for auth checks).
     */
    public function findByEmail(string $email): ?array
    {
        return $this->where('email', $email)->first();
    }

    /**
     * Get all users with their teacher data joined.
     */
    public function getUsersWithTeachers(): array
    {
        return $this->db->table('auth_user u')
            ->select('u.id, u.email, u.first_name, u.last_name, u.is_active, u.created_at,
                      t.id as teacher_id, t.university_name, t.gender, t.year_joined,
                      t.department, t.phone, t.bio')
            ->join('teachers t', 't.user_id = u.id', 'left')
            ->get()
            ->getResultArray();
    }
}
