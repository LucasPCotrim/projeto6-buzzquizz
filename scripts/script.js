// -------------------------- Global Variables --------------------------
let API_quizzes_list = [];
let selected_quiz_index;
let current_quiz;
let user_answers_array = [];
let current_user_created_quiz;
const API_server = "https://mock-api.driven.com.br/api/vs/buzzquizz/quizzes";

let DOM_page_content = document.querySelector('.page_content');


// -------------------------- Functions --------------------------

//----------------------------------------------------------------------------------------
// Function: is_user_created_quizz(quizz)
// Description: Checks if quizz is created by user
//
// Inputs:
// - quizz: Quizz object received from API server.
//
// Outputs: true or false;
//----------------------------------------------------------------------------------------
function is_user_created_quizz(quizz){
    if(localStorage.getItem(`${quizz.id}`) != null) return true;
        
    return false;
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

    const DOM_my_quizzes_gallery = document.querySelector('.my_quiz_gallery');
    const DOM_API_quizzes_gallery = document.querySelector('.quiz_gallery');

    let no_user_quizzes = true;
    
    for(let i = 0; i < API_quizzes_list.length; i++){

        let quizz = API_quizzes_list[i];

        if(is_user_created_quizz(quizz)){
            DOM_my_quizzes_gallery.innerHTML += `
                    <div class="quiz" onclick="click_quiz(${quizz.id})" id="id_${quizz.id}">
                        <div class="quiz_image">
                            <img src="${quizz.image}">
                        </div>
                        <h1>${quizz.title}</h1>
                    </div>`;
            no_user_quizzes = false;
        }
        else{
            DOM_API_quizzes_gallery.innerHTML += `
                    <div class="quiz" onclick="click_quiz(${quizz.id})" id="id_${quizz.id}">
                        <div class="quiz_image">
                            <img src="${quizz.image}">
                        </div>
                        <h1>${quizz.title}</h1>
                        </div>`
        }
    }

    document.querySelectorAll(".quiz_container")[1].classList.remove("hidden");
    if (no_user_quizzes){
        document.querySelector(".empty_quiz_container").classList.remove("hidden");
        document.querySelectorAll(".quiz_container")[0].classList.add("hidden");
    }
    else{
        document.querySelector(".empty_quiz_container").classList.add("hidden");
        document.querySelectorAll(".quiz_container")[0].classList.remove("hidden");
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
    promise.catch((err)=>console.log(err))
           .then(render_API_quizzes);
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
                            <section class="empty_quiz_container hidden">
                                <h1>Voc?? n??o criou nenhum quizz ainda :(</h1>
                                <button onclick="load_tela_3()">Criar Quizz</button>
                            </section>
                            <section class="quiz_container hidden" id="my_quizzes_container">
                                <div class="my_quizzes_header">
                                    <p>Seus Quizzes</p>
                                    <ion-icon name="add-circle" class="add_quiz_small_button" onclick="load_tela_3()"></ion-icon>
                                </div>
                                <div class="my_quiz_gallery">
                                    
                                </div>
                            </section>
                            <section class="quiz_container hidden" id="API_quizzes_container">
                                <h1>Todos os Quizzes</h1>
                                <div class="quiz_gallery">

                                </div>
                            </section>
                        </div>`;
    DOM_page_content.innerHTML = tela_1_div;
    get_API_quizzes();
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
// Function: click_quiz(index)
// Description: Function called whenever user clicks on a Quizz in screen 1.
//
// Inputs:
// - quizz_id: Quizz id in 'API_quizzes_list'
//
// Outputs: none;
//----------------------------------------------------------------------------------------
function click_quiz(quizz_id){
    selected_quiz_index = quizz_id;
    load_tela_2();
    render_quiz_tela2(quizz_id);
    user_answers_array = [];
}

//----------------------------------------------------------------------------------------
// Function: render_quiz_tela2(quizz_id)
// Description: Renders selected Quizz in screen 2.
//
// Inputs:
// - quizz_id: Quizz id in 'API_quizzes_list'
//
// Outputs: none;
//----------------------------------------------------------------------------------------
function render_quiz_tela2(quizz_id){
    window.scroll({top: 0, left: 0, behavior: 'auto' });
    // Get quiz to be rendered by checking quizz_id
    for (let i = 0; i < API_quizzes_list.length; i++) {
        if(API_quizzes_list[i].id == quizz_id){
            current_quiz = API_quizzes_list[i];
        }
    }
    if(current_quiz==undefined){
        console.log('Error');
        return;
    }

    

    // Fill quiz_title
    document.querySelector('.quiz_title').innerHTML += `<div class="quiz_title_image">
                                                            <img src="${current_quiz.image}">
                                                        </div>
                                                        <h1>${current_quiz.title}</h1>
                                                        `;
    
    let DOM_questions_container = document.querySelector('.questions_container');

    let questions = current_quiz.questions;
    // Fill questions_container
    for(let i = 0; i < questions.length; i++){
        DOM_questions_container.innerHTML += `
                        <div class="question hidden">
                            <div class="question_title" style="background-color:${questions[i].color};">
                                <h1>${questions[i].title}</h1>
                            </div>
                            <div class="question_alternatives">

                            </div>
                        </div>`;
        let DOM_answers = DOM_questions_container.lastChild.querySelector('.question_alternatives');

        // Shuffle order of answers in current quiz question
        let unshuffled = questions[i].answers;
        let shuffled = unshuffled.map(value => ({ value, sort: Math.random() }))
                                 .sort((a, b) => a.sort - b.sort)
                                 .map(({ value }) => value);
        questions[i].answers = shuffled;

        // Fill question_alternatives
        for(let j = 0; j < questions[i].answers.length; j++){
            DOM_answers.innerHTML += `
                                <div class="alternative" onclick="select_alternative(${i},${j})">
                                    <img src="${questions[i].answers[j].image}">
                                    <h2>${questions[i].answers[j].text}</h2>
                                </div>`;     
        }
    }
    DOM_questions_container.querySelector('.question').classList.remove("hidden");
    
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
        const next_question = questions[question_index + 1];
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
    render_quiz_tela2(selected_quiz_index);
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
    current_quiz = undefined;
    selected_quiz_index = undefined;
    current_user_created_quiz = undefined;
    user_answers_array = [];
    load_tela_1();
    window.scroll({top: 0, left: 0, behavior: 'auto' });
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
                                <h1>Comece pelo come??o</h1>
                                <div class="form_container">
                                    <input type="text" class="text" placeholder="T??tulo do seu quizz" required>
                                    <p class="text_error hidden error">Digite um titulo que contenha entre 20 e 65 caracteres</p>
                                    
                                    <input type="url" class="url" placeholder="URL da imagem do seu quizz" required>
                                    <p class="url_error hidden error">O valor informado n??o ?? uma url valida</p>
                                    
                                    <input type="number" class="qtd_perguntas" placeholder="Quantidade de perguntas do quizz" required>
                                    <p class="qtd_perguntas_error hidden error">A quantidade minima de perguntas ?? 3</p>
                                    
                                    <input type="number" class="qtd_niveis" placeholder="Quantidade de n??veis do quizz" required>
                                    <p class="niveis_error hidden error">A quantidade minima de erros ?? 2</p>
                                </div>
                                <button onclick="proceed_to_create_questions()">Prosseguir para criar perguntas</button>
                            </div>
                        </div>`;
    DOM_page_content.innerHTML = tela_3_div;
}


//----------------------------------------------------------------------------------------
// Function: valid_url(url_string)
// Description: Checks if a given string is a valid URL
//
// Inputs: url_string
//
// Outputs: true (if valid URL) or false (otherwise);
//----------------------------------------------------------------------------------------
function valid_url(url_string){
    let url;
    try {
        url = new URL(url_string);
      } catch (_) {
        return false;  
    }
    return (url.protocol === "http:" || url.protocol === "https:");
}

//----------------------------------------------------------------------------------------
// Function: validate_inputs_tela_3a()
// Description: Checks if inputs on screen 3a are valid (initial quizz creation screen)
//
// Inputs: none
//
// Outputs:
// - is_valid: true if all inputs in screen 3a are valid (false otherwise)
//----------------------------------------------------------------------------------------
function validate_inputs_tela_3a() {
    const DOM_tela_3a = document.querySelector('.tela_3a')
    const DOM_quiz_title = DOM_tela_3a.querySelector(".text");
    const DOM_url = DOM_tela_3a.querySelector(".url");
    const DOM_n_questions = DOM_tela_3a.querySelector(".qtd_perguntas");
    const DOM_n_levels = DOM_tela_3a.querySelector(".qtd_niveis");

    let is_valid = true;

    // Check if Quiz title is at least 20 characters long
    if (DOM_quiz_title.value.length <= 20){
        is_valid = false;
        DOM_quiz_title.value = "";
        DOM_quiz_title.style.backgroundColor = '#FFE9E9';
        document.querySelector(".text_error").classList.remove("hidden");
        return is_valid;
    }
    // Check if image URL is valid
    if (!valid_url(DOM_url.value)){
        is_valid = false;
        DOM_url.value = "";
        DOM_quiz_title.style.backgroundColor = '#FFFFFF';
        DOM_url.style.backgroundColor = '#FFE9E9';
        document.querySelector(".text_error").classList.add("hidden");
        document.querySelector(".url_error").classList.remove("hidden");
        return is_valid;
    }
    // Check if number of questions is integer and >= 3
    if (Number(DOM_n_questions.value) % 1 != 0 || Number(DOM_n_questions.value) < 3){
        is_valid = false;
        DOM_n_questions.value = "";
        DOM_url.style.backgroundColor = '#FFFFFF';
        DOM_n_questions.style.backgroundColor = '#FFE9E9';
        document.querySelector(".text_error").classList.add("hidden");
        document.querySelector(".url_error").classList.add("hidden");
        document.querySelector(".qtd_perguntas_error").classList.remove("hidden");
        return is_valid;
    }
    // Check if number of levels is integer and >= 2
    if (Number(DOM_n_levels.value) % 1 != 0 || Number(DOM_n_levels.value) < 2){
        is_valid = false;
        DOM_n_levels.value = "";
        DOM_n_levels.style.backgroundColor = '#FFE9E9';
        DOM_url.style.backgroundColor = '#FFFFFF';
        DOM_n_questions.style.backgroundColor = '#FFFFFF';
        document.querySelector(".text_error").classList.add("hidden");
        document.querySelector(".url_error").classList.add("hidden");
        document.querySelector(".qtd_perguntas_error").classList.add("hidden");
        document.querySelector(".niveis_error").classList.remove("hidden");
        return is_valid;
    }

    // Store current user-created Quizz on global variable
    current_user_created_quiz = {
        title: DOM_quiz_title.value,
        image: DOM_url.value,
        questions: new Array(Number(DOM_n_questions.value)).fill(null),
        levels: new Array(Number(DOM_n_levels.value)).fill(null)
    };

    return is_valid;
}


//----------------------------------------------------------------------------------------
// Function: proceed_to_create_questions()
// Description: Get user inputs for Quizz creation and checks if all inputs are valid.
//              Displays alerts in case any input is invalid.
//              Calls function load_tela_3b().
//
// Inputs: none
//
// Outputs: none;
//----------------------------------------------------------------------------------------
function proceed_to_create_questions(){
    // Checks if inputs on screen 3a are valid before rendering screen 3b
    let is_valid = validate_inputs_tela_3a();
    if (!is_valid) return;

    // Renders screen 3b (questions creation screen)
    load_tela_3b();
}


//----------------------------------------------------------------------------------------
// Function: get_form_container_divs_tela3b()
// Description: Returns an array of strings representing divs for each question form_container
//              given global variable 'current_user_created_quiz'
//
// Inputs: none
//
// Outputs:
// - form_container_divs: Array of strings representing each question form for screen 3b
//----------------------------------------------------------------------------------------
function get_form_container_divs_tela3b(){
    let form_container_divs = [];

    for (let i = 0; i < current_user_created_quiz.questions.length; i++) {
        const form_container_div = `
                                <div class="form_container">
                                    <div class="form_question">
                                        <div class="form_question_header">
                                            <h2>Pergunta ${i+1}</h2>
                                            <img src="imgs/create_logo.svg" onclick="open_tab(this)">
                                        </div>
                                        <input type="text" placeholder="Texto da pergunta" required>
                                        <p class="error text_error_3b hidden">Digite uma pergunta com no minimo 20 caracteres</p>

                                        <input type="text" placeholder="Cor de fundo da pergunta" required>
                                        <p class="error background_color_error_3b hidden">Digite uma cor em hexadecimal</p>

                                    </>
                                    <div class="form_question">
                                        <h2>Resposta correta</h2>
                                        <input type="text" placeholder="Resposta correta" required>
                                        <p class="error correct_error_3b hidden">Digite uma resposta</p>
                                       
                                        <input type="text" placeholder="URL da imagem" required>
                                        <p class="error url_error_3b hidden">Url invalido</p>
                                    </div>
                                    <div class="form_question">
                                        <h2>Respostas incorretas</h2>
                                        <input type="text" placeholder="Resposta incorreta 1" required>
                                        <p class="error incorret_error_3b hidden">insira pelo menos uma resposta incorreta</p>

                                        <input type="text" placeholder="URL da imagem 1" required>
                                        <p class="error incorret_error_3b hidden">insira pelo menos uma resposta incorreta</p>

                                        <input type="text" placeholder="Resposta incorreta 2" required>
                                        <p class="error incorret_error_3b hidden">insira pelo menos uma resposta incorreta</p>

                                        <input type="text" placeholder="URL da imagem 2" required>
                                        <p class="error incorret_error_3b hidden">insira pelo menos uma resposta incorreta</p>

                                        <input type="text" placeholder="Resposta incorreta 3" required>
                                        <p class="error incorret_error_3b hidden">insira pelo menos uma resposta incorreta</p>
                                        
                                        <input type="text" placeholder="URL da imagem 3" required>
                                    </div>
                                </div>`;
        form_container_divs.push(form_container_div);
    }
    return form_container_divs;
}

//----------------------------------------------------------------------------------------
// Function: open_tab(elem)
// Description: Opens question or level tab
//
// Inputs:
// - elem: DOM element which represents create_logo img
//
// Outputs: none
//----------------------------------------------------------------------------------------
function open_tab(elem) {
    const DOM_form_question_header = elem.parentElement;
    const DOM_form_question = DOM_form_question_header.parentElement;
    const DOM_form_container = DOM_form_question.parentElement;
    DOM_form_container.style.height = 'initial';
    elem.classList.add('hidden');
}

//----------------------------------------------------------------------------------------
// Function: load_tela_3b()
// Description: Loads tela_3b given 'current_user_created_quiz' global variable.
//
// Inputs: none
//
// Outputs: none
//----------------------------------------------------------------------------------------
function load_tela_3b() {
    const DOM_tela3 = document.querySelector('.tela_3');
    DOM_tela3.innerHTML = `
                            <div class="tela_3b">

                            </div>
                          `;
    const DOM_tela3b = DOM_tela3.querySelector('.tela_3b');
    DOM_tela3b.innerHTML += `<h1>Crie suas perguntas</h1>`;
    const form_container_divs = get_form_container_divs_tela3b();

    for (let i = 0; i < form_container_divs.length; i++) {
        DOM_tela3b.innerHTML += form_container_divs[i];
    }
    DOM_tela3b.innerHTML += `<button onclick="proceed_to_create_levels()">
                                Prosseguir para criar n??veis
                            </button>`;

    DOM_tela3b.querySelectorAll('.form_container')[0].style.height = 'initial';
    DOM_tela3b.querySelectorAll('.form_container')[0].querySelector('img').classList.add("hidden");
    DOM_tela3b.querySelectorAll('.form_container')[0].querySelector('.form_question_header').setAttribute('id','h_init');
    window.scroll({top: 0, left: 0, behavior: 'auto' });
}

//----------------------------------------------------------------------------------------
// Function: valid_hexadecimal_color(color_string)
// Description: Checks if input string is a valid hexadecimal color
//
// Inputs:
// - color_string: String representing a hexadecimal color.
//
// Outputs:
// - is_valid: true if input is a valid hexadecimal color (false otherwise)
//----------------------------------------------------------------------------------------
function valid_hexadecimal_color(color_string){
    if(color_string[0] != '#') return false;
    if(color_string.length != 7) return false;

    const hex_letters = ['A','B','C','D','E','F'];

    for (let i = 1; i < color_string.length; i++) {
        let c = color_string[i];
        if (!( (Number(c) >=0 && Number(c)<=9) || hex_letters.includes(c.toUpperCase()) )){
            return false;
        }
    }
    return true;
}

//----------------------------------------------------------------------------------------
// Function: validate_inputs_tela_3b()
// Description: Checks if inputs on screen 3b are valid (question creation screen).
//
// Inputs: none
//
// Outputs:
// - is_valid: true if all inputs in screen 3b are valid (false otherwise)
//----------------------------------------------------------------------------------------
function validate_inputs_tela_3b() {
    let is_valid;
    let array_with_indexes_of_valid_incorrect_answers = [];

    const DOM_tela3 = document.querySelector('.tela_3');
    const DOM_form_containers = DOM_tela3.querySelectorAll('.form_container')

    for (let i = 0; i < current_user_created_quiz.questions.length; i++) {
        let DOM_question = DOM_form_containers[i].querySelectorAll('.form_question')[0];
        let DOM_correct_answer = DOM_form_containers[i].querySelectorAll('.form_question')[1];
        let DOM_incorrect_answers = DOM_form_containers[i].querySelectorAll('.form_question')[2];

        let DOM_question_text = DOM_question.querySelectorAll('input')[0];
        let DOM_question_color = DOM_question.querySelectorAll('input')[1];
        let DOM_correct_answer_text = DOM_correct_answer.querySelectorAll('input')[0];
        let DOM_correct_answer_url = DOM_correct_answer.querySelectorAll('input')[1];
        let DOM_incorrect_answers_inputs = DOM_incorrect_answers.querySelectorAll('input');

        // Validate question text
        if (DOM_question_text.value.length <= 20){
            is_valid = false;
            DOM_question_text.value='';
            DOM_question.parentElement.style.height='initial';
            DOM_question.parentElement.querySelector('img').classList.add('hidden');
            DOM_question_text.scrollIntoView({behavior: 'smooth'});
            DOM_question_text.style.backgroundColor = '#FFE9E9';
            DOM_form_containers[i].querySelector(".text_error_3b").classList.remove("hidden");
            return is_valid;
        }
        // Validate question color
        if (!valid_hexadecimal_color(DOM_question_color.value)){
            is_valid = false;
            DOM_question_color.value = '';
            DOM_question.parentElement.style.height='initial';
            DOM_question.parentElement.querySelector('img').classList.add('hidden');
            DOM_question_color.scrollIntoView({behavior: 'smooth'});
            DOM_question_text.style.backgroundColor = '#FFFFFF';
            DOM_question_color.style.backgroundColor = '#FFE9E9';
            DOM_form_containers[i].querySelector(".text_error_3b").classList.add("hidden");
            DOM_form_containers[i].querySelector(".background_color_error_3b").classList.remove("hidden");
            return is_valid;
        }
        // Validate correct answer text
        if (DOM_correct_answer_text.value === ''){
            is_valid = false;
            DOM_question.parentElement.style.height='initial';
            DOM_question.parentElement.querySelector('img').classList.add('hidden');
            DOM_correct_answer_text.scrollIntoView({behavior: 'smooth'});
            DOM_question_text.style.backgroundColor = '#FFFFFF';
            DOM_question_color.style.backgroundColor = '#FFFFFF';
            DOM_correct_answer_text.style.backgroundColor = '#FFE9E9';
            DOM_form_containers[i].querySelector(".text_error_3b").classList.add("hidden");
            DOM_form_containers[i].querySelector(".background_color_error_3b").classList.add("hidden");
            DOM_form_containers[i].querySelector(".correct_error_3b").classList.remove("hidden");
            return is_valid;
        }
        // Validate correct answer image URL
        if (!valid_url(DOM_correct_answer_url.value)){
            is_valid = false;
            DOM_correct_answer_url.value = '';
            DOM_question.parentElement.style.height='initial';
            DOM_question.parentElement.querySelector('img').classList.add('hidden');
            DOM_correct_answer_url.scrollIntoView({behavior: 'smooth'});
            DOM_question_text.style.backgroundColor = '#FFFFFF';
            DOM_question_color.style.backgroundColor = '#FFFFFF';
            DOM_correct_answer_text.style.backgroundColor = '#FFFFFF';
            DOM_correct_answer_url.style.backgroundColor = '#FFE9E9';
            DOM_form_containers[i].querySelector(".text_error_3b").classList.add("hidden");
            DOM_form_containers[i].querySelector(".background_color_error_3b").classList.add("hidden");
            DOM_form_containers[i].querySelector(".correct_error_3b").classList.add("hidden");
            DOM_form_containers[i].querySelector(".url_error_3b").classList.remove("hidden");
            return is_valid;
        }
        DOM_form_containers[i].querySelector(".url_error_3b").classList.add("hidden");
        DOM_correct_answer_url.style.backgroundColor = '#FFFFFF';
        // Validate incorrect answers
        let aux = [];
        let cont_valid_incorrect_answers = 0;
        for (let j = 0; j <= 4; j=j+2) {
            let DOM_texto_resposta_incorreta = DOM_incorrect_answers_inputs[j];
            let DOM_url_resposta_incorreta = DOM_incorrect_answers_inputs[j+1];
            if(DOM_texto_resposta_incorreta.value != '' && valid_url(DOM_url_resposta_incorreta.value)){
                aux.push(j);
                cont_valid_incorrect_answers++;
            }
            else{
                DOM_question.parentElement.style.height='initial';
                DOM_question.parentElement.querySelector('img').classList.add('hidden');
                DOM_texto_resposta_incorreta.scrollIntoView({behavior: 'smooth'});
            }
        }
        if (cont_valid_incorrect_answers === 0){
            is_valid = false;
            for (let d = 0; d < DOM_incorrect_answers_inputs.length; d++) {
                DOM_incorrect_answers_inputs[d].value = '';
            }
            alert("?? obrigat??ria a inser????o de pelo menos uma resposta incorreta")
            return is_valid;
        }
        array_with_indexes_of_valid_incorrect_answers.push(aux);
    }

    is_valid = true;
    // Store current user-created Quizz on global variable
    for (let k = 0; k < current_user_created_quiz.questions.length; k++) {
        let DOM_question = DOM_form_containers[k].querySelectorAll('.form_question')[0];
        let DOM_correct_answer = DOM_form_containers[k].querySelectorAll('.form_question')[1];
        let DOM_incorrect_answers = DOM_form_containers[k].querySelectorAll('.form_question')[2];

        let DOM_question_text = DOM_question.querySelectorAll('input')[0];
        let DOM_question_color = DOM_question.querySelectorAll('input')[1];
        let DOM_correct_answer_text = DOM_correct_answer.querySelectorAll('input')[0];
        let DOM_correct_answer_url = DOM_correct_answer.querySelectorAll('input')[1];
        let DOM_incorrect_answers_inputs = DOM_incorrect_answers.querySelectorAll('input');

        let answers = [];
        // Store Correct Answer
        answers.push({
                        text: DOM_correct_answer_text.value,
                        image: DOM_correct_answer_url.value,
                        isCorrectAnswer: true
                    });
        // Store Incorrect Answers
        for (let m = 0; m < array_with_indexes_of_valid_incorrect_answers[k].length; m++) {
            const index = array_with_indexes_of_valid_incorrect_answers[k][m];
            answers.push({
                text: DOM_incorrect_answers_inputs[index].value,
                image: DOM_incorrect_answers_inputs[index+1].value,
                isCorrectAnswer: false
            });
        }
        // Store Question
        let question = {
                        title: DOM_question_text.value,
                        color: DOM_question_color.value,
                        answers: answers
                        }
        current_user_created_quiz.questions[k] = question
    }

    return is_valid;
}


//----------------------------------------------------------------------------------------
// Function: proceed_to_create_levels()
// Description: Get user inputs for Quizz questions and checks if all inputs are valid.
//              Displays alerts in case any input is invalid.
//              Calls function load_tela_3c().
//
// Inputs: none
//
// Outputs: none;
//----------------------------------------------------------------------------------------
function proceed_to_create_levels() {
    // Validates inputs from screen 3b (question creation screen)
    let is_valid = validate_inputs_tela_3b();
    if (!is_valid) return;

    // Renders screen 3c (levels creation screen)
    load_tela_3c();

}

//----------------------------------------------------------------------------------------
// Function: get_form_container_divs_tela3c()
// Description: Returns an array of strings representing divs for each level form_container
//              given global variable 'current_user_created_quiz'
//
// Inputs: none
//
// Outputs:
// - form_container_divs: Array of strings representing each question form for screen 3b
//----------------------------------------------------------------------------------------
function get_form_container_divs_tela3c(){
    let form_container_divs = [];

    for (let i = 0; i < current_user_created_quiz.levels.length; i++) {
        const form_container_div = `<div class="form_container">
                                        <div class="form_question">
                                            <div class="form_question_header">
                                                <h2>N??vel ${i + 1}</h2>
                                                <img src="imgs/create_logo.svg" onclick="open_tab(this)">
                                            </div>
                                            <input type="text" placeholder="T??tulo do n??vel" required>
                                            <p class="error text_error_3c hidden">O t??tulo deve ter pelo menos 10 caracteres</p>

                                            <input type="number" placeholder="% de acerto m??nima" required>
                                            <p class="error acerto_error_3c hidden">a porcentagem de acerto tem que estar entre 0 e 100</p>

                                            <input type="url" placeholder="URL da imagem do n??vel" required>
                                            <p class="error url_error_3c hidden">Url inv??lida</p>

                                            <textarea name="Descri????o" rows="10" placeholder="Descri????o do n??vel" required></textarea>
                                            <p class="error description_error_3c hidden">Descri????o deve conter no minimo 30 caracteres</p>

                                        </div>
                                    </div>`;
        form_container_divs.push(form_container_div);
    }
    return form_container_divs;
}

//----------------------------------------------------------------------------------------
// Function: load_tela_3c()
// Description: Loads tela_3c given 'current_user_created_quiz' global variable.
//
// Inputs: none
//
// Outputs: none
//----------------------------------------------------------------------------------------
function load_tela_3c(){
    const DOM_tela3 = document.querySelector('.tela_3');
    DOM_tela3.innerHTML = `<div class="tela_3c">
                            
                           </div>`;
    const DOM_tela3c = DOM_tela3.querySelector('.tela_3c')
    DOM_tela3c.innerHTML += `<h1>Agora decida os n??veis</h1>`;
    const form_container_divs = get_form_container_divs_tela3c();

    for (let i = 0; i < form_container_divs.length; i++) {
        DOM_tela3c.innerHTML += form_container_divs[i];
    }
    DOM_tela3c.innerHTML += `<button onclick="proceed_to_finalize_quiz()">
                                Finalizar Quiz
                             </button>`;

    DOM_tela3c.querySelectorAll('.form_container')[0].style.height = 'initial';
    DOM_tela3c.querySelectorAll('.form_container')[0].querySelector('img').classList.add("hidden");
    DOM_tela3c.querySelectorAll('.form_container')[0].querySelector('.form_question_header').setAttribute('id','h_init');
    window.scroll({top: 0, left: 0, behavior: 'auto' });
}

//----------------------------------------------------------------------------------------
// Function: validate_inputs_tela_3c()
// Description: Checks if inputs on screen 3c are valid (level creation screen).
//
// Inputs: none
//
// Outputs:
// - is_valid: true if all inputs in screen 3c are valid (false otherwise)
//----------------------------------------------------------------------------------------
function validate_inputs_tela_3c() {
    let is_valid;

    const DOM_tela3c = document.querySelector('.tela_3c');
    const DOM_form_containers = DOM_tela3c.querySelectorAll('.form_container');

    let level_percentages = [];
    for (let i = 0; i < current_user_created_quiz.levels.length; i++) {

        let DOM_level = DOM_form_containers[i].querySelector('.form_question');
        let DOM_level_text = DOM_level.querySelectorAll('input')[0];
        let DOM_level_percentual = DOM_level.querySelectorAll('input')[1];
        let DOM_level_url = DOM_level.querySelectorAll('input')[2];
        let DOM_level_description = DOM_level.querySelector('textarea');

        // Validate level text
        if (DOM_level_text.value.length <= 10){
            is_valid = false;
            DOM_level_text.value='';
            DOM_level.parentElement.style.height='initial';
            DOM_level.parentElement.querySelector('img').classList.add('hidden');
            DOM_level_text.scrollIntoView({behavior: 'smooth'});
            DOM_level_text.style.backgroundColor = '#FFE9E9';
            DOM_level.querySelector(".text_error_3c").classList.remove("hidden");
            return is_valid;
        }
        // Validate level percentual
        if (Number(DOM_level_percentual.value) < 0 || Number(DOM_level_percentual.value) >= 100 || DOM_level_percentual.value == ""){
            is_valid = false;
            DOM_level_percentual.value = '';
            DOM_level.parentElement.style.height='initial';
            DOM_level.parentElement.querySelector('img').classList.add('hidden');
            DOM_level_percentual.scrollIntoView({behavior: 'smooth'});
            DOM_level_text.style.backgroundColor = '#FFFFFF';
            DOM_level.querySelector(".text_error_3c").classList.add("hidden");
            DOM_level_percentual.style.backgroundColor = '#FFE9E9';
            DOM_level.querySelector(".acerto_error_3c").classList.remove("hidden");
            return is_valid;
        }
        else{
            level_percentages.push(Math.round(Number(DOM_level_percentual.value)))
        }
        
        // Validate correct answer image URL
        if (!valid_url(DOM_level_url.value)){
            is_valid = false;
            DOM_level_url.value = '';
            DOM_level.parentElement.style.height='initial';
            DOM_level.parentElement.querySelector('img').classList.add('hidden');
            DOM_level_url.scrollIntoView({behavior: 'smooth'});
            DOM_level_text.style.backgroundColor = '#FFFFFF';
            DOM_level.querySelector(".text_error_3c").classList.add("hidden");
            DOM_level_percentual.style.backgroundColor = '#FFFFFF';
            DOM_level.querySelector(".acerto_error_3c").classList.add("hidden");
            DOM_level_url.style.backgroundColor = '#FFE9E9';
            DOM_level.querySelector(".url_error_3c").classList.remove("hidden");
            return is_valid;
        }
        // Validate level text description
        if (DOM_level_description.value.length <= 30){
            is_valid = false;
            DOM_level_description.value='';
            DOM_level.parentElement.style.height='initial';
            DOM_level.parentElement.querySelector('img').classList.add('hidden');
            DOM_level_description.scrollIntoView({behavior: 'smooth'});
            DOM_level_text.style.backgroundColor = '#FFFFFF';
            DOM_level.querySelector(".text_error_3c").classList.add("hidden");
            DOM_level_percentual.style.backgroundColor = '#FFFFFF';
            DOM_level.querySelector(".acerto_error_3c").classList.add("hidden");
            DOM_level_url.style.backgroundColor = '#FFFFFF';
            DOM_level.querySelector(".url_error_3c").classList.add("hidden");
            DOM_level_description.style.backgroundColor = '#FFE9E9';
            DOM_level.querySelector(".description_error_3c").classList.remove("hidden");
            return is_valid;
        }

        DOM_level_description.style.backgroundColor = '#FFFFFF';
        DOM_level.querySelector(".description_error_3c").classList.add("hidden");

    }
    if (!level_percentages.includes(0)){
        is_valid = false;
        alert('Deve existir pelo menos um n??vel com porcentagem m??nima 0!');
        return is_valid;
    }

    is_valid = true;
    // Store current user-level on global variable
    for (let k = 0; k < current_user_created_quiz.levels.length; k++) {

        let DOM_level = DOM_form_containers[k].querySelector('.form_question');

        let DOM_level_text = DOM_level.querySelectorAll('input')[0];
        let DOM_level_percentual = DOM_level.querySelectorAll('input')[1];
        let DOM_level_url = DOM_level.querySelectorAll('input')[2];
        let DOM_level_description = DOM_level.querySelector('textarea');

        // Store level
        let level = {
                    title: DOM_level_text.value,
                    image: DOM_level_url.value,
                    text: DOM_level_description.value,
                    minValue: DOM_level_percentual.value
        }
        current_user_created_quiz.levels[k] = level;
    }

    return is_valid;
}

//----------------------------------------------------------------------------------------
// Function: proceed_to_finalize_quiz()
// Description: Get user inputs for Quizz levels and checks if all inputs are valid.
//              Displays alerts in case any input is invalid.
//              Calls function load_tela_3c().
//
// Inputs: none
//
// Outputs: none;
//----------------------------------------------------------------------------------------
function proceed_to_finalize_quiz() {
    // Validates inputs from screen 3c (question creation screen)
    let is_valid = validate_inputs_tela_3c();
    if (!is_valid) return;


    let promise = axios.post(API_server,current_user_created_quiz)
    promise.catch((err)=>console.log(err))
           .then(save_quizz_local_storage);

}

//----------------------------------------------------------------------------------------
// Function: load_tela_3d()
// Description: Loads tela_3d after Quiz has been successfully created
//
// Inputs: none
//
// Outputs: none
//----------------------------------------------------------------------------------------
function load_tela_3d(){
    const tela_3d_div = `<div class="tela_3">
                            <div class="tela_3d">
                                <h1>Seu quiz est?? pronto!</h1>
                                <div class="img_result">
                                    <div class="quiz_image">
                                        <img src="${current_user_created_quiz.image}">
                                    </div>
                                    <h3>${current_user_created_quiz.title}</h3>
                                </div>
                                <button class="reset_quiz" onclick="access_new_user_created_quiz(${current_user_created_quiz.id})">
                                    Acessar Quiz
                                </button>
                                <button class="back_home" onclick="go_to_homepage()">
                                    Voltar para home
                                </button>
                            </div>
                        </div>`;
    
    DOM_page_content.innerHTML = tela_3d_div;
}


//----------------------------------------------------------------------------------------
// Function: save_quizz_local_storage(object)
// Description: Callback function from POST request to store user created quizz on API server
//
// Inputs:
// - object: Object response of API server
//
// Outputs: none
//----------------------------------------------------------------------------------------
function save_quizz_local_storage(object){
    const objectSerializado = JSON.stringify(object);
    localStorage.setItem(`${object.data.id}`, objectSerializado);
    
    current_user_created_quiz.id = object.data.id;
    // Render screen 3d (quizz finalization screen)
    load_tela_3d();
}

//----------------------------------------------------------------------------------------
// Function: access_new_user_created_quiz(quizz_id)
// Description: OnClick function called when user wants to access newly created quiz
//
// Inputs:
// - quizz_id: Id of quizz to be displayed.
//
// Outputs: none
//----------------------------------------------------------------------------------------
function access_new_user_created_quiz(quizz_id){
    console.log('access_new_user_created_quiz');
    const promise = axios.get(API_server);
    promise.catch((err)=>console.log(err))
           .then(function (object) {
                    API_quizzes_list = object.data;
                    console.log('quizz_id = ',quizz_id);
                    console.log('API_quizzes_list = ');
                    console.log(API_quizzes_list);
                    click_quiz(quizz_id);
                })
}

// -------------------------- Main --------------------------
load_tela_1();


