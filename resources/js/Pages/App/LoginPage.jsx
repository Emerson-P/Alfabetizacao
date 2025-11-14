import React from 'react';
import styled from 'styled-components';
import { useState,useEffect } from 'react';
import { useNavigate } from "react-router-dom";

const styles = {
    container: {
        display: "flex",
        height: "100vh",
        fontFamily: "Arial",
    },

    sidebar: {
        width: "260px",
        background: "#1b1b1b",
        color: "white",
        paddingTop: "30px",
        textAlign: "center",
    },

    menuTitle: {
        fontSize: "28px",
        marginBottom: "40px",
    },

    content: {
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f1f1f1",
    },

    card: {
        background: "white",
        padding: "40px",
        width: "420px",
        borderRadius: "15px",
        boxShadow: "0 0 20px rgba(0,0,0,0.1)",
    },

    title: {
        textAlign: "center",
        color: "#8b4a0e",
        marginBottom: "30px",
    },

    input: {
        width: "100%",
        padding: "14px",
        fontSize: "16px",
        marginBottom: "18px",
        borderRadius: "8px",
        border: "1px solid #ccc",
    },

    button: {
        width: "100%",
        padding: "14px",
        background: "#8b4a0e",
        border: "none",
        color: "white",
        fontSize: "18px",
        borderRadius: "8px",
        cursor: "pointer",
    },

    linkArea: {
        textAlign: "center",
        marginTop: "16px",
    },

    link: {
        textDecoration: "none",
        color: "#8b4a0e",
        fontSize: "15px",
    },
};
function LoginPage() {
  const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        const res = await fetch("http://localhost:8000/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, senha }),
        });

        const data = await res.json();

        if (data.token) {
            localStorage.setItem("token", data.token);
            navigate("/home");
        } else {
            alert("Credenciais inválidas");
        }
  };
  
  return (
    <div style={styles.container}>

            {/* CONTENT AREA */}
            <div style={styles.content}>
                <div style={styles.card}>
                    <h1 style={styles.title}>Entrar</h1>

                    <form onSubmit={handleLogin}>
                        <input
                            style={styles.input}
                            type="email"
                            placeholder="Seu e-mail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <input
                            style={styles.input}
                            type="password"
                            placeholder="Sua senha"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            required
                        />

                        <button style={styles.button} type="submit">
                            Login
                        </button>
                    </form>

                    <div style={styles.linkArea}>
                        <a style={styles.link} href="/cadastro">
                            Não tem conta? Cadastre-se
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
  
}






export default LoginPage;