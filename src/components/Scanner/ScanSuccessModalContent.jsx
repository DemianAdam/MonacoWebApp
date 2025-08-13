import React from 'react'

export default function ScanSuccessModalContent({ person, setShowModal }) {
    return (
        <div className='bg-black rounded-2xl m-5 sm:max-w-1/2 border-white/30 border shadow-md shadow-white/30 p-5'>
            <h2 className='font-abril-fatface text-3xl text-center mb-3 tracking-wider'>QR Verificado</h2>
            <p className='text-center text-xl'>Nombre: {person.name}</p>
            <p className='text-center text-xl'>DNI: {person.dni}</p>
            <p className='text-center text-xl'>Fecha de Nacimiento: {person.birthdate}</p>
            <p className='text-center text-xl'>Estado: {person.isInside ? 'Dentro' : 'Fuera'}</p>
            <div className='flex justify-center mt-5'>
                <button
                    className='bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors'
                    onClick={() => setShowModal(false)}
                >
                    Cerrar
                </button>
            </div>
        </div>
    )
}
