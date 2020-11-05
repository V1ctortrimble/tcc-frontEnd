import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiKey } from 'react-icons/fi';
import api from '../../services/api';
import './styles.css';
import {Button, notification} from 'antd';

import travelLogoImg from '../../assets/TravelLogo.png';
import travelImg from '../../assets/TravelsWorld.gif';


export default function Login() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const history = useHistory();
    
    async function handleLogin(e) {
    
        const data = {
            username,
            password,
        };
        e.preventDefault();
        setLoading(true);
        try {
           
            const response = await api.post('login', data);
            
            localStorage.setItem('token', response.data.authorization);

            history.push('/admin');   
            
        } catch (error) {
            if (error.response){
                if (error.response.data.status === 401){
                    notification.error({
                        message: "Erro de autenticação",
                        description: "Usuário ou senha inválidos"
                    });
                }
            } else {
                notification.error({
                    message: "Serviço indisponível",
                    description: "Tente novamente mais tarde"
                });
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="login-container">
            <section className="form">
                <img src={travelLogoImg} alt="Logo Travel" />

                <form onSubmit={handleLogin}>
                    <h1>Faça seu login</h1>
                    <input placeholder="E-mail"
                        type="email"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                    />

                    <input type="password" placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <Button className="button" type="primary" size="large" htmlType="submit" loading={loading}>Entrar</Button>
                    <Link className="back-link" to="/forgetPassword">
                        <FiKey size={16} color="#E02041" />
                    Recuperar a senha
                </Link>
                </form>
            </section>
            <img src={travelImg} alt="Imagem Viagens" />
        </div>
    )
}
