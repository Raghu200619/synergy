import React from 'react';
import AuthForm from '../components/Auth/AuthForm';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const RegisterPage: React.FC = () => {
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (data: any) => {
    await register(data.name, data.email, data.password);
    navigate('/');
  };

  return (
    <AuthForm
      mode="register"
      onSubmit={handleRegister}
      onToggleMode={() => navigate('/login')}
      isLoading={isLoading}
    />
  );
};

export default RegisterPage;
