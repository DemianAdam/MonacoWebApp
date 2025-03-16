import React, { useEffect, useState } from 'react'
import { validateDate, validateDni } from '../../utils/validators'
import Table from '../../components/Table/Table';
import { getPersons, createPerson, removePerson, updatePerson } from '../../services/persons/personService'
import { showRemoveModal } from './RemoveModal';
import { showUpdateModal } from './UpdateModal';

export default function Main({ user, setModalContent, setShowModal }) {
    const tableHeaders = ['Nombre Completo']
    const tableActions = [{
        name: 'Editar',
        handler: (person) => { showUpdateModal(person, setModalContent, setShowModal, handleUpdate) },
        style: 'bg-green-500 rounded-full w-fit sm:w-2/3 px-2'
    }, {
        name: 'Eliminar',
        handler: (person) => { showRemoveModal(person, setModalContent, setShowModal, handleRemove) },
        style: 'bg-red-500 rounded-full w-fit sm:w-1/2 px-2'
    }]
    const [persons, setPersons] = useState([])
    const [tableData, setTableData] = useState([])
    useEffect(() => {
        async function fetchData() {
            const data = await getPersons()

            const mappedData = data.map((person) => {
                return {
                    obj: person,
                    tableData: {
                        name: person.name,
                    }
                }
            })
            setPersons(data)
            setTableData(mappedData)
        }

        console.log(user)

        fetchData()
    }, [])


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

            setPersons([...persons, data.person])
            setTableData([...tableData, {
                obj: data.person,
                tableData: {
                    name: data.person.name,
                }
            }])
            console.log([...persons, data.person])
        } catch (error) {
            alert("Error al intentar agregar a la lista: " + error)
        }

    }

    const handleRemove = async (e, person) => {
        e.preventDefault();
        try {
            const data = await removePerson(person, user.id)
            setShowModal(false)
            setPersons(persons.filter((p) => p.id !== person.id))
            setTableData(tableData.filter((p) => p.obj.id !== person.id))
        } catch (error) {
            alert("Error al intentar eliminar a la persona: " + error)
        }
    }

    const handleUpdate = async (e, person) => {
        e.preventDefault();
        try {
            const data = await updatePerson(person, user.id)
            const person = data.person;
            const index = persons.findIndex((p) => p.id === person.id)
            persons[index] = person;
            setPersons(persons)
            const tableIndex = tableData.findIndex((p) => p.obj.id === person.id)
            tableData[tableIndex] = {
                obj: person,
                tableData: {
                    name: person.name,
                }
            }
            setTableData(tableData)
            setShowModal(false)
        } catch (error) {
            alert("Error al intentar actualizar a la persona: " + error)
        }
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
