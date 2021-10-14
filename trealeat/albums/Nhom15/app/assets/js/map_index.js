
const popup_id = 'location_popup'

$(document).ready(() => {
    setup()

})

const setup = () => {
    //plots
    for(let i = 0; i < data.map.plots.length; i++) {
        let p = data.map.plots[i]
        //find location
        let b = $(`.brick:nth-child(${p.index+1})`) // b = brick
        let index = data.locations.findIndex(item => item.id === p.location_id)
        console.log(index, p.location_id)

        if (index !== -1) { // find out
            b.append(presentLocation(data.locations[index]))
        } else {
            b.append("cái này chưa có location đặt vào, vào trang admin để đặt")
        }
        b.css({gridColumn: `${p.x} / span ${p.w}`, gridRow: `${p.y} / span ${p.h}`})
    }
    //paths
    for (let i = 0; i < data.map.paths.length; i++) {
        let p = data.map.paths[i]
        let b = $(`.brick:nth-child(${p.index+1})`)
        b.css({gridColumn: `${p.x} / span 1`, gridRow: `${p.y} / span 1`})
        b.addClass('path')
    }
}



function openModal(el) {
    $(el).next().addClass('open-modal')
}

const presentLocation = (data) => {

    return `
        <div>
            Present Location id:${data.id} name:${data.name}
            trong này xẽ thiết kế  1 button để mở popup (chỉ có 1 pop up ở trong class container khi ng dùng tắt thì xóa bằng jquery 
                <button onclick=showPopup(${data.id})> Show popup</button>
                khi mở thì thêm vào, 'xem flow chuowng trinhf owr file map_index.js' 
            )
            đặt thẻ present ở đây 
            
        </div>
    `
}

const showPopup = (location_id) => {
    let index = data.locations.findIndex(item => item.id == location_id)
    console.log(data.locations, location_id)
    if (index === -1) {
        alert("Location not found")

    } else {
        let location = data.locations[index]
        let header = `
            ${location.name}
        `
        let md = modal(header, "body", "footer", popup_id, popup_id, 'medium')
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