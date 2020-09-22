import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiKey } from 'react-icons/fi';
import api from '../../services/api';

import './styles.css';

import travelLogoImg from '../../assets/TravelLogo.png';
import travelImg from '../../assets/TravelsWorld.png';

export default function Login() {


    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');



    async function handleLogin(e) {
        e.preventDefault();

        const data = {
            username,
            password,
        };

        try {
            const response = await api.post('login', data);

            alert(`Foi enviado um e-mail para a realizar o reset da senha, siga as instruções! ${response.data.id}`);

        } catch (error) {
            alert('Erro na recuperação de senha, tente novamente mais tarde.');
        }

    }



    return (
        <div className="login-container">

            <section className="form">
                <img src={travelLogoImg} alt="Logo Travel" />

                <form onSubmit={handleLogin}>
                    <h1>Faça seu login</h1>
                    <input placeholder="Username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                    />

                    <input placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <button className="button" type="submit">Entrar</button>
                    <Link className="back-link" to="/recoverPassword">
                        <FiKey size={16} color="#E02041" />
                    Recuperar a senha
                </Link>
                </form>

            </section>
            <img src={travelImg} alt="Imagem Viagens" />
        </div>
    )
}
