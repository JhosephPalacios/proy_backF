import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link'
import Head from 'next/head'
import { useRouter } from 'next/router';
import Usuario from '/usuario.json';
import Admins from '/administradores.json';
import LibraryData from '/library.json';
import { json } from 'react-router-dom';


const AgregarNuevo = () => {
    const router = useRouter();
    const { usuario } = router.query;
    // Buscar el administrador por el usuario
    let administradorEncontrado = null;

    // Recorre el objeto de administradores usando forEach
    Object.keys(Admins).forEach(clave => {
        const admin = Admins[clave];
        if (admin.correo === usuario) {
            administradorEncontrado = admin;
        }
    });

    // Obtén el nombre del administrador
    let nombreDelAdministrador = administradorEncontrado ? administradorEncontrado.nombre : 'anonomous';
    let primernombre = "";  // Inicializamos primernombre como una cadena vacía

    // Verificamos si nombreDelAdministrador no es nulo o indefinido antes de procesarlo
    if (nombreDelAdministrador) {
        const nombreAdministradorArray = nombreDelAdministrador.split(' '); // Dividimos la cadena en palabras
        primernombre = nombreAdministradorArray[0]; // Obtenemos el primer elemento del array
    }

    //------------------------ GUARDADO DE LIBRO --------------------------
    const [libroNuevo, setLibroNuevo] = useState({
        titulo: '',
        autor: '',
        ISBN: '',
        serie: '',
        editorial: '',
    });
    const [flag, setFlag] = useState(false)
    const [datos, setDatos] = useState([])

    async function leer() {
        const opciones = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }
        const peticion = await fetch('/api/leer_library', opciones)
        let data = await peticion.json()
        console.log("Peticion_data:", JSON.stringify(data))
        setDatos(data)
    }
    async function escribir() {
     
        let data = datos

        const ISBNExistente = data.find((user) => user.ISBN === libroNuevo.ISBN);
        if (ISBNExistente) {
          return error;
        }
     
        data.push(libroNuevo)
        setDatos(data)
        const opciones = {
            method: 'POST',
            body: JSON.stringify(datos),
            headers: { 'Content-Type': 'application/json' }
        }

        
        const peticion = await fetch('/api/escribir_library', opciones)
        let rpta = await peticion.json()
        setFlag(true)
        console.log(rpta)
    }

    useEffect(() => {
        leer()
    }, [])//variable decision

    const completo = () => {
        // Ocultar la confirmación
        setFlag(false);
        // Restablecer los valores del libroNuevo
        setLibroNuevo({
            titulo: '',
            autor: '',
            ISBN: '',
            serieTipo: '',
        });

        // Redirigir a otra página
        router.push(`/blog/admin/${usuario}/paginaResultadosAdmin`);
    };

    async function exito() {
        try {
          
          const resultado = await escribir();
        setFlag(true)
          // Si todo va bien, puedes hacer algo con el resultado
          console.log(resultado);
        } catch (error) {
          // Aquí puedes manejar el error y mostrar un mensaje personalizado
          console.error('Ocurrió un error:', error.message);
          alert("Ya existe un libro con el mismo ISBN. Por favor, inténte con otro.");
        }
      }


    return (
        <Layout content={
            <>
                <div className="contenidoizquierda">
                    <div className="opciones">
                        <ul>
                            <li><Link href={`/blog/admin/${usuario}/paginaPrincipalAdmin`}>Inicio</Link></li>
                            <li><Link href={`/blog/admin/${usuario}/paginaPerfilAdmin`}>Perfil</Link></li>
                            <li><Link href={`/blog/admin/${usuario}/paginaResultadosAdmin`}>Bibliotecas</Link></li>
                        </ul>
                    </div>
                    <p className="version">Biblio v1.0.1-Alpha</p>
                </div>
                <div className="seccion-titulo">
                    <h2>Hola, {primernombre}!</h2>
                </div>
                <div className="linea"></div>
                <div className="seccion-perfil">
                    <div className="imagen-admin">
                        <img
                            src="/Rectangle 5.png"
                            alt="Imagen del administrador"
                            id="imagenAdmin"
                            style={{
                                maxWidth: '100%', //ancho máximo de la imagen
                                maxHeight: '300px', //altura máxima de la imagen
                            }}
                        />
                    </div>
                    <div className="opciones2">
                        <div className="opciones-superior">
                            <div className='opciones-3'>
                                INSERTAR NUEVO LIBRO
                            </div>
                        </div>
                        <div className="opciones-contenido">
                            <div className="column-2">
                                <div className="input-container-2" >
                                    <label className="form-label-2" htmlFor="titulo">TÍTULO</label>
                                    <input
                                        className="form-input-2"
                                        type="text"
                                        id="titulo"
                                        name="titulo"
                                        required
                                        onChange={(e) => setLibroNuevo({ ...libroNuevo, titulo: e.target.value })}
                                    />
                                </div>
                                <div className="input-container-2" >
                                    <label className="form-label-2" htmlFor="autor">Autor, autores</label>
                                    <input
                                        className="form-input-2"
                                        type="text"
                                        id="autor"
                                        name="autor"
                                        required
                                        onChange={(e) => setLibroNuevo({ ...libroNuevo, autor: e.target.value })}
                                    />
                                </div>
                                <div className="input-container-2" >
                                    <label className="form-label-2" htmlFor="isbn">ISBN</label>
                                    <input
                                        className="form-input-2"
                                        type="text"
                                        id="isbn"
                                        name="isbn"
                                        required
                                        onChange={(e) => setLibroNuevo({ ...libroNuevo, ISBN: e.target.value })}
                                    />
                                </div>
                                <div className="input-container-2" >
                                    <label className="form-label-2" htmlFor="serie">Serie, tipo</label>
                                    <input
                                        className="form-input-2"
                                        type="text"
                                        id="serie"
                                        name="serie"
                                        required
                                        onChange={(e) => setLibroNuevo({ ...libroNuevo, serie: e.target.value })}
                                    />
                                </div>
                                <div className="button-container-2" >
                                    <button className="register-button-2" onClick={exito} disabled= {!(libroNuevo.titulo && libroNuevo.autor && libroNuevo.ISBN && libroNuevo.serie)} >Guardar</button>
                                </div>
                            </div>
                        </div>

                        {/* Sección de confirmación */}
                            
                        {flag && (
            <div className="confirmacion-fondo">
                <div className="confirmacion">
                    <h2>Registro completo</h2>
                    <h3>El recurso ha sido grabado con éxito</h3>
                    <button onClick={completo}>OK</button>
                </div>
            </div>
            
        )}
                    </div>

                </div>


            </>
        }></Layout>
    )

}
export default AgregarNuevo;