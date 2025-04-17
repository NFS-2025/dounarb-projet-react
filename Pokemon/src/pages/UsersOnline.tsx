import { useEffect, useState } from "react";
import axios from "axios";
import { io, Socket } from "socket.io-client";

type User = {
    id: string;
    email: string;
    nom?: string;
    prenom?: string;
};

let socket: Socket | null = null;

function UsersOnline() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        // 1. Requête initiale REST
        axios.get("http://localhost:5000/api/online-users")
            .then((res) => {
                setUsers(res.data);
                setLoading(false);
            })
            .catch(() => {
                setError("Erreur lors du chargement des utilisateurs.");
                setLoading(false);
            });

        // 2. Connexion WebSocket
        socket = io("http://localhost:5000");

        const token = localStorage.getItem("token");
        if (token && socket) {
            socket.emit("auth", token);
        }

        // 3. Réception des utilisateurs en ligne
        socket.on("online-users", (data: User[]) => {
            setUsers(data);
        });

        // 4. Nettoyage à la fin
        return () => {
            if (socket) socket.disconnect();
        };
    }, []);

    if (loading) return <div className="text-center mt-10">Chargement...</div>;
    if (error) return <div className="text-center text-red-500 pt-20">{error}</div>;

    return (
        <div className="max-w-2xl mx-auto mt-20 bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-bold p-4 text-center">Utilisateurs en ligne</h2>
            <ul className="space-y-2">
                {users.map((user) => (
                    <li key={user.id} className="border p-3 rounded-xl bg-gray-100">
                        <p className="font-semibold"> {user.email ?? user.prenom}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default UsersOnline;
