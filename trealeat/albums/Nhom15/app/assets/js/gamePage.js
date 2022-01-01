$(document).ready(() => {
    renderGameGridImage()
    $('#cols').text(state.game.cols);
    $('#rows').text(state.game.rows);
    $('#rows').change(changeDimention)
    $('#cols').change(changeDimention)
    $('#max_turn_replies').val(state.game.max_turn_replies)
    $('#key').val(state.game.key)
    $('#win_banner').css({backgroundImage: `url('${state.game.win}')`})
    $('#loss_banner').css({backgroundImage: `url('${state.game.loss}')`})
    $('#bg_icon_id').css({backgroundImage: `url('${state.game.bg_icon}')`})
    $('#bg_game_id').css({backgroundImage: `url('${state.game.bg_game}')`})
    $('#max_turn_replies').change((e) => {
        if($(e.target).val().trim()) {
            let t = parseInt()
            if (t < 0) {
                $(e.target).val(1)
                t = 1
            }
            state.game.max_turn_replies = t
        }
    })
    $('#key').change((e) => {
        state.game.key = $(e.target).val()
    })
    $('#game_description').val(state.game.description);
    $('#game_description').change(() => {
        state.game.description = $('#game_description').val()
        addToast(document.getElementById('toasts'), {
            type: 'success',
            title: 'Đã lưu',
            message: 'Thay đổi mô tả đã được ghi nhận.',
            duration: 3000
        })
    })
    $('#game_guide').text(state.game.guide);

    document.getElementById("game_guide").addEventListener("change", function() {
        console.log("input event fired");
        addToast(document.getElementById('toasts'), {
            type: 'success',
            title: 'Đã lưu',
            message: 'Thay đổi mô tả đã được ghi nhận.',
            duration: 3000
        })
    }, false);

    $('#game_guide').change(() => {
        state.game.guide = $('#game_guide').val()
        addToast(document.getElementById('toasts'), {
            type: 'success',
            title: 'Đã lưu',
            message: 'Thay đổi mô tả đã được ghi nhận.',
            duration: 3000
        })
    })

})

const renderGameGridImage = () => {
    let cols = parseInt(state.game.cols)
    let rows = parseInt(state.game.rows)
    let number_cells = cols * rows
    let img_cells = ''
    for (let i = 0; i < number_cells; i++) {
        img_cells += `
        <div class='img_cell' style=''>
            <span style="text-align: center;">id: ${i}</span>
        </div>
        `
    }
    let html = `
        <div class='grid bg-image' style="--col:${cols}; background-image:url('${state.game.root_image}');" >
            ${img_cells}
        </div>
    `
    $('#grid-images').html(html)
}

const changeDimention = (name, derection=1) => {
    const max = 5
    const min = 1

    let current = state.game[name]
    if(derection === 1 && current < max) {
        state.game[name] = current + 1
        if(state.game[name] === max) {
            $(`#${name}`).next().addClass('btn-disabled')
            addToast(document.getElementById('toasts'), {
                type:'info', 
                message: `${max} là lớn nhất rồi nhé!`, 
                title:'Thông tin cho bạn',
                duration: 3000
            })

        } else if(state.game[name] === min + 1) {
            $(`#${name}`).prev().removeClass('btn-disabled')
        }
        renderGameGridImage()
    } else if (derection === -1 && current > min) {
        state.game[name] = current - 1
        renderGameGridImage()
        if(state.game[name] === min) {
            $(`#${name}`).prev().addClass('btn-disabled')
            addToast(document.getElementById('toasts'), {
                type:'info', 
                message: `${min} là nhỏ nhất rồi nhé!`, 
                title:'Thông tin cho bạn',
                duration: 3000
            })
        } else if(state.game[name] === max - 1) {
            $(`#${name}`).next().removeClass('btn-disabled')
        }
    }
    
    $(`#${name}`).text(state.game[name]);
    
}
const image_form = (name, id, url='') => {
    let html = `
        <div class="textfield">
            <input type="text" name="${name}" placeholder="https://..." id="${id}" />
            <label for="key">Link ảnh</label>
            <p class='error-message' id='link_image'></p>
        </div>
    `
    return {
        getHtml: () => html,
        setup: () => {
            $(`#${id}`).val(url)
        },
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

const selectImage = (name) => {
    
    let form = image_form('root_image', name, state.game[name])
    let footer = `
        <button class='btn btn-light'id="cancel_image">Hủy</button>
        <button class='btn btn-save' id="save_image">Lưu</button>
    `
    let md = modal('Thay đổi hình ảnh', form.getHtml(), footer, 'image_id', 'image_id', false, 'medium')
    $('#game').prepend(md.getHtml())
    form.setup()
    $('#cancel_image').click(() => {
        md.close()
    })
    const css_selector = {
        root_image: '#grid-images >.grid',
        win: '#win_banner',
        loss: '#loss_banner',
        bg_game: '#bg_game_id',
        bg_icon: '#bg_icon_id'
    }

    $('#save_image').click(() => {
        if(form.validate()) {
            state.game[name] = form.getData()
            console.log($('#grid-images >.grid'))
            $(css_selector[name]).css({backgroundImage: `url('${state.game[name]}')`})
            md.close()
            addToast(document.getElementById('toasts'), {
                type: "success",
                message: "Đã thay đổi thành công.",
                title: "Xong!",
                duration: 3000
            })
            // $('#win').css({backgroundImage: `url('${state.game.root_image}')`})
        } else {

        }
    })
}

