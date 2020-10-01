import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

import api from '../../services/api';
import './styles.css';

import travelLogoImg from '../../assets/TravelLogo.png';

export default function RecoverPassword() {

    const [username, setUsername] = useState('');

    async function handleRecoverPassword(e) {
        e.preventDefault();

        const data = {
            username,
        };

        try {
            api.post('/api/sendemail', data);

        } catch (error) {
            alert('Erro na recuperação de senha, tente novamente mais tarde.');
        }

        alert(`Foi enviado um e-mail para a realizar o reset da senha, siga as instruçõesno e-mail ${username}` );

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
                </form>
            </div>

        </div>
    );
}