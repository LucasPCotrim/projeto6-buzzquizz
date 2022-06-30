let every_quiz_gallery = document.querySelector('.quiz_gallery');
let selected_quiz;
let counter_my_quizes = 1;

get_server();

function get_server(){
    const promise = axios.get("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes");
    promise.then(reneder_quiz);
}

function click_quiz(indice){
    selected_quiz = indice;
    document.querySelector(".tela_1").classList.add("hidden");
    document.querySelector(".tela_2").classList.remove("hidden");
    const promise = axios.get("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes");
    promise.then(reneder_quiz_tela2);
}

function reneder_quiz_tela2(object){
    window.scroll({top: 0, left: 0, behavior: 'smooth' });
    const array = object.data;
    let quiz_header = document.querySelector('.quiz_title');
    quiz_header.innerHTML += `
                <div class="quiz_title_image">
                    <img src="${array[selected_quiz].image}" alt="">
                </div>
                <h1>${array[selected_quiz].title}</h1>`;
    
    let questions_container = document.querySelector('.questions_container');
    let answers;
    let question_title;
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
        question_titles = questions_container.querySelectorAll('.question_title');
        console.log('question_titles');
        console.log(question_titles);
        console.log('${questions[i].color}');
        console.log(`${questions[i].color}`);
        console.log('i', i);
        question_titles[i].style.backgroundColor = `${questions[i].color}`;

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


function check_my_quizzes(){
    if(counter_my_quizes > 0){
        document.querySelector(".empty_quiz_container").classList.add("hidden");
        document.querySelector(".add_quiz_small").classList.remove("hidden");
    }
}
check_my_quizzes()

function add_quiz(){
    console.log("foi");
    document.querySelector(".tela_1").classList.add("hidden");
    document.querySelector(".tela_3").classList.remove("hidden");
}

function create_quiz(){
    const text = document.querySelector(".text");
    const url = document.querySelector(".url");
    const qtd_perguntas = document.querySelector(".qtd_perguntas");
    const qtd_niveis = document.querySelector(".qtd_niveis");
    if(text.value.length >= 20){
        console.log("titulo ta ok")

    } else{
        text.value = "";
        alert("titulo deve ter entre 20 e 65 caracteristicas");
    }

    try {
        let verifica = new URL(url.value)
        console.log("Valid URL!")
      } catch(err) {
          console.log("Invalid URL!")
          url.value = "";
          alert("url invalida");
      }

    if(qtd_perguntas.value >= 3){
        console.log("qtd perguntas está ok")
    } else{
        alert("qtd de perguntas menor que 3");
        qtd_perguntas.value = ";"
    }

    if(qtd_niveis.value >= 2){
        console.log("qtd niveis está ok")
    } else{
        alert("qtd de niveis menor que 2");
        qtd_niveis.value = "";
    }
}