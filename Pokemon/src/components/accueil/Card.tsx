import { useEffect, useState } from "react";

// Interface définissant les types des props
interface CardAccueilProps {
    name: string;
    id: string;
    onClick: () => void;
}

function CardAccueil({ name, id, onClick }: CardAccueilProps) {
    // Utilisation de 'name' et 'id' avec des types explicites
    const [frenchName, setFrenchName] = useState<string>(name);
    const image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${id}.png`;

    useEffect(() => {
        // Requête API pour obtenir le nom en français du Pokémon
        fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`)
            .then((res) => res.json())
            .then((data) => {
                const frName = data.names.find(
                    (entry: { language: { name: string }; name: string }) => entry.language.name === 'fr'
                )?.name;
                if (frName) setFrenchName(frName);
            })
            .catch((err) => console.error(`❌ Erreur nom FR Pokémon ID ${id}:`, err));
    }, [id]); // Dépendance sur 'id' pour rafraîchir si l'id change

    const handleClick = () => {
        onClick(); // Appel de la fonction onClick
    };

    return (
        <div
        onClick={handleClick}
        className="relative w-1/6 bg-gradient-to-b from-transparent via-white to-gray-200 flex flex-col shadow-lg rounded-xl cursor-pointer hover:shadow-blue-200 transition">
        
        {/* Texte derrière l'image */}
        <p className="w-full text-center absolute text-6xl font-bold text-gray-300 top-14 left-0 z-10 select-none pointer-events-none">
            #{id}
        </p>
    
        {/* Image devant */}
        <div className="z-30">
            <img src={image} className="scale-88" alt={frenchName} />
        </div>
    
        <div className="py-2 mt-4 w-full rounded-b-2xl">
            <p className="font-outfit text-center text-lg w-full capitalize font-semibold">{frenchName}</p>
        </div>
    </div>
    
    );
}

export default CardAccueil;
