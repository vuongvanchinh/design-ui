
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

           <svg
           width="229"
           height="352"
           viewBox="0 0 229 352"
           fill="none"
           xmlns="http://www.w3.org/2000/svg"
         >
           <g id="Flat_Navigation_Icon_SVG_pvywdq 1" clip-path="url(#clip0_26:22)">
             <g id="Group">
               <g id="underLocIcon">
                 <g id="Group_2">
                   <path
                     id="Vector"
                     d="M115.051 347.337C173.184 347.337 220.311 334.77 220.311 319.266C220.311 303.763 173.184 291.195 115.051 291.195C56.9184 291.195 9.79224 303.763 9.79224 319.266C9.79224 334.77 56.9184 347.337 115.051 347.337Z"
                     fill="#1FDFAE"
                   />
                   <path
                     id="Vector_2"
                     d="M115.051 352C60.3195 352 4.91772 340.762 4.91772 319.266C4.91772 297.771 60.3195 286.532 115.051 286.532C169.783 286.532 225.185 297.771 225.185 319.266C225.174 340.762 169.783 352 115.051 352ZM115.051 295.848C53.7699 295.848 14.6557 309.713 14.6557 319.266C14.6557 328.809 53.7591 342.685 115.051 342.685C176.333 342.685 215.436 328.82 215.436 319.266C215.436 309.723 176.333 295.848 115.051 295.848Z"
                     fill="#060504"
                   />
                 </g>
                 <g id="Group_3">
                   <path
                     id="Vector_3"
                     d="M161.028 314.097C177.975 315.699 189.032 318.336 189.032 321.313C189.032 322.42 187.519 323.474 184.763 324.446"
                     fill="#1FDFAE"
                   />
                   <path
                     id="Vector_4"
                     d="M184.763 329.109C182.785 329.109 180.915 327.941 180.191 326.059C179.629 324.601 179.878 323.04 180.721 321.841C176.959 320.858 170.561 319.68 160.542 318.739C157.862 318.491 155.905 316.206 156.176 313.642C156.435 311.088 158.834 309.216 161.504 309.464C191.399 312.287 193.895 317.064 193.895 321.324C193.895 326.193 188.286 328.179 186.438 328.83C185.887 329.016 185.314 329.109 184.763 329.109ZM185.001 323.422H185.022H185.001Z"
                     fill="#060504"
                   />
                 </g>
               </g>
               
               <g id="topLocIcon">
                 <g id="Group_4">
                   <g id="Group_5">
                     <path
                       id="Vector_5"
                       d="M114.5 159.68C85.5562 159.68 62.1028 137.233 62.1028 109.555C62.1028 81.8767 85.567 59.4302 114.5 59.4302C143.433 59.4302 166.897 81.8767 166.897 109.555C166.897 137.233 143.444 159.68 114.5 159.68Z"
                       fill="green"
                     />
                   </g>
                 </g>
                 <g id="Group_6">
                   <g id="Group_7">
                     <path
                       id="Vector_6"
                       d="M112.479 324.467C107.668 324.467 103.283 322.165 100.723 318.324L93.0562 306.814C47.298 238.226 0 167.306 0 115.496C0 56.7794 50.4731 9 112.5 9C174.527 9 225 56.7794 225 115.496C225 166.814 180.75 233.361 133.898 303.809C130.691 308.624 127.484 313.449 124.277 318.284C121.717 322.154 117.311 324.467 112.479 324.467ZM112.5 18.0573C55.7403 18.0573 9.56792 61.7654 9.56792 115.496C9.56792 164.683 56.1226 234.477 101.137 301.979L108.815 313.499C109.962 315.228 111.757 315.419 112.479 315.419C113.201 315.419 115.017 315.228 116.174 313.479C119.381 308.644 122.588 303.809 125.795 298.994C171.893 229.682 215.432 164.21 215.432 115.506C215.432 61.7654 169.26 18.0573 112.5 18.0573ZM112.553 168.774C97.6225 168.774 83.3503 163.245 72.7098 153.172C60.7419 141.843 54.8376 126.131 56.5155 110.088C59.1384 85.0067 80.2813 64.9922 106.776 62.5093C123.735 60.921 140.312 66.5102 152.29 77.8393C164.258 89.1684 170.162 104.88 168.485 120.924C165.862 146.005 144.719 166.02 118.224 168.503C116.334 168.683 114.433 168.774 112.553 168.774ZM112.436 71.3052C110.865 71.3052 109.293 71.3756 107.721 71.5263C85.7502 73.5871 68.2179 90.1837 66.0409 110.982C64.6498 124.322 69.5453 137.36 79.4848 146.769C89.4244 156.178 103.208 160.812 117.289 159.495C139.26 157.435 156.793 140.838 158.97 120.04C160.361 106.7 155.465 93.6619 145.526 84.2528C136.701 75.8992 124.85 71.3052 112.436 71.3052Z"
                       fill="#060504"
                     />
                   </g>
                 </g>
                 <g id="Group 1">
                   <path
                     id="Vector_7"
                     d="M112.5 13.5337C53.0112 13.5337 4.78931 59.1819 4.78931 115.496C4.78931 168.874 57.5668 244.972 104.769 315.912C108.359 321.3 116.652 321.28 120.231 315.882C169.334 241.785 220.221 169.005 220.221 115.506C220.221 59.1819 171.989 13.5337 112.5 13.5337ZM117.757 163.999C85.198 167.055 58.0553 141.361 61.2835 110.54C63.6729 87.731 83.1591 69.2847 107.254 67.0229C139.813 63.9669 166.955 89.661 163.727 120.482C161.338 143.291 141.852 161.737 117.757 163.999Z"
                     fill="#FF6263"
                   />
                   <g id="Group_8">
                     <g id="Group_9">
                       <path
                         id="Vector_8"
                         d="M146.837 116.585C144.146 116.585 141.963 114.497 141.963 111.922C141.963 97.437 129.642 85.6502 114.5 85.6502C111.809 85.6502 109.625 83.5617 109.625 80.9872C109.625 78.4128 111.809 76.3242 114.5 76.3242C135.014 76.3242 151.701 92.288 151.701 111.912C151.712 114.507 149.529 116.585 146.837 116.585Z"
                         fill="#060504"
                       />
                     </g>
                   </g>
                 </g>
               </g>
             </g>
           </g>
           <defs>
             <clipPath id="clip0_26:22">
               <rect width="229" height="352" fill="white" />
             </clipPath>
           </defs>
         </svg>
        </div>
   `
}
const popUpContent = (data) => {

    let content = ''
    
    for (i = 2; i < data.media.length; i++) {
        content += slideMediaHtml(data.media[i], '', false)
    }
    let card = '';

    for (i = 1; i < data.media.length; i++) {
        if(i % 2 === 1) {
            card += cardForwardSlider(data.media[i])
        } else {
            card += cardReverseSlider(data.media[i])
        }

    }
    // return `
    //     <div>
            // ${data.media.length > 0 && data.media[0].type === 'IFRAME' ? `
            //    ${mediaHtml(data.media[0], '', true)}
            // `:''}
            // <p class="media-description">${data.description}</p>
    //         ${content}
    //         <div>
    //     </div>
    // `

        return `
        <div class="slide-container">
            <div class="duc-slider">
                <div class="duc-slide current" style="background: url('${data.media[1].url}') no-repeat center center/cover;">
                    <div class="duc-content">
                    <h1>${data.media[1].name}</h1>
                    ${data.media[1].description ?  `<p>${data.media[1].description}</p>`:''}
                    </div>
                </div>
             
                 ${content}

            </div>
            <div class="buttons-slider">
                <button id="prevSlide"><i class="fas fa-arrow-left"></i></button>
                <button id="nextSlide"><i class="fas fa-arrow-right"></i></button>
            </div>
        </div>

       
        ${data.media.length > 0 && data.media[0].type === 'IFRAME' ? `
        ${mediaHtml(data.media[0], '', true)}
        `:'<div></div>'}
        <p class="media-description">${data.description}</p>

       ${card}

        <script>
            ducSlider(${true},document.querySelectorAll('.duc-slide'), document.querySelector('#prevSlide'), document.querySelector('#nextSlide'))
        </script>
        `
}

const cardForwardSlider = (data) => {
    let content = `      
    <section class="sec2 left-right-sec">
    <div class="containter-2">
      <div class="sec2-inner">
        <div class="img">
          <img
            src="${data.url}"
            alt=""
          />
        </div>
        <div class="text">
          <h2>${data.name}</h2>
          <div class="text-inner">
            <div class="scroll-txt">
              <p>
                ${data.description !== undefined ? data.description : ''}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>`;
  return content;
}

const cardReverseSlider = (data) => {
    let content = `      
    <section class="sec2 left-right-sec">
    <div class="containter-2">
      <div class="sec2-inner">
        <div class="text">
          <h2>${data.name}</h2>
          <div class="text-inner">
            <div class="scroll-txt">
              <p>
              ${data.description !== undefined ? data.description : ''}
              </p>
            </div>
          </div>
        </div>
        <div class="img">
        <img
          src="${data.url}"
          alt=""
        />
      </div>
      </div>
    </div>
  </section>`;
  return content;
}



let slideInterval;

const ducSlider = (auto = false, slides, prev, next) => {

        const nextSlide = () => {
            const current = document.querySelector('.current');
            console.log(slides.length)
            current.classList.remove('current');
            if (current.nextElementSibling) {
                current.nextElementSibling.classList.add('current');
            } else {
                slides[0].classList.add('current');
            }
            setTimeout(() => current.classList.remove('current'));
        };
    
        const prevSlide = () => {
            const current = document.querySelector('.current');
            current.classList.remove('current');
            if (current.previousElementSibling) {
                current.previousElementSibling.classList.add('current');
            } else {
                slides[slides.length - 1].classList.add('current');
            }
            setTimeout(() => current.classList.remove('current'));
        }
    
        next.addEventListener('click', () => {
            nextSlide();
            if (auto) {
                clearInterval(slideInterval);
                slideInterval = setInterval(nextSlide, 5000)
            }
        }, false)
    
        prev.addEventListener('click', () => {
            prevSlide();
            if (auto) {
                clearInterval(slideInterval);
                slideInterval = setInterval(nextSlide, 5000)
            }
        }, false)
    
        if (auto) {
            slideInterval = setInterval(nextSlide, 5000)
        }

}
const clearSlideInterval = () => {
    clearInterval(slideInterval);
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
                clearSlideInterval();
                md.close()
            }
        })
        $(`#${popup_id} .modal-close`).click((e) => {
            clearSlideInterval();
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

const slideMediaHtml = (data={type: "image", url:"", description: "",  name: ""}, id="", only_media=true) => {
    let media = ''
    if (id.length > 0) {
        id = `id="${id}"`
    }
    if (data.type ==='image' || data.type==='GIF' || data.type==='JPEG'|| data.type==='JPG'|| data.type==='PNG'|| data.type==='TIF'|| data.type==='TIFF') {
        media = `<img class="media-image" ${id} src="${data.url}"/>`

    } else if (data.type === 'IFRAME' || data.type === 'YTB') {
        return '';
    }
    
    if(only_media) {
        return media
    } else {
        return `
            <div class="duc-slide"style=" background: url('${data.url}')  no-repeat center center/cover;">
                <div class="duc-content" >
                    <h1>${data.name}</h1>
                    ${data.description ?  `<p>${data.description}</p>`:''}
                </div>
            </div>
        `
    }
}

