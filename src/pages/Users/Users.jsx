import React, { useEffect, useState } from 'react'
import { createUser, getUsers, removeUser } from '../../services/userService/userService';
import { useSnackbar } from 'notistack';
import Table from '../../components/Table/Table';
import { showRemoveModal } from './RemoveUserModal';
import { showUpdateModal } from './UpdateUserModal';


export default function Users({ user, setModalContent, setShowModal }) {
  const { enqueueSnackbar } = useSnackbar();
  const [isRRPPTable, setIsRRPPTable] = useState(true);
  const [tableData, setTableData] = useState([]);
  const [tableHeaders, setTableHeaders] = useState([]);

  const tableActions = isRRPPTable ?
    [{
      name: 'Editar',
      handler: (user, setIsRowLoading) => { showUpdateModal(user, setModalContent, setShowModal, handleUpdate, setIsRowLoading) },
      style: 'bg-green-500 rounded-full w-fit px-2'
    },
    {
      name: 'Eliminar',
      handler: (user, setIsRowLoading) => { showRemoveModal(user, setModalContent, setShowModal, handleRemove, setIsRowLoading) },
      style: 'bg-red-500 rounded-full w-fit  px-2'
    }] :
    [{
      name: 'Editar',
      handler: (user, setIsRowLoading) => { showUpdateModal(user, setModalContent, setShowModal, handleUpdate, setIsRowLoading) },
      style: 'bg-green-500 rounded-full w-fit px-2'
    },
    {
      name: 'Eliminar',
      handler: (user, setIsRowLoading) => { showRemoveModal(user, setModalContent, setShowModal, handleRemove, setIsRowLoading) },
      style: 'bg-red-500 rounded-full w-fit  px-2'
    }];

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    setTableHeaders(isRRPPTable ? ['Usuario', 'Limite'] : ['Usuario']);
    setTableData([]);

    async function fetchUsers() {
      try {
        const users = await getUsers({ signal });
        setTableData(isRRPPTable ? users.filter(user => user.role === 'user').map((p) => ({ obj: p, tableData: { username: p.username, limit: p.limit } })) : users.filter(user => user.role === 'security').map((p) => ({ obj: p, tableData: { username: p.username } })));
        enqueueSnackbar("Usuarios obtenidos correctamente", { variant: 'success' });
      } catch (error) {
        enqueueSnackbar("Error al obtener usuarios: " + error, { variant: 'error' });
      }
    }

    fetchUsers();

    return () => controller.abort();
  }, [isRRPPTable]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = {
      username: e.target.username.value,
      password: e.target.password.value,
      role: e.target.type.value
    }
    console.log(user)
    try {
      const data = await createUser(user);
      const createdUser = data.user;
      console.log(createdUser)
      enqueueSnackbar("Usuario creado correctamente", { variant: 'success' });
      const newRow = { obj: createdUser, tableData: { username: createdUser.username } };

      if (isRRPPTable && createdUser.role === 'user') {
        newRow.tableData.limit = createdUser.limit;
      }

      setTableData([...tableData, newRow]);

    } catch (error) {
      enqueueSnackbar("Error al crear usuario: " + error, { variant: 'error' });
    }
  }

  const handleRemove = async (e, user, setIsRowLoading) => {
    e.preventDefault();
    console.log(user)
    setShowModal(false);
    setIsRowLoading(true);
    try {
      const data = await removeUser(user.id);
      if (data.statusCode === 200) {
        enqueueSnackbar("Usuario eliminado correctamente", { variant: 'success' });
      }
      setTableData(tableData.filter((u) => u.obj.id !== user.id));


    } catch (error) {
      enqueueSnackbar("Error al eliminar usuario: " + error, { variant: 'error' });
    }
    setIsRowLoading(false);

  }

  const handleUpdate = async (e, user, setIsRowLoading) => {
    e.preventDefault();
    setShowModal(false);
    setIsRowLoading(true);
    console.log(user)
    const updatedUser = {
      id: user.id,
      username: e.target.username.value || user.username,
      password: e.target.password.value || null,
      limit: Number(e.target.limit.value) || user.limit,
    }
    console.log(updatedUser)
    try {

    } catch (error) {

    }
    setIsRowLoading(false);
  }

  return (

    <div className='p-5'>
      <div className='flex flex-col border bg-black/15 border-black/30 shadow-md shadow-black rounded-2xl p-5 text-white h-96 w-full max-w-sm justify-center mx-auto mb-5'>
        <h2 className="text-4xl xl:text-5xl font-bold text-center font-abril-fatface tracking-wider mb-5">Crear Usuario</h2>

        <form className="flex flex-col gap-3 justify-evenly h-2/3" onSubmit={handleSubmit}>
          <div className='text-left'>
            <input
              id='username'
              type="text"
              placeholder="Nombre de Usuario"
              className="p-2 border-2 bg-transparent autofill:bg-transparent border-white rounded-3xl w-full text-white"
              autoComplete='username'
              required
              minLength={3}
            />
          </div>
          <div className='text-left'>
            <input
              id='password'
              type="password"
              placeholder="Contraseña"
              className="p-2 border-2 bg-transparent autofill:bg-transparent border-white rounded-3xl w-full text-white"
              autoComplete='password'
              required
              minLength={3}
            />
          </div>
          <select className='text-center bg-transparent rounded-2xl border-2 p-2  ' name="" id="type">
            <option className='bg-black/90' value="user">RRPP</option>
            <option className='bg-black/90 ' value="security">Seguridad</option>
            <option className='bg-black/90 ' value="admin">Admin</option>
          </select>
          <button
            type="submit"
            className="flex justify-center p-2 bg-linear-to-r from-white from-[-50%] via-black  to-white border border-white/30  to-150% text-white rounded-3xl"
          >

            <span>Agregar</span>

          </button>
        </form>
      </div>

      <div className='border gap-20 px-10 bg-black/15 border-black/30 shadow-md shadow-black rounded-2xl p-5 text-white w-full mx-auto mb-5 flex justify-around'>
        <button
          onClick={() => setIsRRPPTable(true)}
          className="flex w-full justify-center p-2 bg-linear-to-r from-white from-[-50%] via-black  to-white border border-white/30  to-150% text-white rounded-3xl">
          RRPP
        </button>
        <button
          onClick={() => setIsRRPPTable(false)}
          className="flex justify-center w-full p-2 bg-linear-to-r from-white from-[-50%] via-black  to-white border border-white/30  to-150% text-white rounded-3xl">
          Seguridad
        </button>
      </div>
      <div className="bg-black/15  border border-black/30 shadow-md shadow-black rounded-2xl p-5 overflow-x-auto">
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
  )
}
