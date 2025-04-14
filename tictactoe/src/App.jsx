import { useState } from "react";
import "./App.css";
import Box from "./assets/components/Box";

function App() {
    const [count, setCount] = useState(0);

    return (
        <>
            <div>
                <h1 className="text-xl font-extrabold">Tic-Tac-Toe</h1>
                <span>Ici un tic-tac-toe</span>

                <div className="my-10">
                    <div className="flex flex-row">
                    <Box param='cross'/><Box param='circle'/><Box param='cross'/>
                    </div>

                    <div className="flex flex-row">
                    <Box param='cross'/><Box param='cross'/><Box param='cross'/>
                    </div>

                    <div className="flex flex-row">
                    <Box param='cross'/><Box param='cross'/><Box param='cross'/>
                    </div>
                </div>
            </div>
        </>
    );
}

export default App;
