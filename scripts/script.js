let every_quiz_gallery = document.querySelector('.quiz_gallery');
let selected_quiz;
get_server();

function get_server(){
    const promise = axios.get("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes");
    promise.then(reneder_quiz);
}


function reneder_quiz(object){
    
    const array = object.data;
    
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
function click_quiz(indice){
    selected_quiz = indice;
    document.querySelector(".tela_1").classList.add("hidden");
    document.querySelector(".tela_2").classList.remove("hidden");
    const promise = axios.get("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes");
    promise.then(reneder_quiz_tela2);
}

function reneder_quiz_tela2(object){
    const array = object.data;
    let quiz_header = document.querySelector('.quiz_title');
    quiz_header.innerHTML += `
                <div class="quiz_title_image">
                    <img src="${array[selected_quiz].image}" alt="">
                </div>
                <h1>${array[selected_quiz].title}</h1>`;
    
    let questions_container = document.querySelector('.questions_container');
    let answers;
    console.log(array[selected_quiz].questions.length)
    let questions = array[selected_quiz].questions;
    for(let i = 0; i < questions.length; i++){
        console.log(i);
        questions_container.innerHTML += `
                <div class="question">
                    <div class="question_title">
                        <h1>${questions[i].title}</h1>
                    </div>
                    <div class="question_alternatives qs${i}">

                    </div>
                </div>`;

                answers = document.querySelector(`.qs${i}`);

                for(let j = 0; j < questions[i].answers.length; j++){
                    console.log(questions[i].answers.length)
                    answers.innerHTML += `
                            <div class="alternative">
                                <img src="${questions[i].answers[j].image}">
                                <h2>${questions[i].answers[j].text}</h2>
                            </div>`
                            
                }

    }
    
}

