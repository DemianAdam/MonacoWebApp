import React, { useEffect, useState, useRef } from 'react'
import { validateDate, validateDni } from '../../utils/validators'
import Table from '../../components/Table/Table';
import { getQrLimit, updateQrLimit, getPersons, createPerson, removePerson, getLotteryPersons, updatePerson, removeAllPersons, setInside, verifyQrPerson } from '../../services/persons/personService'
import { updateDateLimit, getDateLimit } from '../../services/userService/userService';
import { showRemoveModal } from './RemoveModal';
import { showUpdateModal } from './UpdateModal';
import { useSnackbar } from 'notistack';
import { getFormattedLocalDateTime } from '../../utils/formatters';
import Timer from '../../components/Timer/Timer';
import { startScanner } from '../../services/scanner/scanner'
import ScanSuccessModalContent from '../../components/Scanner/ScanSuccessModalContent';

export default function Main({ user, setModalContent, setShowModal }) {
    const [personsInside, setPersonsInside] = useState({});
    const dateInputRef = useRef(null);

    const [dateLimit, setDateLimit] = useState(new Date())
    const [isEditingDateLimit, setIsEditingDateLimit] = useState(false)
    const [isLoadingDateLimit, setIsLoadingDateLimit] = useState(false)

    const [qrLimit, setQrLimit] = useState(0)
    const [isLoadingQrLimit, setIsLoadingQrLimit] = useState(false);
    const [isEditingQrLimit, setisEditingQrLimit] = useState(false);

    const [persons, setPersons] = useState([])
    const [isAddingPerson, setIsAddingPerson] = useState(false)
    const [isLoadingPersons, setIsLoadingPersons] = useState(false)


    const [percentage, setPercentage] = useState(0)
    const [insidePercentage, setInsidePercentage] = useState(0)
    const { enqueueSnackbar } = useSnackbar();
    const tableHeaders = ['Nombre Completo']
    const readerRef = useRef(null);
    const searcherRef = useRef(null);
    const [isScanning, setIsScanning] = useState(false)
    const [tableData, setTableData] = useState([])
    const [lotteryPersons, setLotteryPersons] = useState([])
    const [isRaffling, setIsRaffling] = useState(false);

    const userActions = [{
        name: 'Editar',
        type: 'button',
        style: 'bg-green-500 rounded-full w-fit px-2',
        onClick: (person, setIsRowLoading) => { showUpdateModal(person, setModalContent, setShowModal, handleUpdate, setIsRowLoading) }
    },
    {
        name: 'Eliminar',
        type: 'button',
        style: 'bg-red-500 rounded-full w-fit px-2',
        onClick: (person, setIsRowLoading) => { showRemoveModal(person, setModalContent, setShowModal, handleRemove, setIsRowLoading) }
    }]

    /*const securityActions = [{
        type: 'checkbox',
        onChange: (person, setIsRowLoading, e) => { handlePersonInsideChange(person, e.target.checked) },
        checked: (person) => personsInside[person.id] || false
    }]*/


    const tableActions = {
        buttons: user.role != 'security' && userActions /*: securityActions*/,
        rowClick: user.role != 'user' ? ((e, person) => {
            handlePersonInsideChange(person, !personsInside[person.id]);
            const insideColor = "bg-green-900";
            if (e.target.parentElement.className == insideColor) {
                e.target.parentElement.className = "h-10 even:bg-white/10 odd:bg-black/50";
            }
            else {
                e.target.parentElement.className = insideColor;
            }
        }) : null
    }


    useEffect(() => {
        setIsLoadingDateLimit(true);
        setIsLoadingPersons(true);
        setIsLoadingQrLimit(true);
        const controller = new AbortController();
        const signal = controller.signal;


        async function fetchData(showMessages = true) {
            try {
                const data = await getPersons({ signal });
                const updatedPersonsInside = {};

                const mappedData = data.map((person) => {
                    updatedPersonsInside[person.id] = person.isInside;
                    const name = person.lastname ? `${person.lastname} ${person.name}` : person.name

                    return {
                        obj: person,
                        rowData: { name: name },
                        rowStyle: person.isInside
                            ? "bg-green-900"
                            : "h-10 even:bg-white/10 odd:bg-black/50 ",
                    };
                });

                setPersonsInside(updatedPersonsInside);
                setPersons(data);
                setTableData(mappedData);
                setPercentage((data.length * 100) / user.limit);
                setInsidePercentage(
                    Object.values(updatedPersonsInside).filter((v) => v).length * 100 / data.length
                );

                if (showMessages) {
                    enqueueSnackbar("Personas cargadas correctamente", { variant: "success" });
                }
            } catch (error) {
                if (error.name !== "AbortError") {
                    console.error("Error al intentar obtener las personas: " + error);
                    if (showMessages) {
                        enqueueSnackbar(
                            "Error al intentar obtener las personas: " + error,
                            { variant: "error" }
                        );
                    }
                }
            }
            setIsLoadingPersons(false);
        }

        async function fetchDateLimit() {
            try {
                const date = await getDateLimit();
                setDateLimit(new Date(date));
                enqueueSnackbar("Fecha límite cargada correctamente", { variant: "success" });
            } catch (error) {
                enqueueSnackbar(
                    "Error al intentar obtener la fecha límite: " + error,
                    { variant: "error" }
                );
            }
            setIsLoadingDateLimit(false);
        }

        async function fetchQrLimit() {
            try {
                const qrLimit = await getQrLimit();
                setQrLimit(qrLimit);
            } catch (error) {
                console.log(error)
            }

            setIsLoadingQrLimit(false);
        }

        fetchQrLimit();

        // First load
        fetchData(true);
        if (user.role !== "security") {
            fetchDateLimit();
        }

        // Refresh every 5 minutes without snackbar
        const interval = setInterval(() => {
            console.log("refreshing")
            fetchData(false);
        }, 1 * 60 * 1000);

        return () => {
            controller.abort();
            clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        if (isEditingDateLimit) {
            dateInputRef.current.focus()
        }
    }, [isEditingDateLimit])

    const handlePersonInsideChange = async (person, isInside) => {
        setPersonsInside(prev => ({ ...prev, [person.id]: isInside }))
        const percent = 1 * 100 / persons.length;
        setInsidePercentage(prev => prev + (isInside ? percent : -percent))

        console.log(insidePercentage)
        setInside(person, isInside)
        const updatedPersons = persons.map((p) =>
            p.id === person.id ? { ...p, isInside: isInside } : p
        );
        setPersons(updatedPersons);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsAddingPerson(true)

        /*if (!validateDate(e.target.birthdate)) {
            return;
        }

        if (!validateDni(e.target.dni)) {
            return;
        }*/
        const personNameNormalized = e.target.fullName.value.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();

        const person = {
            name: personNameNormalized,
            /* dni: e.target.dni.value,
             birthdate: e.target.birthdate.value,*/
            userId: user.id
        }
        e.target.fullName.value = ''

        try {
            const data = await createPerson(person)
            enqueueSnackbar("Persona agregada correctamente", { variant: 'success' })
            setPersons([...persons, data.person])
            setTableData([...tableData, {
                obj: data.person,
                rowData: {
                    name: data.person.name,
                },
                rowStyle: person.isInside
                    ? "bg-green-900"
                    : "h-10 even:bg-white/10 odd:bg-black/50 ",
            }])
            setPercentage(prev => prev + 100 / user.limit)
            //  console.log([...persons, data.person])
        } catch (error) {
            enqueueSnackbar(`Error al intentar agregar a la persona ${person.name}: ${error}`, { variant: 'error' })
        }
        setIsAddingPerson(false)
    }

    const handleRemove = async (e, person, setIsRowLoading) => {
        e.preventDefault();
        const name = person.name
        setShowModal(false)
        setIsRowLoading(true)
        try {
            const data = await removePerson(person, user.id)

            if (data.statusCode === 200) {
                enqueueSnackbar("Persona eliminada correctamente", { variant: 'success' })
            }
            setPersons(persons.filter((p) => p.id !== person.id))
            setTableData(tableData.filter((p) => p.obj.id !== person.id))
            setPercentage(prev => prev - 100 / user.limit)
        } catch (error) {
            enqueueSnackbar(`Error al intentar eliminar a la persona ${name}: ${error}`, { variant: 'error' })
        }
        setIsRowLoading(false)
    }

    const handleUpdate = async (e, person, setIsRowLoading) => {
        e.preventDefault();
        setShowModal(false)
        const name = person.name
        setIsRowLoading(true)
        try {
            const clone = { ...person, name: e.target.fullName.value.trim().toUpperCase() }
            const data = await updatePerson(clone, user.id)

            if (data.statusCode === 200) {
                enqueueSnackbar("Persona actualizada correctamente", { variant: 'success', })
            }
            const updatedPerson = data.person;
            const updatedPersons = persons.map((p) =>
                p.id === updatedPerson.id ? updatedPerson : p
            );
            setPersons(updatedPersons);
            const updatedTableData = tableData.map((p) =>
                p.obj.id === updatedPerson.id
                    ? { obj: updatedPerson, rowData: { name: updatedPerson.name } }
                    : p
            );
            setTableData(updatedTableData);
        } catch (error) {
            enqueueSnackbar(`Error al intentar actualizar a la persona ${name}: ${error}`, { variant: 'error' })
        }
        setIsRowLoading(false)
    }

    const handleDateSubmit = async (e) => {
        e.preventDefault();
        setIsEditingDateLimit(false)
        setIsLoadingDateLimit(true)
        const date = e.target.dateLimit.value;
        try {
            const data = await updateDateLimit({ date })
            const resultDate = data.date;
            setDateLimit(new Date(resultDate))
            enqueueSnackbar("Fecha límite actualizada correctamente", { variant: 'success' })
        } catch (error) {
            enqueueSnackbar(`Error al intentar actualizar la fecha límite: ${error}`, { variant: ' error' })
        }
        setIsLoadingDateLimit(false)
    }

    /* const handleBirthdateChange = (e) => {
         const value = e.target.value;
         let data = e.nativeEvent.data;
 
         if (isNaN(data)) {
             e.target.value = value.slice(0, value.length - 1)
             return;
         }
         data = Number(data)
         if (data > 3 && value.length === 1) {
             e.target.value = '0' + data + '/'
             return;
         }
 
         if (data > 1 && value.length === 4) {
             e.target.value = value.slice(0, 3) + '0' + data + '/'
             return;
         }
 
 
         if ((value.length === 2 || value.length === 5) && e.nativeEvent.inputType !== 'deleteContentBackward') {
             e.target.value = value + '/'
         }
 
 
         const input = e.target;
         input.setCustomValidity("");
 
 
     }
 
 
     const handleDniChange = (e) => {
         e.target.setCustomValidity("");
         if (e.nativeEvent.data === '-') {
             e.target.value = e.target.value.slice(0, -1);
             return;
         }
         const value = e.target.value;
         if (value.length > 3) {
             e.target.value = value.slice(0, 3);
         }
 
     }*/
    const handleDeleteList = async () => {
        try {
            const data = await removeAllPersons()
            if (data.statusCode === 200) {
                enqueueSnackbar("Lista eliminada correctamente", { variant: 'success' })
                setPersons([])
                setTableData([])
                setPercentage(0)
            }
        } catch (error) {
            enqueueSnackbar(`Error al intentar eliminar la lista: ${error}`, { variant: 'error' })
        }
    }

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        const filteredData = persons.filter((person) => {

            if (person.lastname) {
                return person.name.toLowerCase().includes(value) || person.lastname.toLowerCase().includes(value)
            }

            return person.name.toLowerCase().includes(value)
        })
        const mappedData = filteredData.map((person) => ({
            obj: person,
            rowData: { name: person.lastname ? `${person.lastname} ${person.name}` : person.name },
            rowStyle: person.isInside ? "bg-green-900" : "h-10 even:bg-white/10 odd:bg-black/50 "
        }));
        setTableData(mappedData)
    }

    const scanSuccess = async (decodedText) => {
        setIsScanning(true);
        try {
            const data = await verifyQrPerson(decodedText, persons);

            setModalContent({
                body: <ScanSuccessModalContent person={data.person} setShowModal={setShowModal} />,
                title: 'Información del QR'
            });
            setShowModal(true);

            const updatedTableData = tableData.map((p) => {
                if (p.obj.id == data.person.id) {
                    return { obj: data.person, rowData: { name: `${data.person.lastname} ${data.person.name}` }, rowStyle: data.person.isInside ? "bg-green-900" : "h-10 even:bg-white/10 odd:bg-black/50 " }
                }
                return p;
            });
            const updatedPerson = data.person;
            const updatedPersons = persons.map((p) =>
                p.id === updatedPerson.id ? { ...p, name: `${data.person.lastname} ${data.person.name}`, isInside: updatedPerson.isInside } : p
            );
            setPersons(updatedPersons);
            setTableData(updatedTableData)

            /*searcherRef.current.value = `${data.person.lastname} ${data.person.name}`;
            handleSearch({ target: searcherRef.current });*/
        } catch (error) {
            console.log(error)
            switch (error.code) {
                case "AlreadyInside":
                    enqueueSnackbar("La persona escaneada ya esta dentro", { variant: 'warning' })
                    /*const person = error.response.data.person
                    searcherRef.current.value = `${person.lastname} ${person.name}`;
                    handleSearch({ target: searcherRef.current });*/
                    break;
                case "DataMismatch":
                    enqueueSnackbar("Los datos del QR no coinciden", { variant: 'error' })
                    break;
                case "NotFound":
                    enqueueSnackbar("Persona no encontrada en la lista", { variant: 'error' })
                    break;
                case "InvalidQR_NULL":
                    enqueueSnackbar("QR Invalido", { variant: 'error' })
                    break;
                case "InvalidQR_FORMAT":
                    enqueueSnackbar("QR Invalido, puede tener datos incorrectos o haberse escaneado mal. Intenta nuevamente para comprobar.", { variant: 'warning' })
                    break;
                case "InvalidAge": {
                    enqueueSnackbar(error.message, { variant: 'error' })
                }
                default:
                    enqueueSnackbar(`Error Inesperado : ${error}`)
                    break;
            }
        }
        finally {
            setIsScanning(false);
        }
    }

    const handleQRScan = async () => {

        if (!readerRef.current) return;
        const scanner = await startScanner({
            elementId: readerRef.current.id,
            onSuccess: scanSuccess,
            onFinish: () => { },
        });

    }

    const randomPersonModalContent = (person) =>
        <div className='bg-black rounded-2xl m-5 sm:max-w-1/2 border-white/30 border shadow-md shadow-white/30 p-5'>
            <h2 className='font-abril-fatface text-3xl text-center mb-3 tracking-wider'>Ganador:</h2>
            <p className='text-center text-xl'>Nombre: {person.name}</p>
            <p className='text-center text-xl'>DNI: {person.dni}</p>
            <div className='flex justify-center mt-5'>
                <button
                    className='bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors'
                    onClick={() => setShowModal(false)}
                >
                    Cerrar
                </button>
            </div>
        </div>

    const errorModalContent = (text) =>
        <div className='bg-black rounded-2xl m-5 sm:max-w-1/2 border-white/30 border shadow-md shadow-white/30 p-5'>
            <h2 className='font-abril-fatface text-3xl text-center mb-3 tracking-wider'>{text}</h2>
        </div>

    const randomPerson = async () => {
        setIsRaffling(true);
        const persons = await getLotteryPersons();
        if (!persons.length == 0) {
            const random = Math.floor(Math.random() * persons.length);
            const randomPerson = persons[random];
            setModalContent({
                body: randomPersonModalContent(randomPerson),
                title: 'Información del QR'
            });
        }
        else {
            setModalContent({
                body: errorModalContent("No hay personas."),
                title: 'Información del QR'
            });
        }


        setShowModal(true);
        setIsRaffling(false);
    }

    const handleQrLimitSubmit = async (e) => {
        e.preventDefault();
        setisEditingQrLimit(false);
        setIsLoadingQrLimit(true);
        const newLimit = e.target.qrLimit.value;
        try {
            const data = await updateQrLimit(newLimit);
            setQrLimit(data.newLimit);
            enqueueSnackbar("Limite QR actualizado correctamente", { variant: 'success' })
        } catch (error) {
            enqueueSnackbar("Error al actualizar el Limite QR: " + error.message, { variant: 'error' })
        }
        setIsLoadingQrLimit(false)
    }

    return (
        <>
            <div className='p-5'>
                {user.role != 'security' &&
                    <div className='flex flex-col border bg-black/15 border-black/30 shadow-md shadow-black rounded-2xl p-5 text-white h-96 w-full max-w-sm justify-center mx-auto mb-5'>
                        <h2 className="text-4xl xl:text-5xl font-bold text-center font-abril-fatface tracking-wider">Agregar a la Lista</h2>
                        <form className="flex flex-col gap-3 justify-evenly h-2/3" onSubmit={handleSubmit}>
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
                            {/*<div className='text-left flex gap-2'>
                            <input
                                id='dni'
                                type="number"
                                placeholder="Dni"
                                className="p-2 bg-transparent  autofill:bg-transparent border-2 border-white rounded-3xl"
                                autoComplete='dni'
                                required
                                min={0}
                                max={999}
                                onChange={handleDniChange}
                            />
                            <input
                                id='birthdate'
                                type="text"
                                placeholder="Fecha de Nacimiento"
                                className="p-2 bg-transparent autofill:bg-transparent border-2 rounded-3xl transition-all border-white focus:border-blue-500 w-full"
                                autoComplete='birthdate'
                                required
                                onChange={handleBirthdateChange}
                                maxLength={8}

                            />
                        </div>*/}
                            <button
                                disabled={isAddingPerson}
                                type="submit"
                                className="flex justify-center p-2 bg-linear-to-r from-white from-[-50%] via-black  to-white border border-white/30  to-150% text-white rounded-3xl"
                            >

                                {isAddingPerson ? <span className='loader'></span> : <span>Agregar</span>}

                            </button>
                        </form>
                    </div>
                }


                <div className='border bg-black/15 border-black/30 shadow-md shadow-black rounded-2xl p-5 text-white w-full mx-auto mb-5'>

                    <div className='flex flex-col justify-around'>
                        <div className='flex flex-col'>
                            <span className='text-center text-2xl mb-5 border-b-2 text-nowrap'>Personas Añadidas:</span>
                            <div
                                className="text-center rounded-full w-full border border-white p-2"
                                style={{
                                    background: `linear-gradient(to right, #00c951 ${percentage}%, transparent ${percentage}%)`
                                }}
                            >
                                {
                                    user.limit == 0 ? <span>{persons.length}</span> : <span>{persons.length} / {user.limit}</span>
                                }
                            </div>
                        </div>
                        {
                            user.role == 'security' &&
                            <div className='flex flex-col'>
                                <span className='text-center text-2xl mb-5 border-b-2'>Personas Dentro:</span>
                                <div
                                    className="text-center rounded-full w-full border border-white p-2"
                                    style={{
                                        background: `linear-gradient(to right, #00c951 ${insidePercentage}%, transparent ${insidePercentage}%)`
                                    }}
                                >
                                    {Object.values(personsInside).filter((value) => value).length} / {persons.length}
                                </div>
                            </div>
                        }
                        {user.role != 'security' &&
                            <>
                                <div className='flex flex-col'>
                                    <span className='text-center text-2xl mb-5 border-b-2'>Tiempo Restante:</span>
                                    <div
                                        className="flex justify-around text-center rounded-full w-full border border-white p-2"

                                    >

                                        {!isEditingDateLimit ? (
                                            isLoadingDateLimit ? (
                                                <span className="loader"><span /></span>
                                            ) : (
                                                <Timer targetDate={new Date(dateLimit)} />
                                            )
                                        ) : (
                                            <form onSubmit={handleDateSubmit}>
                                                <input
                                                    id="dateLimit"
                                                    required
                                                    type="datetime-local"
                                                    className="mb-2 border rounded-md"
                                                    onFocus={(e) => e.target.showPicker?.()}
                                                    ref={dateInputRef}
                                                    min={getFormattedLocalDateTime()}
                                                />
                                                <div className="flex justify-around">
                                                    <input className="bg-green-500 rounded-full w-fit px-2" type="submit" value="Guardar" />
                                                    <button
                                                        className="bg-red-500 rounded-full w-fit px-2"
                                                        type="button"
                                                        onClick={() => setIsEditingDateLimit(false)}
                                                    >
                                                        Cancelar
                                                    </button>
                                                </div>
                                            </form>
                                        )}

                                        {user.role == 'admin' && !isEditingDateLimit && <button onClick={() => setIsEditingDateLimit(true)} className='bg-green-500 rounded-full w-fit px-2'>Editar</button>}
                                    </div>
                                </div>
                                {user.role == "admin" &&
                                    <div className='flex flex-col'>
                                        <span className='text-center text-2xl mb-5 border-b-2'>Limite Lista QR:</span>
                                        <div
                                            className="flex justify-around text-center rounded-full w-full border border-white p-2">


                                            {
                                                isEditingQrLimit ?
                                                    <form onSubmit={handleQrLimitSubmit}>
                                                        <input
                                                            id="qrLimit"
                                                            required
                                                            type="number"
                                                            className="mb-2 border rounded-md"
                                                            min={0}
                                                        />
                                                        <div className="flex justify-around">
                                                            <input className="bg-green-500 rounded-full w-fit px-2" type="submit" value="Guardar" />
                                                            <button
                                                                className="bg-red-500 rounded-full w-fit px-2"
                                                                type="button"
                                                                onClick={() => setisEditingQrLimit(false)}
                                                            >
                                                                Cancelar
                                                            </button>
                                                        </div>
                                                    </form>
                                                    : isLoadingQrLimit ? <span className="loader"><span /></span> :
                                                        <span>{qrLimit}</span>

                                            }


                                            {!isEditingQrLimit && <button onClick={() => setisEditingQrLimit(true)} className='bg-green-500 rounded-full w-fit px-2'>Editar</button>}
                                        </div>
                                    </div>
                                }
                            </>
                        }
                    </div>

                </div>

                {
                    user.role == "admin" &&
                    <div className='border flex justify-center  bg-black/15 border-black/30 shadow-md shadow-black rounded-2xl p-5 text-white w-full mx-auto mb-5'>
                        <button disabled={isRaffling} onClick={randomPerson} className="w-full p-2 bg-linear-to-r from-white from-[-50%] via-black  to-white border border-white/30  to-150% text-white rounded-3xl">
                            {isRaffling ? <span className='loader'></span> : <span>Persona Aleatoria</span>}
                        </button>
                    </div>
                }
                {user.role == 'security' &&
                    <div className='border bg-black/15 border-black/30 shadow-md shadow-black rounded-2xl p-5 text-white w-full mx-auto mb-5'>
                        <div className='flex flex-col'>
                            <span className='text-center text-2xl mb-5 border-b-2'>Escanear QR</span>
                            <button onClick={handleQRScan} disabled={isScanning || isLoadingPersons} value="Escanear" className="flex justify-center p-2 bg-linear-to-r from-white from-[-50%] via-black  to-white border border-white/30  to-150% text-white rounded-3xl"
                            >
                                {isScanning || isLoadingPersons ? <span className='loader'></span> : <span>Escanear</span>}
                            </button>
                            <div id='scanner' ref={readerRef}></div>
                        </div>
                    </div>

                }

                <div className="bg-black/15 border border-black/30 shadow-md shadow-black rounded-2xl p-5 overflow-x-auto mb-5">
                    <div className="max-w-full mx-auto">
                        <div>
                            <div className='flex flex-col justify-center items-center '>
                                <span>Buscar</span>
                                <input onChange={handleSearch} className='border rounded-2xl' type="text" name="" id="" ref={searcherRef} placeholder='Nombre' />
                            </div>
                        </div>
                        {
                            isLoadingPersons ? <span className='loader'></span> :
                                <Table styles={{
                                    table: 'border-separate border-spacing-y-3 w-full',
                                    header: '',
                                    headerCell: '',
                                    body: '',
                                    bodyRow: 'h-10 even:bg-white/10 odd:bg-black/50 ',
                                    bodyCell: 'first:rounded-l-2xl last:rounded-r-2xl p-2 '
                                }} headers={tableHeaders} data={tableData} actions={tableActions} />
                        }

                    </div>
                </div>

                {user.role == 'admin' &&
                    <div className="bg-black/15 border-2 flex justify-center items-center border-black/30 shadow-md shadow-black rounded-2xl p-7 overflow-x-auto">
                        <button onClick={handleDeleteList} className='bg-red-700 rounded-2xl w-[70%] p-3 text-2xl'>Eliminar Lista</button>
                    </div>
                }
            </div>
        </>
    )
}
