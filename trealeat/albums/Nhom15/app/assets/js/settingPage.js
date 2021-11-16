$(document).ready(() => {
    renderSettingPage()
    changePage('setting-page')
    $('#title').val(state.title)
    $('#title').change((e) => {
        state.title = e.target.value
    })
    $('#greeting').val(state.greeting)
    $('#greeting').change((e) => {
        state.greeting = e.target.value
    })
})


const renderSettingPage = () => {
    $('#setting').prepend('Chào bạn đây là trang thiết lập')
    renderBgs()
    renderFeatureControl()
}


const renderBgs = () => {
    let html = ''
    for(let i = 0; i < state.map.background.options.length; i++) {
        html += renderBgItem(state.map.background.options[i], i)
    }
    html += `
    <div class="bg flex-center add-bg" onclick="addBg()">
        <i class='bx bx-plus' style='font-size: 2rem;'></i>
        <span>Thêm</span>
    </div>
    `
    $('#backgrounds').empty()
    $('#backgrounds').append(html)
    console.log(state.map.background.selected)
    console.log()
    
    $($(`#backgrounds`).children()[state.map.background.selected]).addClass('bg--active')
   
    $('.bg__icon i').click((e) => {
        let mode = 'block'
        if($(e.target).next().css('display') === 'block')  {
            mode = 'none'
        }
        $(e.target).next().css('display', mode)
    })
}

const renderBgItem = (data, index) => {
    let style = data.style
    if(data.type === 'image') {
        style=`background-image: url("${data.style}")`
    }
    let icon = `
        <div class="bg__icon">
            <i class='bx bx-dots-vertical-rounded'></i>
            <div class="bg__delbtn" onclick="del_bg('${index}')">Xóa</div>
        </div>
    `

    if (index === 0 && state.map.background.options.length === 1) {
        icon = ''
    }
    return `
        <div class="bg">
            <div class="bg__body bg--${data.type}" style='${style}' onclick="selectbg(${index})">
            
            </div>
            ${icon}
            
        </div>
    `
}

const selectbg = (i) => {
    $('.bg').removeClass('bg--active')
    $(`.bg:nth-child(${i + 1})`).addClass('bg--active')
    state.map.background.selected = i
}

const del_bg = (index) => {
    console.log(index)
    state.map.background.options.splice(index, 1)
    $($(`#backgrounds`).children()[index]).css({transition: 'all .5s ease', transform: 'scale(0)'})
   
    if (index <= state.map.background.selected && state.map.background.selected > 0) {
        state.map.background.selected = state.map.background.selected - 1
    }

    setTimeout(() => {
        renderBgs()
    }, 500)
   
}
const bg_form = (data= {url:'', type: 'image'}) => {
    let html = `
        <div class="textfield">
            <input type="text" name="bg-url" 
                placeholder ='https://abc.com/hinhanh.jpg'
                id="bg-url" 
            />
            <label for="number_of_cells">Đường dẫn url</label>
            <p class='error-message' id='bg-url-message'></p>
        </div>
    `

    return {
        getHtml: () => html,
        getData: () => {
            return {
                type: data.type,
                style: $('#bg-url').val()
            }
        },
        validate: () => {
            if(!$('#bg-url').val().trim()) {
                $('#bg-url-message').text('Bạn chưa điền đường dẫn tới ảnh')
                return false
            }
            return true
        },
        setup: () => {
            $('#bg-url').focus()
            renderBgs()
        }

    }
}
const addBg = () => {
    let form = bg_form()
    let footer = `
        <button class="btn btn-light" id='cancel-add-bg'>Hủy</button>
        <span style='padding:0 0.5rem'></span>
        <button class="btn btn-save"  id='save-add-bg'>Lưu</button>
    
    `
    let m = modal('Thêm nền ảnh mới', form.getHtml(), footer, 'add-bg-modal', 'add-bg-modal', false, 'medium')
    $('#setting-page').append(m.getHtml())
    form.setup()
    $('#cancel-add-bg').click(() => {
        m.close()
    })
    $('#save-add-bg').click(() => {
        if(form.validate()) {
            state.map.background.options.push(form.getData())
            console.log(state.map.background.options)
            renderBgs()
            m.close()
        }
    })

}

const renderFeatureControl = () => {
    let icon = ''
    
    let html = ''
    for (i = 0; i < features.length; i++) {
        let index = state.features.findIndex(item => item === features[i].key)
        if(index >= 0) {
            icon = "<i class='bx bxs-checkbox-checked' ></i>"
        } else {
            icon = "<i class='bx bx-checkbox'></i>"
        }
        html += `
            <div class="feature-item">
                <div class="feature-item__checkbox ${index >=0? 'checked':''}" id='${features[i].key}' >
                    ${icon}
                </div>
                <div class='feature-item__label'>
                    ${features[i].name}
                </div>

            </div>

        `
    }
    $('#features-control').html(html)
    $('.feature-item__checkbox').click((e)=> {

        let el = $(e.target).closest('.feature-item__checkbox')
        let index = state.features.findIndex(item => item === el.attr('id'))
        if(index >= 0) {
            state.features.splice(index, 1)
            el.html("<i class='bx bx-checkbox'></i>")
            el.removeClass('checked')
        } else {
            state.features.push(el.attr('id'))
            el.html("<i class='bx bxs-checkbox-checked' ></i>")
            el.addClass('checked')
        }
    })
}