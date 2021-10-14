let state = {
    map: {
        cell_width: "50px",
        number_of_cells: 2000,
        cells_per_row: 60,
        plots: [
            { index: 64, x:5, y:2, w: 8, h: 8, location_id: 0},
            // { index: 150,x:20, y:2, w: 8, h: 8, location_index: 1}
        ],
        paths: [],//w and h default is 1
    }
}
let data = null
let loadding = true
 // outputs a javascript object from the parsed json

let pathMode = false
let plotMode = false

const w_id = "number_cell_width"
const h_id = "number_cell_height"
const number_of_cells_id = "number_of_cells"
const cells_per_row_id = "cells_per_row"
const cell_width_id = "cell_width"

const location_id_value = 'location_id'
const modal_id = 'form-plot-modal'
const pathToggleId = "#toggleDrawPathMode"
const plotToggleId = "#togglePlotMode"

$(document).ready(() => {
    fetch('streamline-example.trealet')
    .then(response => response.json()).then(jsonResponse => {
        state =  jsonResponse.trealet
        renderMap();
        $(pathToggleId).click(() => {
            drawPathModeToggle();
        })
        $(plotToggleId).click(() => {
            plotModeToggle();
        })

        $(`#${number_of_cells_id}`).val(state.map.number_of_cells)
        $(`#${cells_per_row_id}`).val(state.map.cells_per_row)
        $(`#${cell_width_id}`).val(state.map.cell_width)
    })      
});

const renderMap = () => {
    let = plots = state.map.plots
    let map = state.map

    let cells = ''
    for (let i = 0; i < state.map.number_of_cells; i++) {
        let index = state.map.plots.findIndex(item => item.index === i);
        let style = ''
        if (index === -1) {
            style =  `style='width: ${state.map.cell_width}; height:${state.map.cell_width};'`
        } else {
            style = `style='grid-column: ${plots[index].x} / span ${plots[index].w};
                            grid-row:  ${plots[index].y} / span ${plots[index].h};
            '`
        }
        cells += `<div class='brick ${index !== -1 ? "plot":"" }' ${style} onclick="setFeature(${i})" >
                    ${i}
                </div>`
    }
    $('#board').remove()
    $('#map').append(`    
        <div class="board" id="board" style="grid-template-columns: repeat(${map.cells_per_row}, 1fr);">
        ${cells}
        </div>
    `);
    
}

const changePage = (nav) => {
    let current = $(nav)
    $('.nav-item').removeClass('nav-active')
    current.addClass('nav-active')
    let pageId = current.attr('name')
    $('.page').removeClass('page-view')
    $(`#${pageId}`).addClass('page-view')
}

const zoom = (direction) => {
    let pre_w = $('.brick').css('width')
    let current_w = '50px'
    if(direction === 1) {
        current_w = `${parseInt(pre_w) * 1.1 }px`
    } else {
        current_w = `${parseInt(pre_w) * 0.9 }px`
    }
    $('.brick:not(.plot)').css('width', current_w);
    $('.brick:not(.plot)').css('height', current_w);
}

const change = (el) => {
    let value = el.value
    if(el.name === 'cell_width') {
        value = parseInt(value) + "px"
    }
    state.map[el.name] = value
}

const refresh = () => {
    let {cell_width,cells_per_row, number_of_cells } = state.map
    if (cell_width && cells_per_row, number_of_cells) {
        renderMap()
    } else {
        alert("enter full fill before")
    }
}

const onPlotMode = (index) => {
    alert(data)
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
            <input type="number" name="${location_id_value}" 
                placeholder="vd: 1" 
                id="${location_id_value}" 
                
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
            <input type="number" name="${location_id}" 
                placeholder="vd: 8" 
                id="${location_id}" 
                value="${state.map.plots[has_index].location_id}"
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
    $('#map').prepend(modal(header, body, footer, modal_id, 'modal-set-feature', 'small'))
} 
const onPathMode = (i) => {
    let b = $(`.brick:nth-child(${i + 1})`)
    if(state.map.plots.findIndex(item => item.index === i) !== -1) {
        alert('This is a plot, You must delete plot before set it become a path')
        return
    }
    let index = state.map.paths.findIndex(item => item.index===i)
    if(index !== -1) {
        state.map.paths.splice(index, 1)
        $(`.brick:nth-child(${i + 1})`).removeClass('path')
        b.css({width: state.map.cell_width, height: state.map.cell_width, gridRow: "auto", gridColumn: "auto"})
    } else { // add new
        const zero = $(`.brick:nth-child(1)`).position(); 
        let p = b.position()
        let cell_w = parseInt(state.map.cell_width)
        let x = ((p.left - zero.left) / cell_w) + 1
        let y = ((p.top - zero.top) / cell_w) + 1
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
    removeModal(`#${modal_id}`)
}

const savePlot = (w_id, h_id, brick_index) => {
    let w = parseInt($(w_id).val())
    let h = parseInt($(h_id).val())
    if(!w || !h || !w <0 || !h <0) {
        alert("Width and height must be enter and greate more than 0")
        return
    }
    let location_id = parseInt($(`#${location_id_value}`).val())
    const zero = $(`.brick:nth-child(1)`).position(); 
    let b = $(`.brick:nth-child(${brick_index + 1})`)
    let p = b.position()
    let cell_w = parseInt(state.map.cell_width)
    let x = ((p.left - zero.left) / cell_w) + 1
    let y = ((p.top - zero.top) / cell_w) + 1
    

    // console.log(h, w)

    const index = state.map.plots.findIndex(item => item.index === brick_index)
    if (index === -1) {
        state.map.plots.push({index: brick_index, x: x, y: y, w: w, h: h, location_id: location_id})
    } else {
        state.map.plots[index].x = x
        state.map.plots[index].y = y
        state.map.plots[index].w = w
        state.map.plots[index].h = h
        state.map.plots[index].location_id = location_id
    }
    // delete paths is wrap by new plot
    let delete_indexs = []
    for (let i = 0; i < state.map.paths.length; i++) {
        let item = state.map.paths[i]
        if (item.x >= x && item.x <= x + w && item.y >= y && item.y <= y + h) {
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
    alert("Chinhs ")
    console.log(JSON.stringify(obj))
}