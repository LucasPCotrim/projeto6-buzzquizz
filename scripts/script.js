let every_quiz_gallery = document.querySelector('.quiz_gallery');
let selected_quiz;
let counter_my_quizes = 1;
let perguntas_qtd;
let niveis_qtd;
// -------------------------- Global Variables --------------------------
let API_quizzes_list = [];
let my_quizzes_list = [];
let selected_quiz_index;
let current_quiz_container_name;
let current_quiz;
let user_answers_array = [];
const API_server = "https://mock-api.driven.com.br/api/v7/buzzquizz/quizzes"; //"https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes"


let DOM_page_content = document.querySelector('.page_content');
let DOM_API_quizzes_gallery;


// -------------------------- Functions --------------------------

//----------------------------------------------------------------------------------------
// Function: render_my_quizzes()
// Description: Renders user-created Quizzes (if there are none, renders 'empty_quiz_container')
//
// Inputs: none
//
// Outputs:
//----------------------------------------------------------------------------------------
function render_my_quizzes(){
    if(my_quizzes_list.length > 0){
        document.querySelector(".empty_quiz_container").classList.add("hidden");
        document.querySelectorAll(".quiz_container")[0].classList.remove("hidden");
    }
    else{
        document.querySelector(".empty_quiz_container").classList.remove("hidden");
        document.querySelectorAll(".quiz_container")[0].classList.add("hidden");
    }
}

//----------------------------------------------------------------------------------------
// Function: render_API_quizzes(object)
// Description: Callback function from GET request to 'API_server'.
//              Renders API Quizzes.
//
// Inputs:
// - object: Server response in case of successful GET request.
//
// Outputs: none;
//----------------------------------------------------------------------------------------
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

//----------------------------------------------------------------------------------------
// Function: get_API_quizzes()
// Description: Sends a GET request to 'API_server'.
//
// Inputs: none
//
// Outputs: none;
//----------------------------------------------------------------------------------------
function get_API_quizzes(){
    const promise = axios.get(API_server);
    promise.then(render_API_quizzes);
}

//----------------------------------------------------------------------------------------
// Function: load_tela_1()
// Description: Loads screen 1 with user-created and API Quizzes
//
// Inputs: none
//
// Outputs: none;
//----------------------------------------------------------------------------------------
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

//----------------------------------------------------------------------------------------
// Function: load_tela_2()
// Description: Loads screen 2 given selected Quizz
//
// Inputs: none
//
// Outputs: none;
//----------------------------------------------------------------------------------------
function load_tela_2() {
    const tela_2_div = `<div class="tela_2">
                            <div class="quiz_title">
                                
                            </div>
                            <div class="questions_container">
                                
                            </div>
                        </div>`;
    DOM_page_content.innerHTML = tela_2_div;
}

//----------------------------------------------------------------------------------------
// Function: click_quiz(quiz_container_name, index)
// Description: Function called whenever user clicks on a Quizz in screen 1.
//
// Inputs:
// - quiz_container_name ('API_quizzes' or 'my_quizzes'): Indicates whether selected Quizz
//                                                        is from the API Quizz container
//                                                        or from the user-created Quizz
//                                                        .container
// - index: Index of selected Quizz in the respective container.
//
// Outputs: none;
//----------------------------------------------------------------------------------------
function click_quiz(quiz_container_name, index){
    current_quiz_container_name = quiz_container_name;
    selected_quiz_index = index;
    load_tela_2();
    render_quiz_tela2(quiz_container_name, index);
    user_answers_array = [];
}

//----------------------------------------------------------------------------------------
// Function: render_quiz_tela2(quiz_container_name, index)
// Description: Renders selected Quizz in screen 2.
//
// Inputs:
// - quiz_container_name ('API_quizzes' or 'my_quizzes'): Indicates whether selected Quizz
//                                                        is from the API Quizz container
//                                                        or from the user-created Quizz
//                                                        .container
// - index: Index of selected Quizz in the respective container.
//
// Outputs: none;
//----------------------------------------------------------------------------------------
function render_quiz_tela2(quiz_container_name, index){
    window.scroll({top: 0, left: 0, behavior: 'auto' });

    let quiz_array;
    if (quiz_container_name=='API_quizzes'){
        quiz_array = API_quizzes_list;
    }
    else if(quiz_container_name=='my_quizzes'){
        quiz_array = my_quizzes_list;
    }
    current_quiz = quiz_array[index];

    // Fill quiz_title
    document.querySelector('.quiz_title').innerHTML += `<div class="quiz_title_image">
                                                            <img src="${current_quiz.image}">
                                                        </div>
                                                        <h1>${current_quiz.title}</h1>
                                                        `;
    
    let questions_container = document.querySelector('.questions_container');
    let answers;

    let questions = current_quiz.questions;
    // Fill questions_container
    for(let i = 0; i < questions.length; i++){
        questions_container.innerHTML += `
                        <div class="question hidden">
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
                                <div class="alternative" onclick="select_alternative(${i},${j})">
                                    <img src="${questions[i].answers[j].image}">
                                    <h2>${questions[i].answers[j].text}</h2>
                                </div>`;     
        }
    }
    questions_container.querySelector('.question').classList.remove('hidden');
    
}

//----------------------------------------------------------------------------------------
// Function: select_alternative(question_index, alternative_index)
// Description: Function called whenever user clicks on answer to a question in the Quizz
//              Performs style changes to answers and scrolls to next question or result.
//
// Inputs:
// - question_index: Question index in 'current_quiz'
// - alternative_index: Index of answer clicked
//
// Outputs: none;
//----------------------------------------------------------------------------------------
function select_alternative(question_index, alternative_index){

    // Check if user already entered an answer to this question
    for (let k = 0; k < user_answers_array.length; k++) {
        if(user_answers_array[k].question == question_index) return;
    }

    // Save user's chosen answer
    user_answers_array.push({
                            question: question_index,
                            chosen_alternative: alternative_index
                            });

    const questions_container = document.querySelector('.questions_container');
    const questions = questions_container.querySelectorAll('.question');
    const question = questions[question_index];
    const alternatives = question.querySelectorAll('.alternative');

    // Update styles of alternatives
    for (let i = 0; i < alternatives.length; i++) {
        alternatives[i].style.cursor = 'initial';
        if (i != alternative_index){
            alternatives[i].style.opacity = '0.3';
        }
        if (current_quiz.questions[question_index].answers[i].isCorrectAnswer){
            alternatives[i].querySelector('h2').style.color = '#009C22';
        }
        else {
            alternatives[i].querySelector('h2').style.color = '#FF0B0B';
        }
    }
    
    // There are still more unanswered questions
    if(user_answers_array.length < current_quiz.questions.length){
        const next_question = questions[question_index+1];
        setTimeout(() => {
            next_question.classList.remove('hidden');
            next_question.scrollIntoView({behavior: 'smooth'});
        }, 2000);
        
    }
    // User answered all questions
    else{
        setTimeout(() => {
            display_quiz_result();
            questions_container.querySelector('.quiz_result').scrollIntoView({behavior: 'smooth'});
        }, 2000);
    }
}

//----------------------------------------------------------------------------------------
// Function: calculate_user_score()
// Description: Calculates user score on current Quizz given answers chosen ('user_answers_array')
//
// Inputs: none
//
// Outputs:
// - score: Percentage score on current finished Quizz (Number with no decimal places)
//----------------------------------------------------------------------------------------
function calculate_user_score() {
    let q_i;
    let a_i;
    let cont_correct = 0;
    for (let i = 0; i < user_answers_array.length; i++) {
        q_i = user_answers_array[i].question;
        a_i = user_answers_array[i].chosen_alternative;

        if(current_quiz.questions[q_i].answers[a_i].isCorrectAnswer){
            cont_correct++;
        }
    }
    let score = Math.round(100*(cont_correct / user_answers_array.length));
    return score;
}


//----------------------------------------------------------------------------------------
// Function: display_quiz_result()
// Description: Renders 'quiz_result' div given user score
//
// Inputs: none
//
// Outputs:
//----------------------------------------------------------------------------------------
function display_quiz_result() {

    // Calculate user score
    let user_score = calculate_user_score();

    // Obtain user level given score
    let quiz_levels = Object.assign({},current_quiz).levels;
    quiz_levels.sort((a, b) => {
        return a.minValue - b.minValue;
    });
    let user_level_index = 0;
    for (let i = 0; i < quiz_levels.length; i++) {
        if(user_score >= quiz_levels[i].minValue) user_level_index=i;
    }
    
    // Display user level
    const questions_container = document.querySelector('.questions_container');
    questions_container.innerHTML += `
                                    <div class="quiz_result">
                                        <div class="title">
                                            <h1>${quiz_levels[user_level_index].title}</h1>
                                        </div>
                                        <div class="content">
                                            <img src="${quiz_levels[user_level_index].image}" alt="quiz result">
                                            <p>${quiz_levels[user_level_index].text}</p>
                                        </div>
                                    </div>
                                    <button class="reset_quiz" onclick="restart_current_quizz()">
                                        Reiniciar Quizz
                                    </button>
                                    <button class="back_home" onclick="go_to_homepage()">
                                        Voltar para home
                                    </button>
                                    `;
}


//----------------------------------------------------------------------------------------
// Function: restart_current_quizz()
// Description: Restarts current Quizz and scrolls back to top of the page
//
// Inputs: none
//
// Outputs:
//----------------------------------------------------------------------------------------
function restart_current_quizz() {
    load_tela_2();
    render_quiz_tela2(current_quiz_container_name, selected_quiz_index);
    user_answers_array = [];
}

//----------------------------------------------------------------------------------------
// Function: go_to_homepage()
// Description: Returns to homepage and lists all Quizzes again
//
// Inputs: none
//
// Outputs:
//----------------------------------------------------------------------------------------
function go_to_homepage() {
    API_quizzes_list = [];
    my_quizzes_list = [];
    selected_quiz_index = undefined;
    current_quiz_container_name = undefined;
    current_quiz = undefined;
    user_answers_array = [];

    load_tela_1();
}

//----------------------------------------------------------------------------------------
// Function: load_tela_3()
// Description: Loads screen 3 (Quizz creation screen)
//
// Inputs: none
//
// Outputs: none;
//----------------------------------------------------------------------------------------
function load_tela_3(){
    const tela_3_div = `<div class="tela_3">
                            <div class="tela_3a">
                                <h1>Comece pelo começo</h1>
                                <div class="form_container">
                                    <input type="text" class="text" placeholder="Título do seu quizz" required>
                                    <input type="url" class="url" placeholder="URL da imagem do seu quizz" required>
                                    <input type="number" class="qtd_perguntas" placeholder="Quantidade de perguntas do quizz" required>
                                    <input type="number" class="qtd_niveis" placeholder="Quantidade de níveis do quizz" required>
                                </div>
                                <button onclick="create_quiz()">Prosseguir para criar perguntas</button>
                            </div>
                            <div class="tela_3b">
                                
                            </div>
                            <div class="tela_3c hidden">
                                <h1>Agora decida os níveis</h1>
                                <div class="form_container">
                                    <div class="form_question">
                                        <h2>Nível 1</h2>
                                        <input type="text" placeholder="Título do nível" required>
                                        <input type="number" placeholder="% de acerto mínima" required>
                                        <input type="url" placeholder="URL da imagem do nível" required>
                                        <textarea name="Descrição" rows="10" placeholder="Descrição do nível" required></textarea>
                                    </div>
                                </div>
                                <div class="form_container">
                                    <div class="form_question">
                                        <h2>Nível 2</h2>
                                        <input type="text" placeholder="Título do nível" required>
                                        <input type="number" placeholder="% de acerto mínima" required>
                                        <input type="url" placeholder="URL da imagem do nível" required>
                                        <textarea name="Descrição" rows="10" placeholder="Descrição do nível" required></textarea>
                                    </div>
                                </div>
                                <div class="form_container">
                                    <div class="form_question">
                                        <h2>Nível 3</h2>
                                        <input type="text" placeholder="Título do nível" required>
                                        <input type="number" placeholder="% de acerto mínima" required>
                                        <input type="url" placeholder="URL da imagem do nível" required>
                                        <textarea name="Descrição" rows="10" placeholder="Descrição do nível" required></textarea>
                                    </div>
                                </div>
                                <button>Finalizar Quizz</button>
                            </div>
                            <div class="tela_3d hidden">
                                <h1>Seu quiz está pronto!</h1>
                                <div class="img_result">
                                    <div class="quiz_image">
                                        <img src="imgs/harry_potter.png">
                                    </div>
                                    <h3>O quão Potterhead é você?</h3>
                                </div>
                                <button class="reset_quiz">
                                    Reiniciar Quizz
                                </button>
                                <button class="back_home">
                                    Voltar para home
                                </button>
                            </div>
                        </div>`;
    DOM_page_content.innerHTML = tela_3_div;
}

//----------------------------------------------------------------------------------------
// Function: add_quiz()
// Description: Takes user to Quizz creation screen (tela 3)
//
// Inputs: none
//
// Outputs: none;
//----------------------------------------------------------------------------------------
function add_quiz(){
    load_tela_3()
}

//----------------------------------------------------------------------------------------
// Function: create_quiz()
// Description: Get user inputs for Quizz creation and checks if all inputs are valid.
//              Displays alerts in case any input is invalid.
//
// Inputs: none
//
// Outputs: none;
//----------------------------------------------------------------------------------------
function create_quiz(){
    let cont = 0;
    const text = document.querySelector(".text");
    const url = document.querySelector(".url");
    const qtd_perguntas = document.querySelector(".qtd_perguntas");
    const qtd_niveis = document.querySelector(".qtd_niveis");
    if(text.value.length >= 20 && qtd_perguntas.value >= 3 && qtd_niveis.value >= 2){
        try {
            let verifica = new URL(url.value)
            console.log("tudo ok")
            cont = 1;
            perguntas_qtd = qtd_perguntas.value;
            niveis_qtd = qtd_niveis.value;
          } catch(err) {
            text.value = "";
            url.value = "";
            qtd_niveis.value = "";
            qtd_perguntas.value = "";
            alert("insira as informações corretamente");
          }

    } else{
        text.value = "";
        url.value = "";
        qtd_niveis.value = "";
        qtd_perguntas.value = "";
        alert("insira as informações corretamente");
    }

    if(cont = 1){

        document.querySelector(".tela_3a").classList.add("hidden");
        document.querySelector(".tela_3b").classList.remove("hidden");
        let galery_ask = document.querySelector(".tela_3b");
        galery_ask.innerHTML += `<h1>Crie suas perguntas</h1>`
        
        for (let i = 0; i < qtd_perguntas.value; i++) {
           
            galery_ask.innerHTML += `
                    <div class="form_container">
                        <div class="form_question pergunta">
                            <h2>Pergunta ${i+1}</h2>
                            <input class"texto_pergunta${i}" type="text" placeholder="Texto da pergunta" required>
                            <input class"cor_fundo${i}" type="text" placeholder="Cor de fundo da pergunta" required>
                        </div>
                        <div class="form_question correto">
                            <h2>Resposta correta</h2>
                            <input class"texto_resposta_correta${i}" type="text" placeholder="Resposta correta" required>
                            <input class"url_resposta_certa${i}" type="text" placeholder="URL da imagem" required>
                        </div>
                        <div class="form_question incorreto${i}">
                            <h2>Respostas incorretas</h2>
                            
                        </div>
                    </div>`; 

            let incorreto = document.querySelector(`.incorreto${i}`);
            
            for(let j = 0; j < qtd_niveis.value; j++){
                console.log("testando o for");
                incorreto.innerHTML += `
                            <input class"texto_resposta_errada${i}" type="text" placeholder="Resposta incorreta ${j+1}" required>
                            <input class"url_resposta_errada${i}" type="text" placeholder="URL da imagem ${j+1}" required>`

            }
        
        }
        
        galery_ask.innerHTML += `<button onclick="create_ask()">Prosseguir para criar perguntas</button>`

    

    }

}

function create_ask(){
    let url_esta_certa;
    let tudo_ok;
    let tudo_ok2;
    for(let i =0; i < perguntas_qtd; i++){

        let texto_pergunta = document.querySelector(`.texto_pergunta${i}`).value;
        console.log(texto_pergunta)
        let texto_resposta = document.querySelector(`.texto_resposta${i}`).value;
        console.log(texto_resposta)
        let cor_fundo = document.querySelector(`.cor_fundo${i}`).value;
        console.log(cor_fundo)
        let url_resposta_certa = document.querySelector(`.url_resposta_certa${i}`).value;
        console.log(url_resposta_certa)

        try {
            let ver = new URL(url_resposta_certa)
            console.log("tudo ok")
            url_esta_certa = 1;
          } catch(err) {
            url_esta_certa = 0;
          }

        
        if(texto_pergunta.length >= 20 && texto_resposta != "" && cor_fundo[0] == "#" && cor_fundo.length == 7 && url_esta_certa == 1 ){
            tudo_ok = 1;
        }
        else {
            tudo_ok = 0;
        }

        for(let j = 0; j < niveis_qtd; j++){
            
            let url_resposta_errada = document.querySelector(`.url_resposta_errada${i}`).value;

            try {
                let veri = new URL(url_resposta_errada.value)
                console.log("tudo ok")
                url_esta_certa = 1;
              } catch(err) {
                url_esta_certa = 0;
              }

            if(url_esta_certa == 1){
                tudo_ok2 = 1;
            } else{
                tudo_ok2 == 0;
            }
        }
    }

    if( tudo_ok == 1 && tudo_ok2 == 1){
        alert("ok");
    } else{
        alert("insira as informações corretamente");
    }
}








// -------------------------- Main --------------------------
load_tela_1();





