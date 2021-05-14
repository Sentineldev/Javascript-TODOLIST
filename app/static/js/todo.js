const contenedor = document.getElementById('todos')
let todos_template = []
let todos = JSON.parse(localStorage.getItem('todos')) || []
const info = document.getElementById('buscar')
const btn_voz = document.querySelector('.voice')
const reconocimientoVoz = window.SpeechRecognition || window.webkitSpeechRecognition
const reconocimiento = new reconocimientoVoz()


function buscar_todos(titulo){
    todos.forEach((todo,indice)=>{
        if(todo.titulo.toLowerCase() === titulo.toLowerCase()){
            if(todo.estado === true){
                const todo_template = '<div class="todo" style="border-color:rgb(21,255,0);" >'+'<h1 style="color:rgb(21,255,0);">'+todo.titulo+'</h1>'+'<p>'+todo.descripcion+'</p>'+'<button class="eliminar">Eliminar</button>'+'<button class="editar">Editar</button>'+'<button class="completado">Completado</button>'+'</div>'
                contenedor.innerHTML = todo_template
            }
            else{
                const todo_template = '<div class="todo" style="border-color:red;" >'+'<h1 style="red;">'+todo.titulo+'</h1>'+'<p>'+todo.descripcion+'</p>'+'<button class="eliminar">Eliminar</button>'+'<button class="editar">Editar</button>'+'<button class="completado">Completado</button>'+'</div>'
                contenedor.innerHTML = todo_template
            }
            eliminar_todo()
            editar_todo()
            completar_todo()
            
        }
    })
}

function buscar(event){
    if(event.key === 'Enter'){
        buscar_todos(info.value)
    }
    else{
        render()
    }
}

function render(){
    const todos_template = todos.map(todo =>{
        if(todo.estado === true){
            return '<div class="todo" style="border-color:rgb(21,255,0);" >'+'<h1 style="color:rgb(21,255,0);">'+todo.titulo+'</h1>'+'<p>'+todo.descripcion+'</p>'+'<button class="eliminar">Eliminar</button>'+'<button class="editar">Editar</button>'+'<button class="completado">Completado</button>'+'</div>'
        
        }
        else{
            return '<div class="todo" style="border-color:red;" >'+'<h1 style="red;">'+todo.titulo+'</h1>'+'<p>'+todo.descripcion+'</p>'+'<button class="eliminar">Eliminar</button>'+'<button class="editar">Editar</button>'+'<button class="completado">Completado</button>'+'</div>'
        }
    })
    contenedor.innerHTML = todos_template.join('')
    eliminar_todo()
    editar_todo()
    completar_todo()
    actualizar_todos()
}


function editar_todo(){
    const editar = document.querySelectorAll('.todo .editar')
    editar.forEach((elemento,indice)=>{
        elemento.addEventListener('click',()=>{
            console.log(indice)
            todos[indice].titulo = prompt('Indique nuevo titulo')
            todos[indice].descripcion = prompt('Indique nueva descripcion')
            render()
        })
    })
}


function completar_todo(){
    const completado = document.querySelectorAll('.todo .completado')
    completado.forEach((elemento,indice)=>{
        elemento.addEventListener('click',()=>{
            if(todos[indice].estado !== true){
                todos[indice].estado = true
                render()
            }
            else{
                todos[indice].estado = false
                render()
            }
        })
    })
}

function eliminar_todo(){
    const divs = document.querySelectorAll('.todo .eliminar')
    for(let i = 0;i<divs.length;i++){
        divs[i].addEventListener('click',()=>{
            todos.splice(i,1)
            render()
        })
    }
}


function crear_todo(){
    const titulo = document.getElementById('titulo')
    const descripcion = document.getElementById('descripcion')
    todo = {
        titulo:titulo.value,
        descripcion:descripcion.value,
        estado:false
    }
    todos.push(todo)
    render()
    titulo.value = ""
    descripcion.value = ""
}

function actualizar_todos(){
    const todos_json = JSON.stringify(todos)
    localStorage.setItem('todos',todos_json)
}


function comando(comando){
    const voz = new SpeechSynthesisUtterance()
    voz.lang = 'es-419'
    if(comando.includes('crear')){
        const titulo = 'Titulo'
        const descripcion = 'Descripcion'
        todo = {
        titulo:titulo,
        descripcion:descripcion,
        estado:false
        }
        todos.push(todo)
        render()
    }
    else if(comando.includes('samuel')){
        voz.text = 'No metan discretas en segundo semestre gente'
        window.speechSynthesis.speak(voz)
    }
    else if(comando.includes('discreta') || comando.includes('discretas')){
        voz.text = 'Porque metiste discretas en segundo semestre?. Estas loco amigo'
        window.speechSynthesis.speak(voz)
    }
    else{
        voz.text = 'Hola'
        window.speechSynthesis.speak(voz)
    }

}
reconocimiento.onstart = ()=>{
    console.log('Estamos grabando...')
}
reconocimiento.onresult = (e) =>{
    let mensaje = e.results[0][0].transcript
    console.log(mensaje)
    comando(mensaje.toLowerCase())

}
btn_voz.addEventListener('click',()=>{
    alert("Di 'crear' para generar un pendiente")
    reconocimiento.lang = 'es-419'
    reconocimiento.start()
})

window.onload = () =>{
    render()
    const form = document.getElementById('form')
    form.onsubmit = (evento) =>{
        evento.preventDefault()
        crear_todo()
    }
}