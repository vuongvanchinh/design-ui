$(document).ready(() => {
    renderLocationPage()
})
const renderLocationPage = () => {
    let body = ''
    for (i = 0; i < state.locations.length; i++) {
        let questionString = '';
        
        for (let j = 0; j < state.locations[i].question_ids.length; j++) {
            let index = state.game.questions.findIndex(question => question.id === state.locations[i].question_ids[j])
            let string = ''
            if(index === -1) {
                string = '<p class="error-message">Không tồn tại</p>';
            } else {
                string = state.game.questions[index].content;
            }
            if(questionString !== '') {
                questionString += ',';
            }
            questionString += string
        }

        body += `
            <tr id='${state.locations[i].id}'>

                <td>${state.locations[i].id}</td>
                <td>${state.locations[i].name}</td>
                <td ><p class="oneline">${state.locations[i].media}</p></td>
                <td><p class="oneline">${questionString}</p></td>
                <td></td>
                <td>
                    ${dropdown("<i class='bx bx-dots-vertical-rounded circle-icon'></i>", `
                        <div class="btn-del" onclick="deleteLocation('${state.locations[i].id}')">Xóa</div>
                    `).getHtml()}
                </td>
            </tr>
        `
        state.locations[i].picked = -1;
    }

    const location_headers = ['Id', 'Tên', 'Id Hình ảnh/video...','Id câu hỏi','']
    $('#location-content').append(table(location_headers, body, 'locations-table', 'Các địa điểm', `Đang có ${state.locations.length} địa điểm.`))
    $('#locations-table tbody tr').dblclick((e) => {
        // console.log(e)
        if ($(e.target).is('td')) {
            let id = $(e.target).parent().attr('id');
            updateLocation(id)
        }
    } )
}

const location_form = (dt = {id: false, name:'', description: '', media: [], question_ids:[]}) => {
    let form = `
    
    <form>
        <div class="form-card">
            <div class="form-card-header">
            Thông tin chung
            </div>
            <div class="form-card-body">
                <div class="textfield">
                    <input type="text" name="location_name" 
                        placeholder="Tên" 
                        id="location_name" 
                    />
                    <label for="location_name">Tên</label>
                    <p class='error-message'></p>
                </div>
                
                <div>
                    <label for="location_description">Mô tả</label>
                    <textarea  id="location_description">

                    </textarea>
                </div>
            </div>
        </div>
        <div class="form-card">
            <div class="form-card-header">
                Media
            </div>
            <div class="form-card-body">
              
               <div id='medias' class='child_setparate'>
                <div class="textfield">
                    <input type="text" name="media-ids" 
                        placeholder="một dãy các số nguyên cách nhau bởi dấu cách" 
                        id="media-ids" 
                    />
                    <label for="media-ids">Media ids</label>
                    <p class='error-message' ></p>
                </div>
               </div>
            </div>
        </div>
        <div class="form-card">
            <div class="form-card-header">
                Câu hỏi
            </div>
            <div class="form-card-body">
               <div id='questions' class='child_setparate'>
                <div class="textfield">
                    <input type="text" name="question-ids" 
                        placeholder="một dãy các số nguyên cách nhau bởi dấu cách" 
                        id="question-ids" 
                    />
                    <label for="question-ids">Các id câu hỏi</label>
                    <p class='error-message'></p>
                </div>
               </div>
            </div>
        </div>
    </form>
    `
    
    return {
        getHtml: () => form,
        getData: () =>{
            return {
                name: $('#location_name').val(),
                description: $('#location_description').val().trim(),
                media: $('#media-ids').val().trim().split(',').map(item => parseInt(item.trim())),
                question_ids: $('#question-ids').val().trim().split(',').map(item => item.trim())
            }
        },
        validate: () => {
            let failed = false;
            let name = $('#location_name').val().trim()
            if (!name) {
                $('#location_name').next().next().text('Mục này không được trống')
                $('#location_name').focus()
                failed = true
            }else {
                $('#location_name').next().next().empty()
            }

            
            let media =  $('#media-ids').val()
            if (!media) {
                $('#media-ids').next().next().text('Mục này cần điền các số nguyên cách nhau bằng dấu phẩy')
                failed = true
                $('#media-ids').focus()
            } else {
                let medias = media.trim().split(',')
                let ok = true
                for (i = 0; i < medias.length; i++) {
                    let item = medias[i]
                    if (isNaN(item.trim())) {
                        failed = true
                        $('#media-ids').next().next().text('Mục này cần điền các số nguyên cách nhau bằng dấu phẩy')
                        ok = false
                        break;
                    }
                }
                if (ok) {
                    $('#media-ids').next().next().empty()
                }
            }

            let question =  $('#question-ids').val()
            if (!question) {
                $('#question-ids').next().next().text('Mục này cần điền các id câu hỏi cách nhau bằng dấu phẩy')
                failed = true
                $('#question-ids').focus()
            } else {
                let questions = question.trim().split(',')
                let ok = true
                for (i = 0; i < questions.length; i++) {
                    let item = questions[i]
                    if (item.trim() === '') {
                        failed = true
                        $('#question-ids').next().next().text('Mục này cần điền các id câu hỏi cách nhau bằng dấu phẩy')
                        ok = false
                        break;
                    }
                }
                if (ok) {
                    $('#question-ids').next().next().empty()
                }
            }
            return failed
        },
        setup: () => {
            $('#location_description').richText().trigger('change');
            // fill data
            if (dt.id) {
                $('#location_name').val(dt.name)
                $('#media-ids').val(dt.media.join(','))
                $('#question-ids').val(dt.media.join(','))
                $('#question-ids').val(dt.question_ids.join(','))
                $('#location_description').val(dt.description).trigger('change')
            }
            $('#location_name').focus();
            $('#location_name').change(() => {
                let name = $('#location_name').val().trim()
                if (!name) {
                    $('#location_name').next().next().text('Mục này không được trống')
                }else {
                    $('#location_name').next().next().empty()
                }
            })
            $('#media-ids').change(() => {
                let media =  $('#media-ids').val()
                if (!media) {
                    $('#media-ids').next().next().text('Mục này cần điền các số nguyên cách nhau bằng dấu phẩy')
                } else {
                    let medias = media.trim().split(',')
                    let ok = true
                    for (i = 0; i < medias.length; i++) {
                        let item = medias[i]
                        if (isNaN(item.trim()) || item.trim() === '') {
                            $('#media-ids').next().next().text('Mục này cần điền các số nguyên cách nhau bằng dấu phẩy')
                            
                            ok = false
                            break;
                        }
                    }
                    if (ok) {
                        $('#media-ids').next().next().empty()
                        
                    }
                }
            })
            $('#question-ids').change(() => {
                let question =  $('#question-ids').val()
                if (!question) {
                    $('#question-ids').next().next().text('Mục này cần điền các id câu hỏi cách nhau bằng dấu phẩy')
                } else {
                    let questions = question.trim().split(',')
                    let ok = true
                    for (i = 0; i < questions.length; i++) {
                        let item = questions[i]
                        if (item.trim() === '') {
                            $('#question-ids').next().next().text('Mục này cần điền các id câu hỏi cách nhau bằng dấu phẩy')
                            ok = false
                            break;
                        }
                    }
                    if (ok) {
                        $('#question-ids').next().next().empty()
                    }
                }
            })
        }
    }
}

const media_form = (dt, type='image') => {
    let form = ''    
    switch (type) {
        case 'YTB':
        case '3d':
        case 'image':
            form = `
                <div class='media-form'>
                    <div class='media-form-header'>
                        <span>${type} form</span>
                        <span class='bx bx-time'></span>
                    </div>
                   <div class='child_setparate'>
                        <div class="textfield">
                            <input type="text" name="media_name" 
                                placeholder="name" 
                                class="media_name"
                            />
                            <label for="media_name">Tên</label>
                        </div>
                        <div class="textfield">
                            <input type="text" name="media_url" 
                                placeholder="url" 
                                class="media_url" 
                            />
                            <label for="media_url">Url</label>
                        </div>
                   </div>
                </div>
            `
            break
        default: break
    }
    
    
    return {
        getHtml: () => {
            return form
        },
        getData: () => {
            return {
                name: $('.media_name').val(),
                url: $('.media_url').val(),
                description: $('.media-description').val().trim(),
                type: type
            }
        },
        setup: () => {
            // $(`.media-description`).richText()
        }
    }
}

const addMedia = (type) => {
    let form = media_form({}, type)
    
    // let m = modal(`Add new ${type}`, form.getHtml(), footer, 'media-form', 'media-form', false, 'medium')
    // $('#media-modal').empty()
    $('#medias').append(form.getHtml())
    console.log(form.getHtml())
    form.setup()
    $(`#add-media-${type}`).click(() => {
        console.log(form.getData())
    })
}

const deleteLocation = (id) => {
    let index = state.locations.findIndex(item => item.id === id)
    if (index === -1) {
        alert('not found')
        return
    }
    let body = `
        <div class="flex space-between">
            <button class="btn btn-light" id='no-delete'>Không</button>
            <button class="btn btn-save" id='confirm-delete'>Có</button>
        </div>
    `

    let header = `Bạn có muốn xoá ${id} này không? <p class="error-message">Nếu xoá, các ô đất có item id là "${id}" cũng nên được sửa!</p>`

    let m = modal(header, body, '', 'confirm-delete-modal','confirm-delete-modal', false, 'small')
    $('#locations-page').prepend(m.getHtml())
    $('#no-delete').click(() => {
        m.close()
        m=null   
        $(`tr#${id} .dropdown-content`).removeClass('drop')
    })

    $('#confirm-delete').click(() => {
        state.locations.splice(index, 1)
        m.close()
        m = null
        $(`tr#${id}`).fadeOut()
        addToast(document.getElementById('toasts'), {
            type: 'success',
            title: 'Đã xong!',
            message: 'Đã xóa thành công!',
            duration: 3000
        })

    })
} 
const addLocation = () => {
    let form = location_form()
    let footer = `
        <div style="padding: .5rem 0">
            <span class='btn btn-light ' id='cancel-location-form' style ='margin-right: 0.5rem;'>Hủy</span>
            <span class='btn btn-save' id='add-location-btn'>Lưu</span>
        </div>
    `
    let m = modal(`<p style='font-weight: 560;'>Thêm địa điểm mới</p>`, form.getHtml(), footer, 'location-form', 'location-form', false, 'medium')
    $('#locations-page').prepend(m.getHtml())
    form.setup()
    $('#cancel-location-form').click(() => {
        m.close()
    })
    $(`#add-location-btn`).click(() => {
        if(!form.validate()) { // not fail
            let lastid = 1
            let l = state.locations.length 
            if (l > 0) {

                lastid = parseInt(state.locations[l - 1].id.split('_')[1])
            } 
            let new_id = `location_${lastid + 1}`
            let dt = form.getData()
            state.locations.push({...dt, id: new_id})

            let questionString = ''
            for (let i = 0; i < dt.question_ids.length; i++) {
                let index = state.game.questions.findIndex(v => v.id === dt.question_ids[i])
                let string = ''
                if(index === -1) {
                    string = '<p class="error-message">Không tồn tại</p>';
                } else {
                    string = state.game.questions[index].content;
                }
                if(questionString !== '') {
                    questionString += ',';
                }
                questionString += string
            }

            $('#locations-table tbody').append(`
                <tr id='${new_id}'>
                    <td>${new_id}</td>
                    <td>${dt.name}</td>
                    <td><p class='oneline'>${dt.media}<p/></td>
                    <td><p class="oneline">${questionString}</p></td>
                    <td></td>
                    <td>
                        ${dropdown("<i class='bx bx-dots-vertical-rounded circle-icon'></i>", `
                            <div class="btn-del" onclick="deleteLocation('${new_id}')">Xóa</div>
                        `).getHtml()}
                    </td>
                </tr>
            `)
            $('#locations-table tbody tr:last-child()').dblclick((e) => {
                if ($(e.target).is('td')) {
                    let id = $(e.target).parent().attr('id');
                    updateLocation(id)
                }
            } )
            m.close()
            addToast(document.getElementById('toasts'), {
                type: 'success',
                title: 'Đã xong!',
                message: 'Đã thêm thành công một địa điểm!',
                duration: 3000
            })
        }
    })

}

const updateLocation = (location_id) => {
    let index = state.locations.findIndex(item => item.id === location_id)
    if (index === -1) {
        alert("Lỗi đã xảy ra")
        return
    }
    let form = location_form(state.locations[index])
    let footer = `
        <div style="padding: .5rem 0">
            <span class='btn btn-light ' id='cancel-location-form' style ='margin-right: 0.5rem;'>Hủy</span>
            <span class='btn btn-save' id='update-location-btn'>Lưu</span>
        </div>
    `
    let m = modal(`<p style='font-weight: 560;'>Cập nhật địa điểm</p>`, form.getHtml(), footer, 'location-update-form', 'location-update-form', false, 'medium')
    $('#locations-page').prepend(m.getHtml())
    form.setup()
    $('#cancel-location-form').click(() => {
        m.close()
    })
    $(`#update-location-btn`).click(() => {
        if(!form.validate()) { // not fail
            let dt = form.getData()
            state.locations[index] = {id: state.locations[index].id, ...dt}

            let questionString = ''
            for (let i = 0; i < dt.question_ids.length; i++) {
                let index = state.game.questions.findIndex(v => v.id === dt.question_ids[i])
                let string = ''
                if(index === -1) {
                    string = '<p class="error-message">Không tồn tại</p>';
                } else {
                    string = state.game.questions[index].content;
                }
                if(questionString !== '') {
                    questionString += ',';
                }
                questionString += string
            }

            $(`#locations-table  tbody tr:nth-child(${index + 1})`).text('')
            $(`#locations-table > tbody > tr:nth-child(${index + 1})`).append(`
                <td>${state.locations[index].id}</td>
                <td>${dt.name}</td>
                <td><p class='oneline'>${dt.media}<p/></td>
                <td><p class="oneline">${questionString}</p></td>
                <td></td>
                <td>
                    ${dropdown("<i class='bx bx-dots-vertical-rounded circle-icon'></i>", `
                        <div class="btn-del" onclick="deleteLocation('${state.locations[index].id}')">Xóa</div>
                    `).getHtml()}
                </td>
            `)
            
            m.close()
            addToast(document.getElementById('toasts'), {
                type: 'success',
                title: 'Đã xong!',
                message: 'Đã cập nhật thành công!',
                duration: 3000
            })
        }
    })

}