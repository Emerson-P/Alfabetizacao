import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';

const LoginAlfabetizacao = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    if (errors.general) {
      setErrors(prev => ({
        ...prev,
        general: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setSuccessMessage('');

    // Validação básica no frontend
    if (!formData.email || !formData.password) {
      setErrors({
        general: 'Por favor, preencha todos os campos'
      });
      setLoading(false);
      return;
    }

    console.log('Enviando dados de login:', { email: formData.email }); // Debug (sem mostrar senha)

    try {
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      console.log('Resposta do servidor:', data); // Debug

      if (response.ok) {
        setSuccessMessage(`Bem-vindo, ${data.user.name}! Redirecionando...`);
        
        // Aqui você pode armazenar os dados do usuário
        localStorage.setItem('user', JSON.stringify(data.user)); // Se precisar
        
        // Redirecionar após 2 segundos
        setTimeout(() => {
          window.location.href = '/'; // Descomente quando tiver a rota
          console.log('Usuário logado:', data.user);
        }, 2000);
      } else {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setErrors({
            general: data.message || 'Credenciais inválidas'
          });
        }
      }
    } catch (error) {
      console.error('Erro na requisição:', error); // Debug
      setErrors({
        general: 'Erro ao conectar com o servidor. Verifique se o Laravel está rodando na porta 8000.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCadastroClick = () => {
  
    window.location.href = '/cadastro'; 
    console.log('Ir para página de cadastro');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        {/* Header com imagem ilustrativa */}
        <div className="bg-gray-200 rounded-t-lg h-40 flex items-center justify-center mb-0">
          <div className="text-center">
            <BookOpen size={64} className="mx-auto text-gray-400 mb-2" />
            <p className="text-gray-600 text-lg font-semibold">Programa de Alfabetização para Idosos</p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-b-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-amber-700 text-center mb-6">
            Entrar
          </h2>

          {successMessage && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              {successMessage}
            </div>
          )}

          {errors.general && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {errors.general}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Seu e-mail"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 text-lg"
                autoComplete="email"
              />
              {errors.email && (
                <p className="mt-1 text-red-600 text-sm">{errors.email[0]}</p>
              )}
            </div>

            <div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Sua senha"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 text-lg"
                autoComplete="current-password"
              />
              {errors.password && (
                <p className="mt-1 text-red-600 text-sm">{errors.password[0]}</p>
              )}
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-amber-700 hover:bg-amber-800 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            >
              {loading ? 'Entrando...' : 'Login'}
            </button>

            <div className="text-center mt-4">
              <p className="text-gray-600">
                Não tem conta?{' '}
                <span 
                  onClick={handleCadastroClick}
                  className="text-amber-700 hover:text-amber-800 font-semibold cursor-pointer"
                >
                  Cadastre-se
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Informações adicionais */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">
            🔐 Acesso Seguro
          </h3>
          <p className="text-gray-700 leading-relaxed">
            Entre com seu e-mail e senha para acessar as aulas, exercícios e acompanhar seu progresso no programa de alfabetização.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginAlfabetizacao;