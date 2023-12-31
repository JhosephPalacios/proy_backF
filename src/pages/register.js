import Link from 'next/link'
import Head from 'next/head'

import { useState } from "react"


const Formulario = () => {
  var data
  //acordarme del useState
  //ESTADO para manejar validación de contraseñas
  const [isValid, setIsValid] = useState(true)

  const [state, setState] = useState(
    { nombres: "", apellidos: "", tipoDocumento: "", nroDocumento: "", correo: "", password: "", repetirPassword: "" }
  )

  function mngmtChange(e) {
    console.log(e.target.name, e.target.value)
    setState({ ...state, [e.target.name]: e.target.value })
  }

  async function mngmtSubmit(e) {
    e.preventDefault();

    //logica para manejar la validación de contraseña
    if (state.password !== state.repetirPassword) {
      setIsValid(false)
      alert('No coincide la contraseña');
      return;
    }
    setIsValid(true)
    let formData = new FormData();
    for (let [key, value] of Object.entries(state)) {
      formData.append(key, value)
    }
    //Una vez que se ha cargado el formData, se envia el formulario normalmente usando fetch (backend)...
    console.log(formData)

    // Redirigir a la página "/login" si las contraseñas coinciden
  if (e.nativeEvent.submitter.classList.contains('register-button')) {
    try {
      await doEscribir();
      alert("Se ha registrado correctamente");
      window.location.href = "/login";
    } catch (error) {
      console.error("Error al registrar el usuario:", error);
      alert("El correo electronico ya existe. Por favor, inténte con otro.");
    }
  }
  }

  async function doLeer(){
    const opciones = {
      method : 'GET',
      headers : {
        'Content-Type' : 'application/json'
      }
    }

    const peticion = await fetch( 'api/actualizarRegistros/leerUsuario', opciones)
    data = await peticion.json()
    console.log(data)
    return data
  }

  async function doEscribir(){

    const {
      nombres,
      apellidos,
      tipoDocumento,
      nroDocumento,
      correo,
      password,
      repetirPassword,
    } = state

    let data = await doLeer ()

 
    let nuevo = { 
      
      "nombres": nombres ,
      "apellidos": apellidos,
      "tipoDocumento":tipoDocumento,
      "nroDocumento":nroDocumento,
      "correo":correo,
      "password":password,
      "repetirPassword":repetirPassword,
    }

    data.push (nuevo)

    //Grabar usuario
    const opciones = {
      method : 'POST',
      body : JSON.stringify( data),
      headers : { 'Content-Type' : 'application/json' }
     
    }

    const peticion = await fetch( 'api/actualizarRegistros/escribirUsuario', opciones)
    data = await peticion.json()
    console.log(data)
  }

  


 
  return (
    <>
      <div className="title">Sistema de Reserva de Libros</div>
      <div className="subtitle">Registro de Usuario</div> {/* Movido debajo del título */}
      <div className="container">
        <form onSubmit={mngmtSubmit}>
          {/* Centrar todas las columnas y el botón horizontalmente */}
          <div className="center-container">
            {/* Primera columna con 4 elementos */}
            <div className="column">
              <div className="columna-subtitulo" >Datos personales</div>
              <div className="input-container" onSubmit={mngmtSubmit}>
                <label className="form-label" htmlFor="nombres">Nombres:</label>
                <input className="form-input" type="text" id="nombres" name="nombres" onChange={mngmtChange} value={state.nombres} required />
              </div>
              <div className="input-container" onSubmit={mngmtSubmit}>
                <label className="form-label" htmlFor="apellidos">Apellidos:</label>
                <input className="form-input" type="text" id="apellidos" name="apellidos" onChange={mngmtChange} value={state.apellidos} required />
              </div>
              <div className="input-container" onSubmit={mngmtSubmit}>
                <label className="form-label" htmlFor="tipoDocumento">Tipo de Documento:</label>
                <input className="form-input" type="text" id="tipoDocumento" name="tipoDocumento" onChange={mngmtChange} value={state.tipoDocumento} required />
              </div>
              <div className="input-container" onSubmit={mngmtSubmit}>
                <label className="form-label" htmlFor="nroDocumento">Nro de Documento:</label>
                <input className="form-input" type="text" id="nroDocumento" name="nroDocumento" onChange={mngmtChange} value={state.nroDocumento} required />
              </div>
            </div>

            {/* Segunda columna con 3 elementos y el botón */}
            <div className="column">
              <div className='columna-subtitulo' >Datos de la cuenta</div>
              <div className="input-container" onSubmit={mngmtSubmit}>
                <label className="form-label" htmlFor="correo">Correo Electrónico:</label>
                <input className="form-input" type="email" id="correo" name="correo" onChange={mngmtChange} value={state.correo} required />
              </div>
              <div className="input-container" onSubmit={mngmtSubmit}>
                <label className="form-label" htmlFor="password">Password:</label>
                <input className="form-input" type="password" id="password" name="password" onChange={mngmtChange} value={state.password} required />
              </div>
              <div className="input-container" onSubmit={mngmtSubmit}>
                <label className="form-label" htmlFor="repetirPassword">Repetir Password:</label>
                <input className="form-input" type="password" id="repetirPassword" name="repetirPassword" onChange={mngmtChange} value={state.repetirPassword} required />
              </div>
              <div className="button-container" onSubmit={mngmtSubmit}>
                <button className="register-button" >Registrar</button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}

export default Formulario
