import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

import api from '../../services/api';
import './styles.css';

import travelLogoImg from '../../assets/TravelLogo.png';

export default function RecoverPassword() {

    const divStyleHidden = {
        display: 'none',
    }

    const divStyleShow = {
        display: 'block',
    }

    const [username, setUsername] = useState('');

    const [confirm, setConfirm] = useState(divStyleHidden);

    const [error, setError] = useState(divStyleHidden);

    async function handleRecoverPassword(e) {
        e.preventDefault();

        const data = {
            username,
        };

        try {
            await api.post('/api/sendemail', data);
            setConfirm(divStyleShow);
            setError(divStyleHidden);

        } catch (error) {
            setError(divStyleShow);
            setConfirm(divStyleHidden);
        }
    }
    return (
        <div className="recoverPassword-container">

            <div className="content">
                <section>
                    <img src={travelLogoImg} alt="Logo Travel System" />
                    <h1>Recuperação de Senha</h1>
                    <p>Para recuperar a sua senha, informe o e-mail cadastrado.</p>

                    <Link className="back-link" to="/">
                        <FiArrowLeft size={16} color="#E02041" />
                    Voltar para a página de Login
                </Link>

                </section>
                <form onSubmit={handleRecoverPassword}>
                    <input
                        type = "email"
                        placeholder="Informe seu e-mail"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                    />
                    <button className="button" type="submit">Recuperar Senha</button>
                    <div className="divTextConfirm" style={confirm}><h5>Verifique seu e-mail, se recebeu o código para troca de senha!</h5></div>
                    <div className="divTextError" style={error}><h5>Erro na recuperação de senha, tente novamente mais tarde!</h5></div>
                </form>
            </div>

        </div>
    );
}