function CardAccueil({ name, id }) {
    const image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${id}.png`;


    function changePokemonTarget() {

    }

    return (

        <div className="w-1/6 flex flex-col shadow-lg rounded-2xl " onClick={changePokemonTarget}>
            <div>
                <img src={image} alt={name} />
            </div>
            <div className="bg-gray-100 py-6 mt-4 w-full rounded-2xl">
                <p className="text-center w-full capitalize">{name}</p>
            </div>
        </div>
    );
}

export default CardAccueil;
