import React from 'react'
const removePersonForm = (onHide, handleRemove, person, setIsRowLoading) =>
    <div className='bg-black rounded-2xl m-5 sm:max-w-1/2 border-white/30 border shadow-md shadow-white/30'>
        <div className='bg-white/5 p-5 flex flex-col text-xl rounded'>
            <h2 className='font-abril-fatface text-3xl text-center mb-3 tracking-wider'>Esta seguro que desea eliminar a "{person.name}"?</h2>
            <form onSubmit={(e) => { handleRemove(e, person, setIsRowLoading) }}>
                <div className='flex justify-around'>
                    <input className='bg-green-500 rounded-full w-fit px-2' type="submit" value="Aceptar" />
                    <button className='bg-red-500 rounded-full w-fit  px-2' onClick={(e) => { e.preventDefault(); onHide() }}>Cancelar</button>
                </div>
            </form>
        </div>
    </div>

export const showRemoveModal = (person, setModalContent, setShowModal, handleRemove, setIsRowLoading) => {
    console.log(person)
    setModalContent({
        body: removePersonForm(() => { setShowModal(false) }, handleRemove, person, setIsRowLoading),
        title: 'Eliminar Persona'
    })
    setShowModal(true)
}