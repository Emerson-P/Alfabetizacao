<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $usuarios = [
            [
                'name' => 'Maria Silva',
                'email' => 'maria@email.com',
                'password' => Hash::make('123456'),
            ],
            [
                'name' => 'João Santos',
                'email' => 'joao@email.com',
                'password' => Hash::make('123456'),
            ],
            [
                'name' => 'Ana Costa',
                'email' => 'ana@email.com',
                'password' => Hash::make('123456'),
            ],
            [
                'name' => 'Pedro Oliveira',
                'email' => 'pedro@email.com',
                'password' => Hash::make('123456'),
            ],
            [
                'name' => 'Rosa Ferreira',
                'email' => 'rosa@email.com',
                'password' => Hash::make('123456'),
            ],
            [
                'name' => 'Carlos Almeida',
                'email' => 'carlos@email.com',
                'password' => Hash::make('123456'),
            ],
            [
                'name' => 'Lucia Martins',
                'email' => 'lucia@email.com',
                'password' => Hash::make('123456'),
            ],
            [
                'name' => 'Antonio Rocha',
                'email' => 'antonio@email.com',
                'password' => Hash::make('123456'),
            ],
        ];

        foreach ($usuarios as $usuario) {
            User::create($usuario);
        }
    }
}