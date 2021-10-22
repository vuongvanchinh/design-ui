
const popup_id = 'location_popup'
let zoom_rate = 1
// data is variable in file map/index.php
$(document).ready(() => {
    
    setup()
    document.getElementById('board').onwheel = function(e){ 
        e.preventDefault()
        // const target = $(e.target).closest('.brick')
       
        // const zero_p = $('.brick:nth-child(1)').position()
        
        const pre_zoom_rate = zoom_rate
        // console.log(e.clientX, e.clientY)
        // console.log("pre offset", (pre_position.left - zero_p.left), (pre_position.top - zero_p.top))
        let direction = e.deltaY < 0 ? 1: -1
        zoom(direction, offset=0.1)
        // console.log("after", (after_position.left - zero_p.left), (after_position.top - zero_p.top))
        let new_position = {
            x: zoom_rate * e.clientX,
            y: zoom_rate * e.clientY
        }

        // console.log(new_position)

        let board = document.getElementById('board')
        board.scrollLeft = board.scrollLeft + (zoom_rate - pre_zoom_rate) * e.clientX;
        board.scrollTop = board.scrollTop + (zoom_rate - pre_zoom_rate) * e.clientY;
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
    

    for (let i = 0; i < data.media.length; i++) {
        let classs = 'simple-slide-item '
        if (slide_items.length === 0) {
            classs += 'simple-slide-item-active'
        }
        if(data.media[i].type ==='image') {
            slide_items += `
            <div class="${classs}" style="background-image: url('${data.media[i].url}')">
            
            </div>
            `
        }
       
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
    let content = ''
    for (i = 1; i < data.media.length; i++) {
        content += mediaHtml(data.media[i], '', false)
    }
    return `
        <div>
            ${data.media.length > 0 && data.media[0].type=='YTB' ? `
               ${mediaHtml(data.media[0])}
            `:''}
            <p class="media-description">${data.description}</p>
            ${content}
        </div>
    `
}


const popUpFooter = (data) => {

    return `
        <div class="flex space-between">
            <span class="btn btn-footer"
            onclick="alert('chưa cài đặt')"
            >Quét mã QR</span>

            <span class="btn btn-footer"
                onclick="alert('chưa cài đặt')"
            >
            Chơi một trò chơi</span>
        
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
        let popup_footer = popUpFooter(location)
        let md = modal(header, popup_content , popup_footer, popup_id, popup_id, true,  'medium')
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
    let current_percent = parseFloat($('.brick').css('zoom'))
    if(direction === -1) {//descrease
        let board_w = $('#view').width()
        let min_brick_w = board_w / data.map.cells_per_row
        let min_percent = min_brick_w / parseFloat(data.map.cell_width)
        
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

const mediaHtml = (data={type: "image", url:"", description: "",  name: ""}, id="", only_media=true) => {
    let media = ''
    if (id.length > 0) {
        id = `id="${id}"`
    }
    switch (data.type) {
        case 'image':
            media = `<img class="media-image" ${id} src="${data.url}"/>`
            break;
        case 'YTB': 
            media = `
                <div class="video">
                    <iframe src="${data.url}" title="${data.name}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>   
                </div>
            `
        case "3d":
            media = `
                <div class="video">
                    <iframe src="${data.url}" title="${data.name}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>   
                </div>
            `
        default:
            break;
    }
    if(only_media) {
        return media
    } else {
        return `
            <p class="media-name">${data.name}</p>
            ${media}
            <p class="media-description">${data.description}</p>
        `
    }
}