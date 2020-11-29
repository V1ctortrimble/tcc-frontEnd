import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiKey } from 'react-icons/fi';
import api from '../../services/api';
import './styles.css';
import {Button, notification} from 'antd';

import travelLogoImg from '../../assets/TravelLogo.png';



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
                if (error.response.data.status === 403){
                    notification.error({
                        message: "Sessão inválida",
                        description: "Faça o login novamente"
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
        <div className="container-fundo" >
        <div className="login-container" >
            <section className="form">
                <div style={{marginLeft: '10%'}}>
                <img src={travelLogoImg} alt="Logo Travel" />
                </div>

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
                    <div style={{marginLeft: '25%'}}>
                    <Link className="back-link" to="/forgetPassword">
                        <FiKey size={16} color="#E02041" />
                    Recuperar a senha
                </Link>
                </div>
                </form>
            </section>
            
        </div>
        </div>
    )
}
