let data = null
let loadding = true
 // outputs a javascript object from the parsed json

let pathMode = false
let plotMode = false
 
// const w_id = "number_cell_width"
// const h_id = "number_cell_height"
const number_of_cells_id = "number_of_cells"
const cells_per_row_id = "cells_per_row"
const cell_width_id = "cell_width"

const item_id_value = 'item_id'
const modal_id = 'form-plot-modal'
const pathToggleId = "#toggleDrawPathMode"
const plotToggleId = "#togglePlotMode"
const location_headers = ['Item Id', 'Name']
let zoom_rate = 1

$(document).ready(() => {
    console.log(state)
    renderNavs()
    renderMap()
    renderPathOptions()
    //mode draw map
    $(pathToggleId).click(() => {
        drawPathModeToggle()
    })
    $(plotToggleId).click(() => {
        plotModeToggle();
    })

    let p = document.getElementById('view').offsetTop
    console.log(p)
    document.getElementById('view').onwheel = function(e){ 
        e.preventDefault()
        const pre_zoom_rate = zoom_rate
        let direction = e.deltaY < 0 ? 1: -1
        zoom(direction, offset=0.1)
        let view = document.getElementById('view')
        view.scrollLeft = view.scrollLeft + (zoom_rate - pre_zoom_rate) * e.pageX;
        view.scrollTop = view.scrollTop + (zoom_rate - pre_zoom_rate) * e.pageY;
        return false;
    }

    // update map parameter 
    $(`#${number_of_cells_id}`).val(state.map.number_of_cells)
    $(`#${cells_per_row_id}`).val(state.map.cells_per_row)
    $(`#${cell_width_id}`).val(state.map.cell_width)     
});

const renderPaths = () => {
    for (let i = 0; i < state.map.paths.length; i++) {
        let path = state.map.paths[i];
        let b = $(`.brick:nth-child(${path.index + 1})`)
        if (path.op_no === undefined) {
            state.map.paths[i].op_no = `op_0`
        }
        // state.map.paths[i].op_no =  `op_${state.map.paths[i].op_no}`
        b.css({"b_w": "initial", "background-image": `url("${state.map.path_list.options[path.op_no]}")`,width: "auto", height: "auto", gridRow: `${path.y} / span 1`, gridColumn: `${path.x} / span 1`})
        b.addClass('path')
    }
}
const renderPathOptions = () => {
    let content = showPathItems();

    let pathList = $('#path-choice-list')

    pathList.html( `
        <div class="path-items">
            ${content}
            <div class="path-item add-path-item" onclick="addPathItem()" >
                <i class='bx bx-plus' style='font-weight: bold;'></i>
            </div>
        </div>
        `
    )
}
const selectPathImage = (me, i) => {
    console.log( me.firstElementChild)
    $('.path-active').removeClass('path-active')
    me.firstElementChild.classList.add('path-active')
    state.map.path_list.selected = i;
}

const updatePathImageOption = (index) => {
    let form = path_form(state.map.path_list.options[index])

    let header = `
    <div class="update-path-header-popup">
        <div style="padding-top: 5px;">
            <p>Cập nhật</p>
        </div>
        <div class="btns-popup">
            <button class="btn btn-light" id='cancel-update-option'>Hủy</button>
            <button class="btn btn-save"  id='save-update-option'>Lưu</button>
        </div>
    </div>

    `
    let footer = `
    <div class="update-path-footer-popup">
        <div class="update-path-footer-btns">
            <button class="btn btn-danger" id='delfake-item'>Xoá</button>
        </div>

        <div class="alert-comfirm-del">
            <p style="color:red; font-size: 1.2rem; margin-bottom: 0.5rem;">Cảnh báo xoá!</p>
            <p>Bạn có chắc chắn muốn xoá không? Nếu xoá đi thì tất cả đường đi đã vẽ bằng nó cũng sẽ bị xoá.</p>
            <div style="padding:0.5rem;"></div>
            <button class="btn btn-primary" id='cancel-del-item'>Không</button>
            <span style='padding:0 0.5rem'></span>
            <button class="btn btn-danger" id='delforce-item'>Có</button>
        </div>  
    </div>
    `

    let m = modal(header, form.getHtml(), footer, 'update-path-option-modal', 'update-path-option-modal', false, 'small')

    $('#map').prepend(m.getHtml());
    form.setup();

    $('#cancel-update-option').click(() => {
        m.close()
    })

    $('#delfake-item').click(() => {
        $('.update-path-footer-popup .alert-comfirm-del').toggle('fast');
        $('#delfake-item').css({display: "none"})
    })

    $('#delforce-item').click(() => {
        delete state.map.path_list.options[index];
        state.map.paths = state.map.paths.filter(path => path.op_no !== index)
        renderPathOptions()
        renderPaths()
        renderMap()
        m.close()
        addToast(document.getElementById('toasts'), {
            type: "success",
            message: `Bạn đã xoá thành công`, 
            title:'Xong!',
            duration: 3000
        })
    })

    $('#cancel-del-item').click(() => {
        $('.update-path-footer-popup .alert-comfirm-del').toggle('fast');
        $('#delfake-item').css({display: "block"})
    })

    $('#save-update-option').click(() => {
        if(form.validate()) {
            state.map.path_list.options[index] = form.getData()
            renderPathOptions()
            renderPaths()
            m.close()
        }
    })
}
const showPathItems = () => {
    let content = ''
    for(let i in state.map.path_list.options ) {
        content += `
            <div class="path-item" onclick="selectPathImage(this,'${i}')" ondblclick ="updatePathImageOption('${i}')">
                <img class="${state.map.path_list.selected === i? 'path-active' : ''}"src="${state.map.path_list.options[i]}">
            </div>
        `
    }

    // for (let i = 0; i < state.map.path_list.options.length; i++) {
    //     content += `
    //         <div class="path-item" onclick="selectPathImage(this,${i})" ondblclick ="updatePathImageOption(${i})">
    //             <img class="${state.map.path_list.selected === i? 'path-active' : ''}"src="${state.map.path_list.options[i]}">
    //         </div>
    //     `
    // }
    return content;
}

const path_form = (url='') => {
    let html = `
        <div class="textfield">
            <input type="text" name="bg-url" 
                placeholder ='https://abc.com/hinhanh.jpg'
                id="path-url" 
            />
            <label for="number_of_cells">Đường dẫn url</label>
            <p class='error-message' id='path-url-message'></p>
        </div>
    `

    return {
        getHtml: () => html,
        getData: () => {
            return $('#path-url').val()
        },
        validate: () => {
            if(!$('#path-url').val().trim()) {
                $('#path-url-message').text('Bạn chưa điền đường dẫn tới ảnh')
                return false
            }
            return true
        },
        setup: () => {
            $('#path-url').val(url)
            $('#path-url').focus()
            renderPathOptions()
        }

    }
}

const addPathItem = () => {
    let form = path_form()
    let footer = `
        <button class="btn btn-light" id='cancel-add-path-option'>Hủy</button>
        <span style='padding:0 0.5rem'></span>
        <button class="btn btn-save"  id='save-add-path-option'>Lưu</button>
    `

    let m = modal('Thêm nền đường mới', form.getHtml(), footer, 'add-path-option-modal', 'add-path-option-modal', false, 'small')
    $('#map').prepend(m.getHtml());
    $('#cancel-add-path-option').click(() => {
        m.close()
    })
    $('#save-add-path-option').click(() => {
        if(form.validate()) {
            let index = 0;
            if(Object.keys(state.map.path_list.options).length !== 0 ) {
                index = parseInt(Object.keys(state.map.path_list.options).pop().split('_')[1]) + 1;
            }
            state.map.path_list.options[`op_${index}`] = form.getData()
            renderPathOptions()
            m.close()
        }
    })
}
const renderNavs = () => {
    const navs = [
        {icon: "bx bx-palette", name: "Chung", page:'setting-page', onClick: () => changePage('setting-page')},
        {icon: "bx bx-map", name: "Địa điểm", page:'locations-page', onClick: () => changePage('locations-page')},
        {icon: "bx bxs-dashboard", name: "Bản đồ", page:'map', onClick:() =>  changePage('map')},
        {icon: "bx bx-dialpad-alt", name: "Banner", page:'decorators-page', onClick:() => changePage('decorators-page')},
        {icon: "bx bx-game", name: "Game", page:'game', onClick:() => changePage('game')},
        {icon: "bx bxs-save", name: "Lưu", page:'sav', onClick: () => saveMap()}
        
    ]
    let navigation = $('#navs')
    for (i = 0; i < navs.length; i++) {
        let nav = navs[i];
        navigation.append(`
        <div class='nav-item' name='${nav.page}'>
            <i class='${nav.icon}' ></i>
            <span>${nav.name}</span>
        </div>
        `)
        $(navigation.children().last()).click((e) => {
            nav.onClick(e)
        }) 
    }
}
const renderMap = () => {
    let = plots = state.map.plots
    let cells = ''
    let style = `style="--b_w: ${state.map.cell_width}"`
    for (let i = 0; i < state.map.number_of_cells; i++) {
        cells += `<div class='brick' onclick="setFeature(${i})" ${style}>
                    ${i}
                </div>`
    }
    $('#board').empty();
    $('#board').append(cells)
    // render plots 
    for (let i = 0; i < state.map.plots.length; i++) {
        let plot = state.map.plots[i];
        let clas = 'plot '
        if (plot.item_id.startsWith('decorator')) {
            clas += 'plot--decorator'
        }
        let b = $(`.brick:nth-child(${plot.index + 1})`)
        b.css({"--b_w":"auto", gridRow: `${plot.y} / span ${plot.h}`, gridColumn: `${plot.x} / span ${plot.w}`})
        b.addClass(clas)
        b.append(`item id: ${plot.item_id}`)
    }
    
    //render paths
    renderPaths()
    $(window).resize((e) => {
        if (zoom_rate < 1) {
            zoom_rate = 1
            $('.brick').css('zoom', zoom_rate)
            $('#board').css({'--board_w': `${zoom_rate * state.map.cells_per_row * parseFloat(state.map.cell_width)}px`})
        }
    })
}

const changePage = (id) => {
    console.log(`.nav-item[name='${id}']`)
    let current = $(`.nav-item[name='${id}']`).first()
    $('.nav-item').removeClass('nav-active')
    current.addClass('nav-active')
    
    $('.page').removeClass('page-view')
    $(`#${id}`).addClass('page-view')
    
}

const change = (el) => {
    let value = el.value
    if(el.name === 'cell_width') {
        // let max_w = Math.floor(board_w / state.map.cells_per_row)
        
        value = parseInt(value);
        if(!value || value < 50) { // min width is 50px
            value = `${max_w}px`
            $(el).val(value)
        } else {
            value += "px"
        }
    }
    state.map[el.name] = value
}

const refresh = () => {
    let {cell_width,cells_per_row, number_of_cells } = state.map
    if (cell_width && cells_per_row, number_of_cells) {

        renderMap()
        $('.brick').css('zoom', 1)
    } else {
        alert("enter full fill before")
    }
}

const plot_form = (dt={index:false, w: 0, h: 0, item_id: ''}) => {
   
    let form = `
        <div class="textfield">
            <input type="number" name="number_cell_width" 
                min="1"
                placeholder="vd: 8" 
                id="number_cell_width" 
            />
            <label for="number_of_cells">Số ô rộng</label>
            <p class='error-message'></p>
        </div>
        <div class="textfield">
            <input type="number" name="number_cell_height" 
                min="1"
                placeholder="vd: 8" 
                id="number_cell_height" 
            />
            <label for="number_of_cells">Số ô dài</label>
            <p class='error-message'></p>
        </div>
        <div class="textfield">
            <input type="text" name="plot_item_id" 
                placeholder="vd: 8" 
                id="plot_item_id" 
            />
            <label for="number_of_cells">Item id</label>
            <p class='error-message'></p>
        </div>
    `
    return {
        getHtml: () => form,
        getData: () => {
            return {   
                x: dt.x,
                y: dt.y,             
                w: $('#number_cell_width').val(),
                h: $('#number_cell_height').val(),
                item_id: $('#plot_item_id').val()
            }
        },
        setup: () => {
            if(dt.index !== false) {
                $('#number_cell_width').val(dt.w)
                $('#number_cell_height').val(dt.h)
                $('#plot_item_id').val(dt.item_id)
            } else {
                $('#number_cell_width').val(2)
                $('#number_cell_height').val(2)
                $('#plot_item_id').val('decorator_0')
            }
            $('#number_cell_width').change(() => {
                let w = $('#number_cell_width').val()
                if (!w || isNaN(w) || parseInt(w.trim()) < 0) {
                    $('#number_cell_width').next().next().text('This field must be fill an integer more than 0')
                    success = false
                } else {
                    $('#number_cell_width').next().next().text('')
                }
            })
            $('#number_cell_height').change(() => {
                //h
                let h = $('#number_cell_height').val()
                if (!h || isNaN(h) || parseInt(h.trim()) < 0) {
                    $('#number_cell_height').next().next().text('This field must be fill an integer more than 0')
                    success = false
                } else {
                    $('#number_cell_height').next().next().text('')
                }
            })

            $('#plot_item_id').change(() => {
                //item_id
                let item_id = $('#plot_item_id').val()
                if (!item_id.trim()) {
                    $('#plot_item_id').next().next().text('Which item will be put on this plot? fill its id')
                    success = false
                } else {
                    $('#plot_item_id').next().next().text('')
                }

            })

        },
        validate: () => {
            let success = true
            //w
            let w = $('#number_cell_width').val()
            if (!w || isNaN(w) || parseInt(w.trim()) < 0) {
                $('#number_cell_width').next().next().text('This field must be fill an integer more than 0')
                success = false
            } else {
                $('#number_cell_width').next().next().text('')
            }
            //h
            let h = $('#number_cell_height').val()
            if (!h || isNaN(h) || parseInt(h.trim()) < 0) {
                $('#number_cell_height').next().next().text('This field must be fill an integer more than 0')
                success = false
            } else {
                $('#number_cell_height').next().next().text('')
            }
            //item_id
            let item_id = $('#plot_item_id').val()
            if (!item_id.trim()) {
                $('#plot_item_id').next().next().text('Which item will be put on this plot? fill its id')
                success = false
            } else {
                $('#plot_item_id').next().next().text('')
            }

            return success
        }
    }
}
const onPlotMode = (index) => {
    
    if(state.map.paths.findIndex(item => item.index === index) !== -1) {
        alert('This is a path, You must delete path before set it become a plot')
        return
    }

    let has_index = state.map.plots.findIndex(item => item.index === parseInt(index))
    let form = null
    if (has_index === -1) {
        form = plot_form()
    } else {// update
        form = plot_form(state.map.plots[has_index])
    }
    
    const header = `Set brick no ${index} become a plots`
    const body = `
        <div class='child_setparate'>
           ${form.getHtml()}
        </div>
    `
    const footer = `
        <div class="flex space-between">
            <button class='btn btn-save' id='save-plot'>Save</button>
            ${has_index !== -1? `
                <button class="btn btn-danger" id='delete-plot'>Delete</button>    
            `:''}
            <button class="btn btn-light" id='cancel-plot'>Cancel</button>
        </div>`
    let m = modal(header, body, footer, modal_id, 'modal-set-feature', false, 'small')
    $('#map').prepend(m.getHtml())
    form.setup()
    $('#cancel-plot').click(() => {
        m.close()
    })
    $('#delete-plot').click(() => {
        deletePlot(index)
        m.close()
    })
    $('#save-plot').click(() => {
        if(!form.validate()) {
            return
        }
        let b = $(`.brick:nth-child(${index + 1})`)
        let p = b.position()
        
        const zero = $(`.brick:nth-child(1)`).position()
        let cell_w = parseInt(state.map.cell_width)
        let x = Math.round((Math.round(p.left) - Math.round(zero.left)) / cell_w) + 1
        let y = Math.round((Math.round(p.top) - Math.round(zero.top)) / cell_w ) + 1
        let dt = form.getData()
        // console.log('x y: ', x, y, dt.w, dt.h, cell_w)
        if(has_index === -1) { // add new
             // when add new dt.x and dt.y is undefinded 
            state.map.plots.push({
                index: index, 
                x: x, 
                y: y, 
                w: dt.w, 
                h: dt.h, 
                item_id: dt.item_id
            })
            
        } else { // update
            state.map.plots[has_index].x = dt.x
            state.map.plots[has_index].y = dt.y
            state.map.plots[has_index].w = dt.w
            state.map.plots[has_index].h = dt.h
            state.map.plots[has_index].item_id = dt.item_id
        }
        
        b.css({'--b_w': 'auto' , gridRow: `${y} / span ${dt.h}`, gridColumn: `${x} / span ${dt.w}`})
        if(dt.item_id.startsWith('decorator')) {
            b.addClass('plot plot--decorator');
        } else {
            b.addClass('plot');
        }
       
        //close modal
        m.close()
       
        m = null
    })

} 

const onPathMode = (i) => {
    let b = $(`.brick:nth-child(${i + 1})`)
    if(state.map.plots.findIndex(item => item.index === i) !== -1) {
        alert('This is a plot, You must delete plot before set it become a path')
        return
    }
    let index = state.map.paths.findIndex(item => item.index===i)
    if(index !== -1) { // delete 
        state.map.paths.splice(index, 1)
        b.css({"background-image": "unset"})
        $(`.brick:nth-child(${i + 1})`).removeClass('path')
        b.css({'--b_w': state.map.cell_width, gridRow: "auto", gridColumn: "auto"})
    } else { // add new
        const zero = $(`.brick:nth-child(1)`).position(); 
        let p = b.position()
        let cell_w = parseInt(state.map.cell_width)
       
        let x = Math.round((Math.round(p.left) - Math.round(zero.left)) / cell_w) + 1
        let y = Math.round((Math.round(p.top) - Math.round(zero.top)) / cell_w ) + 1
        console.log( i,"P", p, "Zero", zero)
        console.log(x, y)
        b.addClass('path')
        b.css({"background-image": `url("${state.map.path_list.options[state.map.path_list.selected]}")`, gridColumn: `${x} / span 1`, gridRow: `${y} / span 1`})
        state.map.paths.push({index: i, x:x, y:y, op_no:state.map.path_list.selected})
    }
}
const setFeature = (index) => {
    if(pathMode) {
        onPathMode(index)
    } else if (plotMode) {
        onPlotMode(index)
    }
}

const removeModal = (id) => {
    $(id).remove()
}

const deletePlot = (index) => {
    state.map.plots = state.map.plots.filter(item => item.index != index);
    let b = $(`.brick:nth-child(${index + 1})`)
    b.css({'--b_w': state.map.cell_width ,gridRow: "auto", gridColumn: "auto"})
    b.removeClass('plot')
    b.removeClass('plot--decorator')
    b.text(index)
}


const drawPathModeToggle = () => {
    $("#path-choice-list").toggle();
    $(pathToggleId).toggleClass("btn-active")
    $(plotToggleId).removeClass("btn-active")
    pathMode = !pathMode
    plotMode = false
}

const plotModeToggle = () => {
    if(pathMode) {
        $("#path-choice-list").toggle();
    }
    $(pathToggleId).removeClass("btn-active")
    $(plotToggleId).toggleClass("btn-active")
    plotMode = !plotMode
    pathMode = false
}

const saveMap = () => {
    const obj = {
        trealet: state
    }
    console.log(JSON.stringify(obj))
    saveText(JSON.stringify(obj), 'streamline-example.trealet')
}

function saveText(text, filename){
    var a = document.createElement('a');
    a.setAttribute('href', 'data:text/plain;charset=utf-8,'+encodeURIComponent(text));
    a.setAttribute('download', filename);
    a.click()
}

const zoom = (direction, offset=0.05) => {
    let current_percent = parseFloat($('.brick').css('zoom'))
    if(direction === -1) {//descrease
        let b_w = $('#board').width()
        let view_w = $('#view').width()
        let b_h = $('#board').height()
        let view_h = $('#view').height()

        // console.log("view", view_w, "view height", view_h)
        // console.log("board W", b_w, "board_height",b_h)
        let rate = (zoom_rate - offset) / zoom_rate

        if (rate * b_w > view_w || 
            rate *b_h > view_h) {//current_percent - offset >= min_percent
            zoom_rate = current_percent - offset
            $('.brick').css('zoom', zoom_rate)
            $('#board').css({'--board_w': `${zoom_rate * state.map.cells_per_row * parseFloat(state.map.cell_width)}px`})
        } else if (b_h > view_h) {
            zoom_rate = zoom_rate * view_h / b_h
            console.log("room rate", zoom_rate)
            $('.brick').css('zoom', zoom_rate)
            $('#board').css({'--board_w': `${zoom_rate * state.map.cells_per_row * parseFloat(state.map.cell_width)}px`})
        }
    } else { 
       zoom_rate = current_percent + offset
        $('.brick').css('zoom', zoom_rate)
        $('#board').css({'--board_w': `${zoom_rate * state.map.cells_per_row * parseFloat(state.map.cell_width)}px`})
    }
  
    return true
}

const LOCATION_FORM = {
    id: null,
    name: '',
    description: '',
    media: [
        
    ] 
} 

const checkPlot = () => {
    let count = 0;

    let i = 0
    while( i <  state.decorators.length) {
       let d = state.decorators[i];
       let index = state.map.plots.findIndex(plot => plot.item_id === d.id)
       if(index === -1) {
            state.decorators.splice(i, 1)
            console.log(d.id)
           count ++
       } else {
           i ++
       }

    }
    console.log(JSON.stringify(state.decorators))

   console.log(count)
   
} 