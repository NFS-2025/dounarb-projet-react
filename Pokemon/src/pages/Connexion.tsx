import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Connexion() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  // Fonction de validation immédiate sur les champs
  const validateEmail = (email: string) => {
    if (!email.trim()) {
      setEmailError("L'email est requis.");
    } else {
      setEmailError("");
    }
  };

  const validatePassword = (password: string) => {
    if (!password.trim()) {
      setPasswordError("Le mot de passe est requis.");
    } else {
      setPasswordError("");
    }
  };

  const handleClick = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation avant envoi
    validateEmail(email);
    validatePassword(password);

    // Si des erreurs, on arrête l'envoi
    if (emailError || passwordError) return;

    axios
      .post("http://localhost:5000/api/login", { email, password })
      .then((response) => {
        const { token } = response.data;
        localStorage.setItem("token", token);
        setTimeout(() => {
          navigate("/");
        }, 1000);
      })
      .catch((error) => {
        const errorMessage =
          error.response?.data?.error || "Erreur lors de la connexion.";
        alert(errorMessage);
      });
  };

  return (
    <div className="max-w-[800px] mx-auto mt-20 bg-white">
      <div className="p-4 sm:p-7">
        <div className="text-center">
          <h1 className="block text-4xl font-bold text-gray-800">Connexion</h1>
        </div>

        <div className="mt-5">
          <form onSubmit={handleClick}>
            <div className="grid gap-y-4">
              <div>
                <label htmlFor="email" className="block text-sm mb-2">
                  Email
                </label>
                <input
                  type="text"
                  id="email"
                  name="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    validateEmail(e.target.value); // Validation en temps réel
                  }}
                  className={`py-2.5 px-4 block w-full border rounded-lg sm:text-sm ${
                    emailError ? "border-red-500" : "border-gray-200"
                  }`}
                />
                {emailError && (
                  <p className="text-sm font-bold text-red-600 mt-1">{emailError}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm mb-2">
                  Mot de passe
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    validatePassword(e.target.value); // Validation en temps réel
                  }}
                  className={`py-2.5 px-4 block w-full border rounded-lg sm:text-sm ${
                    passwordError ? "border-red-500" : "border-gray-200"
                  }`}
                />
                {passwordError && (
                  <p className="text-sm font-bold text-red-600 mt-1">{passwordError}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 inline-flex justify-center items-center text-sm font-medium rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Se connecter
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Connexion;
