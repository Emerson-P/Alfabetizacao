import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';

const CadastroAlfabetizacao = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
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
  };

  const handleLoginClick = () => {
  
    window.location.href = '/login'; 
    console.log('Ir para página de login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setSuccessMessage('');

    // Validação básica no frontend
    if (!formData.name || !formData.email || !formData.password || !formData.password_confirmation) {
      setErrors({
        general: 'Por favor, preencha todos os campos'
      });
      setLoading(false);
      return;
    }

    if (formData.password !== formData.password_confirmation) {
      setErrors({
        password_confirmation: ['As senhas não conferem']
      });
      setLoading(false);
      return;
    }

    console.log('Enviando dados:', formData); // Debug

    try {
      const response = await fetch('http://localhost:8000/api/cadastro', {
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
        setSuccessMessage('Cadastro realizado com sucesso! Bem-vindo ao programa de alfabetização.');
        setFormData({
          name: '',
          email: '',
          password: '',
          password_confirmation: ''
        });
        setTimeout(() => {
          setSuccessMessage('');
        }, 5000);
      } else {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setErrors({
            general: data.message || 'Erro ao processar o cadastro'
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
            Cadastro
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
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Seu nome"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 text-lg"
              />
              {errors.name && (
                <p className="mt-1 text-red-600 text-sm">{errors.name[0]}</p>
              )}
            </div>

            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Seu e-mail"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 text-lg"
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
              />
              {errors.password && (
                <p className="mt-1 text-red-600 text-sm">{errors.password[0]}</p>
              )}
            </div>

            <div>
              <input
                type="password"
                name="password_confirmation"
                value={formData.password_confirmation}
                onChange={handleChange}
                placeholder="Confirmar senha"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 text-lg"
              />
              {errors.password_confirmation && (
                <p className="mt-1 text-red-600 text-sm">{errors.password_confirmation[0]}</p>
              )}
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-amber-700 hover:bg-amber-800 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            >
              {loading ? 'Cadastrando...' : 'Criar conta'}
            </button>

            <div className="text-center mt-4">
              <p className="text-gray-600">
                Já tem conta?{' '}
                <span className="text-amber-700 hover:text-amber-800 font-semibold cursor-pointer"
                 onClick={handleLoginClick}>
                  Faça login
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Informações adicionais */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">
            💡 Sobre o Programa
          </h3>
          <p className="text-gray-700 leading-relaxed">
            Nosso programa de alfabetização foi desenvolvido especialmente para pessoas da terceira idade, 
            com interface amigável, letras grandes e exercícios adaptados ao ritmo de aprendizado de cada aluno.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CadastroAlfabetizacao;