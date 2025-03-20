import React from 'react'
const updateUserForm = (onHide, handleUpdate, user, setIsRowLoading) =>
    <div className='bg-black rounded-2xl m-5 sm:max-w-1/2 border-white/30 border shadow-md shadow-white/30'>
        <div className='bg-white/5 p-5 flex flex-col text-xl rounded-2xl'>
            <h2 className='font-abril-fatface text-4xl text-center mb-3 tracking-wider'>Editar</h2>
            <form onSubmit={(e) => { handleUpdate(e, user, setIsRowLoading) }}>
                <div className='text-left'>
                    <input
                        id='username'
                        type="text"
                        placeholder="Nuevo Nombre de Usuario"
                        className="p-2 mb-3 border-2 bg-transparent autofill:bg-transparent border-white rounded-3xl w-full text-white"
                        autoComplete='username'
                        minLength={3}
                    />
                    <input
                        id='password'
                        type="password"
                        placeholder="Nueva Contraseña"
                        className="p-2 mb-3 border-2 bg-transparent autofill:bg-transparent border-white rounded-3xl w-full text-white"
                        autoComplete='password'
                        minLength={3}
                    />
                    {
                        user.role == 'user' &&
                        <input
                            id='limit'
                            type="number"
                            placeholder="Nuevo Limite"
                            className="p-2 mb-3 border-2 bg-transparent autofill:bg-transparent border-white rounded-3xl w-full text-white"
                            autoComplete='limit'
                            min={1}
                        />
                    }
                </div>
                <div className='flex justify-around'>
                    <input className='bg-green-500 rounded-full w-fit px-3 py-1' type="submit" value="Aceptar" />
                    <button className='bg-red-500 rounded-full w-fit  px-3 py-1' onClick={(e) => { e.preventDefault(); onHide() }}>Cancelar</button>
                </div>
            </form>
        </div>
    </div>
export const showUpdateModal = (user, setModalContent, setShowModal, handleUpdate, setIsRowLoading) => {
    setModalContent({
        body: updateUserForm(() => { setShowModal(false) }, handleUpdate, user, setIsRowLoading),
        title: 'Editar Usuario'
    })
    setShowModal(true)
}