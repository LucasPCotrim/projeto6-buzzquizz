let every_quiz_gallery = document.querySelector('.quiz_gallery');
let selected_quiz;
let counter_my_quizes = 1;
let perguntas_qtd;
let niveis_qtd;

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
    document.querySelector(".tela_3a").classList.remove("hidden");
}

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
