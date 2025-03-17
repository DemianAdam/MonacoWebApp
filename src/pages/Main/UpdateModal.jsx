import React from 'react'
const updatePersonForm = (onHide, handleUpdate, person, setIsRowLoading) =>
    <form className='bg-black' onSubmit={(e) => { handleUpdate(e, person,setIsRowLoading) }}>
        <h2>Editar</h2>
        <div className='text-left'>
            <input
                id='fullName'
                type="text"
                placeholder="Nombre Completo"
                className="p-2 border-2 bg-transparent autofill:bg-transparent border-white rounded-3xl w-full text-white"
                autoComplete='fullName'
                required
                minLength={3}
            />
        </div>
        <div>
            <input type="submit" value="Aceptar" />
            <button onClick={(e) => { e.preventDefault(); onHide() }}>Cancelar</button>
        </div>
    </form>

export const showUpdateModal = (person, setModalContent, setShowModal, handleUpdate, setIsRowLoading) => {
    setModalContent({
        body: updatePersonForm(() => { setShowModal(false) }, handleUpdate, person, setIsRowLoading),
        title: 'Editar Persona'
    })
    setShowModal(true)
}