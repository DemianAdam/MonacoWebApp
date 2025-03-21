import React from 'react'
const removeUserForm = (onHide, handleRemove, user, setIsRowLoading) =>
    <div className='bg-black rounded-2xl m-5 sm:max-w-1/2 border-white/30 border shadow-md shadow-white/30'>
        <div className='bg-white/5 p-5 flex flex-col text-xl rounded'>
            <h2 className='font-abril-fatface text-3xl text-center mb-3 tracking-wider'>Esta seguro que desea eliminar a "{user.username}"?</h2>
            <form onSubmit={(e) => { handleRemove(e, user, setIsRowLoading) }}>
                <div className='flex justify-around'>
                    <input className='bg-green-500 rounded-full w-fit px-2' type="submit" value="Aceptar" />
                    <button className='bg-red-500 rounded-full w-fit  px-2' onClick={(e) => { e.preventDefault(); onHide() }}>Cancelar</button>
                </div>
            </form>
        </div>
    </div>

export const showRemoveModal = (user, setModalContent, setShowModal, handleRemove, setIsRowLoading) => {
    //console.log(user)
    setModalContent({
        body: removeUserForm(() => { setShowModal(false) }, handleRemove, user, setIsRowLoading),
        title: 'Eliminar Usuario'
    })
    setShowModal(true)
}