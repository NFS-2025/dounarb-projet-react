import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";

const schema = yup.object({
    nom: yup.string().required("Le nom est requis").min(3, "Minimum 3 caractères"),
    prenom: yup.string().required("Le prénom est requis").min(3, "Minimum 3 caractères"),
    age: yup.number().typeError("L'âge est requis").required().min(13, "Minimum 13 ans"),
    email: yup.string().required("L'email est requis").email("Email invalide"),
    password: yup.string().required("Le mot de passe est requis").min(8, "Minimum 8 caractères"),
});

function Inscription() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: yupResolver(schema) });

    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const onSubmit = async (data: any) => {
        try {
            const response = await fetch("https://dounarb-projet-react.onrender.com/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                setMessage("Inscription réussie !");
                setTimeout(() => {
                    navigate("/connexion");
                }, 1000);
            } else {
                setMessage(result.error || "Erreur lors de l'inscription.");
            }
        } catch (error) {
            setMessage("Erreur de connexion au serveur.");
        }
    };


    return (
        <div className="max-w-[800px] mx-auto mt-20 bg-white">
            <div className="p-4 sm:p-7">
                <div className="text-center">
                    <h1 className="block text-2xl font-bold text-gray-800">Inscription</h1>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="mt-5">
                    <div className="grid gap-y-4">
                        {/* Nom */}
                        <div>
                            <label htmlFor="nom" className="block text-sm mb-2">Nom</label>
                            <input
                                id="nom"
                                placeholder="Nom"
                                {...register("nom")}
                                className={`py-2.5 px-4 w-full border ${errors.nom ? "border-red-500" : "border-gray-200"} rounded-lg`}
                            />
                            {errors.nom && <p className="text-xs text-red-600 mt-2">{errors.nom.message}</p>}
                        </div>

                        {/* Prénom */}
                        <div>
                            <label htmlFor="prenom" className="block text-sm mb-2">Prénom</label>
                            <input
                                id="prenom"
                                placeholder="Prénom"
                                {...register("prenom")}
                                className={`py-2.5 px-4 w-full border ${errors.prenom ? "border-red-500" : "border-gray-200"} rounded-lg`}
                            />
                            {errors.prenom && <p className="text-xs text-red-600 mt-2">{errors.prenom.message}</p>}
                        </div>

                        {/* Âge */}
                        <div>
                            <label htmlFor="age" className="block text-sm mb-2">Âge</label>
                            <input
                                type="number"
                                id="age"
                                placeholder="Age"
                                {...register("age")}
                                className={`py-2.5 px-4 w-full border ${errors.age ? "border-red-500" : "border-gray-200"} rounded-lg`}
                            />
                            {errors.age && <p className="text-xs text-red-600 mt-2">{errors.age.message}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm mb-2">Email</label>
                            <input
                                type="email"
                                id="email"
                                placeholder="Email"
                                {...register("email")}
                                className={`py-2.5 px-4 w-full border ${errors.email ? "border-red-500" : "border-gray-200"} rounded-lg`}
                            />
                            {errors.email && <p className="text-xs text-red-600 mt-2">{errors.email.message}</p>}
                        </div>

                        {/* Mot de passe */}
                        <div>
                            <label htmlFor="password" className="block text-sm mb-2">Mot de passe</label>
                            <input
                                type="password"
                                id="password"
                                placeholder="Mot de passe"
                                {...register("password")}
                                className={`py-2.5 px-4 w-full border ${errors.password ? "border-red-500" : "border-gray-200"} rounded-lg`}
                            />
                            {errors.password && <p className="text-xs text-red-600 mt-2">{errors.password.message}</p>}
                        </div>

                        {/* Bouton */}
                        <button
                            type="submit"
                            className="w-full py-3 px-4 mt-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg bg-red-600 text-white hover:bg-red-700"
                        >
                            S'inscrire
                        </button>

                        {/* Message d'état */}
                        {message && <p className="mt-4 text-center text-sm">{message}</p>}
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Inscription;
