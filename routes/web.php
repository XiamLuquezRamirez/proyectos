<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Api\UsuarioController;
use App\Http\Controllers\ParametrosController;

Route::get('/', function () {
    return Inertia::render('auth/login');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::get('/parametros', function () {
    return Inertia::render('parametros');
})->name('parametros');

Route::post('/parametros/municipios', [ParametrosController::class, 'listarMunicipios'])
    ->middleware(['auth']);

Route::post('/parametros/usuarios', [UsuarioController::class, 'listarUsuarios'])
    ->middleware(['auth']);

Route::post('/parametros/proyectos', [ParametrosController::class, 'listarProyectos'])
    ->middleware(['auth']);

Route::post('/parametros/guardarProyectos', [ParametrosController::class, 'guardarProyectos'])
    ->middleware(['auth']);

    
require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
