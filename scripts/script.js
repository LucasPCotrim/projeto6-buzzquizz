let every_quiz_gallery = document.querySelector('.quiz_gallery');
get_server();

function get_server(){
    const promise = axios.get("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes");
    promise.then(reneder_quiz);
}

function click_quiz(quiz){
    console.log(quiz);
    document.querySelector(".tela_1").classList.add("hidden");
    document.querySelector(".tela_2").classList.remove("hidden");
}

function reneder_quiz(object){
    console.log(object.data);
    const array = object.data;
    console.log(array[1]);
    for(let i = 0; i < array.length; i++){
    every_quiz_gallery.innerHTML += `
                    <div class="quiz" onclick="click_quiz(${i})">
                        <div class="quiz_image">
                            <img src="${array[i].image}">
                        </div>
                        <h1>${array[i].title}</h1>
                    </div>`
}






}