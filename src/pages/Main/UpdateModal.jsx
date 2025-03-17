import React from 'react'
const updatePersonForm = (onHide, handleUpdate, person, setIsRowLoading) =>
    <div className='bg-black rounded m-5'>
        <div className='bg-white/5 p-5 flex flex-col text-xl'>
            <h2 className='font-abril-fatface text-4xl text-center mb-3'>Editar</h2>
            <form onSubmit={(e) => { handleUpdate(e, person, setIsRowLoading) }}>
                <div className='text-left'>
                    <input
                        type="text"
                        className="p-2 mb-3 border-2 bg-transparent autofill:bg-transparent border-white rounded-3xl w-full text-white"
                        value={person.name}
                        disabled
                    />
                </div>
                <div className='text-left'>
                    <input
                        id='fullName'
                        type="text"
                        placeholder="Nuevo Nombre"
                        className="p-2 mb-3 border-2 bg-transparent autofill:bg-transparent border-white rounded-3xl w-full text-white"
                        autoComplete='fullName'
                        required
                        minLength={3}
                    />
                </div>
                <div className='flex justify-around'>
                    <input className='bg-green-500 rounded-full w-fit px-2' type="submit" value="Aceptar" />
                    <button className='bg-red-500 rounded-full w-fit  px-2' onClick={(e) => { e.preventDefault(); onHide() }}>Cancelar</button>
                </div>
            </form>
        </div>
    </div>
export const showUpdateModal = (person, setModalContent, setShowModal, handleUpdate, setIsRowLoading) => {
    setModalContent({
        body: updatePersonForm(() => { setShowModal(false) }, handleUpdate, person, setIsRowLoading),
        title: 'Editar Persona'
    })
    setShowModal(true)
}