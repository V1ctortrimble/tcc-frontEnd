import React, { useEffect, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

import api from '../../services/api';
import './styles.css';

import travelLogoImg from '../../assets/TravelLogo.png';

export default function RecoverPassword() {
    let { code } = useParams();

    const divStyleHidden = {
        display: 'none',
    }

    const divStyleShow = {
        display: 'block',
    }

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [repeat_password, setRepeatPassword] = useState('');

    const [confirm, setConfirm] = useState(divStyleHidden);
    const [error, setError] = useState(divStyleHidden);
    const [errorPassword, setErrorPassword] = useState(divStyleHidden);
    const [errorCod, setErrorCod] = useState(divStyleHidden);

    const history = useHistory();
    
    useEffect(() => {
        loadPage();
    }, []) // eslint-disable-line react-hooks/exhaustive-deps
    ;

    async function loadPage() {

        if (code != null) {
            try {
                const response = await api.get(`api/recoverypassword/${code}`)

                setUsername(response.data.username);

                console.log(username);

            } catch (error) {
                setConfirm(divStyleHidden);
                setError(divStyleShow);
            }
        } else {
            setErrorCod(divStyleShow);
            setConfirm(divStyleHidden);
            setError(divStyleHidden);
        }
    }

    async function handleRecoverPassword(e) {
        e.preventDefault();

        const data = {
            username,
            password,
            repeat_password,
            code,
        };

        if (password === repeat_password) {
            try {
                await api.put('/api/changepassword', data);

                setConfirm(divStyleShow);
                setError(divStyleHidden);

                setTimeout(() => history.push("/"), 2000);

            } catch (error) {
                setConfirm(divStyleHidden);
                setError(divStyleShow);
            }
        } else {
            setErrorPassword(divStyleShow);
            setConfirm(divStyleHidden);
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
                <div className="divTextConfirm" style={confirm}><h5>Sua senha foi alterada com sucesso!</h5></div>
                <div className="divTextError" style={errorPassword}><h5>Senhas digitadas não conferem</h5></div>
                <div className="divTextError" style={errorCod}><h5>Você não possui um código válido, faavor realizar o processo de recupera senha novamente</h5></div>
                <div className="divTextError" style={error}><h5>Erro na troca de senha, tente novamente mais tarde!</h5></div>
                    <input
                        type="email"
                        placeholder="Email Cadastrado"
                        value={username}
                        disabled
                        onChange={e => setUsername(e.target.value)}
                    />
                    <input
                        type="password"
                        value={password}
                        placeholder="Nova Senha"
                        required
                        pattern="^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\S+$).{8,}$"
                        title="Digite uma senha com letras (Maiuscula e Minuscula), números e caracteres especiais (#@$!), mínimo de 8 caracteres."
                        onChange={e => setPassword(e.target.value)}
                    />
                    <input
                        type="password"
                        value={repeat_password}
                        placeholder="Confirme a senha"
                        required
                        pattern="^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\S+$).{8,}$"
                        title="Digite uma senha com letras (Maiuscula e Minuscula), números e caracteres especiais (#@$!), mínimo de 8 caracteres."
                        onChange={e => setRepeatPassword(e.target.value)}
                    />
                    <button className="button" type="submit">Alterar Senha</button>
                </form>
            </div>
        </div>
    );
}