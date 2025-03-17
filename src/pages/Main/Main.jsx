import React, { useEffect, useState } from 'react'
import { validateDate, validateDni } from '../../utils/validators'
import Table from '../../components/Table/Table';
import { getPersons, createPerson, removePerson, updatePerson } from '../../services/persons/personService'
import { showRemoveModal } from './RemoveModal';
import { showUpdateModal } from './UpdateModal';
import { useSnackbar } from 'notistack';

export default function Main({ user, setModalContent, setShowModal }) {

    const { enqueueSnackbar } = useSnackbar();
    const tableHeaders = ['Nombre Completo']
    const tableActions = [{
        name: 'Editar',
        handler: (person, setIsRowLoading) => { showUpdateModal(person, setModalContent, setShowModal, handleUpdate, setIsRowLoading) },
        style: 'bg-green-500 rounded-full w-fit px-2'
    }, {
        name: 'Eliminar',
        handler: (person, setIsRowLoading) => { showRemoveModal(person, setModalContent, setShowModal, handleRemove, setIsRowLoading) },
        style: 'bg-red-500 rounded-full w-fit  px-2'
    }]
    const [persons, setPersons] = useState([])
    const [tableData, setTableData] = useState([])
    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        async function fetchData() {
            try {
                const data = await getPersons({ signal });

                const mappedData = data.map((person) => ({
                    obj: person,
                    tableData: { name: person.name },
                }));

                setPersons(data);
                setTableData(mappedData);
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.error("Error fetching persons:", error);
                }
            }
        }

        fetchData();

        return () => controller.abort(); // Cleanup function
    }, []);


    const handleSubmit = async (e) => {
        e.preventDefault();

        /*if (!validateDate(e.target.birthdate)) {
            return;
        }

        if (!validateDni(e.target.dni)) {
            return;
        }*/

        const person = {
            name: e.target.fullName.value,
            /* dni: e.target.dni.value,
             birthdate: e.target.birthdate.value,*/
            userId: user.id
        }

        try {
            const data = await createPerson(person)
            enqueueSnackbar("Persona agregada correctamente", { variant: 'success' })
            setPersons([...persons, data.person])
            setTableData([...tableData, {
                obj: data.person,
                tableData: {
                    name: data.person.name,
                }
            }])
            console.log([...persons, data.person])
        } catch (error) {
            enqueueSnackbar(`Error al intentar agregar a la persona ${person.name}: ${error}`, { variant: 'error' })
        }

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
            person.name = e.target.fullName.value
            const data = await updatePerson(person, user.id)

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
                    ? { obj: updatedPerson, tableData: { name: updatedPerson.name } }
                    : p
            );
            setTableData(updatedTableData);
        } catch (error) {
            enqueueSnackbar(`Error al intentar actualizar a la persona ${name}: ${error}`, { variant: 'error' })
        }
        setIsRowLoading(false)
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
    return (
        <>
            <div className='p-5'>
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
                            type="submit"
                            className="flex justify-center p-2 bg-linear-to-r from-white from-[-50%] via-black  to-white border border-white/30  to-150% text-white rounded-3xl"
                        >

                            <span>Agregar</span>

                        </button>
                    </form>
                </div>
                <div className="bg-black/30 rounded p-5 overflow-x-auto">
                    <div className="max-w-full mx-auto">
                        <Table styles={{
                            table: 'border-separate border-spacing-y-3 w-full',
                            header: '',
                            headerCell: '',
                            body: '',
                            bodyRow: 'h-10 even:bg-white/10 odd:bg-black/50 ',
                            bodyCell: 'first:rounded-l-2xl last:rounded-r-2xl p-2 '
                        }} headers={tableHeaders} data={tableData} actions={tableActions} />
                    </div>
                </div>


            </div>
        </>
    )
}
