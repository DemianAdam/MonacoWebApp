import React from 'react'
const removePersonForm = (onHide, handleRemove, person, setIsRowLoading) =>
    <form onSubmit={(e) => { handleRemove(e, person, setIsRowLoading) }}>
        <h2>Seguro?</h2>
        <div>
            <input type="submit" value="Aceptar" />
            <button onClick={(e) => { e.preventDefault(); onHide() }}>Cancelar</button>
        </div>
    </form>

export const showRemoveModal = (person, setModalContent, setShowModal, handleRemove, setIsRowLoading) => {
    console.log(person)
    setModalContent({
        body: removePersonForm(() => { setShowModal(false) }, handleRemove, person, setIsRowLoading),
        title: 'Eliminar Persona'
    })
    setShowModal(true)
}