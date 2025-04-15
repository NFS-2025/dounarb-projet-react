import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Accueil from "./pages/Accueil";
import APropos from "./pages/APropos";
import PageErreur from "./pages/PageErreur";
import Connexion from "./pages/Connexion";

const Router: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Accueil />} />
                <Route path="/a-propos" element={<APropos />} />
                <Route path="/*" element={<PageErreur />} />
                <Route path="/connexion" element={<Connexion />} />
            </Routes>
        </BrowserRouter>
    )
}

export default Router;


