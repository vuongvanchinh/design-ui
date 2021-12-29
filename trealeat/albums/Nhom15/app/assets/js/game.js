let indexNumber = 0
let questionNumber = 1
let rewards = [];
let times = 5;



const showQuestion = (qs_id) => {
    let index = data.game.questions.findIndex(qs => qs.id == qs_id);
    let question = data.game.questions[index];
    let reward = question.reward;

    let answer = '';
    for (let i = 0; i < question.answers.length; i++) {
        // console.log(question.answers[i].images.length);
        answer += ` <div class="answer">
    <input type="radio" class ="answer-input" id="option-${i}" name="option" class="radio" value="${question.answers[i].isAnswer}" />
    <label for="option-${i}" class="option" id="option-${i}-label">
        <span>${question.answers[i].content}</span>
        
    </label>
    </div>
    `
    }
    return `
    <div class="game-question-container">
        <div id="display-question">
            <img src="${question.images[0]}" alt="">
            <h1>Câu ${reward}, ${question.content}</h1>
        </div>
    </div>
    <div class="game-options-container">
        ${answer}
    </div>
    <div class="submit-button-container">
        <button onclick="checkAnswer(${reward})">Submit Question</button>
    </div>
    `
}

const checkAnswer = (reward) => {
    let a;
    const options = document.getElementsByName("option");
    for (let index = 0; index < options.length; index++) {
        if (options[index].value === 'true') {
            a = index;
        }
    }
    for (let index = 0; index < options.length; index++) {
        if (options[index].value === 'true' && options[index].checked === true) {
            rewards.push(reward);
            setTimeout(() => {
                document.getElementById("option-" + a + "-label").classList.add("answer-correct");
                setTimeout(() => {
                    showGamePopup();
                }, 1000);
            }, 1000);

        } else if (options[index].value === 'false' && options[index].checked === true) {
            setTimeout(() => {
                document.getElementById("option-" + a + "-label").classList.add("answer-correct");
                document.getElementById("option-" + index + "-label").style.backgroundColor = "red";
            }, 2000);
            // alert('chưa chính xác');
            // console.log(index);
        }
        // }
        // let aws = document.getElementById("option-" + i);
        // console.log(aws);
        // if (aws.value === 'true') {
        //     setTimeout(() => {
        //         document.getElementById("option-" + i + "-label").style.backgroundColor = "green";

        //     }, 1000)
        // }
    }
}


// Hiển thị gamepopup khi trả lời đúng

const showGamePopup = () => {
    const ele = document.getElementById('bubble-chat');
    ele.click();
    // console.log();
    // document.getElementById(`grid-${reward}`).style.background = "none";
}

const showGame = (data) => {
    let header = `
    <p style='font-size: 1.5rem; font-weight: 560;'>Trò chơi</p>
    `
    let footer = '';
    let content = '';
    // data.question_ids.length
    for (let i = 0; i < 1; i++) { content += ` ${showQuestion(data.question_ids[i])} ` }
    return ` 
    <div class = "game-container">
    <hr style="margin: 2rem ">
        <div>
        ${header}
        </div>
        <div class="game-quiz-container">
            ${content}
        </div>
        </div>
        `
}

const gamePopup = () => {
    let cols = parseInt(data.game.cols)
    let rows = parseInt(data.game.rows)
    let number_cells = cols * rows
    let img_cells = ''
    for (let i = 0; i < number_cells; i++) {

        if (rewards.includes(i)) {
            img_cells += ` <div class='img_cell' style="background-color: none" id="grid-${i}">
                 <span>${i}</span>
            </div>
            `
        } else {
            img_cells += ` <div class='img_cell' style="background-color: #afafaf" id="grid-${i}">
                <span>${i}</span>
           </div>
           `
        }
    }
    let header = `
                
    `
    let img_grid = `
            <div class='grid-img bg-image' style="--col:${cols}; background-image:url('${data.game.root_image}');">
                ${img_cells}
            </div>
            `
    let textfield = `
            <div class="key_input">
                <label class="lable">Nhập từ khóa trò chơi</label>      
                <input type="text" placeholder="vd: XINCHAO" id="key">
                <p id="err_p" style="color:#de3232; margin-bottom:10px"></p>
                <button onclick="CheckKey()" id="btn-key">Trả lời</button>
            </div>
            `

    let win = `
        <div class="win-game" id = "win">
        <p style="">Chúc mừng, bạn đã chiến thắng</p>
        <img src="${data.game.win}" alt="">
        </div>
    `

    let lose = `
    <div class="lose-game" id = "lose">
    <p style="">Game Over!</p>
    <img src="${data.game.loss}" alt="">
    </div>
`
    return `
            <div>
                <h1>Trò Chơi</h1>
                <hr>
                <div class="game-des">
                    <p><span style="font-size: 1.3rem;  text-decoration: underline;">Mô tả:</span> ${data.game.description}</p>
                </div>
                ${img_grid}
            </div>
            ${textfield}
            ${win}
            ${lose}
            `
}

const checkEnter = () => {
    var key = document.getElementById("key");
    key.addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById("btn-key").click();
        }
    });
}


const CheckKey = () => {
    let a = document.getElementById("key").value;
    if (a == data.game.key) {
        document.getElementById("win").style.display = "block";
    } else {
        times--;
        if (times >= 1) {
            document.getElementById("err_p").innerText = `Đáp án chưa chính xác, bạn còn ${times} lần!`;
        } else {
            document.getElementById("lose").style.display = "block";
            document.getElementById("err_p").innerText = `Hết số lần trả lời`;
        }
        // console.log(times);
    }

}