const ADD_QA_BTN = '#add-QA-btn';
const ADD_ANSWER_BTN = '#add-answer-btn'
const SHOW_LOCATIONID_BTN = '#showLocationId-btn'
const ADD_Q_IMG_BTN = '#add-q-img'

const ANSWER_LIST = '#answers-list'
const LOCATIONID_LIST = '#locationId-list'
const QUESTION_CONTENT = '#locationId-list'

const MAX_ANSWER_INPUT = 5
let currentAnswerNum = 1;

$(document).ready(() => {
    $(ADD_QA_BTN).click(()=>{
        console.log('oke')
    })
    $(ADD_ANSWER_BTN).click(()=>{
        if(currentAnswerNum >= MAX_ANSWER_INPUT) {
            addToast(document.getElementById('toasts'), {
                type: "error",
                message: `${MAX_ANSWER_INPUT} là lớn nhất rồi nhé!`, 
                title:'Thông tin cho bạn',
                duration: 3000
            })
        } else {
            addAnswer();
        }
    })
    $(SHOW_LOCATIONID_BTN).click(()=>{
       $(LOCATIONID_LIST).toggle("fast");
    })

    $(LOCATIONID_LIST).append(renderLocationIdList())
})

const questionForm = () => {
    let data =             {
        id: "",
        content: "",
        images: [],
        answers: [
           {
              content:"",
              images: [""],
              is_correct: false
           }
        ],
        reward: 0
     };
    
    $

     const answer_Form = () => {

     }

}

const renderLocationIdList = () => {
    let locationIdList = '';
    let {locations} = state;

    function addList(value) {
        locationIdList += `
            <div onclick='selectLocationId(this)'>
                <p>${value.id}</p> 
            </div>
        `
    }
    locations.forEach(addList);
    $(SHOW_LOCATIONID_BTN).text(locations[0].id)
    return locationIdList;
}

const selectLocationId = (e) => {
    let text = e.querySelector("p").innerHTML;
    $(SHOW_LOCATIONID_BTN).text(text)
    $(LOCATIONID_LIST).toggle("fast");
}

const addAnswer = () => {
    let delBtn = document.querySelector(`${ANSWER_LIST} .del-answer-form`);
    if(delBtn !== null) {
        delBtn.remove();
    }
    currentAnswerNum = currentAnswerNum + 1;
    $(ANSWER_LIST).append(answerForm(currentAnswerNum));
    $(ANSWER_LIST).scrollTop(Number.MAX_SAFE_INTEGER);
}
const answerForm = (num) => {
    let html = `
    <div class="textfield text-del-row">
        <input type="text" name="answer" id='answer_${num}' placeholder="vd: Được A+"/>
        <label for="answer">Đáp án ${num}</label>
        ${delAnserInputBtn(num)}
    </div>
    `
    return {
        html: () => html,
        getData: () => {
            return $(`#answer_${num}`).val()
        }
    }
}

const delAnswerInput = (e) =>{
    $(`${ANSWER_LIST} .text-del-row:nth-child(${e})`).remove();
    e = e - 1;
    currentAnswerNum = e;
    if(e != 1) {
        $(`${ANSWER_LIST} .text-del-row:nth-child(${e})`).append(delAnserInputBtn(e))
    }
}

const delAnserInputBtn = (num) => {
    return `
        <div class="del-answer-form" onClick='delAnswerInput(${num})' id="del-answer-input">x</div>
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
            if(!link.startsWith('https')) {
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
      let url = form.getData()

    $('#save_Qimage').click(() => {
        if(form.validate()) {
            $(ADD_Q_IMG_BTN).before(imageAppendForm('https://tinypng.com/images/social/website.jpg'))
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
        <button><i class='bx bxs-x-circle'></i></button>
    </div>`
}