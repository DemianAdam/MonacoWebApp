import React, { useRef } from "react";
import { Link } from "react-router";
import useIsVisible from "../../hooks/useIsVisible.js";
import useSticky from "../../hooks/useSticky.js";

export default function Admin({ user }) {
    const logo = useRef(null);

    return (
        <div >
            <Header logo={logo} />
            <p>a</p>
            <p>a</p>
            <p>a</p>
            <p>a</p>
            <p>a</p>
            <p>a</p>
            <p>a</p>
            <p>a</p>
            <p>a</p>
            <p>a</p>
            <p>a</p>
            <p>a</p>
            <p>a</p>
            <p>a</p>
            <p>a</p>
            <p>a</p>
            <p>a</p>
            <p>a</p>
            <p>a</p>
            <p>a</p>
            <p>a</p>
            <p>a</p>
            <p>a</p>
            <p>a</p>
            <p>a</p>
            <p>a</p>
            <p>a</p>
            <p>a</p>
            <p>a</p>
            <p>a</p>
            <p>a</p>
            <p>a</p>
            <p>a</p>
            <p>a</p>
            <p>a</p>
            <p>a</p>
            <p>a</p>
            <p>a</p>
            <p>a</p>
            <p>a</p>
            <p>a</p>
            <p>a</p>
            <p>a</p>
            <p>a</p>
            <p>a</p>
            <p>a</p>
            <p>a</p>
            <p>a</p>
            <p>a</p>
            <p>a</p>
        </div>
    )
}



function Header({ logo }) {

    const isSticky = useSticky(50); // Navbar changes after 50px scroll

    return (
        <div className="sticky -top-1">
            <div className={`w-full flex items-center z-50 transition-all duration-500 ease-in-out px-6 ${isSticky ? "bg-black/90 backdrop-blur-md shadow-lg py-4" : "bg-transparent py-6"}`}>
                <nav className="w-full flex justify-center items-center relative py-2">
                    <ul className={`flex justify-around w-screen items-center transition-all duration-500 ease-in-out`}>
                        <li><Link to="/" className="text-white hover:text-gray-300">Lista</Link></li>
                        <li><Link to="/login" className="text-white hover:text-gray-300">Usuarios</Link></li>
                    </ul>
                </nav>
            </div>
        </div>
    );
}

