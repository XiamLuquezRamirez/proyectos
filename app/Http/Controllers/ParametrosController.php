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
            ->leftJoin('municipios', 'proyectos.municipio','municipios.id')
            ->leftJoin('users', 'proyectos.responsable','users.id')
            ->where('estado', 'Activo')
            ->select('proyectos.*', 'municipios.nombre as municipio', 'users.name as responsable')
            ->get();
        return response()->json($proyectos);
    }

    public function guardarProyectos(Request $request)
    {
        $proyectos = $request->all();

        //validar insert con commit
        DB::beginTransaction();
        try {
            $proyectos = DB::table('proyectos')->insert(
                [
                'nombre' => $proyectos['nombre'],
                'descripcion' => $proyectos['descripcion'],
                'municipio' => $proyectos['municipio'],
                'fecha' => $proyectos['fechaInicio'],                
                'fase' => $proyectos['fase'],                
                'presupuesto' => $proyectos['presupuesto'],
                'responsable' => $proyectos['responsable'],          
                'categoria' => $proyectos['categoria'],
                'estado' => $proyectos['estado'],
            ]
        );
        DB::commit();
        return response()->json($proyectos);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
