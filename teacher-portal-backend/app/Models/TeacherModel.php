<?php

namespace App\Models;

use CodeIgniter\Model;

class TeacherModel extends Model
{
    protected $table            = 'teachers';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;

    protected $allowedFields = [
        'user_id',
        'university_name',
        'gender',
        'year_joined',
        'department',
        'phone',
        'bio',
    ];

    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';

    protected $validationRules = [
        'user_id'         => 'required|integer',
        'university_name' => 'required|min_length[2]|max_length[200]',
        'gender'          => 'required|in_list[male,female,other]',
        'year_joined'     => 'required|integer|greater_than[1900]',
        'department'      => 'required|min_length[2]|max_length[150]',
    ];

    /**
     * Get all teachers with their user info joined.
     */
    public function getTeachersWithUsers(): array
    {
        return $this->db->table('teachers t')
            ->select('t.*, u.email, u.first_name, u.last_name')
            ->join('auth_user u', 'u.id = t.user_id', 'left')
            ->get()
            ->getResultArray();
    }

    /**
     * Get a single teacher with user info.
     */
    public function getTeacherWithUser(int $id): ?array
    {
        return $this->db->table('teachers t')
            ->select('t.*, u.email, u.first_name, u.last_name')
            ->join('auth_user u', 'u.id = t.user_id', 'left')
            ->where('t.id', $id)
            ->get()
            ->getRowArray();
    }
}
