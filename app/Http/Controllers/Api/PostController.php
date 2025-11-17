<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PostController extends Controller
{
    // Listar todos os posts
    public function index()
    {
        $posts = Post::with('user:id,name,email')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'posts' => $posts
        ], 200);
    }

    // Listar posts do usuário logado
    public function meusPosts(Request $request)
    {
        $userId = $request->input('user_id');

        if (!$userId) {
            return response()->json([
                'success' => false,
                'message' => 'ID do usuário é obrigatório'
            ], 400);
        }

        $posts = Post::with('user:id,name,email')
            ->where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'posts' => $posts
        ], 200);
    }

    // Criar novo post
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'titulo' => 'required|string|max:255',
            'conteudo' => 'required|string|min:10',
        ], [
            'user_id.required' => 'Usuário não identificado',
            'user_id.exists' => 'Usuário inválido',
            'titulo.required' => 'O título é obrigatório',
            'titulo.max' => 'O título deve ter no máximo 255 caracteres',
            'conteudo.required' => 'O conteúdo é obrigatório',
            'conteudo.min' => 'O conteúdo deve ter no mínimo 10 caracteres',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $post = Post::create([
            'user_id' => $request->user_id,
            'titulo' => $request->titulo,
            'conteudo' => $request->conteudo,
        ]);

        $post->load('user:id,name,email');

        return response()->json([
            'success' => true,
            'message' => 'Post criado com sucesso!',
            'post' => $post
        ], 201);
    }

    // Deletar post
    public function destroy(Request $request, $id)
    {
        $userId = $request->input('user_id');

        if (!$userId) {
            return response()->json([
                'success' => false,
                'message' => 'ID do usuário é obrigatório'
            ], 400);
        }

        $post = Post::find($id);

        if (!$post) {
            return response()->json([
                'success' => false,
                'message' => 'Post não encontrado'
            ], 404);
        }

        // Verificar se o post pertence ao usuário
        if ($post->user_id != $userId) {
            return response()->json([
                'success' => false,
                'message' => 'Você não tem permissão para deletar este post'
            ], 403);
        }

        $post->delete();

        return response()->json([
            'success' => true,
            'message' => 'Post deletado com sucesso!'
        ], 200);
    }
}