
//contenedor para renderizar los todos
const contenedor = document.getElementById('todos')


//Funcion para la busqueda de un todo
function buscar_todo_titulo(titulo,todos){
    let todos_return = []
    todos.forEach((elemento,indice)=>{
        if(elemento.titulo.toLowerCase().includes(titulo.toLowerCase())){
            todos_return.push(elemento)
        }
    })
    return todos_return
}
//FUncion para buscar y listar los todos con un titulo especifico
async function buscar_todo(titulo){
    let todos = await listar_todos()
    const todos_busqueda = buscar_todo_titulo(titulo,todos)
    const todos_template = todos_busqueda.map(todo =>{
        if(todo.completado === 0){
            return '<div class="todo" style="border-color:red;" >'+'<h1 style="red;">'+todo.titulo+'</h1>'+'<pre>'+todo.descripcion+'</pre>'+'<button class="eliminar">Eliminar</button>'+'<button class="editar">Editar</button>'+'<button class="completado">Completado</button>'+'</div>'
        }
        else{
            return '<div class="todo" style="border-color:rgb(21,255,0);" >'+'<h1 style="color:rgb(21,255,0);">'+todo.titulo+'</h1>'+'<pre>'+todo.descripcion+'</pre>'+'<button class="eliminar">Eliminar</button>'+'<button class="editar">Editar</button>'+'<button class="completado">Completado</button>'+'</div>'
        }
    })
    contenedor.innerHTML = todos_template.join('')
    eliminar_todo(todos_busqueda)
    completar_todo(todos_busqueda)
    editar_todo_evento(todos_busqueda)
}

function buscar(evento){
    const buscar_input = document.getElementById('buscar')
    if(evento.key === "Enter"){
        buscar_todo(buscar_input.value)
    }
}
//Funcion para modificar los campos del todo
function editar_todo(indice,todos){
    const mod_titulo = document.getElementById('mod-titulo')
    mod_titulo.value = todos[indice].titulo
    const mod_descripcion = document.getElementById('mod-descripcion')
    mod_descripcion.value = todos[indice].descripcion
    const btn_modificar = document.getElementById('modificar')
    btn_modificar.addEventListener('click',async ()=>{
        const model = document.getElementById('model')
        model.style.display = 'none'
        let url = window.origin+'/modificar_todo'
        let todo = todos[indice]
        todo.titulo = mod_titulo.value
        todo.descripcion = mod_descripcion.value
        let data = await fetch(url,{
            method: 'PUT',
            credentials: 'include',
            cache: 'no-cache',
            body: JSON.stringify(todo),
            headers: new Headers({
                'content-type':'application/json'
            })
        })
        render()
    })
}
//Funcion para añadir el evento modificar al todo
function editar_todo_evento(todos){
    const boton_editar = document.querySelectorAll('.todo .editar')
    boton_editar.forEach((elemento,indice)=>{
        elemento.addEventListener('click',()=>{
            editar_todo(indice,todos)
            const model = document.getElementById('model')
            model.style.display = 'block'
        })
    })
}
//Funcion  para eliminar un todo
function eliminar_todo(todos){
    let url = window.origin+'/delete_todo'
    const boton_eliminar = document.querySelectorAll('.todo .eliminar')
    boton_eliminar.forEach((elemento,indice)=>{
        elemento.addEventListener('click',async ()=>{
            let url = window.origin+'/delete_todo'+'/'+todos[indice].id
            let data = await fetch(url,{
                method: 'DELETE',
                credentials: 'include',
                cache: 'no-cache',
                headers: new Headers({
                    'content-type':'application/json'
                })
            })
            render()
        })
    })
}
//Funcionar para actualizar el estado del todo
function completar_todo(todos){
    const boton_completar = document.querySelectorAll('.todo .completado')
    boton_completar.forEach(async (elemento,indice)=>{
        elemento.addEventListener('click', async ()=>{
            let url = window.origin+'/update_todo_completado'
            if(todos[indice].completado === 0){
                todos[indice].completado = true
            }
            else{
                todos[indice].completado = false
            }
            let todo_data = {
                completado:todos[indice].completado,
                id:todos[indice].id
            }
            let data = await fetch(url,{
                method:'PATCH',
                credentials:'include',
                cache:'no-cache',
                body: JSON.stringify(todo_data),
                headers: new Headers({
                    'content-type':'application/json'
                })
            })
            render()
        })
    })
}

//Funcion para renderizar los todos.
async function render(){
    let todos = await listar_todos()
    const todos_template = todos.map(todo =>{
        if(todo.completado === 0){
            return '<div class="todo" style="border-color:red;" >'+'<h1 style="red;">'+todo.titulo+'</h1>'+'<pre>'+todo.descripcion+'</pre>'+'<button class="eliminar">Eliminar</button>'+'<button class="editar">Editar</button>'+'<button class="completado">Completado</button>'+'</div>'
        }
        else{
            return '<div class="todo" style="border-color:rgb(21,255,0);" >'+'<h1 style="color:rgb(21,255,0);">'+todo.titulo+'</h1>'+'<pre>'+todo.descripcion+'</pre>'+'<button class="eliminar">Eliminar</button>'+'<button class="editar">Editar</button>'+'<button class="completado">Completado</button>'+'</div>'
        }
    })
    contenedor.innerHTML = todos_template.join('')
    eliminar_todo(todos)
    completar_todo(todos)
    editar_todo_evento(todos)
}
//Listar todos los todos del perfil que inicio sesion
async function listar_todos(){
    const url = window.origin+'/get_todos'
    let todos = []
    let data = await fetch(url,{
        method:'GET',
        credentials: 'include',
        cache: 'no-cache',
        headers: new Headers({
            'content-type':'application/json'
        })
    })
    todos = await data.json()
    return todos
}


//AJAX para generar el todo y luego ser renderizado
async function crear_todo(){
    const url = window.origin+'/create_todo'
    const titulo = document.getElementById('todo-titulo')
    const descripcion = document.getElementById('descripcion')
    const data = {
        titulo: titulo.value,
        descripcion: descripcion.value
    }
    let send_data = await fetch(url,{
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(data),
        cache: 'no-cache',
        headers: new Headers({
            'content-type':'application/json'
        })
    })
    send_data = await send_data.json()
    render()
}
//Renderizar los todos al cargar la pagina
window.onload = () =>{
    render()
    const form = document.getElementById('form')
    form.onsubmit = (e) =>{
        e.preventDefault()
        crear_todo()
    }
}