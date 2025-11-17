<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Post;
use App\Models\User;

class PostSeeder extends Seeder
{
    public function run(): void
    {
        $mensagens = [
            [
                'titulo' => 'Minha experiência com o site',
                'conteudo' => 'Achei o site maravilhoso! Consegui aprender a ler palavras básicas em poucos dias. Tudo muito bem explicado.'
            ],
            [
                'titulo' => 'Aprender ficou fácil!',
                'conteudo' => 'Nunca imaginei que aprender a ler seria tão fácil. As atividades são divertidas e me ajudaram muito!'
            ],
            [
                'titulo' => 'Parece com outro app',
                'conteudo' => 'Copiaram o Duolingo 🦜 na cara de pau.'
            ],
            [
                'titulo' => 'Adorei as aulas',
                'conteudo' => 'Gostei muito das aulas! As explicações com áudio e jogos tornaram o aprendizado muito mais leve.'
            ],
            [
                'titulo' => 'Mudou minha vida!',
                'conteudo' => 'Esse site mudou minha vida! Aprender a ler com ele foi simples e muito gratificante.'
            ],
            [
                'titulo' => 'Muito feliz com meu progresso',
                'conteudo' => 'Fiquei muito feliz com meu progresso. As lições são bem organizadas e fáceis de seguir.'
            ],
            [
                'titulo' => 'Gratidão',
                'conteudo' => 'Comecei sem saber quase nada e agora já leio textos simples sozinho. Muito obrigado!'
            ],
            [
                'titulo' => 'Os jogos ajudam muito',
                'conteudo' => 'Achei incrível como os jogos me ajudaram a memorizar as palavras. Parabéns pelo trabalho!'
            ],
            [
                'titulo' => 'Problema técnico',
                'conteudo' => 'Meu gato 😾 comeu meu mouse 🐀, não gostei.'
            ],
            [
                'titulo' => 'Recomendo!',
                'conteudo' => 'A alfabetização pelo site foi uma das melhores experiências que tive. Recomendo para todos!'
            ],
            [
                'titulo' => 'Os áudios são ótimos',
                'conteudo' => 'Os áudios me ajudaram a entender a pronúncia correta. Aprender ficou bem mais fácil.'
            ],
            [
                'titulo' => 'Atividades divertidas',
                'conteudo' => 'Adorei as atividades com imagens e sons. Aprender ficou divertido e eficiente!'
            ],
            [
                'titulo' => 'Superou expectativas',
                'conteudo' => 'Foi muito mais fácil do que eu pensava! O site é claro, didático e bem feito.'
            ],
            [
                'titulo' => 'Receita',
                'conteudo' => 'Receita de Bolo 🎂 de cenoura 🥕 google pesquisar.'
            ],
            [
                'titulo' => 'Nunca é tarde',
                'conteudo' => 'Muito obrigado por esse conteúdo! Eu achava que já era tarde para aprender, mas consegui.'
            ],
            [
                'titulo' => 'Plataforma intuitiva',
                'conteudo' => 'A plataforma é intuitiva e muito agradável. Fiquei empolgado a cada lição completada.'
            ],
            [
                'titulo' => 'AJUDAAAAA',
                'conteudo' => 'COMO TIRAR LETRA GRAMDE ?????.'
            ],
            [
                'titulo' => 'Faz diferença na vida',
                'conteudo' => 'Recomendo muito! É o tipo de site que faz a diferença na vida de quem quer aprender a ler.'
            ],
        ];

        // Buscar todos os usuários
        $usuarios = User::all();

        if ($usuarios->isEmpty()) {
            $this->command->error('Nenhum usuário encontrado! Execute o UserSeeder primeiro.');
            return;
        }

        // Distribuir mensagens entre os usuários
        foreach ($mensagens as $index => $mensagem) {
            // Distribuir de forma circular entre os usuários
            $usuario = $usuarios[$index % $usuarios->count()];

            Post::create([
                'user_id' => $usuario->id,
                'titulo' => $mensagem['titulo'],
                'conteudo' => $mensagem['conteudo'],
                'created_at' => now()->subDays(rand(1, 30)), // Datas variadas nos últimos 30 dias
            ]);
        }

        $this->command->info('Posts criados com sucesso!');
    }
}