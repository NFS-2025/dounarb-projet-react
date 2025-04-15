import React, { useEffect, useState } from "react";
import CardAccueil from '../components/accueil/card';


function Accueil() {


    const [data, setData] = useState(null);

    useEffect(() => {
        fetch('https://pokeapi.co/api/v2/pokemon?limit=151&offset=0')
            .then(response => response.json())
            .then(json => setData(json.results))
            .catch(error => console.error(error));
    }, []);



    return (
        <div className="flex flex-row">
            <div className="w-screen">
                <div className="w-full flex justify-center items-center py-4">
                    <label className="input  w-1/3">
                        <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></g></svg>
                        <input type="search" required placeholder="Search" />
                    </label>
                </div>
                <div className="max-w-[1100px] w-full mx-auto mt-2">



                    {data ? (
                        <div className="flex flex-wrap gap-4 justify-evenly">
                            {data.map((pokemon: { url: string; name: unknown; }, index: React.Key | null | undefined) => {
                                const id = pokemon.url.split("/")[6];
                                return (
                                    <CardAccueil key={index} name={pokemon.name} id={id} />
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

            <div className="h-screen min-w-[450px] w-[450px] shadow-2xl fixed  right-0 pt-20 z-10">

                <h2 className="text-2xl font-bold text-black text-center mt-16">Mew</h2>

                <div className="flex flex-row justify-center">
                    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/151.png" width={350} alt="" />
                </div>
                <div className="flex flex-row justify-center gap-x-2">
                    <div className="badge badge-neutral">Neutral</div><div className="badge badge-neutral">Neutral</div>
                </div>
            </div>
        </div>
    );
}


export default Accueil