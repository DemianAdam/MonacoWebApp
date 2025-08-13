import React, { useState, useRef } from 'react'
import { startScanner } from '../../services/scanner/scanner'
import { verifyDiscountPerson } from '../../services/persons/personService'
import { useSnackbar } from 'notistack';
import ScanSuccessModalContent from '../../components/Scanner/ScanSuccessModalContent'

export default function Bar({ setModalContent, setShowModal }) {
    const { enqueueSnackbar } = useSnackbar();
    const readerRef = useRef(null);
    const [isScanning, setIsScanning] = useState(false)

    const successModalBody = (person) =>
        <div className='bg-black rounded-2xl m-5 sm:max-w-1/2 border-white/30 border shadow-md shadow-white/30 p-5'>
            <h2 className='font-abril-fatface text-3xl text-center mb-3 tracking-wider'>QR Verificado</h2>
            <p className='text-center text-xl'>Nombre: {person.name}</p>
            <p className='text-center text-xl'>DNI: {person.dni}</p>
            <h2 className='font-abril-fatface text-3xl text-center mb-3 tracking-wider'>¡Se puede usar el descuento!</h2>
            <div className='flex justify-center mt-5'>
                <button
                    className='bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors'
                    onClick={() => setShowModal(false)}
                >
                    Cerrar
                </button>
            </div>
        </div>

    const scanSuccess = async (decodedText) => {
        setIsScanning(true);
        try {
            const data = await verifyDiscountPerson(decodedText);
            setModalContent({
                body: successModalBody(data.person),
                title: 'Información del QR'
            });
            setShowModal(true);
            console.log(data)
        } catch (error) {
            switch (error.code) {
                case "DiscountUsed":
                    enqueueSnackbar("El descuento de este DNI ya se uso", { variant: 'error' });
                    break;
                case "PersonNotInside":
                    enqueueSnackbar("La persona del DNI escaneado no esta dentro", { variant: 'error' })
                    break;
                default:
                    enqueueSnackbar("Error inesperado", { variant: 'error' })
                    break;
            }
        }
        setIsScanning(false);
    }

    const handleQrScan = async () => {
        if (!readerRef.current) return;
        const scanner = await startScanner({
            elementId: readerRef.current.id,
            onSuccess: scanSuccess,
            onFinish: () => { },
        });
    }
    return (
        <div className='border bg-black/15 border-black/30 shadow-md shadow-black rounded-2xl p-5 text-white w-full mx-auto mb-5'>
            <div className='flex flex-col'>
                <span className='text-center text-2xl mb-5 border-b-2'>Escanear QR</span>
                <button onClick={handleQrScan} disabled={isScanning} value="Escanear" className="flex justify-center p-2 bg-linear-to-r from-white from-[-50%] via-black  to-white border border-white/30  to-150% text-white rounded-3xl"
                >
                    {isScanning ? <span className='loader'></span> : <span>Escanear</span>}
                </button>
                <div id='scanner' ref={readerRef}></div>
            </div>
        </div>
    )
}
