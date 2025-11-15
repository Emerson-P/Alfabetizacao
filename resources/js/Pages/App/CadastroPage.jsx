import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CadastroPage() {
    const navigate = useNavigate();

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmar, setConfirmar] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (senha !== confirmar) {
            alert("As senhas não coincidem!");
            return;
        }

        const res = await fetch("http://localhost:8000/api/cadastro", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome, email, senha }),
        });

        const data = await res.json();

        if (data.success) {
            alert("Cadastro realizado com sucesso!");
            navigate("/login");
        } else {
            alert("Erro ao cadastrar.");
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>Cadastro</h1>

                <form onSubmit={handleSubmit}>
                    <input
                        style={styles.input}
                        type="text"
                        placeholder="Seu nome"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        required
                    />

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

                    <input
                        style={styles.input}
                        type="password"
                        placeholder="Confirmar senha"
                        value={confirmar}
                        onChange={(e) => setConfirmar(e.target.value)}
                        required
                    />

                    <button style={styles.button} type="submit">
                        Criar conta
                    </button>
                </form>

                <div style={styles.linkArea}>
                    <a style={styles.link} href="/login">
                        Já tem conta? Faça login
                    </a>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "#f1f1f1",
        fontFamily: "Arial",
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


export default CadastroPage;