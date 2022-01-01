let indexNumber = 0
let questionNumber = 1
let rewards = [];
// let times = 5;


const showQuestion = (qs_id, locationQuestion) => {
    let index = data.game.questions.findIndex(qs => qs.id == qs_id);
    let question = data.game.questions[index];
    let reward = question.reward;
    let answer = '';
    let index_corect = question.answers.findIndex(isAs => isAs.isAnswer == true);

    let indexLocation = data.locations.findIndex(v => v.id === locationQuestion.id);
    let index_picker = data.locations[indexLocation].picked;
    if (index_picker !== -1) {
        for (let i = 0; i < question.answers.length; i++) {
            //hiển thị đap an đúng
            if ((i == index_corect)) {
                answer += ` <div class="answer">
                        <input type="radio" class ="answer-input" id="option-${i}" name="option" class="radio" value="${question.answers[i].isAnswer}" />
                            <label for="option-${i}" class="option answer-correct" id="option-${i}-label">
                                <span>${question.answers[i].content}</span>
                                <img src="${question.answers[i].images[0]}" alt="">
                            </label>
                        </div>
                        `
            } //nếu chọn sai
            else if ((index_picker !== index_corect) && (i == index_picker)) {
                answer += ` <div class="answer">
                            <input type="radio" class ="answer-input" id="option-${i}" name="option" class="radio" value="${question.answers[i].isAnswer}" />
                                <label for="option-${i}" class="option" style="background-color: red;" id="option-${i}-label">
                                    <span>${question.answers[i].content}</span>
                                    <img src="${question.answers[i].images[0]}" alt="">
                                </label>
                            </div>
                            `
            } else {
                answer += ` <div class="answer">
                            <input type="radio" class ="answer-input none_hover none_click" id="option-${i}" name="option" class="radio" value="${question.answers[i].isAnswer}" />
                                <label for="option-${i}" class="option" id="option-${i}-label">
                                    <span>${question.answers[i].content}</span>
                                    <img src="${question.answers[i].images[0]}" alt="">
                                </label>
                            </div>
                            `
            }

        }
        let historyAnswer = '';
        if((index_picker === index_corect)) {
            historyAnswer = `<p style="color:green; transform: scale(1)">Bạn đã trả lời đúng<br/>Bạn nhận được mảnh ghép số ${reward}!</p>`;
        } else {
            historyAnswer = `<p style="color:red; transform: scale(1)">Bạn đã trả lời sai!</p>`;
        }
        return `
        <div class="game-question-container">
            <div id="display-question">
                <img src="${question.images[0]}" alt="">
                <h1>${question.content}</h1>
            </div>
        </div>
        <div class="game-options-container">
            ${answer}
        </div>
     
        <div class="submit-button-container">
            ${historyAnswer}
        </div>
        `
    } else {
        for (let i = 0; i < question.answers.length; i++) {
            // console.log(question.answers[i].images.length);
            answer += ` <div class="answer">
        <input type="radio" class ="answer-input" id="option-${i}" onchange='handleChange(this);' name="option" class="radio" value="${question.answers[i].isAnswer}" />
            <label for="option-${i}" class="option" id="option-${i}-label">
                <span>${question.answers[i].content}</span>
                <img src="${question.answers[i].images[0]}" alt="">
                </label>
        </div>
        `
        }
        return `
        <div class="game-question-container">
            <div id="display-question">
                <img src="${question.images[0]}" alt="">
                <h1>${question.content}</h1>
            </div>
        </div>
        <div class="game-options-container">
            ${answer}
        </div>
        <div class="submit-button-container">
            <button onclick="checkAnswer(${locationQuestion.id},${reward})">Trả lời</button>
        </div>
        `
    }

}

function handleChange(checkbox) {
    if (checkbox.checked == true) {
        document.querySelector('.submit-button-container button').style.transform = 'scale(1)';
    }
}

const checkAnswer = (locationQuestionId, reward) => {
    let pick = -1;
    let indexLocation = data.locations.findIndex(v => v.id === locationQuestionId.id);
    //xóa hiệu ứng khi trả lời

    const options = document.getElementsByName("option");
    for (let index = 0; index < options.length; index++) {
        if (options[index].value === 'true') {
            pick = index;
        }

    }
    for (let index = 0; index < options.length; index++) {
        if (options[index].checked === true) {
            for (let j = 0; j < options.length; j++) {
                document.getElementById(`option-${j}-label`).disabled = true;
                document.getElementById(`option-${j}`).disabled = true;
                document.getElementById(`option-${j}`).classList.add('none_hover');
                document.querySelectorAll(`.answer input[type=radio]`)[j].disabled = true;
            }
        }
    }
    let btnContenner = document.querySelector('.submit-button-container');

    for (let index = 0; index < options.length; index++) {
        if (options[index].value === 'true' && options[index].checked === true) {

            data.locations[indexLocation].picked = index;
            rewards.push(reward);
            btnContenner.querySelector('button').remove();
            let message = document.createElement('div');
            message.innerHTML = `<p style="color:green;">Bạn đã trả lời đúng<br/>Bạn nhận được mảnh ghép số ${reward}</p>`;
            btnContenner.appendChild(message);
            setTimeout(() => {
                btnContenner.querySelector('p').style.transform= 'scale(1)';
                document.getElementById("option-" + pick + "-label").classList.add("answer-correct");
                setTimeout(() => {
                    showGamePopup();
                }, 500);
            }, 500);

        } else if (options[index].value === 'false' && options[index].checked === true) {
            data.locations[indexLocation].picked = index;
            btnContenner.querySelector('button').remove();
            let message = document.createElement('div');
            message.innerHTML = `<p style="color:red;">Chúc bạn may mắn lần sau!</p>`
            btnContenner.appendChild(message);
            setTimeout(() => {
                btnContenner.querySelector('p').style.transform= 'scale(1)';
                document.getElementById("option-" + pick + "-label").classList.add("answer-correct");
                document.getElementById("option-" + index + "-label").style.backgroundColor = "red";

            }, 500);
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
    // const ele = document.getElementById('bubble-chat');
    // if (document.getElementById('myModal').style.display !== "block") {
    //     ele.click();
    // } else {
    //     ele.click();
    //     ele.click();
    // }
    const ele = document.getElementById('bubble-chat');
    const elew = document.getElementById('game-board'); 
    let modal = document.getElementById("myModal");
    let myGamePopup = document.getElementById("gamePopup");
    modal.style.display = "block"
    myGamePopup.innerHTML = `${gamePopup()}`;

    const screen_w = $("#game-mask").width()
    let time = (parseInt(elew.style.top) -  1) *  0.5;
                            
    $( elew ).animate({
        top: "1px"
    }, time, function() {
        // Animation complete.
        modal.style.display = "block"; 
        if (parseInt(elew.style.left) <= screen_w/2) {
            modal.classList.remove("modalGame-right");
            modal.classList.add("modalGame-left");
            
        } else {
            modal.classList.remove("modalGame-left");
            modal.classList.add("modalGame-right");
        }
    })
    rect = ele.getBoundingClientRect();
        // console.log(rect.left);
        
    checkEnter();
}

const showGuide = () => {
    return `
        ${data.game.guide}
    `
}

function getBackground(param) {
    if (param == 1) {
        return data.game.bg_icon;
    } else {
        return data.game.bg_game;
    }
}

const showGame = (locations) => {
    let header = `
    <p style='font-size: 1.5rem; font-weight: 560;'>Trò chơi</p>
    `
    let content = '';
    for (let i = 0; i < 1; i++) { content += ` ${showQuestion(locations.question_ids[i], locations)} ` }
    return ` 
    <div class = "game-container">
    <hr style="margin: 2rem ">
        <div>
        ${header}
        </div>
        <div class="game-quiz-container" style="background-image:url('${data.game.bg_game}')">
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
    let modalGame_content = document.getElementsByClassName("modalGame-content")[0];
    let a = getBackground(5);
    modalGame_content.style.backgroundImage = `url(${a})`;
 
    let isGameEnd = data.game.picked;
    let hideImg = `style="background-color: #d9cfcf"`
 
    if (isGameEnd === 1) {
        hideImg = `style="background-color: none"`
    }
    let times;
    if (data.game.max_turn_replies >= 1) {
        times = `còn ${data.game.max_turn_replies} lần`;
    } else {
        times = "Hết số lần trả lời";
    }
 
    for (let i = 0; i < number_cells; i++) {
        if (rewards.includes(i)) {
            img_cells += ` <div class='img_cell' style="background-color: none" id="grid-${i}">
                 <span >${i}</span>
            </div>
            `
        } else {
            img_cells += ` <div class='img_cell' ${hideImg} id="grid-${i}">
            <span >${i}</span>
            </div>
           `
        }
    }
    let header = `
               
    `
 
    let img_grid = `
            <div class='grid-img ' style="--col:${cols}; background-image:url('${data.game.root_image}');">
                ${img_cells}
            </div>
            `
    let textfield = '';
    if(isGameEnd === -1) {
        textfield = `
        <div class="key_input">
            <label class="lable" id ="lable-key">Nhập từ khóa trò chơi (<b>${times}</b>)</label>
            <input type="text" placeholder="vd: XINCHAO" id="key">
            <p id="err_p" style="color:#de3232; margin-bottom:10px"></p>
            <button onclick="CheckKey()" id="btn-key">Trả lời</button>
        </div>
        `
    } else {
        textfield = `<div class="key_input">
            <div class="win-text">Trò chơi kết thúc</div>
        </div>`
    }

    let win = `
        <div class="win-game" id = "win" onclick="closeWinBanner(this)">
        <p style="">Chúc mừng, bạn đã chiến thắng</p>
        <img src="${data.game.win}" alt="">
        </div>
    `
 
    let lose = `
            <div class="lose-game" id = "lose" onclick="closeWinBanner(this)" ${isGameEnd === 2&& "style='display:block; transition-delay: 2s;'"}>
            <p style="">Game Over!</p>
            <img src="${data.game.loss}" alt="">
            </div>
        `
 
    return `
            <div>
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

const closeWinBanner = (i) => {
    i.style.display = 'none'
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
    let lable_key = document.getElementById("lable-key")
    let a = document.getElementById("key").value;

    if (a == data.game.key) {
        data.game.picked = 1;
        let imgs = document.querySelectorAll('.img_cell');
        for (let i = 0; i < imgs.length; i++) {
            imgs[i].style.backgroundColor = "transparent"
        }
        document.getElementById("win").style.display = "block";
        flowerFalling();
        document.querySelector('.key_input').innerHTML = "<div class='win-text'>Xin chúc mừng bạn!<div>"
    } else {
        data.game.picked = 2;
        data.game.max_turn_replies--;
        if (data.game.max_turn_replies >= 1) {
            lable_key.innerHTML = `Nhập từ khóa trò chơi (<b>còn ${data.game.max_turn_replies} lần</b>)`;
            // document.getElementById("err_p").innerText = `Đáp án chưa chính xác, bạn còn ${data.game.max_turn_replies} lần!`;
        } else {
            document.getElementById("lose").style.display = "block";
            data.game.picked = 2;
            lable_key.innerHTML = `Nhập từ khóa trò chơi (<b>Hết số lần trả lời</b>)`;
            // document.getElementById("err_p").innerText = `Hết số lần trả lời`;
            document.getElementById('key').style.display = 'none';
            document.getElementById('btn-key').style.display = 'none';
        }
        // console.log(times);
    }


}

////////////////////////////////////////////////////////////////

