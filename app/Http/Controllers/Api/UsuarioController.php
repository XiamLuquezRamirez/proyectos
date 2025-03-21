<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
class UsuarioController extends Controller
{
    public function listarUsuarios()
    {
        $usuarios = DB::table('users')
            ->select('id', 'name as nombre', 'email')
            ->orderBy('name')
            ->get();
        
        return response()->json($usuarios);
    }
}
