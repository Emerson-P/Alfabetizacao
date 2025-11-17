import React, { useState, useEffect } from 'react';
import { MessageCircle, Plus, Trash2, User, Clock } from 'lucide-react';

const ForumAlfabetizacao = () => {
  const [usuario, setUsuario] = useState(null);
  const [abaSelecionada, setAbaSelecionada] = useState('todos'); // 'todos' ou 'meus'
  const [meusPosts, setMeusPosts] = useState([]);
  const [todosPosts, setTodosPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [novoPost, setNovoPost] = useState({ titulo: '', conteudo: '' });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  // Verificar se usuário está logado
  useEffect(() => {
    const usuarioLogado = localStorage.getItem('user');
    if (!usuarioLogado) {
      window.location.href = '/login';
      return;
    }
    setUsuario(JSON.parse(usuarioLogado));
  }, []);

  // Carregar posts quando o usuário estiver disponível
  useEffect(() => {
    if (usuario) {
      carregarTodosPosts();
      carregarMeusPosts();
    }
  }, [usuario]);

  const carregarTodosPosts = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/posts');
      const data = await response.json();
      if (data.success) {
        setTodosPosts(data.posts);
      }
    } catch (error) {
      console.error('Erro ao carregar posts:', error);
    }
  };

  const carregarMeusPosts = async () => {
    if (!usuario) return;
    
    try {
      const response = await fetch(`http://localhost:8000/api/posts/meus?user_id=${usuario.id}`);
      const data = await response.json();
      if (data.success) {
        setMeusPosts(data.posts);
      }
    } catch (error) {
      console.error('Erro ao carregar meus posts:', error);
    }
  };

  const handleCriarPost = async () => {
    setLoading(true);
    setErrors({});

    if (!novoPost.titulo || !novoPost.conteudo) {
      setErrors({ geral: 'Preencha todos os campos' });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          user_id: usuario.id,
          titulo: novoPost.titulo,
          conteudo: novoPost.conteudo
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Post criado com sucesso!');
        setNovoPost({ titulo: '', conteudo: '' });
        setShowModal(false);
        carregarTodosPosts();
        carregarMeusPosts();
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setErrors(data.errors || { geral: 'Erro ao criar post' });
      }
    } catch (error) {
      setErrors({ geral: 'Erro ao conectar com o servidor' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeletarPost = async (postId) => {
    if (!confirm('Tem certeza que deseja deletar este post?')) return;

    try {
      const response = await fetch(`http://localhost:8000/api/posts/${postId}?user_id=${usuario.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Post deletado com sucesso!');
        carregarTodosPosts();
        carregarMeusPosts();
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        alert(data.message || 'Erro ao deletar post');
      }
    } catch (error) {
      alert('Erro ao conectar com o servidor');
    }
  };

  const formatarData = (data) => {
    const date = new Date(data);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const postsParaExibir = abaSelecionada === 'todos' ? todosPosts : meusPosts;
  const postsOutros = todosPosts.filter(post => post.user_id !== usuario?.id);

  if (!usuario) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-xl text-gray-600">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageCircle size={32} className="text-amber-700" />
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Fórum da Comunidade</h1>
                <p className="text-gray-600">Compartilhe e aprenda com outros alunos</p>
              </div>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-amber-700 hover:bg-amber-800 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <Plus size={20} />
              Criar Post
            </button>
          </div>
        </div>

        {/* Mensagem de Sucesso */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {successMessage}
          </div>
        )}

        {/* Abas */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setAbaSelecionada('todos')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-colors ${
              abaSelecionada === 'todos'
                ? 'bg-amber-700 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Todos os Posts ({postsOutros.length})
          </button>
          <button
            onClick={() => setAbaSelecionada('meus')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-colors ${
              abaSelecionada === 'meus'
                ? 'bg-amber-700 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Meus Posts ({meusPosts.length})
          </button>
        </div>

        {/* Lista de Posts */}
        <div className="space-y-4">
          {abaSelecionada === 'todos' ? (
            postsOutros.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <MessageCircle size={48} className="mx-auto text-gray-400 mb-3" />
                <p className="text-gray-600 text-lg">Nenhum post de outros usuários ainda</p>
                <p className="text-gray-500 text-sm mt-2">Seja o primeiro a criar um post!</p>
              </div>
            ) : (
              postsOutros.map(post => (
                <PostCard
                  key={post.id}
                  post={post}
                  ehMeuPost={false}
                  onDelete={handleDeletarPost}
                  formatarData={formatarData}
                />
              ))
            )
          ) : (
            meusPosts.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <MessageCircle size={48} className="mx-auto text-gray-400 mb-3" />
                <p className="text-gray-600 text-lg">Você ainda não criou nenhum post</p>
                <button
                  onClick={() => setShowModal(true)}
                  className="mt-4 bg-amber-700 hover:bg-amber-800 text-white px-6 py-2 rounded-lg font-semibold"
                >
                  Criar Meu Primeiro Post
                </button>
              </div>
            ) : (
              meusPosts.map(post => (
                <PostCard
                  key={post.id}
                  post={post}
                  ehMeuPost={true}
                  onDelete={handleDeletarPost}
                  formatarData={formatarData}
                />
              ))
            )
          )}
        </div>
      </div>

      {/* Modal de Criar Post */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Criar Novo Post</h2>

            {errors.geral && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                {errors.geral}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Título</label>
                <input
                  type="text"
                  value={novoPost.titulo}
                  onChange={(e) => setNovoPost({ ...novoPost, titulo: e.target.value })}
                  placeholder="Digite o título do post"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 text-lg"
                />
                {errors.titulo && (
                  <p className="mt-1 text-red-600 text-sm">{errors.titulo[0]}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Conteúdo</label>
                <textarea
                  value={novoPost.conteudo}
                  onChange={(e) => setNovoPost({ ...novoPost, conteudo: e.target.value })}
                  placeholder="Escreva o conteúdo do seu post..."
                  rows="6"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 text-lg resize-none"
                />
                {errors.conteudo && (
                  <p className="mt-1 text-red-600 text-sm">{errors.conteudo[0]}</p>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCriarPost}
                disabled={loading}
                className="flex-1 bg-amber-700 hover:bg-amber-800 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
              >
                {loading ? 'Criando...' : 'Publicar'}
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setNovoPost({ titulo: '', conteudo: '' });
                  setErrors({});
                }}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-3 rounded-lg font-semibold"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const PostCard = ({ post, ehMeuPost, onDelete, formatarData }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center">
            <User size={24} className="text-white" />
          </div>
          <div>
            <p className="font-semibold text-gray-800">
              {post.user.name}
              {ehMeuPost && <span className="ml-2 text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">Você</span>}
            </p>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Clock size={14} />
              <span>{formatarData(post.created_at)}</span>
            </div>
          </div>
        </div>

        {ehMeuPost && (
          <button
            onClick={() => onDelete(post.id)}
            className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors"
            title="Deletar post"
          >
            <Trash2 size={20} />
          </button>
        )}
      </div>

      <h3 className="text-xl font-bold text-gray-800 mb-2">{post.titulo}</h3>
      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{post.conteudo}</p>
    </div>
  );
};

export default ForumAlfabetizacao;