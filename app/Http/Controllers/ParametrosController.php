<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
class ParametrosController extends Controller
{
    public function listarMunicipios()
    {
        $municipios = DB::table('municipios')
            ->select('id', 'nombre')
            ->where('habilitado', 'SI')
            ->get();
        return response()->json($municipios);
    }
    public function listarProyectos()
    {
        $proyectos = DB::table('proyectos')
            ->where('estado', 'Activo')
            ->get();
        return response()->json($proyectos);
    }
}
