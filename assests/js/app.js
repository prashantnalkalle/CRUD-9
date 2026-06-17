const spinner = document.getElementById('spinner')
const cl = console.log;
const commentForm = document.getElementById('commentForm')
const name = document.getElementById('name')
const email = document.getElementById('email')
const body = document.getElementById('body')
const userId = document.getElementById('userId')
const Addcomment = document.getElementById('Addcomment')
const Updatecomment = document.getElementById('Updatecomment')
const commentcontainer = document.getElementById('commentcontainer')


let commentArr =[]

let Base_Url = `https://jsonplaceholder.typicode.com/comments`


function snackbar(msg,icon){
    swal.fire({
        title : msg,
        icon : icon,
        timer : 2000
    })
}

function fetchcomments(){
    spinner.classList.remove('d-none')
    let xhr = new XMLHttpRequest()
    xhr.open('GET',Base_Url)
    xhr.send(null)
    xhr.onload = function (){
        if(xhr.status >= 200 && xhr.status <= 299){
            commentArr = JSON.parse(xhr.response)

            commentCards(commentArr.reverse())
            $(function () {
                $('[data-toggle="tooltip"]').tooltip()
            })
        }else{
            snackbar(xhr)
        }
     spinner.classList.add('d-none')
    }
}
fetchcomments()

function commentCards(arr){
    let result =``
    arr.forEach(ele => {
        result+=`<div class="col-md-4  my-4" id=${ele.id}>
					<div class="card h-100">
						<div class="card-header bg-primary" data-toggle="tooltip" data-placement="top" title="${ele.name}">
							<h2>${ele.name}</h2>
							 <h3>Email : ${ele.email}</h3>
						</div>
						<div class="card-body">
							<p>${ele.body}</p>
						</div>
						<div class="card-footer d-flex justify-content-between">
							<button class="btn btn-sm btn-success " onclick="Onedit(this)">Edit</button>
							<button class="btn btn-sm btn-danger " onclick="Onremove(this)">Remove</button>
						</div>
					</div>
				</div>`
    });
    commentcontainer.innerHTML =result;
}

function onsubmitHandalar (ele){
    spinner.classList.remove('d-none')
    ele.preventDefault();
    let newobj ={
        name : name.value,
        email: email.value,
        body : body.value,
        postId : userId.value
    }
    let xhr = new XMLHttpRequest()
    xhr.open('POST',Base_Url)
    xhr.send(JSON.stringify(newobj))
    xhr.onload = function (){
        if(xhr.status >= 200 && xhr.status <= 299){
            let res  = JSON.parse(xhr.response)
            cratenewcard(newobj,res)
            $(function () {
                $('[data-toggle="tooltip"]').tooltip()
            })   
        }else{
            snackbar(xhr)
        }
     spinner.classList.add('d-none')
    }
}

function cratenewcard(newobj,res){
    let div = document.createElement('div')
    div.className = `col-md-4 offset-md-1 my-4`
    div.id = res.id

    div.innerHTML =`<div class="card h-100">
						<div class="card-header bg-primary" data-toggle="tooltip" data-placement="top" title="${newobj.name}">
							<h2>${newobj.name}</h2>
							<h3>${newobj.email}</h3>
						</div>
						<div class="card-body">
							<p>${newobj.body}</p>
						</div>
						<div class="card-footer d-flex justify-content-between">
							<button class="btn btn-sm btn-success " onclick="Onedit(this)">Edit</button>
							<button class="btn btn-sm btn-danger " onclick="Onremove(this)">Remove</button>
						</div>
					</div>`
    commentcontainer.prepend(div)
    commentForm.reset()
    snackbar(`The New Comment Id ${res.id} is Added Successfully`,'success')
}

function Onedit(ele){
    spinner.classList.remove('d-none')
    let editId = ele.closest('.col-md-4').id
    localStorage.setItem('EditId',editId)
    let editUrl = `${Base_Url}/${editId}`
    let xhr = new XMLHttpRequest()
    xhr.open('GET',editUrl)
    xhr.send(null); 
    xhr.onload = function(){
        if(xhr.status >= 200 && xhr.status <= 299){
            let editObj = JSON.parse(xhr.response)
            name.value = editObj.name
            email.value = editObj.email
            body.value = editObj.body
            userId.value = editObj.postId

            Addcomment.classList.add('d-none')
            Updatecomment.classList.remove('d-none')
            commentForm.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }else{
            snackbar(xhr)
        }
      spinner.classList.add('d-none')
    }
}

function onupdatehandl(){
    spinner.classList.remove('d-none')
    let updateId = localStorage.getItem('EditId')
    let updateObj ={
        name : name.value,
        email: email.value,
        body : body.value,
        postId : userId.value,
        id : updateId
    }
    let updateUrl = `${Base_Url}/${updateId}`
    let xhr = new XMLHttpRequest()
    xhr.open('PUT',updateUrl)
    xhr.send(JSON.stringify(updateObj))
    xhr.onload = function (){
        if(xhr.status >= 200 && xhr.status <= 299){
            let div = document.getElementById(updateId)
            let h2 = div.querySelector('.card-header h2')
            h2.innerText = updateObj.name
            let h3 = div.querySelector('.card-header h3')
            h3.innerText = updateObj.email
            let p = div.querySelector('.card-body p')
            p.innerText = updateObj.body
            snackbar(`The Comment Id ${updateId} is Updated Successfully!! `,'success')
            commentForm.reset();
            Addcomment.classList.remove('d-none')
            Updatecomment.classList.add('d-none')
            div.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
            div.classList.add('highlight');
            setTimeout(() => {
                div.classList.remove('highlight');
            }, 4000);
        }else{
            snackbar(xhr)
        }
        spinner.classList.add('d-none')
    }
}

function Onremove(ele){
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
        }).then((result) => {
        if (result.isConfirmed) {
            spinner.classList.remove('d-none')
            let removeId = ele.closest('.col-md-4').id
            let removeUrl = `${Base_Url}/${removeId}`
            let xhr = new XMLHttpRequest()
            xhr.open('DELETE',removeUrl)
            xhr.send(null)
            xhr.onload = function (){
                if(xhr.status >= 200 && xhr.status <= 299){
                    ele.closest('.col-md-4').remove()
                    snackbar(`The Comment Id ${removeId} is Removed Successfully!!`,'success')
                }else{
                    snackbar(xhr)
                }
                spinner.classList.add('d-none')
            }
        }
    });
}

commentForm.addEventListener("submit", onsubmitHandalar)
Updatecomment.addEventListener('click',onupdatehandl)