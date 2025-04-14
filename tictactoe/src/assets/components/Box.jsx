import { useState } from "react";

const Box = ({ id, statut }) => {
    return (
        <>
            <div id={id} className="w-24 cursor-pointer h-24 border-2 rounded-2xl text-4xl text-white flex justify-center items-center">
                {statut == 'cross' ? <i className="fa-solid fa-xmark"></i> : statut == 'circle' ? <i className="fa-regular fa-circle"></i> : ''}
                {/* <i className="fa-solid fa-xmark"></i><i className="fa-regular fa-circle"></i> */}
            </div>
        </>
    );
};

export default Box;
