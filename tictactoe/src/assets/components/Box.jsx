import { useState } from "react";

function Box({ id, statut, onClick }) {
    return (
        <div
            className="w-24 cursor-pointer h-24 border-2 rounded-2xl text-4xl text-white flex justify-center items-center" onClick={onClick} >
            {statut == 'cross' ? <i className="fa-solid fa-xmark"></i> : statut == 'circle' ? <i className="fa-regular fa-circle"></i> : ''}
        </div>
    );
}

export default Box;
