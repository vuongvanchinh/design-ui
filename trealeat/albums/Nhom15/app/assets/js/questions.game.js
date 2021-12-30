const ADD_QA_BTN = '#add-QA-btn';
const ADD_ANSWER_BTN = '#add-answer-btn'
const ADD_QUESTION_IMG_BTN = '#add-question-img'

const ANSWER_LIST = '#answers-list'
const QUESTION_LIST = '#question-list'
const QA_CONTAINER ='#QA-container'
const QA_LIST_CONTAINER ='#QA-list-container'

$(document).ready(() => {
    // let questionForm =  quizForm();
    // renderQuestionList()
    // questionForm.render();
    // questionForm.setup();
    // $(ADD_QA_BTN).click(()=>{
    //     if(questionForm.validate()) {
    //         let data = questionForm.getData()
    //         // $(QUESTION_LIST).append(appendIDQuestion(data).html());
    //         state.game.questions.push(data)
    //         renderQuestionList()
    //         addToast(document.getElementById('toasts'), {
    //             type: "success",
    //             message: `Thêm câu hỏi thành công`,
    //             title: "Xong!",
    //             duration: 3000
    //         })

    //         let form =  quizForm();
    //         form.render();
    //         form.setup();
    //     }
    // })
    initRender();
})

const initRender = () => {
    let questionForm =  quizForm();
    renderQuestionList()

    questionForm.render();
    questionForm.setup();
    $(ADD_QA_BTN).click(()=>{
        if(questionForm.validate()) {
            let data = questionForm.getData()
            // $(QUESTION_LIST).append(appendIDQuestion(data).html());
            state.game.questions.push(data)
            renderQuestionList()
            addToast(document.getElementById('toasts'), {
                type: "success",
                message: `Thêm câu hỏi thành công`,
                title: "Xong!",
                duration: 3000
            })

            initRender();
        }
    })
}

const quizForm = () => {
     const html = () => `
        <div class="form-card">
            <div class="form-card-header">
                <p>Thêm câu hỏi</p>
            </div>
            <div class="form-card-body">
                <div class="section">
                    <div class="textfield" style="margin-bottom: 1rem;">
                        <input type="text" name="question" placeholder="vd: Một cộng một bằng mấy?" id="question_content" />
                        <label for="question">Câu hỏi</label>
                        <p style="display: none" class='error-message'></p>
                    </div>

                    <div class="QA-card-form">
                        <p>Hình ảnh cho câu hỏi:</p>

                        <div></div>
                        <div class="question-image-list">
                            <div class="question-image" id="add-question-img" onclick='addQImage("select-QA-image")'> 
                                <i class='bx bx-image-add'></i>
                            </div>
                        </div>
                    </div>

                    <div class="QA-card-form">
                        <p>Thêm câu trả lời</p>
                        <table>
                            <thead>
                                <tr>
                                    <th >Đúng/Sai</th>
                                    <th >Ảnh</th>
                                    <th style="width: 75%;text-align: start">Câu trả lời</th>
                                    <th>   </th>
                                </tr>
                            </thead>
                            <tbody id="answers-list">
                            <tr>
                                <td><input type="checkbox" /></td>
                                <td style="padding: 0 10px;">
                                    <div class="answer-img" id="add-answer-img1" onclick='addAImage(this)'> 
                                        <i class='bx bx-image-add'></i>
                                    </div>
                                </td>
                                <td>
                                    <div class="textfield text-del-row" >
                                        <input type="text" name="answer" placeholder="vd: Bằng 10" />
                                        <label for="answer">Đáp án 1</label>
                                        <p style="display: none" class='error-message'></p>
                                    </div>
                                </td>
                                <td style="padding: 0 10px;">
                                    <div style="padding:0 1rem 0.2rem 1rem;"></div>
                                </td>
                            </tr>
                            </tbody>
                        </table>

                        <div class="add-A" style="margin-top: 1rem;">
                            <button class="add-answers" id="add-answer-btn" onclick="addAnswer()">Thêm câu trả lời</button>
                        </div>

                        <div class="reward">
                        <p>Phần thưởng</p>
                        <form>
                            <div class="triggervalue-button left-decrease" onclick="decreaseValue()" value="Decrease Value">-</div>
                            <input type="number" id="rewardId" value="0" disabled />
                            <div class="triggervalue-button right-increase" onclick="increaseValue()" value="Increase Value">+</div>
                            <div style="display: none" class='error-message'></div>
                        </form>
                       
                    </div>
                    </div>
                    <div class="add-QA" style="margin-top: 1rem;" id="add-QA-btn">
                        <button>Thêm vào danh sách</button>
                    </div>
                </div>
            </div>
        </div>
     `

     let questionId = parseInt(state.game.questions[state.game.questions.length - 1].id.split("_")[1]);

     const increaseQuestionId = () => {
        questionId ++;
        return `question_${questionId}`
     } 

     const answers = () => { 
         let data = [];
         $(`${ANSWER_LIST} tr`).each(function(){
            let isAnswer = $(this).find('input[type=checkbox]').is(":checked")
            let imgUrl = $(this).find('div.answer-img').css('background-image')
            imgUrl = imgUrl.replace('url("','').replace('")','');
            if(imgUrl === 'none') {
                imgUrl = ''
            }
            let images = [];
            images.push(imgUrl);
            data.push({content: $(this).find('input[type=text]').val(), isAnswer, images: images });
         })
         return data;
     }
     const getQuestionImg = () => {
        let images = [];
        $(".QA-card-form .question-image-list").find('.question-image img').each( function() {
            images.push($(this).attr('src'))
        })
        return images;
     }

     const getRewardId = () => parseInt(document.getElementById('rewardId').value, 10)

     const validate = () => {
            let success = true
            let range = state.game.rows * state.game.cols - 1;
            let reward = $('#rewardId').val()
            if(!$('#question_content').val()) {
                $('#question_content').next().next().text('Bạn không được bỏ trống câu hỏi')
                $('#question_content').next().next().show()
                $('#question_content').focus();
                success = false
            } else {
                $('#question_content').next().next().text('')
            }
            if(reward >= range|| reward < 0) {
                $('#rewardId').next().next().text(`Id của phần thưởng nằm trong khoảng từ 0 - ${range}`)
                $('#rewardId').next().next().show()
                $('#rewardId').focus();
                success = false
            }else {
                $('#rewardId').next().next().hide();
            }
            $(`${ANSWER_LIST} tr`).each(function(){
                if(!$(this).find('input[type=text]').val()) {
                    $(this).find('input[type=text]').next().next().text('Bạn không được bỏ trống câu trả lời')
                    $(this).find('input[type=text]').next().next().show()
                    $(this).find('input[type=text]').focus()
                    success = false
                } else {
                    $(this).find('input[type=text]').next().next().hide();
                }
            })
            return success
     }

     const setup = () => {
        $('#question_content').change(() => {
            let name = $('#question_content')
            if(!name.val().trim()) {
                name.next().next().text('Bạn không được bỏ trống câu hỏi')
                name.next().next().show()
                name.focus();
            } else {
                name.next().next().hide();
            }
        })
        $(`${ANSWER_LIST} tr`).each(function(){
            let input = $(this).find('input[type=text]')
            $(this).find('input[type=text]').change(() => {
                if(!input.val()) {
                    $(this).find('input[type=text]').next().next().text('Bạn không được bỏ trống câu trả lời')
                    $(this).find('input[type=text]').next().next().show()
                    $(this).find('input[type=text]').focus()
                } else {
                    $(this).find('input[type=text]').next().next().hide();
                }
            })
        })
        $(`${ANSWER_LIST} tr`).each(function(){
            let input = $(this).find('input[type=text]')
            $(this).find('input[type=text]').change(() => {
                if(!input.val()) {
                    $(this).find('input[type=text]').next().next().text('Bạn không được bỏ trống câu trả lời')
                    $(this).find('input[type=text]').next().next().show()
                    $(this).find('input[type=text]').focus()
                } else {
                    $(this).find('input[type=text]').next().next().hide();
                }
            })
        })

     }
     
     return {
         render: () => $(QA_CONTAINER).html(html),
         getData: () => {
            return {
                id: increaseQuestionId(),
                content: $('#question_content').val(),
                images : getQuestionImg(),
                answers: answers(),
                reward: getRewardId()
            };
        }, 
        validate: () => validate(),
        setup: () => setup()
     }
}

const UpdateQuestionForm = (data) => {

    let questionImages = ''
    let answerContent = ''

    for (let i = 0; i < data.images.length; i++) {
        questionImages += imageAppendForm(data.images[i])
    }

    for (let i = 0; i < data.answers.length; i++) {
        answerContent += updateAnswerForm(i+1, data.answers[i].content, data.answers[i].images[0], data.answers[i].isAnswer);
    }


     const html = () => `
        <div class="form-card">
            <div class="form-card-header" style="display: flex; justify-content:space-between">
                <p>Chỉnh sửa câu hỏi</p>
                <div style="margin-right: 2rem;">
                    <button class="btn btn btn-save" id="back-to-add-questions">Quay lại</button>
                </div>
            </div>
            <div class="form-card-body">
                <div class="section">
                    <div class="textfield" style="margin-bottom: 1rem;">
                        <input type="text" name="question" placeholder="vd: Một cộng một bằng mấy?" id="question_content" value="${data.content}" />
                        <label for="question">Câu hỏi</label>
                        <p style="display: none" class='error-message'></p>
                    </div>

                    <div class="QA-card-form">
                        <p>Hình ảnh cho câu hỏi:</p>

                        <div></div>
                        <div class="question-image-list">
                        ${questionImages}
                            <div class="question-image" id="add-question-img" onclick='addQImage("select-QA-image")'> 

                                <i class='bx bx-image-add'></i>
                            </div>
                        </div>
                    </div>

                    <div class="QA-card-form">
                        <p>Chỉnh sửa câu trả lời</p>
                        <table>
                            <thead>
                                <tr>
                                    <th>Đúng/Sai</th>
                                    <th>Ảnh</th>
                                    <th>Câu trả lời</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody id="answers-list">

                                ${answerContent}

                            </tbody>
                        </table>

                        <div class="add-A" style="margin-top: 1rem;">
                            <button class="add-answers" id="add-answer-btn" onclick="addAnswer()" >Thêm câu trả lời</button>
                        </div>

                        <div class="reward">
                        <p>Phần thưởng</p>
                        <form>
                            <div class="triggervalue-button left-decrease" onclick="decreaseValue()" value="Decrease Value">-</div>
                            <input type="number" id="rewardId" value="${data.reward}" />
                            <div class="triggervalue-button right-increase" onclick="increaseValue()" value="Increase Value">+</div>
                            <div style="display: none" class='error-message'></div>
                        </form>
                       
                    </div>
                    </div>
                    <div class="add-QA" style="margin-top: 1rem;" id="SubmitEditQA-Btn">
                        <button>Xác nhận chỉnh sửa</button>
                    </div>
                </div>
            </div>
        </div>
     `

     const answers = () => { 
        let data = [];
        $(`${ANSWER_LIST} tr`).each(function(){
           let isAnswer = $(this).find('input[type=checkbox]').is(":checked")
           let imgUrl = $(this).find('div.answer-img').css('background-image')
           imgUrl = imgUrl.replace('url("','').replace('")','');
           if(imgUrl === 'none') {
               imgUrl = ''
           }
           let images = [];
           images.push(imgUrl);
           data.push({content: $(this).find('input[type=text]').val(), isAnswer, images: images });
        })
        return data;
    }

    const getQuestionImg = () => {
       let images = [];
       $(".QA-card-form .question-image-list").find('.question-image img').each( function() {
           images.push($(this).attr('src'))
       })
       return images;
    }

    const getRewardId = () => parseInt(document.getElementById('rewardId').value, 10)

    const validate = () => {
           let success = true
           let range = state.game.rows * state.game.cols - 1;
           let reward = $('#rewardId').val()
           if(!$('#question_content').val()) {
               $('#question_content').next().next().text('Bạn không được bỏ trống câu hỏi')
               $('#question_content').next().next().show()
               $('#question_content').focus();
               success = false
           } else {
            $('#question_content').next().next().hide();
           }
           if(reward >= range|| reward < 0) {
               $('#rewardId').next().next().text(`Id của phần thưởng nằm trong khoảng từ 0 - ${range}`)
               $('#rewardId').next().next().show()
               $('#rewardId').focus()
               success = false
           } else {
                $('#rewardId').next().next().hide();
           }
           $(`${ANSWER_LIST} tr`).each(function(){
               if(!$(this).find('input[type=text]').val()) {
                   $(this).find('input[type=text]').next().next().text('Bạn không được bỏ trống câu trả lời')
                   $(this).find('input[type=text]').next().next().show()
                   !$(this).find('input[type=text]').focus()
                   success = false
               } else {
                    $(this).find('input[type=text]').next().next().hide();
               }
           })
           return success
    }
    const setup = () => {
        $('#question_content').change(() => {
            let name = $('#question_content')
            if(!name.val().trim()) {
                name.next().next().text('Bạn không được bỏ trống câu hỏi')
                name.next().next().show()
                name.focus();
            } else {
                name.next().next().hide();
            }
        })
        $(`${ANSWER_LIST} tr`).each(function(){
            let input = $(this).find('input[type=text]')
            $(this).find('input[type=text]').change(() => {
                if(!input.val()) {
                    $(this).find('input[type=text]').next().next().text('Bạn không được bỏ trống câu trả lời')
                    $(this).find('input[type=text]').next().next().show()
                    $(this).find('input[type=text]').focus()
                } else {
                    $(this).find('input[type=text]').next().next().hide();
                }
            })

        })
     }
     return {
         render: () => $(QA_CONTAINER).html(html),
         getData: () => {
            return {
                id: data.id,
                content: $('#question_content').val(),
                images : getQuestionImg(),
                answers: answers(),
                reward: getRewardId()
            };
        }, 
        validate: () => validate(),
        setup: () => setup(),
     }
}

const renderQuestionList = () => {
    let questionList = questionItem();
    const header = ['ID', 'Câu hỏi', '']
    let questionNum = state.game.questions.length
    let title = `<h3>Danh sách câu hỏi</h3>`
    let html = table(header,questionList,"question-list",title,`Đang có ${questionNum} câu hỏi`)

    return $(QA_LIST_CONTAINER).html(html)
}

const questionItem = () => {
    let html = ``;
    for (let i = 0; i < state.game.questions.length; i++) {
        html += `
        <tr ondblclick="showUpdateQuestion('${i}',this)">
            <td>
                <div >
                    <p>${state.game.questions[i].id}</p>
                </div>
            </td>
            <td>
                <div>
                    <p>${state.game.questions[i].content}</p>
                </div>
            </td>
            <td>
                <div>
                    ${dropdown("<i class='bx bx-dots-vertical-rounded circle-icon'></i>", `
                        <div class="btn-del" onclick="deleteQuestionItem(${i})">Xóa</div>
                    `).getHtml()}
                </div>
            </td>
        </tr>
        `
    }
    return html;
}

const deleteQuestionItem = (index) => {
    let footer = `
        <div class="flex space-between">
            <button class="btn btn-light" id='no-delete'>Không</button>
            <button class="btn btn-danger" id='confirm-delete'>Có</button>
        </div>
    `
    let m = modal(``,`Cảnh báo!Bạn có chắc muốn xóa ${state.game.questions[index].id}?` , footer, 'confirm-delete-modal','confirm-delete-modal', false, 'small')

    $('#game').prepend(m.getHtml())

    $('#no-delete').click(() => {
        m.close()
        m=null   
        $(`#question-list .dropdown-content`).removeClass('drop')
    })

    $('#confirm-delete').click(() => {
        state.game.questions.splice(index, 1)
        $(`#question-list .dropdown-content`).removeClass('drop')
        m.close()
        m = null
        addToast(document.getElementById('toasts'), {
            type: 'success',
            title: 'Đã xong!',
            message: 'Đã xóa thành công!',
            duration: 3000
        })
        renderQuestionList();
    })
}

const showUpdateQuestion = (index, e) => {
    for(let i = 0; i < e.parentElement.children.length; i++) {
        e.parentElement.children[i].classList.remove('selected-question-item')
    }
    e.classList.add('selected-question-item');
    let form  = UpdateQuestionForm(state.game.questions[parseInt(index)]);
    form.render();
    form.setup();

    $("#SubmitEditQA-Btn").click(() => {
        if(form.validate()) {
            state.game.questions[parseInt(index)] = {...form.getData()};
            renderQuestionList()
            addToast(document.getElementById('toasts'), {
                type: "success",
                message: `Chỉnh sửa câu hỏi thành công`,
                title: "Xong!",
                duration: 3000
            })
        let questionForm = quizForm();
            questionForm.render()
            console.log(questionForm.render());
            for(let i = 0; i < e.parentElement.children.length; i++) {
                e.parentElement.children[i].classList.remove('selected-question-item')
            }
            questionForm.setup();
    
        $("#add-QA-btn").click(()=>{
            questionForm.setup();
            if(questionForm.validate()) {
                let data = questionForm.getData()
                // $(QUESTION_LIST).append(appendIDQuestion(data).html());
                state.game.questions.push(data)
                renderQuestionList()
                addToast(document.getElementById('toasts'), {
                    type: "success",
                    message: `Thêm câu hỏi thành công`,
                    title: "Xong!",
                    duration: 3000
                })
            }
        })
        }


    })
    $('#question_content').focus();
    let questionForm = quizForm();
    $("#back-to-add-questions").click(() => {
        questionForm.render()
        console.log(questionForm.render());
        for(let i = 0; i < e.parentElement.children.length; i++) {
            e.parentElement.children[i].classList.remove('selected-question-item')
        }
        questionForm.setup();
        $("#add-QA-btn").click(()=>{
            if(questionForm.validate()) {
                questionForm.setup();
                let data = questionForm.getData()
                // $(QUESTION_LIST).append(appendIDQuestion(data).html());
                state.game.questions.push(data)
                renderQuestionList()
                addToast(document.getElementById('toasts'), {
                    type: "success",
                    message: `Thêm câu hỏi thành công`,
                    title: "Xong!",
                    duration: 3000
                })
                initRender();
            }
        })
    })
}

const increaseValue = () => {
    var value = parseInt(document.getElementById('rewardId').value, 10);
    value = isNaN(value)|| value >= state.game.rows * state.game.cols - 1 ? -1 : value;
    value++;
    document.getElementById('rewardId').value = value;
}
  
const  decreaseValue = () => {
    var value = parseInt(document.getElementById('rewardId').value, 10);
    value = isNaN(value) ? 0 : value;
    value < 1  ? value = state.game.rows * state.game.cols : '';
    value--;
    document.getElementById('rewardId').value = value;
}

const addAnswer = () => {
    let num = $(ANSWER_LIST).children().length + 1
    let form = answerForm(num,'');

    if(num > 5) {
        addToast(document.getElementById('toasts'), {
            type: "info",
            message: `Đáp án chỉ tối đa ${num - 1 } câu`,
            title: "Thông tin cho bạn!",
            duration: 3000
        })
    } else {
        // let delBtn = document.querySelector(`${ANSWER_LIST} .del-answer-form`);
        // if(delBtn !== null) {
        //     delBtn.parentElement.remove();
        // }
        $(ANSWER_LIST).append(form.html);
        form.setup();
    }
    // $(ANSWER_LIST).scrollTop(Number.MAX_SAFE_INTEGER);
}

const answerForm = (num, value='') => {
    let html = `
    <tr>
        <td><input type="checkbox"/></td>
        <td style="padding: 0 10px;">
            <div class="answer-img" id="add-answer-img${num}" onclick='addAImage(this)'> 
                <i class='bx bx-image-add'></i>
            </div>
        </td>
        <td>
            <div class="textfield text-del-row" >
                <input type="text" name="answer" placeholder="vd: Bằng 10" value="${value}"/>
                <label for="answer">Đáp án ${num}</label>
                <p style="display: none" class='error-message'></p>
            </div>
        </td>
        <td style="padding: 0 10px;">
            <button class="del-answer-form" onClick='delAnswerInput(this)'>x</button>
        </td>
    </tr>
    `
    const setup = () => {
        let answer = $(`${ANSWER_LIST} tr:nth-child(${num})`)
        answer.find('input[type=text]').change(() => {
            if(!answer.find('input[type=text]').val()) {
                answer.find('input[type=text]').next().next().text('Bạn không được bỏ trống câu trả lời')
                answer.find('input[type=text]').next().next().show()
                answer.find('input[type=text]').focus()
            } else {
                answer.find('input[type=text]').next().next().hide();
            }
        })
        answer.find('input[type=checkbox]').change(() => {
            isAnswer = num -1;
        })
        // .each(function(){
        //     if(!$(this).find('input[type=text]').val()) {
        //         $(this).find('input[type=text]').next().next().text('Bạn không được bỏ trống câu trả lời')
        //         $(this).find('input[type=text]').next().next().show()
        //         $(this).find('input[type=text]').focus()
        //         success = false
        //     } else {
        //         $(this).find('input[type=text]').next().next().hide();
        //     }
        // })
    }
    return {
        html,
        setup: () => setup(),
    };
}
const updateAnswerForm = (num, value='',imageUrl, isAnswer) => {
    let imageStyle = imageUrl? `style="background-image: url(${imageUrl})"`:"";
    let disableImg = imageUrl? `disableImg`:"";
    isAnswer = isAnswer ? `checked`: "";

    let html = `
    <tr>
        <td><input type="checkbox" ${isAnswer}/></td>
        <td style="padding: 0 10px;">
            <div class="answer-img " id="add-answer-img${num}" ${imageStyle} onclick='addAImage(this,"${imageUrl}")'> 
                <i class='bx bx-image-add ${disableImg}'></i>
            </div>
        </td>
        <td>
            <div class="textfield text-del-row" >
                <input type="text" name="answer" placeholder="vd: Bằng 10" value="${value}"/>
                <label for="answer">Đáp án ${num}</label>
                <p style="display: none" class='error-message'></p>
            </div>
        </td>
        <td style="padding: 0 10px;">
            <button class="del-answer-form" onClick='delAnswerInput(this)'>x</button>
        </td>
    </tr>
    `
    return html;
}

// const delAnswerInput = (e) =>{
//     e.parentElement.parentElement.remove()
//     if($(`${ANSWER_LIST} tr td`).length !== 4) {
//         $(`${ANSWER_LIST} tr:last-child`).append(delAnserInputBtn())
//     }
// }

const delAnswerInput = (e) =>{
    e.parentElement.parentElement.remove();
    $(`${ANSWER_LIST} tr`).each(function(index){
        $(this).find('input[type=text]').next().text(`Đáp án ${index + 1}`)
    })
}

const delAnserInputBtn = () => {
    return `
    <td style="padding: 0 10px;">
        <button class="del-answer-form" onClick='delAnswerInput(this)'>x</button>
    </td>
    `
}

const imageQForm = (name, id) => {
    let html = `
        <div class="textfield">
            <input type="text" name="${name}" placeholder="https://..." id="${id}" />
            <label for="key">Link ảnh</label>
            <p class='error-message' id='link_image'></p>
        </div>
    `

    return {
        getHtml: () => html,
        validate: () => {
            let link = $(`#${id}`).val()
            let success = true
            if(!link.startsWith('http')) {
                $('#link_image').text('bạn cần nhập link đúng định dạng.')
                success = false
            } else {
                $('#link_image').text('')
            }
            return success
        },
        getData: () => {
            return $(`#${id}`).val()
        }
    }
}

const addQImage = (name) => {
    
    let form = image_form('root_image', name)
    let footer = `
        <button class='btn btn-light'id="cancel_Qimage">Hủy</button>
        <button class='btn btn-save' id="save_Qimage">Lưu</button>
    `
    let md = modal('Thay đổi hình ảnh', form.getHtml(), footer, 'image_id', 'image_id', false, 'medium')
    $('#game').prepend(md.getHtml())
    
    $('#cancel_Qimage').click(() => {
        md.close()
    })

    $('#save_Qimage').click(() => {
        if(form.validate()) {
            let url = form.getData()
            $(ADD_QUESTION_IMG_BTN).before(imageAppendForm(url))
            md.close()
            addToast(document.getElementById('toasts'), {
                type: "success",
                message: "Đã thay đổi thành công.",
                title: "Xong!",
                duration: 3000
            })
        }
    })
}
const addAImage = (e, imageUrl='') => {
    let num = $(ANSWER_LIST).children().length + 1;
    let form = image_form('root_image', num, imageUrl)
    let footer = `
        <button class='btn btn-light'id="cancel_Aimage">Hủy</button>
        <button class='btn btn-save' id="save_Aimage">Lưu</button>
    `
    let md = modal('Thay đổi hình ảnh', form.getHtml(), footer, 'image_id', 'image_id', false, 'medium')
    $('#game').prepend(md.getHtml())
    form.setup()
    $('#cancel_Aimage').click(() => {
        md.close()
    })

    $('#save_Aimage').click(() => {
        if(form.validate()) {
            e.style.backgroundImage  = `url('${form.getData()}')`
            let icon = e.querySelector('i')
            icon.classList.add('disableImg')
            md.close()
            addToast(document.getElementById('toasts'), {
                type: "success",
                message: "Đã thay đổi thành công.",
                title: "Xong!",
                duration: 3000
            })
        }
    })
}

const imageAppendForm = (url) => {
    return `
    <div class="question-image" > 
        <img src="${url}" alt="">
        <button onclick='delQImage(this)'><i class='bx bxs-x-circle'></i></button>
    </div>`
}

const delQImage = (e) => {
    e.parentElement.remove();
}