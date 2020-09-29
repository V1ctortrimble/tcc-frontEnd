import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

import api from '../../services/api';
import './styles.css';

import travelLogoImg from '../../assets/TravelLogo.png';

export default function RecoverPassword() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');


    async function handleRecoverPassword(e) {
        e.preventDefault();

        const data = {
            username,
            password,
            confirmPassword,
        };

        if (this.password.value === this.confirmPassword.value){
            try {
                const response = await api.post('recoverPassword', data);
    
                alert(`Sua senha foi alterada com sucesso ${response.data.username}`);
    
            } catch (error) {
                alert('Erro na recuperação de senha, tente novamente mais tarde.');
            }
        } else {
            alert('Senhas digitadas não conferem');
        }         

    }
    return (
        <div className="recoverPassword-container">

            <div className="content">
                <section>
                    <img src={travelLogoImg} alt="Logo Travel System" />
                    <h1>Recuperação de Senha</h1>
                    <p>Insira a nova senha para o usuário</p>

                    <Link className="back-link" to="/">
                        <FiArrowLeft size={16} color="#E02041" />
                    Voltar para a página de Login
                </Link>

                </section>
                <form onSubmit={handleRecoverPassword}>
                    <input
                        type = "email"
                        placeholder="Email Cadastrado"
                        value={username}
                        disabled
                        onChange={e => setUsername(e.target.value)}
                    />
                    <input
                        type = "password"
                        value={password}
                        placeholder="Nova Senha"
                        required
                        pattern="[0-9a-zA-Z]{8,32}"
                        title="Digite uma senha com letras e números, mínimo de 8 caracteres."
                        onChange={e => setPassword(e.target.value)}
                    />
                    <input
                        type = "password"
                        value={confirmPassword}
                        placeholder="Confirme a senha"
                        required
                        pattern="[0-9a-zA-Z]{8,32}"
                        title="Digite uma senha com letras e números, mínimo de 8 caracteres."
                        onChange={e => setConfirmPassword(e.target.value)}
                    />
                    <button className="button" type="submit">Alterar Senha</button>
                </form>
            </div>

        </div>
    );
}