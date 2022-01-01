let indexNumber = 0
let questionNumber = 1
let rewards = [];
let times = 5;


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
                <h1>Câu ${reward}, ${question.content}</h1>
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


    for (let index = 0; index < options.length; index++) {
        if (options[index].value === 'true' && options[index].checked === true) {

            data.locations[indexLocation].picked = index;
            rewards.push(reward);

            setTimeout(() => {
                document.getElementById("option-" + pick + "-label").classList.add("answer-correct");
                document.querySelector('.submit-button-container').remove();
                setTimeout(() => {
                    showGamePopup();
                }, 1000);
            }, 1000);

        } else if (options[index].value === 'false' && options[index].checked === true) {
            data.locations[indexLocation].picked = index;

            setTimeout(() => {
                document.getElementById("option-" + pick + "-label").classList.add("answer-correct");
                document.getElementById("option-" + index + "-label").style.backgroundColor = "red";
                document.querySelector('.submit-button-container').remove();

                addToast(document.getElementById('toasts'), {
                    type: 'success',
                    title: 'Bạn đã trả lời sai!',
                    message: 'Chúc bạn may mắn lần sau!',
                    duration: 3000
                })
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
    if (document.getElementById('myModal').style.display !== "block") {
        ele.click();
    } else {
        ele.click();
        ele.click();
    }
    addToast(document.getElementById('toasts'), {
            type: 'success',
            title: 'Xin chúc mừng!',
            message: 'Bạn đã mở khoá thêm một mảnh ghép hình ảnh!',
            duration: 3000
        })
        // console.log();
        // document.getElementById(`grid-${reward}`).style.background = "none";
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
    let footer = '';
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
    let hideImg = `style="background-color: #afafaf"`

    if (isGameEnd !== -1) {
        hideImg = `style="background-color: none"`
    }

    for (let i = 0; i < number_cells; i++) {

        if (rewards.includes(i)) {
            img_cells += ` <div class='img_cell' style="background-color: none" id="grid-${i}">
                 <span>${i}</span>
            </div>
            `
        } else {
            img_cells += ` <div class='img_cell' ${hideImg} id="grid-${i}">
                <span>${i}</span>
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

    let textfield = isGameEnd === -1 ? `
            <div class="key_input">
                <label class="lable">Nhập từ khóa trò chơi</label>
                <input type="text" placeholder="vd: XINCHAO" id="key">
                <p id="err_p" style="color:#de3232; margin-bottom:10px"></p>
                <button onclick="CheckKey()" id="btn-key">Trả lời</button>
            </div>
            ` : `<div class="key_input">
            <label class="lable">Trò chơi kết thúc</label>
        </div>`

    let win = `
        <div class="win-game" id = "win" onclick="closeWinBanner(this)">
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

    let a = document.getElementById("key").value;
    if (a == data.game.key) {
        data.game.picked = 1;
        let imgs = document.querySelectorAll('.img_cell');

        for (let i = 0; i < imgs.length; i++) {
            imgs[i].style.backgroundColor = "transparent"
        }
        document.getElementById("win").style.display = "block";
        flowerFalling()
    } else {
        data.game.max_turn_replies--;
        if (data.game.max_turn_replies >= 1) {
            document.getElementById("err_p").innerText = `Đáp án chưa chính xác, bạn còn ${data.game.max_turn_replies} lần!`;
        } else {
            document.getElementById("lose").style.display = "block";
            document.getElementById("err_p").innerText = `Hết số lần trả lời`;
        }
        // console.log(times);
    }

}