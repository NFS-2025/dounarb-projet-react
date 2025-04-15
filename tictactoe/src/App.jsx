import { useState } from "react";
import "./App.css";
import Box from "./assets/components/Box";

function App() {
    const initialCaseList = [
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

    const [caseList, setCaseList] = useState(initialCaseList);
    const [currentPlayer, setCurrentPlayer] = useState('cross');
    const [winner, setWinner] = useState(null);
    const [isDraw, setIsDraw] = useState(false);

    const solutions = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
        [1, 4, 7],
        [2, 5, 8],
        [3, 6, 9],
        [1, 5, 9],
        [3, 5, 7],
    ];

    const checkVictory = (list, player) => {
        return solutions.some((combinaison) =>
            combinaison.every((id) =>
                list.find((c) => c.id === id)?.statut === player
            )
        );
    };

    const checkDraw = (list) => {
        return list.every((c) => c.statut !== '');
    };

    const changeStatut = (id) => {
        if (caseList.find(c => c.id === id)?.statut !== '' || winner) return;

        const updatedList = caseList.map((c) =>
            c.id === id ? { ...c, statut: currentPlayer } : c
        );
        setCaseList(updatedList);

        if (checkVictory(updatedList, currentPlayer)) {
            setWinner(currentPlayer);
        } else if (checkDraw(updatedList)) {
            setIsDraw(true);
        } else {
            setCurrentPlayer((prev) => (prev === 'cross' ? 'circle' : 'cross'));
        }
    };

    const resetGame = () => {
        setCaseList(initialCaseList);
        setCurrentPlayer('cross');
        setWinner(null);
        setIsDraw(false);
    };

    return (
        <div className="text-center mt-10">
            <h1 className="text-xl font-extrabold mb-2">Tic-Tac-Toe</h1>

            <div className="mb-4 text-lg">
                {winner ? (
                    <span className="text-green-600">Le joueur <strong>{winner}</strong> a gagné !</span>
                ) : isDraw ? (
                    <span className="text-yellow-600">Match nul !</span>
                ) : (
                    <span>Tour de : <strong>{currentPlayer}</strong></span>
                )}
            </div>

            <div className="my-10 w-72 mx-auto">
                <div className="flex flex-row flex-wrap">
                    {caseList.map((caseGrille) => (
                        <Box
                            key={caseGrille.id}
                            id={caseGrille.id}
                            statut={caseGrille.statut}
                            onClick={() => changeStatut(caseGrille.id)}
                        />
                    ))}
                </div>
            </div>

            {(winner || isDraw) && (
                <button
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    onClick={resetGame}
                >
                    🔁 Rejouer
                </button>
            )}
        </div>
    );
}

export default App;
