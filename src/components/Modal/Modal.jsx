import React, { useRef } from 'react';

import { CSSTransition } from 'react-transition-group';
import './Modal.css'; // Import your CSS for transitions

export default function Modal({ content, show, onHide }) {
    const nodeRef = useRef(null); // Create a ref

    return (
        <CSSTransition
            in={show}
            timeout={300}             // Duration of the animation in ms
            classNames="modal"        // Base name for the transition classes
            unmountOnExit             // Remove the modal from the DOM when not shown
            nodeRef={nodeRef}         // Pass the ref to CSSTransition
        >
            <div
                ref={nodeRef}           // Attach the ref to the element
                className="fixed top-0 left-0 w-full h-full bg-black/70 flex justify-center items-center"
            >

                {content.body}



            </div>
        </CSSTransition>
    );
}
