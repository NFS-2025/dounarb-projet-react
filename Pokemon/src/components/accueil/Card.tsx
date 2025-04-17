import { useEffect, useState } from "react";

function CardAccueil({ name, id, onClick }) {
    const [frenchName, setFrenchName] = useState(name);
    const image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${id}.png`;

    useEffect(() => {
        fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`)
            .then((res) => res.json())
            .then((data) => {
                const frName = data.names.find((entry) => entry.language.name === 'fr')?.name;
                if (frName) setFrenchName(frName);
            })
            .catch((err) => console.error(`❌ Erreur nom FR Pokémon ID ${id}:`, err));
    }, [id]);

    const handleClick = () => {
        onClick?.();
    };

    return (
        <div
            onClick={handleClick}
            className="relative w-1/6 bg-gradient-to-b from-transparent via-white to-gray-200 flex flex-col shadow-lg rounded-xl cursor-pointer hover:shadow-blue-200 transition">
            <div className="">

                <img src={image} className="scale-88" alt={frenchName} />
                

            </div>
            <span className="absolute top-2 right-2 font-semibold">#{id}</span>
            <div className=" py-2 mt-4 w-full rounded-b-2xl">
                <p className="font-outfit text-center text-lg w-full capitalize font-semibold">{frenchName}</p>
            </div>
        </div>
    );
}

export default CardAccueil;
