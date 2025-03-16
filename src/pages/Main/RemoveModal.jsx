import React from 'react'
const removePersonForm = (onHide, handleRemove, person) =>
    <form onSubmit={(e) => { handleRemove(e, person) }}>
        <h2>Seguro?</h2>
        <div>
            <input type="submit" value="Aceptar" />
            <button onClick={(e) => { e.preventDefault(); onHide() }}>Cancelar</button>
        </div>
    </form>

export const showRemoveModal = (person, setModalContent, setShowModal, handleRemove) => {
    console.log(person)
    setModalContent({
        body: removePersonForm(() => { setShowModal(false) }, handleRemove, person),
        title: 'Eliminar Persona'
    })
    setShowModal(true)
}