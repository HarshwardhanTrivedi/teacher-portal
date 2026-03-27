<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */

// ─── Public Auth Routes ────────────────────────────────────────────────
$routes->group('api/auth', function ($routes) {
    $routes->post('register', 'AuthController::register');
    $routes->post('login',    'AuthController::login');
});

// ─── Protected Routes (require JWT) ───────────────────────────────────
$routes->group('api', ['filter' => 'jwtAuth'], function ($routes) {
    // Teacher CRUD
    $routes->post('teachers',        'TeacherController::create');
    $routes->get('teachers',         'TeacherController::index');
    $routes->get('teachers/(:num)',  'TeacherController::show/$1');
    $routes->put('teachers/(:num)',  'TeacherController::update/$1');
    $routes->delete('teachers/(:num)', 'TeacherController::delete/$1');

    // Auth Users list
    $routes->get('users', 'AuthController::users');

    // Profile
    $routes->get('profile', 'AuthController::profile');
});
