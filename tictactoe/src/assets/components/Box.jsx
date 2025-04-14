import { useState } from "react";

const Box = ({param}) => {
    return (
        <>
            <div className="w-24 h-24 border-2 rounded-2xl text-4xl text-white flex justify-center items-center">
            {param == 'cross' ? <i className="fa-solid fa-xmark"></i> : <i className="fa-regular fa-circle"></i>}
                {/* <i className="fa-solid fa-xmark"></i><i className="fa-regular fa-circle"></i> */}
            </div>
        </>
    );
};

export default Box;
