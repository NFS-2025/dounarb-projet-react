import { useState } from "react";
import "./App.css";
import Box from "./assets/components/Box";

function App() {

    let caseList = [
        { id: 1, statut: '' },
        { id: 2, statut: '' },
        { id: 3, statut: '' },
        { id: 4, statut: '' },
        { id: 5, statut: '' },
        { id: 6, statut: '' },
        { id: 7, statut: '' },
        { id: 8, statut: '' },
        { id: 9, statut: '' },
    ];

    const [statut, setIcon] = useState('');

    const changeStatut = () => {
        setIcon('cross')
    }

}


return (
    <div>
        <h1 className="text-xl font-extrabold">Tic-Tac-Toe</h1>
        <span>Ici un tic-tac-toe</span>

        <div className="my-10 w-72">
            <div className="flex flex-row flex-wrap">

                {caseList.map((caseGrille) => (
                    <Box id={caseGrille.id} statut={caseGrille.statut} onClick={() => changeStatut} />
                ))
                }

            </div>


        </div>
    </div>
);
}

export default App;
