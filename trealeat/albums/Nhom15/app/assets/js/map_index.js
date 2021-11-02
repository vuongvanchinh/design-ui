
const popup_id = 'location_popup'
let zoom_rate = 1

let data = {}
let med = {}
const getListMediaId = (data) => {
    let rs = []
    for(let i = 0; i < data.locations.length; i++) {
        rs.push(...data.locations[i].media)
    }
    for(let i = 0; i < data.decorators.length; i++) {
        rs.push(...data.decorators[i].media)
    }

    return rs
}

const filloutMediaData = (medias, data) => {
     //fetch media for locations 
     for(i = 0; i < data.locations.length; i++) {    
        let j = 0
        while (j < data.locations[i].media.length) {
            let id = data.locations[i].media[j]
            if (medias[id]) {
                data.locations[i].media[j] = medias[id]
                j += 1
            } else {
                console.log('lost', data.locations[i].media[j])
                data.locations[i].media.splice(j, 1)
            }
        }
    }
    //fetch media for decorators
    for(let i = 0; i < data.decorators.length; i++) {
        let j = 0
        while (j < data.decorators[i].media.length) {
            let id = data.decorators[i].media[j]
            if (medias[id]) {
                data.decorators[i].media[j] = medias[id]
                j += 1
            } else {
                console.log('lost', data.decorators[i].media[j])
                data.decorators[i].media.splice(j, 1)
            }
        }
    }

    return data
}

$(document).ready(() => { 
    if (window.location.hostname === '127.0.0.1') {
        // ở local tạm thời dùng dữ liệu cứng 
        //muốn update thì xóa file .trealet trong app trong nhom15 upload lại 
        //vào trag https://hcloud.trealet.com/apps_dev/btl/nhom15/app/ để lấy chuỗi mới nhất thay vào str_data
        ;(async () =>{
            try {
                let res = await fetch('streamline-example.trealet')
                let dt = await res.json()
                data = dt.trealet
                document.title = data.title
                // let media_ids = getListMediaId(data)
                let medias_res = await fetch('media.json')
                let medias = await medias_res.json()
                console.log(medias)
                data = filloutMediaData(medias, data)
                setup()

            } catch (error) {
                console.log(error)
                alert(error)
            }
            
        })()
        document.getElementById('view').onwheel = function(e){ 
            e.preventDefault()
            const pre_zoom_rate = zoom_rate
            let direction = e.deltaY < 0 ? 1: -1
            zoom(direction, offset=0.1)
            let view = document.getElementById('view')
            view.scrollLeft = view.scrollLeft + (zoom_rate - pre_zoom_rate) * (e.clientX);
            view.scrollTop = view.scrollTop + (zoom_rate - pre_zoom_rate) * (e.clientY);
            return false;
        }    
    } else {
        // trên online thì gọi dữ liệu 
        $(document).ready(() => {
            let url = 'https://hcloud.trealet.com/apps_dev/btl/nhom15/app/streamline-example.trealet'
            
            ;(async () =>{
                try {
                    let res = await fetch(url)
                    data = await res.json()
                    data = data.trealet
                    document.title = data.title
                    let media_ids = getListMediaId(data)
                    let medias = {}
                    await Promise.all(media_ids.map(async (id) => {
                        try {
                            if(!medias[id]) {
                                let mres = await fetch(`https://hcloud.trealet.com/tiny${id}?json`)
                                let dt = await mres.json()
                                if(dt && dt.image && dt.image.path) {
                                    dt = dt.image
                                    let type = dt.path.split('.')[1].toUpperCase()        
                                    if (type === 'YTB' || type === 'TXT') {
                                        try {
                                            let code = await fetch(`https://hcloud.trealet.com${dt.url_full}`)
                                            let link = await code.text()
                                            medias[id] =  {type:'IFRAME', url: link.trim(), description: dt.desc, name: dt.title}
                                        } catch (error) {
                                            console.log(`id ${id} error ${type}`)
                                        }
                                    } else {
                                        medias[id] =  {
                                            type: type, 
                                            url: `https://hcloud.trealet.com/${dt.url_full}`, 
                                            description: dt.desc, 
                                            name: dt.title
                                        }
                                    }
                                }
                            }
                        } catch (error) {
                            console.log("Error ", id,  error)
                        }
                    }))
                    console.log(medias)
                    data = filloutMediaData(medias, data)
                    console.log(data)

                    setup()        

                    document.getElementById('view').onwheel = function(e){ 
                        e.preventDefault()
                        const pre_zoom_rate = zoom_rate
                        let direction = e.deltaY < 0 ? 1: -1
                        zoom(direction, offset=0.1)
                        let view = document.getElementById('view')
                        view.scrollLeft = view.scrollLeft + (zoom_rate - pre_zoom_rate) * (e.clientX);
                        view.scrollTop = view.scrollTop + (zoom_rate - pre_zoom_rate) * (e.clientY);
                        return false;
                    }
                    // console.log(JSON.stringify(data))
                    // console.log(data)
                } catch (error) {
                    console.log(error)
                    alert('can not fetch data')
                    // document.getElementById('#message').innerHTML = 'Can not fetch data'
                }
            })()
            
        })

    }

   

})


const setup = () => {
    // render brick
    let brick = `
        <div class='brick' style = 'width: ${data.map.cell_width};height:${data.map.cell_width}'>
        
        </div>
    `
    $('#board').css('grid-template-columns', `repeat(${data.map.cells_per_row}, 1fr)`)
    $('#board').append(brick.repeat(data.map.number_of_cells))
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

    $(window).resize((e) => {
        if (zoom_rate < 1) {
            zoom_rate = 1
            $('.brick').css('zoom', zoom_rate)
        }
    })
    $('#pre-loader').remove()
}



function openModal(el) {
    $(el).next().addClass('open-modal')
}

const presentItem = (data) => {
    // sử hàm này để thay đổi cái present card cái này sẽ để  hiển thị location, tạo thêm cái tương tự để  hiển thị decorators 
    let slide_items = ''
    for (let i = 0; i < data.media.length; i++) {
        let classs = 'simple-slide-item '
        if (slide_items.length === 0) {
            classs += 'simple-slide-item-active'
        }
        let media = data.media[i]
        if(media.type === 'JPEG'|| media.type==='JPG'|| media.type === 'image' || media.type==='GIF' || media.type==='PNG'|| media.type==='TIF'|| media.type==='TIFF') {
            slide_items += `
            <div class="${classs}" style="background-image: url('${data.media[i].url}')">
            
            </div>
           `
        }
    }
    return `    
        <div class="present-item" onclick="showPopup('${data.id}')">
           <div class="simple-slider">
            ${
                slide_items
            }
           </div>
           
           <div class="tooltip">
           ${data.name}
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
            ${data.media.length > 0 && data.media[0].type === 'IFRAME' ? `
               ${mediaHtml(data.media[0], '', true)}
            `:''}
            <p class="media-description">${data.description}</p>
            ${content}
        </div>
    `
}

const popUpFooter = (data) => {
    // phát triển tính năng tương tác
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
    // console.log(data.locations, item_id)
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
        $('#container').prepend(md.getHtml())
        $(`#${popup_id}`).mousedown((e) => {
            if(e.target.classList.contains('modal')) {
                md.close()
            }
        })
        $(`#${popup_id} .modal-close`).click((e) => {
            md.close()
        })
    }
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
    if (data.type ==='image' || data.type==='GIF' || data.type==='JPEG'|| data.type==='JPG'|| data.type==='PNG'|| data.type==='TIF'|| data.type==='TIFF') {
        media = `<img class="media-image" ${id} src="${data.url}"/>`

    } else if (data.type === 'IFRAME' || data.type === 'YTB') {
        media = `
            <div class="video">
                <iframe src="${data.url}" title="${data.name}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>   
            </div>
        `
    }
    
    if(only_media) {
        return media
    } else {
        return `
            <p class="media-name">${data.name}</p>
            ${media}
           ${data.description ?  `<p class="media-description">${data.description}</p>`:''}
        `
    }
}

