import React, { useEffect, useState, useRef } from 'react'
import { startScanner } from '../../services/scanner/scanner'
import { addLotteryPerson, getLotteryPersons } from '../../services/persons/personService'
import { useSnackbar } from 'notistack';
import ScanSuccessModalContent from '../../components/Scanner/ScanSuccessModalContent'


export default function Seller({ setModalContent, setShowModal }) {
    const { enqueueSnackbar } = useSnackbar();
    const readerRef = useRef(null);
    const [isScanning, setIsScanning] = useState(false)
    const [lotteryPersons, setLotteryPersons] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const persons = await getLotteryPersons();
            setLotteryPersons(persons);
        }
        fetchData();
        const interval = setInterval(() => {
            console.log("refreshing")
            fetchData(false);
        }, 1 * 60 * 1000);
        return () => {
            clearInterval(interval);
        };
    }, []);

    const successModalBody = (person) =>
        <div className='bg-black rounded-2xl m-5 sm:max-w-1/2 border-white/30 border shadow-md shadow-white/30 p-5'>
            <h2 className='font-abril-fatface text-3xl text-center mb-3 tracking-wider'>QR Verificado</h2>
            <p className='text-center text-xl'>Nombre: {person.name}</p>
            <p className='text-center text-xl'>DNI: {person.dni}</p>
            <h2 className='font-abril-fatface text-3xl text-center mb-3 tracking-wider'>¡Ingreso al Sorteo!</h2>
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

            const data = await addLotteryPerson(decodedText, lotteryPersons);
            setModalContent({
                body: successModalBody(data.person),
                title: 'Información del QR'
            });
            setLotteryPersons([...lotteryPersons, data.person]);
            setShowModal(true);
        } catch (error) {
            switch (error.code) {
                case "UniqueError":
                    enqueueSnackbar("Ya existe una persona con ese DNI en el sorteo", { variant: "error" });
                    break;
                case "UnderAge":
                    enqueueSnackbar("La persona es menor de edad", { variant: 'error' })
                    break;
                case "InvalidQR_NULL":
                    enqueueSnackbar("QR Invalido", { variant: 'error' })
                    break;
                case "InvalidQR_FORMAT":
                    enqueueSnackbar("QR Invalido, puede tener datos incorrectos o haberse escaneado mal. Intenta nuevamente para comprobar.", { variant: 'warning' })
                    break;
                default:
                    enqueueSnackbar(`Error Inesperado : ${error}`)
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
                <span className='text-center text-2xl mb-5 border-b-2'>Ingresar al Sorteo</span>
                <button onClick={handleQrScan} disabled={isScanning} value="Escanear" className="flex justify-center p-2 bg-linear-to-r from-white from-[-50%] via-black  to-white border border-white/30  to-150% text-white rounded-3xl"
                >
                    {isScanning ? <span className='loader'></span> : <span>Escanear</span>}
                </button>
                <div id='scanner' ref={readerRef}></div>
            </div>
        </div>
    )
}
