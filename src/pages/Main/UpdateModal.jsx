import React from 'react'
const updatePersonForm = (onHide, handleUpdate, person, setIsRowLoading) =>
    <div className='bg-black rounded-2xl m-5 sm:max-w-1/2 border-white/30 border shadow-md shadow-white/30'>
        <div className='bg-white/5 p-5 flex flex-col text-xl rounded-2xl'>
            <h2 className='font-abril-fatface text-4xl text-center mb-3 tracking-wider'>Editar</h2>
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
                    <input className='bg-green-500 rounded-full w-fit px-3 py-1' type="submit" value="Aceptar" />
                    <button className='bg-red-500 rounded-full w-fit  px-3 py-1' onClick={(e) => { e.preventDefault(); onHide() }}>Cancelar</button>
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