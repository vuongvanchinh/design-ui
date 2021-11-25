$(document).ready(() => {
    renderDecoratorPage()
    // changePage('decorators-page')
})

const renderDecoratorPage = () => {
    let body = ''
    for (i = 0; i < state.decorators.length; i++) {
        body += `
            <tr id='${state.decorators[i].id}'>
                <td>${state.decorators[i].id}</td>
                <td>${state.decorators[i].name}</td>
                <td>${state.decorators[i].media}</td>
                <td>
                    ${dropdown("<i class='bx bx-dots-vertical-rounded circle-icon'></i>", `
                        <div class="btn-del" onclick="deleteDecorator('${state.decorators[i].id}')">Xóa</div>
                    `).getHtml()}
                </td>
            </tr>
        `
    }
    const decorator_headers = ['Id', 'Tên', 'Id Hình ảnh/video...', '']
    $('#decorator-content').append(table(decorator_headers, body, 'decorators-table', 'Các banner', `Đang có ${state.decorators.length} decorators`))
    $('#decorators-table tbody tr').dblclick((e) => {
        // console.log(e)
        if ($(e.target).is('td')) {
            let id = $(e.target).parent().attr('id');
            updateDecorator(id)
        }
    } )
}


const decorator_form = (dt = {id: false, name:'', description: '', media: []}) => {
    let form = `
    
    <form>
        <div class="form-card">
            <div class="form-card-header">
            Thông tin chung
            </div>
            <div class="form-card-body">
                <div class="textfield">
                    <input type="text" name="decorator_name" 
                        placeholder="Tên" 
                        id="decorator_name" 
                    />
                    <label for="decorator_name">Name</label>
                    <p class='error-message'></p>
                </div>
            </div>
        </div>
        <div class="form-card">
            <div class="form-card-header">
                Media
            </div>
            <div class="form-card-body">
              
               <div id='decorator-medias' class='child_setparate'>
                <div class="textfield">
                    <input type="text" name="decorator-media-ids" 
                        placeholder="nhập các số nguyên cách nhau dấu phẩy" 
                        id="decorator-media-ids" 
                    />
                    <label for="decorator-media-ids">Các media id</label>
                    <p class='error-message' ></p>
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
                name: $('#decorator_name').val(),
                media: $('#decorator-media-ids').val().trim().split(',').map(item => parseInt(item.trim()))
            }
        },
        validate: () => { 
            // return true if failed 
            let failed = false;
            let name = $('#decorator_name').val().trim()
            if (!name) {
                $('#decorator_name').next().next().text('This field is required')
                $('#decorator_name').focus()
                failed = true
            }else {
                $('#decorator_name').next().next().empty()
            }
            let media =  $('#decorator-media-ids').val()
            if (!media) {
                $('#decorator-media-ids').next().next().text('Mục này phải điền các số nguyên cách nhau bằng dấu phẩy')
                failed = true
                $('#decorator-media-ids').focus()
            } else {
                let medias = media.trim().split(',')
                let ok = true
                for (i = 0; i < medias.length; i++) {
                    let item = medias[i]
                    if (isNaN(item.trim())) {
                        failed = true
                        $('#decorator-media-ids').next().next().text('Mục này phải điền các số nguyên cách nhau bằng dấu phẩy')
                        
                        ok = false
                        break;
                    }
                }
                if (ok) {
                    $('#decorator-media-ids').next().next().empty()
                    
                    
                }
            }
            
            return failed
        },
        setup: () => {
           
            // fill data
            if (dt.id) {
                $('#decorator_name').val(dt.name)
                $('#decorator-media-ids').val(dt.media.join(','))
                
            }


            $('#decorator_name').focus();
            $('#decorator_name').change(() => {
                let name = $('#decorator_name').val().trim()
            
                if (!name) {
                    $('#decorator_name').next().next().text('Mục này không được trống')
                }else {
                    $('#decorator_name').next().next().empty()
                }
            })
            $('#decorator-media-ids').change(() => {
                let media =  $('#decorator-media-ids').val()
                if (!media) {
                    $('#decorator-media-ids').next().next().text('Mục này phải điền các số nguyên cách nhau bằng dấu phẩy')
                } else {
                    let medias = media.trim().split(',')
                    let ok = true
                    for (i = 0; i < medias.length; i++) {
                        let item = medias[i]
                        if (isNaN(item.trim()) || item.trim() === '') {
                           
                            $('#decorator-media-ids').next().next().text('Mục này phải điền các số nguyên cách nhau bằng dấu phẩy')
                            
                            ok = false
                            break;
                        }
                    }
                    if (ok) {
                        $('#decorator-media-ids').next().next().empty()
                        
                    }
                }
            })
        }
    }
}




const deleteDecorator = (id) => {
    let index = state.decorators.findIndex(item => item.id === id)
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
    let m = modal(`Bạn có chắc muốn xóa ${id}?`, body, '', 'confirm-delete-modal','confirm-delete-modal', false, 'small')
    $('#decorators-page').prepend(m.getHtml())
    $('#no-delete').click(() => {
        m.close()
        m=null   
        $(`tr#${id} .dropdown-content`).removeClass('drop')
    })

    $('#confirm-delete').click(() => {
        state.decorators.splice(index, 1)
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
const addDecorator = () => {
    let form = decorator_form()
    let footer = `
        <div style="padding: .5rem 0">
            <span class='btn btn-light ' id='cancel-decorator-form' style ='margin-right: 0.5rem;'>Hủy</span>
            <span class='btn btn-save' id='add-decorator-btn'>Lưu</span>
        </div>
    `
    let m = modal(`<p style='font-weight: 560;'>Thêm banner mới</p>`, form.getHtml(), footer, 'decorator-form', 'decorator-form', false, 'medium')
    $('#decorators-page').prepend(m.getHtml())
    form.setup()
    $('#cancel-decorator-form').click(() => {
        m.close()
    })
    $(`#add-decorator-btn`).click(() => {
        if(!form.validate()) { // not fail
            let lastid = 1
            let l = state.decorators.length 
            if (l > 0) {
                lastid = parseInt(state.decorators[l - 1].id.split('_')[1])
            } 
            let new_id = `decorator_${lastid + 1}`
            let dt = form.getData()
            state.decorators.push({...dt, id: new_id})
            $('#decorators-table tbody').append(`
                <tr id='${new_id}'>
                    <td>${new_id}</td>
                    <td>${dt.name}</td>
                    <td>${dt.media}</td>
                    <td>
                        ${dropdown("<i class='bx bx-dots-vertical-rounded circle-icon'></i>", `
                            <div class="btn-del" onclick="deleteDecorator('${new_id}')">Xóa</div>
                        `).getHtml()}
                    </td>
                </tr>
            `)
            $('#decorators-table tbody tr:last-child()').dblclick((e) => {
                // console.log(e)
                if ($(e.target).is('td')) {
                    let id = $(e.target).parent().attr('id');
                    updateDecorator(id)
                }
            } )
           
            m.close()
            addToast(document.getElementById('toasts'), {
                type: 'success',
                title: 'Đã xong!',
                message: 'Đã thêm thành công 1 banner!',
                duration: 3000
            })
        }
    })

}

const updateDecorator = (decorator_id) => {
    let index = state.decorators.findIndex(item => item.id === decorator_id)
    if (index === -1) {
        alert("Not found")
        return
    }
    let form = decorator_form(state.decorators[index])
    let footer = `
        <div style="padding: .5rem 0">
            <span class='btn btn-light ' id='cancel-decorator-modal' style ='margin-right: 0.5rem;'>Hủy</span>
            <span class='btn btn-save' id='update-decorator-btn'>Lưu</span>
        </div>
    `
    let m = modal(`<p style='font-weight: 560;'>Cập nhật banner</p>`, form.getHtml(), footer, 'decorator-update-modal', 'decorator-update-modal', false, 'medium')
    $('#decorators-page').prepend(m.getHtml())
    form.setup()
    $('#cancel-decorator-modal').click(() => {
        m.close()
    })
    $(`#update-decorator-btn`).click(() => {
        if(!form.validate()) { // not fail
            let dt = form.getData()
            console.log(dt)
            state.decorators[index] = {id: state.decorators[index].id, ...dt}
            $(`#decorators-table tbody tr:nth-child(${index + 1})`).text('')
            $(`#decorators-table > tbody > tr:nth-child(${index + 1})`).append(`
                <td>${state.decorators[index].id}</td>
                <td>${dt.name}</td>
                <td>${dt.media}</td>
                <td>
                    ${dropdown("<i class='bx bx-dots-vertical-rounded circle-icon'></i>", `
                        <div class="btn-del" onclick="deleteDecorator('${state.decorators[index].id}')">Xóa</div>
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