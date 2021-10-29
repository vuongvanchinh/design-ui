
const popup_id = 'location_popup'
let zoom_rate = 1

let data = {}

$(document).ready(() => { 
    if (window.location.hostname === '127.0.0.1') {
        // ở local tạm thời dùng dữ liệu cứng 
        //muốn update thì xóa file .trealet trong app trong nhom15 upload lại 
        //vào trag https://hcloud.trealet.com/apps_dev/btl/nhom15/app/ để lấy chuỗi mới nhất thay vào str_data
        let str_data = '{"map":{"cell_width":"50px","cells_per_row":50,"number_of_cells":3400,"plots":[{"index":142,"x":23,"y":6,"w":3,"h":3,"item_id":"location_1"},{"index":457,"x":24,"y":13,"w":5,"h":5,"item_id":"location_2"},{"index":492,"x":9,"y":14,"w":4,"h":4,"item_id":"location_3"},{"index":815,"x":24,"y":21,"w":5,"h":5,"item_id":"location_5"},{"index":804,"x":9,"y":22,"w":4,"h":4,"item_id":"location_6"},{"index":1176,"x":24,"y":29,"w":5,"h":5,"item_id":"location_8"},{"index":773,"x":40,"y":20,"w":4,"h":4,"item_id":"location_9"},{"index":967,"x":34,"y":25,"w":4,"h":4,"item_id":"location_10"},{"index":1510,"x":24,"y":37,"w":5,"h":5,"item_id":"location_11"},{"index":2086,"x":24,"y":50,"w":5,"h":5,"item_id":"location_12"},{"index":1887,"x":25,"y":45,"w":3,"h":3,"item_id":"location_13"},{"index":1885,"x":41,"y":47,"w":3,"h":3,"item_id":"location_14"},{"index":1887,"x":25,"y":44,"w":3,"h":3,"item_id":"location_15"},{"index":1376,"x":40,"y":34,"w":4,"h":4,"item_id":"location_16"},{"index":2118,"x":41,"y":53,"w":3,"h":3,"item_id":"location_17"},{"index":1484,"x":9,"y":37,"w":4,"h":4,"item_id":"location_18"},{"index":1841,"x":9,"y":47,"w":3,"h":3,"item_id":"location_19"},{"index":2264,"x":9,"y":54,"w":3,"h":3,"item_id":"location_20"},{"index":2643,"x":25,"y":62,"w":3,"h":3,"item_id":"location_21"},{"index":2477,"x":9,"y":59,"w":3,"h":3,"item_id":"location_22"},{"index":622,"x":15,"y":17,"w":4,"h":4,"item_id":"location_23"},{"index":250,"x":6,"y":6,"w":17,"h":2,"item_id":"location_24"},{"index":172,"x":22,"y":4,"w":2,"h":2,"item_id":"location_25"},{"index":174,"x":25,"y":4,"w":2,"h":2,"item_id":"location_26"},{"index":251,"x":26,"y":6,"w":21,"h":2,"item_id":"location_27"},{"index":306,"x":45,"y":8,"w":2,"h":23,"item_id":"location_28"},{"index":1263,"x":47,"y":30,"w":2,"h":3,"item_id":"location_29"},{"index":1437,"x":47,"y":34,"w":2,"h":3,"item_id":"location_30"},{"index":1517,"x":45,"y":36,"w":2,"h":29,"item_id":"location_31"},{"index":2592,"x":28,"y":63,"w":17,"h":2,"item_id":"location_32"},{"index":2697,"x":27,"y":65,"w":2,"h":2,"item_id":"location_33"},{"index":2694,"x":24,"y":65,"w":2,"h":2,"item_id":"location_34"},{"index":270,"x":6,"y":8,"w":2,"h":23,"item_id":"location_35"},{"index":1414,"x":6,"y":36,"w":2,"h":29,"item_id":"location_35"},{"index":2535,"x":8,"y":63,"w":17,"h":2,"item_id":"location_36"},{"index":1151,"x":4,"y":30,"w":2,"h":3,"item_id":"location_37"},{"index":1318,"x":4,"y":34,"w":2,"h":3,"item_id":"location_38"},{"index":2858,"x":24,"y":71,"w":5,"h":5,"item_id":"location_39"}],"paths":[]},"exec":"streamline","title":"Trealet","locations":[{"id":"location_1","name":"Điện Thái Hòa","effect":"loops","description":"Điện Thái Hòa (chữ Hán: 太和殿) là cung điện nằm trong khu vực Đại Nội của kinh thành Huế, là nơi đăng quang của 13 vua triều Nguyễn từ Gia Long đến Bảo Đại. Trong chế độ phong kiến cung điện này được coi là trung tâm của đất nước.Xây dựng và trùng tu Quá trình xây dựng và trùng tu điện Thái Hòa được chia làm 3 thời kỳ chính; mỗi thời kỳ đều có những thay đổi lớn, cải tiến về kiến trúc và trang trí. Vua Gia Long khởi công xây dựng vào ngày 21 tháng 2 năm 1805 và hoàn thành vào tháng 10 cùng năm. Năm 1833 khi vua Minh Mạng quy hoạch lại hệ thống kiến trúc cung đình ở Đại Nội, trong đó có việc cho dời điện về mé nam và làm lại đồ sộ và lộng lẫy hơn. Năm 1923 dưới thời vua Khải Định để chuẩn bị cho lễ Tứ tuần Đại khánh tiết của nhà vua (mừng vua tròn 40 tuổi) diễn ra vào năm 1924, điện Thái Hòa đã được đại gia trùng kiến. Qua các đợt trùng tu lớn nói trên và nhiều lần trùng tu sửa chữa nhỏ khác dưới thời vua Thành Thái, Bảo Đại và trong thời gian gần đây (vào năm 1960, 1970, 1981, 1985 và 1992) điện Thái Hòa đã ít nhiều có thay đổi, vẻ cổ kính ngày xưa đã giảm đi một phần. Tuy nhiên, cốt cách cơ bản của nó thì vẫn còn được bảo lưu, nhất là phần kết cấu kiến trúc và trang trí mỹ thuật.","media":[{"type":"JPG","url":"https://hcloud.trealet.com//albums/Nhom15/media/images/Bên_trong_điện_Thái_Hòa.jpg","description":"vghgftyftyftyftydytdtyt","name":"DSCF7020"},{"type":"JPEG","url":"https://hcloud.trealet.com//albums/Nhom15/media/images/Điện_Thái_Hòa.jpeg","description":"vghgftyftyftyftydytdtyt","name":"Điện_Thái_Hòa"}],"next":"quangninh"},{"id":"location_2","name":"Test","effect":"crazy","description":"description","media":[{"type":"JPG","url":"https://hcloud.trealet.com//albums/Nhom15/media/images/Bên_trong_điện_Thái_Hòa.jpg","description":"vghgftyftyftyftydytdtyt","name":"DSCF7020"},{"type":"JPEG","url":"https://hcloud.trealet.com//albums/Nhom15/media/images/Điện_Thái_Hòa.jpeg","description":"vghgftyftyftyftydytdtyt","name":"Điện_Thái_Hòa"}],"next":"hanoi"},{"id":"location_3","name":"Đại nội","effect":"loops","description":"description","media":[{"type":"JPG","url":"https://hcloud.trealet.com//albums/Nhom15/media/images/Bên_trong_điện_Thái_Hòa.jpg","description":"vghgftyftyftyftydytdtyt","name":"DSCF7020"},{"type":"JPEG","url":"https://hcloud.trealet.com//albums/Nhom15/media/images/Điện_Thái_Hòa.jpeg","description":"vghgftyftyftyftydytdtyt","name":"Điện_Thái_Hòa"},{"type":"IFRAME","url":"https://www.360view.vn/gallery/data/projects/vietnam/thuathien_hue/kinhthanh__092011/index.html","description":"chgchhgcghcghcghchgchgcgcchgcghcghcghcghchgcghch","name":"Ngọ môn "}],"next":null}],"decorators":[{"id":"decorator_1","name":"test","media":[]}]}'
        data = JSON.parse(str_data)
        console.log('on local')
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
    } else {
        // trên online thì gọi dữ liệu 
        $(document).ready(() => {
            let url = 'https://hcloud.trealet.com/apps_dev/btl/nhom15/app/streamline-example.trealet'
            
            ;(async () =>{
                let fetched = {}
                try {
                    let res = await fetch(url)
                    data = await res.json()
                    data = data.trealet
                    document.title = data.title
                    //fetch media for locations 
                    for(i = 0; i < data.locations.length; i++) {    
                        for(j = 0; j < data.locations[i].media.length; j++) {
                            if (fetched[data.locations[i].media[j]]) {
                                data.locations[i].media[j] = fetched[data.locations[i].media[j]]
                                console.log("hit")
                            } else {
                                try {
                                    let mres = await fetch(`https://hcloud.trealet.com/tiny${data.locations[i].media[j]}?json`)
                                    let dt = await mres.json()   
                                    dt = dt.image
                                    let type = dt.path.split('.')[1].toUpperCase()        
                                    if (type === 'YTB' || type === 'TXT') {
                                        try {
                                            let code = await fetch(`https://hcloud.trealet.com${dt.url_full}`)
                                            let link = await code.text()
                                            let new_media = {type:'IFRAME', url: link.trim(), description: dt.desc, name: dt.title}
                                            fetched[data.locations[i].media[j]] = new_media
                                            data.locations[i].media[j] = new_media
                                           
                                        } catch (error) {
                                            alert(error, "YTB")
                                        }
                                    } else {
                                        let new_media = {
                                            type: type,
                                            url: `https://hcloud.trealet.com/${dt.url_full}`,
                                            description: dt.desc,
                                            name: dt.title
                                        }
                                        fetched[data.locations[i].media[j]] = new_media
                                        data.locations[i].media[j] = new_media
                                        
                                    }      
                                    
                                } catch (error) {
                                   alert(error)
                                }
                            }
                            
                        }
                    }
                    //fetch media for decorators
                    for(i = 0; i < data.decorators.length; i++) {
                        for(j = 0; j < data.decorators[i].media.length; j++) {
                            if(fetched[data.decorators[i].media[j]]) {
                                data.decorators[i].media[j] = fetched[data.decorators[i].media[j]]
                                console.log("hit")
                            } else {
                                try {
                                    let mres = await fetch(`https://hcloud.trealet.com/tiny${data.decorators[i].media[j]}?json`)
                                    let dt = await mres.json()   
                                    dt = dt.image
                                    let type = dt.path.split('.')[1].toUpperCase()
                                    console.log(type)        
                                    if (type === 'YTB' || type === 'TXT') {
                                        try {
                                            let code = await fetch(`https://hcloud.trealet.com${dt.url_full}`)
                                            let link = await code.text()
                                            let new_media = {type:'IFRAME', url: link.trim(), description: dt.desc, name: dt.title}
                                            
                                            fetched[data.decorators[i].media[j]] = new_media
                                            data.decorators[i].media[j] = new_media
            
                                        } catch (error) {
                                             alert(error, "YTB")
                                        }
                                    } else {
                                        let new_media = {
                                            type: type,
                                            url: `https://hcloud.trealet.com${dt.url_full}`,
                                            description: dt.desc,
                                            name: dt.title
                                        }
                                        fetched[data.decorators[i].media[j]] = new_media
                                        data.decorators[i].media[j] = new_media
                                    }      
                                } catch (error) {
                                   alert(error)
                                }
                            }
                        }
                    }
                    /// handle
                    // console.log(JSON.stringify(data))
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
           <div class='present-info'>
            <span class='present-item-name'> ${data.name}</span>
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
               ${mediaHtml(data.media[0], '', false)}
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

    } else if (data.type === 'YTB' || data.type === 'IFRAME') {
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
            <p class="media-description">${data.description}</p>
        `
    }
}

