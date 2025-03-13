import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import { loginUser } from '../../services/authService/authService';

export default function Login({ setUser }) {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    const login = {
      username: "FonsecaMelina",
      password: "40297838"
    }

    const user = {
      username: e.target.username.value,
      password: e.target.password.value
    }

    try {
      const data = await loginUser(login)
      localStorage.setItem('token', data.authToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user)
      navigate('/')
    } catch (error) {
      alert("Error al intentar iniciar sesión: " + error)
    }
    finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className='flex flex-col items-center justify-center px-5 mt-10'> 
        <div className='flex flex-col border bg-black/15 border-black/30 shadow-md shadow-black rounded-2xl p-5 text-white h-96 w-full max-w-sm justify-center mx-auto'>
          <h1 className="text-4xl xl:text-5xl font-bold text-center font-abril-fatface">Inicia Sesión</h1>
          <form className="flex flex-col gap-3 justify-evenly h-2/3" onSubmit={handleSubmit}>
            <div className='text-left'>
              <input
                id='username'
                type="text"
                placeholder="Usuario"
                className="p-2 border-2 bg-transparent autofill:bg-transparent border-white rounded-3xl w-full text-white"
                autoComplete='username'
                //required
                //pattern="[a-zA-Z0-9_.\-]{3,16}"
              />
            </div>
            <div className='text-left'>
              <input
                id='password'
                type="password"
                placeholder="Contraseña"
                className="p-2 bg-transparent autofill:bg-transparent border-2 border-white rounded-3xl w-full"
                autoComplete='current-password'
                //required
              //pattern='(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z0-9]{8,}'
              />
            </div>
            <button
              type="submit"
              className="flex justify-center p-2 bg-linear-to-r from-white from-[-50%] via-black  to-white border border-white/30  to-150% text-white rounded-3xl"
            >
              {
                isLoading ? <span className='loader'></span> : <span>Ingresar</span>
              }
            </button>
          </form>
        </div>
      </div>

    </>
  )
}
