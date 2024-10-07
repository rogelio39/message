import { useState } from "react";
import './index.css'
import AudioRecorder from "../AudioRecorder/AudioRecorder";
const Index = () => {

    const [firstResponse, setFirstResponse] = useState(null);
    const [count, setCount] = useState(0);
    const [view, setView] = useState(null)


    const updateFirstResponse = () => {
        setFirstResponse(true)
    }

    const incrementCount = () => {
        setCount(count + 1)
    }

    const viewImg = () => {
        setView(true)
    }
    return (
        <div className='container'>
            {
                !firstResponse ?
                    <div className='message-div'>
                        <h2>Me gustaria que sepas algo. (Dale al boton de siguiente para continuar)
                        </h2>
                        <button onClick={updateFirstResponse}>SIGUIENTE</button>
                    </div> :
                    <div className='container2'>
                        <h2>Esto quiero que lo tengas presente siempre</h2>


                        {

                            count < 1 &&
                            <>
                                <h3>Se que habra dias mas dificiles que otros</h3>
                            </>

                        }

                        {count <= 12 && !view &&

                            <div>
                                {
                                    count == 1 && <p>Dias donde quizas no nos entendamos mucho</p>
                                }
                                {
                                    count == 2 && <p>Momentos donde quizas nos enojemos el uno con el otro</p>
                                }
                                {
                                    count == 3 && <p>o hagamos cosas que nos hagan enojar entre nosotros</p>
                                }
                                {
                                    count == 4 && <p>y se que eso cuesta. Uno a veces quiere que todo sea perfecto, pero no siempre lo es, ni lo sera</p>
                                }
                                {
                                    count == 5 && <p>habra cosas en las que no estaremos de acuerdo</p>
                                }
                                {
                                    count == 6 &&
                                    <p>cosas que nos molestaran del otro</p>
                                }
                                {
                                    count == 7 && <p>caracteristicas de mi, o de ti, que no seran del todo agradables</p>
                                }
                                {
                                    count == 8 && <p>pero eso forma parte de la vida y las relaciones</p>
                                }
                                {
                                    count == 9 && <p>pero lo que siento por ti, en la totalidad de lo que eres</p>
                                }
                                {
                                    count == 10 && <p>lo que me pasa cuando te tengo cerca, no lo vivi jamas con nadie.</p>
                                }
                                {
                                    count == 11 && <p>asi que ten presente siempre, siempre, que te voy a amar con todo lo que soy, jamas lo olvides</p>
                                }
                                {
                                    count == 12 && <p>Si yo te digo, after all this time?, que me dirias?</p>
                                }

                            </div>

                        }

                        {
                            count == 12 && !view && <button className='next' onClick={viewImg}>ve abajo y dale al boton de start recording (asi en ingles porque somos internationals) cuando termines dale a stop recording y luego dale al boton de enviar</button>
                        }
                        {
                            count < 13 && !view && <button className='next' onClick={incrementCount}>SIGUIENTE</button>
                        }

                        {
                            view &&
                            <div className='img-container'>
                                <p>De tu cadera a tus pies quiero hacer un largo viaje.
                                    Soy más pequeño que un insecto.
                                    Voy por estos colinas, son de color de avena,
                                    y tienen formaciones duras como el áspero vestigio
                                    de un planeta.</p>
                                <button>y no representa ni un 1% de todo lo que tu cuerpo representa para mi</button>
                                <p>Hoy esta cancion sonaba en mi cabeza mientras te veia dormir (antes que te enojaste y me dijiste que no te hable en la mañana jajajaj)</p>

                                <iframe width="560" height="315" src="https://www.youtube.com/embed/q8Tc24s9O00?si=u2uHJVRZ3_bvrnUf" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>


                            </div>

                        }
                    </div>
            }
            <AudioRecorder/>
        </div>
    )
}

export default Index
