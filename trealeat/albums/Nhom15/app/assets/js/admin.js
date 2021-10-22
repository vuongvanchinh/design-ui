let data = null
let loadding = true
 // outputs a javascript object from the parsed json

let pathMode = true
let plotMode = false

const w_id = "number_cell_width"
const h_id = "number_cell_height"
const number_of_cells_id = "number_of_cells"
const cells_per_row_id = "cells_per_row"
const cell_width_id = "cell_width"

const item_id_value = 'item_id'
const modal_id = 'form-plot-modal'
const pathToggleId = "#toggleDrawPathMode"
const plotToggleId = "#togglePlotMode"
let zoom_rate = 1

$(document).ready(() => {
    
    // fetch('../streamline-example.trealet')
    // .then(response => response.json()).then(jsonResponse => {
    //     state =  jsonResponse.trealet
        
    // }) 
    renderNavs()
    renderItem()
    changePage('items')
    renderMap()
    $(pathToggleId).click(() => {
        drawPathModeToggle()
    })
    $(plotToggleId).click(() => {
        plotModeToggle();
    })
    document.getElementById('board').onwheel = function(e){ 
        e.preventDefault()
        const pre_zoom_rate = zoom_rate
        let direction = e.deltaY < 0 ? 1: -1
        zoom(direction, offset=0.1)
        // console.log("after", (after_position.left - zero_p.left), (after_position.top - zero_p.top))
        let new_position = {
            x: zoom_rate * e.clientX,
            y: zoom_rate * e.clientY
        }

        // console.log(new_position)

        let view = document.getElementById('view')
        view.scrollLeft = view.scrollLeft + (zoom_rate - pre_zoom_rate) * e.clientX;
        view.scrollTop = view.scrollTop + (zoom_rate - pre_zoom_rate) * e.clientY;
        return false;
        
    }

    // update map parameter 
    $(`#${number_of_cells_id}`).val(state.map.number_of_cells)
    $(`#${cells_per_row_id}`).val(state.map.cells_per_row)
    $(`#${cell_width_id}`).val(state.map.cell_width)     
});
const renderNavs = () => {
    const navs = [
        {icon: "bx bx-map", name: "Items", page:'items', onClick: () => changePage('items')},
        {icon: "bx bxs-dashboard", name: "Map", page:'map', onClick:() =>  changePage('map')},
        {icon: "bx bx-dialpad-alt", name: "Decorators", page:'decorators', onClick:() => changePage('decorators')},
        {icon: "bx bxs-save", name: "Save", page:'sav', onClick: () => saveMap()}
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
    let style = `style="width: ${state.map.cell_width}; height: ${state.map.cell_width}"`
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
        let b = $(`.brick:nth-child(${plot.index + 1})`)
        b.css({width: "auto", height: "auto", gridRow: `${plot.y} / span ${plot.h}`, gridColumn: `${plot.x} / span ${plot.w}`})
        b.addClass('plot')
        b.append(` location id: ${plot.item_id}`)
    }

    //render paths
    for (let i = 0; i < state.map.paths.length; i++) {
        let path = state.map.paths[i];
        let b = $(`.brick:nth-child(${path.index + 1})`)
        b.css({width: "auto", height: "auto", gridRow: `${path.y} / span 1`, gridColumn: `${path.x} / span 1`})
        b.addClass('path')
    }


}

const renderItem = () => {
    const btns = [
        {
            name: "Add location",
            onClick: (e) => { alert("Add location")}
        },
        {
            name: "Add decorator",
            onClick: (e) => { alert("Add decorator")}
        }
    ]
    let actions = $('#item_actions')
    for (i = 0; i < btns.length; i++) {
        let btn = btns[i];
        actions.append(`<button class="btn btn-light"}">${btn.name}</button>`)
        $(actions.children().last()).click((e) => {
            btn.onClick(e)
        }) 
    }
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
        let board_w = $('#board').width()
        let max_w = Math.floor(board_w / state.map.cells_per_row)
        
        value = parseInt(value);
        if(!value || value < max_w) {
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

const onPlotMode = (index) => {
    
    if(state.map.paths.findIndex(item => item.index === index) !== -1) {
        alert('This is a path, You must delete path before set it become a plot')
        return
    }
    let has_index = state.map.plots.findIndex(item => item.index === parseInt(index))
    let form = ''
    if (has_index === -1) {
        form = `
        <div class="textfield">
            <input type="number" name="number_cells_width" 
                placeholder="vd: 8" 
                id="number_cell_width" 
            />
            <label for="number_of_cells">Number cells width</label>
        </div>
        <div class="textfield">
            <input type="number" name="number_cells_height" 
                placeholder="vd: 8" 
                id="number_cell_height" 
            />
            <label for="number_of_cells">Number cells height</label>
        </div>
        <div class="textfield">
            <input type="number" name="${item_id_value}" 
                placeholder="vd: 1" 
                id="${item_id_value}" 
                
            />
            <label for="number_of_cells">Location Id</label>
        </div>
        
        `
    } else {
        form = `
        <div class="textfield">
            <input type="number" name="${w_id}" 
                min="1"
                placeholder="vd: 8" 
                id="${w_id}" 
                
                value="${state.map.plots[has_index].w}"
            />
            <label for="number_of_cells">Number cells width</label>
        </div>
        <div class="textfield">
            <input type="number" name="${h_id}" 
                min="1"
                placeholder="vd: 8" 
                id="${h_id}" 
                
                value="${state.map.plots[has_index].h}"
            />
            <label for="number_of_cells">Number cells height</label>
        </div>
        <div class="textfield">
            <input type="number" name="${item_id_value}" 
                placeholder="vd: 8" 
                id="${item_id_value}" 
                value="${state.map.plots[has_index].item_id}"
            />
            <label for="number_of_cells">Location Id</label>
        </div>
    `
    }

    const header = `Set brick no ${index} become a plots`
    const body = `
        <div class='child_setparate'>
           ${form}
        </div>
    `
    const footer = `
        <div class="flex space-between">
            <button class='btn btn-save' onclick="savePlot('#${w_id}', '#${h_id}', ${index})">Save</button>
            ${has_index !== -1? `
                <button class="btn btn-danger" onclick="deletePlot(${index})">Delete</button>    
            `:''}
            <button class="btn btn-light" onclick="removeModal('#${modal_id}')">Cancel</button>
        </div>`
    removeModal('#form-plot-moda')
    $('#map').prepend(modal(header, body, footer, modal_id, 'modal-set-feature', false, 'small'))
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
        $(`.brick:nth-child(${i + 1})`).removeClass('path')
        b.css({width: state.map.cell_width, height: state.map.cell_width, gridRow: "auto", gridColumn: "auto"})
    } else { // add new
        const zero = $(`.brick:nth-child(1)`).position(); 
        let p = b.position()
        let cell_w = parseInt(state.map.cell_width)
        let x = parseInt((p.left - zero.left) / cell_w) + 1
        let y = parseInt((p.top - zero.top) / cell_w) + 1
        console.log( i,"P", p, "Zero", zero)
        console.log(x, y)
        state.map.paths.push({index: i, x:x, y:y})
        b.addClass('path')
        b.css({gridColumn: `${x} / span 1`, gridRow: `${y} / span 1`})
    }
}
const setFeature = (index) => {
    if(pathMode) {
        onPathMode(index)
    } else if (plotMode) {
        onPlotMode(index)
    } else {
        alert(`Please choose mode to draw`)
    }
}

const removeModal = (id) => {
    $(id).remove()
}

const deletePlot = (index) => {
    state.map.plots = state.map.plots.filter(item => item.index != index);
    let b = $(`.brick:nth-child(${index + 1})`)
    b.css({width: state.map.cell_width, height: state.map.cell_width, gridRow: "auto", gridColumn: "auto"})
    b.removeClass('plot')
    b.text(index)

    removeModal(`#${modal_id}`)
}

const savePlot = (w_id, h_id, brick_index) => {
    let w = parseInt($(w_id).val())
    let h = parseInt($(h_id).val())
    if(!w || !h || !w < 0 || !h < 0) {
        alert("Width and height must be enter and greate more than 0")
        return
    }
    let item_id = parseInt($(`#${item_id_value}`).val())
    const zero = $(`.brick:nth-child(1)`).position(); 
    let b = $(`.brick:nth-child(${brick_index + 1})`)
    let p = b.position()
    let cell_w = parseInt(state.map.cell_width)
    console.log("Cell width", cell_w)
    console.log("Zero", zero)
    console.log("brick point", p)
    let x = parseInt((p.left - zero.left) / cell_w) + 1
    let y = parseInt((p.top - zero.top) / cell_w) + 1
    
    // console.log(h, w)

    const index = state.map.plots.findIndex(item => item.index === brick_index)
    if (index === -1) {// add new
        state.map.plots.push({index: brick_index, x: x, y: y, w: w, h: h, item_id: item_id})
    } else {// update
        state.map.plots[index].x = x
        state.map.plots[index].y = y
        state.map.plots[index].w = w
        state.map.plots[index].h = h
        state.map.plots[index].item_id = item_id
    }
    // delete paths is wrap by new plot
    let delete_indexs = []
    for (let i = 0; i < state.map.paths.length; i++) {
        let item = state.map.paths[i]
        if (item.x >= x && item.x < x + w && item.y >= y && item.y < y + h) {
            delete_indexs.push(i)
            let b = $(`.brick:nth-child(${item.index + 1})`)
            b.removeClass('path')
            b.css({width: state.map.cell_width, height: state.map.cell_width, gridRow: "auto", gridColumn: "auto"})           
        } 
    }
    state.map.paths.filter(item => !delete_indexs.includes(item.index))

    // set css for plot
    b.css({width: "auto", height: "auto", gridRow: `${y} / span ${h}`, gridColumn: `${x} / span ${w}`})
    removeModal(`#${modal_id}`)

}

const drawPathModeToggle = () => {
    
    $(pathToggleId).toggleClass("btn-active")
    $(plotToggleId).removeClass("btn-active")
    pathMode = !pathMode
    plotMode = false
}

const plotModeToggle = () => {
    $(pathToggleId).removeClass("btn-active")
    $(plotToggleId).toggleClass("btn-active")
    plotMode = !plotMode
    pathMode = false

}
const saveMap = () => {
    const obj = {
        trealet: state
    }
    saveText(JSON.stringify(obj), 'streamline-example.trealet')
}

const modal = (header='', body='', footer='', id='', name='set-feature-modal', close_icon = true, variant='main') => {
    if (footer) {
        footer = `<div class="modal-footer">${footer}</div>`
    }
    if (header) {
        header = `<div class='modal-header'>${header}</div>`
    }

    return `
    <div class='modal modal-${variant} open-modal' name='${name}' ${id?`id="${id}"`: ""}>
        <div class='modal-content'>
            ${header}
            <div class='modal-body'>
                ${body}
            </div>
            ${footer}
            ${close_icon ? "<i class='bx bx-x modal-close'></i>":''}
        </div>
    </div>
    `
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
        let board_w = $('#view').width()
        let min_brick_w = board_w / state.map.cells_per_row
        let min_percent = min_brick_w / parseFloat(state.map.cell_width)
        
        if (current_percent - offset >= min_percent) {
            zoom_rate = current_percent - offset
            $('.brick').css('zoom', zoom_rate)
        }
    } else { 
       zoom_rate = current_percent + offset
        $('.brick').css('zoom', zoom_rate)
    }
  
    return true
}