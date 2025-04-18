import { useEffect, useState } from "react";
import CardAccueil from '../components/accueil/Card';

function Accueil() {



    const [data, setData] = useState<{ url: string; name: string }[]>([]);
    const [selectedPokemon, setSelectedPokemon] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Animation de début (1.5 secondes)
        const timer = setTimeout(() => setIsLoading(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        fetch('https://pokeapi.co/api/v2/pokemon?limit=1000&offset=0')
            .then(response => response.json())
            .then(json => setData(json.results))
    }, []);

    const handleCardClick = async (id: string) => {
        try {
            const [pokemonRes, speciesRes] = await Promise.all([
                fetch(`https://pokeapi.co/api/v2/pokemon/${id}`),
                fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`)
            ]);

            const pokemonData = await pokemonRes.json();
            const speciesData = await speciesRes.json();

            const frName = speciesData.names.find((n: any) => n.language.name === "fr")?.name || pokemonData.name;
            const frDesc = speciesData.flavor_text_entries.find((entry: any) => entry.language.name === 'fr')?.flavor_text;

            setSelectedPokemon({
                id,
                name: frName,
                description: frDesc?.replace(/\f/g, ' '),
                image: pokemonData.sprites.other.home.front_default,
                types: pokemonData.types.map((t: any) => t.type.name),
                height: pokemonData.height,
                weight: pokemonData.weight,
                stats: pokemonData.stats,
                habitat: speciesData.habitat?.name || 'Inconnu',
                shape: speciesData.shape?.name || 'Inconnue',
                generation: speciesData.generation?.name || 'Inconnue'
            });

        } catch (error) {
            console.error(" Erreur lors du chargement des données Pokémon :", error);
        }
    };

    return (
        <>
            {/* Animation de démarrage */}
            {isLoading && (
                <div className="fixed inset-0 z-50 flex flex-col">
                    <div className="bg-red-500 h-1/2 w-screen animate-slide-up relative z-30" >
                        <img src="./public/Poké_Ball_icon.png" width={300} className="absolute -bottom-36 right-145 z-40" alt="" />
                    </div>
                    <div className="bg-red-500 h-1/2 w-screen animate-slide-down z-20" />
                </div>
            )}

            <div className="flex flex-row ">
                <div className="w-screen">


                    <div className="max-w-[1100px] w-full mx-auto mt-20">

                        {data ? (
                            <div className="flex flex-wrap gap-y-4 gap-x-2 justify-evenly px-4">
                                {data.map((pokemon: { url: string; name: string }, index: number) => {
                                    const id = pokemon.url.split("/")[6];
                                    return (
                                        <CardAccueil
                                            key={index}
                                            name={pokemon.name}
                                            id={id}
                                            onClick={() => handleCardClick(id)}
                                        />
                                    );
                                })}
                            </div>
                        ) : (
                            'Chargement...'
                        )}
                    </div>
                </div>
                <div className="h-screen min-w-[450px] w-[450px]">
                </div>

                {/* Panneau latéral droit */}
                <div className="h-screen min-w-[450px] w-[450px] shadow-2xl fixed right-0 pt-20 z-10 bg-white overflow-y-auto">
                    {selectedPokemon ? (
                        <>
                            <h2 className="text-2xl font-bold text-black text-center mt-4 capitalize">
                                {selectedPokemon.name}
                            </h2>
                            <p className="text-center text-gray-600 italic mx-4 mt-2">{selectedPokemon.description}</p>
                            <div className="flex justify-center mt-4 relative">
                                <img src="./public/Pokeball.png" className="z-10 invert-10 w-60 absolute bottom-0" alt="" />
                                <img src={selectedPokemon.image} width={230} className="z-20" alt={selectedPokemon.name} />
                            </div>

                            <div className="flex flex-row justify-center gap-x-2 mt-4">
                                {selectedPokemon.types.map((type: string, idx: number) => (
                                    <div key={idx} className="badge badge-neutral bg-gray-300 text-black border-0 capitalize">{type}</div>
                                ))}
                            </div>

                            <div className="px-6 flex justify-center items-center flex-col w-full gap-y-4 mt-4">
                                <div className="flex flex-row justify-evenly w-full items-center">
                                    <div className="flex flex-col gap-2 justify-center items-center"><span>🎯 Taille:</span> <span>{selectedPokemon.height / 10} m</span></div>
                                    <div className="h-10 border-l-2 border-gray-300"></div>
                                    <div className="flex flex-col gap-2 justify-center items-center"><span>⚖️ Poids:</span> <span>{selectedPokemon.weight / 10} kg</span></div>
                                    <div className="h-10 border-l-2 border-gray-300"></div>
                                    <div className="flex flex-col gap-2 justify-center items-center"><span>🌍 Habitat:</span> <span>{selectedPokemon.habitat}</span></div>
                                </div>
                                <div className="flex flex-row justify-evenly w-full items-center">
                                    <div className="flex flex-col gap-2 justify-center items-center"><span>🔵 Forme:</span> <span>{selectedPokemon.shape}</span></div>
                                    <div className="h-10 border-l-2 border-gray-300"></div>
                                    <div className="flex flex-col gap-2 justify-center items-center"><span>📘 Génération:</span> <span>{selectedPokemon.generation.toUpperCase()}</span></div>
                                </div>
                            </div>

                            <div className="px-6 flex justify-center items-center flex-col w-full gap-y-4 mt-8">
                                <div className="flex flex-row justify-evenly w-full items-center flex-wrap gap-y-4">
                                    {selectedPokemon.stats.map((stat: any, idx: number) => (
                                        <div
                                            key={idx}
                                            className={`flex w-1/3 flex-col justify-center items-center ${idx !== 2 && idx !== 5 ? 'border-r-2 border-gray-300' : ''}`}
                                        >
                                            <span>{stat.stat.name.toUpperCase()}</span>
                                            <span>{stat.base_stat}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="text-center flex w-full h-[80vh] justify-center items-center text-lg text-gray-400 flex flex-col">
                            <img src="./public/Silhouette.png" className="z-10 invert-10 w-50" alt="" />
                            <p>Clique sur un Pokémon !</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default Accueil;
