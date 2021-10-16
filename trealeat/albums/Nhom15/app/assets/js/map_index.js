
const popup_id = 'location_popup'
let zoom_rate = 1
// data is variable in file map/index.php
$(document).ready(() => {
    setup()
    $('.brick:nth-child(1)').click(() => {
        changeSimpleSlide()
    })
    $('.brick:nth-child(2)').click(() => {
        zoom(1)
    })
    document.getElementById('board').onwheel = function(e){ 
        let direction = e.deltaY < 0 ? 1: -1
        if (zoom(direction, offset=0.2)) {
            return false
        }
        return false;
        
    }
    // changeSimpleSlide()
})


const setup = () => {
    
    //plots
    for(let i = 0; i < data.map.plots.length; i++) {
        let p = data.map.plots[i]
        //find location
        let b = $(`.brick:nth-child(${p.index+1})`) // b = brick
        let index = data.locations.findIndex(item => item.id === p.item_id)
        console.log(index, p.item_id)

        if (index !== -1) { // find out
            b.append(presentItem(data.locations[index]))
        } else {
            b.append("cái này chưa có location đặt vào, vào trang admin để đặt")
        }
        b.css({width: "auto", height: "auto", gridColumn: `${p.x} / span ${p.w}`, gridRow: `${p.y} / span ${p.h}`})
        b.addClass('plot')
    }
    // auto change slide
    let timer = setInterval(changeSimpleSlide, 5000)
    //paths
    for (let i = 0; i < data.map.paths.length; i++) {
        let p = data.map.paths[i]
        let b = $(`.brick:nth-child(${p.index+1})`)
        b.css({gridColumn: `${p.x} / span 1`, gridRow: `${p.y} / span 1`})
        b.addClass('path')
    }
    // $('.brick:not(.plot)').css({width: data.map.cell_width, height:  data.map.cell_width})
}



function openModal(el) {
    $(el).next().addClass('open-modal')
}

const presentItem = (data) => {
    let slide_items = ''
    

    for (let i = 0; i < data.images.length && i < 4; i++) {
        let classs = 'simple-slide-item '
        if (i === 0) {
            classs += 'simple-slide-item-active'
        }
        slide_items += `
            <div class="${classs}" style="background-image: url('${data.images[i]}')">
            
            </div>
        `
    }
    return `    
        <div class="present-item">
           <div class="simple-slider">
            ${
                slide_items
            }
           </div>
           <div class='present-info'>
            <span class='present-item-name'> ${data.name}</span>
            <div onclick="showPopup(${data.id})"class='btn-detail'>
                <i class='bx bx-show'></i>
                <span>Xem</span>
            </div>
           </div>
        </div>
    `
}

const popUpContent = (data) => {

    return `
        <div>
            ${data.videos && data.videos.length > 1 ? `
               <div class="video">
                    <iframe src="https://www.youtube.com/embed/WZMkUfvqnus" title="${data.name}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>   
               </div>
            `:''}
        </div>
    `

}

const changeSimpleSlide = () => {
    let slides_active = $('.simple-slide-item-active')
    for(i = 0; i < slides_active.length; i++) {
        let s = $(slides_active[i])
        s.removeClass('simple-slide-item-active')
        if(s.next().length !== 0) { // not last slide
            s.next().addClass('simple-slide-item-active')

        } else {
            $(s.parent().children()[0]).addClass('simple-slide-item-active')
        }
    }
}
const slider = (data) => {
    return `
        <div class="slider">
            Slider
            ${data.name}

        </div>
    `
}

const showPopup = (item_id) => {
    let index = data.locations.findIndex(item => item.id == item_id)
    console.log(data.locations, item_id)
    if (index === -1) {
        alert("Location not found")

    } else {
        let location = data.locations[index]
        let header = `
            ${location.name}
        `
        let popup_content = popUpContent(location)
        let md = modal(header, popup_content , "footer", popup_id, popup_id, true,  'medium')
        $('#container').prepend(md)
        $(`#${popup_id}`).mousedown((e) => {
            if(e.target.classList.contains('modal')) {
                closePopup()
            }
        })
        $(`#${popup_id} .modal-close`).click((e) => {
            closePopup()
        })
    }
}

const closePopup = () => {
    $(`#${popup_id}`).off('mousedown')
    $(`#${popup_id}`).remove()
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

const zoom = (direction, offset=0.05) => {
    
    if(direction === -1) {//descrease
        let target_w = (zoom_rate - offset) * parseFloat(data.map.cell_width)
        let board_w = $('#board').width()
        let min_brick_w = board_w / data.map.cells_per_row
        if(target_w < min_brick_w) {
            return false
        } else {
            zoom_rate -= offset
            target_w += "px"
            console.log(target_w,board_w, data.map.cells_per_row)
            $('.brick:not(.plot)').css({width: target_w, height: target_w})
        }
    } else { //+ increase
        let target_w = (zoom_rate + offset) *  parseFloat(data.map.cell_width)
        target_w += "px"
        zoom_rate += offset
        $('.brick:not(.plot)').css({width: target_w, height: target_w})
    }
    return true
}