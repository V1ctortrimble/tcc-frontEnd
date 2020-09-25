import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

import api from '../../services/api';
import './styles.css';

import travelLogoImg from '../../assets/TravelLogo.png';

export default function RecoverPassword() {

    const [email, setEmail] = useState('');

    async function handleRecoverPassword(e) {
        e.preventDefault();

        const data = {
            email,
        };

        try {
            const response = await api.post('recoverPassword', data);

            alert(`Foi enviado um e-mail para a realizar o reset da senha, siga as instruções! ${response.data.id}`);

        } catch (error) {
            alert('Erro na recuperação de senha, tente novamente mais tarde.');
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
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <button className="button" type="submit">Recuperar Senha</button>
                </form>
            </div>

        </div>
    );
}