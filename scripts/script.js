// -------------------------- Global Variables --------------------------
let API_quizzes_list = [];
let my_quizzes_list = [];
let selected_quiz_index;
let my_quizzes_counter = 0;

let DOM_page_content = document.querySelector('.page_content');
let DOM_API_quizzes_gallery;


// -------------------------- Functions --------------------------


function render_API_quizzes(object){
    API_quizzes_list = object.data;
    console.log('API_quizzes_list');
    console.log(API_quizzes_list);

    DOM_API_quizzes_gallery = document.querySelector('.quiz_gallery');
    
    for(let i = 0; i < API_quizzes_list.length; i++){
        DOM_API_quizzes_gallery.innerHTML += `
                    <div class="quiz" onclick="click_quiz('API_quizzes', ${i})">
                        <div class="quiz_image">
                            <img src="${API_quizzes_list[i].image}">
                        </div>
                        <h1>${API_quizzes_list[i].title}</h1>
                    </div>`
    }
}


function get_API_quizzes(){
    const promise = axios.get("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes");
    promise.then(render_API_quizzes);
}


function load_tela_1() {
    const tela_1_div = `<div class="tela_1">
                            <section class="empty_quiz_container">
                                <h1>Você não criou nenhum quizz ainda :(</h1>
                                <button onclick="add_quiz()">Criar Quizz</button>
                            </section>
                            <section class="quiz_container hidden" id="my_quizzes_container">
                                <div class="my_quizzes_header">
                                    <p>Seus Quizzes</p>
                                    <ion-icon name="add-circle" class="add_quiz_small_button" onclick="add_quiz()"></ion-icon>
                                </div>
                                <div class="my_quiz_gallery">
                                    <div class="quiz">
                                        <div class="quiz_image">
                                            <img src="imgs/harry_potter.png" alt="harry_potter picture">
                                        </div>
                                        <h1>O quão Potterhead é você?</h1>
                                    </div>
                                </div>
                            </section>
                            <section class="quiz_container" id="API_quizzes_container">
                                <h1>Todos os Quizzes</h1>
                                <div class="quiz_gallery">

                                </div>
                            </section>
                        </div>`;
    DOM_page_content.innerHTML = tela_1_div;
    get_API_quizzes();
    render_my_quizzes();
}

function load_tela_2() {
    const tela_2_div = `<div class="tela_2">
                            <div class="quiz_title">
                                
                            </div>
                            <div class="questions_container">
                                
                            </div>
                            <div class="quiz_result">

                            </div>
                            <button class="reset_quiz">
                                Reiniciar Quizz
                            </button>
                            <button class="back_home">
                                Voltar para home
                            </button>
                        </div>`;
    DOM_page_content.innerHTML = tela_2_div;
}


// quiz_container_name == 'API_quizzes', 'my_quizzes'
function click_quiz(quiz_container_name, index){
    selected_quiz_index = index;
    load_tela_2();
    render_quiz_tela2(quiz_container_name, index);
}

function render_quiz_tela2(quiz_container_name, index){
    window.scroll({top: 0, left: 0, behavior: 'auto' });

    let quiz_array;
    if (quiz_container_name=='API_quizzes'){
        quiz_array = API_quizzes_list;
    }
    else if(quiz_container_name=='my_quizzes'){
        quiz_array = my_quizzes_list;
    }

    // Fill quiz_title
    document.querySelector('.quiz_title').innerHTML += `<div class="quiz_title_image">
                                                            <img src="${quiz_array[index].image}">
                                                        </div>
                                                        <h1>${quiz_array[index].title}</h1>
                                                        `;
    
    let questions_container = document.querySelector('.questions_container');
    let answers;
    let questions = quiz_array[index].questions;

    // Fill questions_container
    for(let i = 0; i < questions.length; i++){
        questions_container.innerHTML += `
                        <div class="question">
                            <div class="question_title" style="background-color:${questions[i].color};">
                                <h1>${questions[i].title}</h1>
                            </div>
                            <div class="question_alternatives">

                            </div>
                        </div>`;
        answers = questions_container.lastChild.querySelector('.question_alternatives');

        // Fill question_alternatives
        for(let j = 0; j < questions[i].answers.length; j++){
            answers.innerHTML += `
                                <div class="alternative">
                                    <img src="${questions[i].answers[j].image}">
                                    <h2>${questions[i].answers[j].text}</h2>
                                </div>`;     
        }
    }
}




function render_my_quizzes(){
    if(my_quizzes_counter > 0){
        document.querySelector(".empty_quiz_container").classList.add("hidden");
        document.querySelectorAll(".quiz_container")[0].classList.remove("hidden");
    }
    else{
        document.querySelector(".empty_quiz_container").classList.remove("hidden");
        document.querySelectorAll(".quiz_container")[0].classList.add("hidden");
    }
}




function add_quiz(){
    document.querySelector(".tela_1").classList.add("hidden");
    document.querySelector(".tela_3").classList.remove("hidden");
}










// -------------------------- Main --------------------------
load_tela_1();




