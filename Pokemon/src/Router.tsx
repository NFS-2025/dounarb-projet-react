import React from "react";
import { Routes, Route } from "react-router-dom";
import Accueil from "./pages/Accueil";
import APropos from "./pages/APropos";
import PageErreur from "./pages/PageErreur";
import Connexion from "./pages/Connexion";
import Inscription from "./pages/Inscription";
import UsersOnline from "./pages/UsersOnline";

const Router: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<Accueil />} />
            <Route path="/a-propos" element={<APropos />} />
            <Route path="/*" element={<PageErreur />} />
            <Route path="/connexion" element={<Connexion />} />
            <Route path="/inscription" element={<Inscription />} />
            <Route path="/user_en_ligne" element={<UsersOnline />} />
        </Routes>
    )
}

export default Router;


