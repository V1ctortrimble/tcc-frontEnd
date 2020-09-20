import React from 'react';
import {FiKey} from 'react-icons/fi'

import './styles.css';

import travelLogoImg from '../../assets/TravelLogo.png';
import travelImg from '../../assets/TravelsWorld.png';

export default function Login(){
    return (
        <div className="login-container">
            
        <section className="form">
            <img src ={travelLogoImg} alt="Logo Travel"/>

            <form>
                <h1>Faça seu login</h1>
                <input placeholder="E-mail"/>
                <input placeholder="Senha"/>
                <button className="button" type="submit">Entrar</button>
                <a href="/forgetPass">
                    <FiKey size={16} color="#E02041"/>
                    Recuperar a senha
                </a>
            </form>

        </section>
        <img src ={travelImg} alt="Imagem Viagens"/>
        </div>
    )
}