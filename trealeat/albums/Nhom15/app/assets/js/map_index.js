const popup_id = 'location_popup'
let zoom_rate = 1
let data = {}
let med = {}
const getListMediaId = (data) => {
	let rs = []
	for (let i = 0; i < data.locations.length; i++) {
		rs.push(...data.locations[i].media)
	}
	for (let i = 0; i < data.decorators.length; i++) {
		rs.push(...data.decorators[i].media)
	}
	return rs
}
const filloutMediaData = (medias, data) => {
	//fetch media for locations 
	for (i = 0; i < data.locations.length; i++) {
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
	// for (let i = 0; i < data.decorators.length; i++) {
	// 	let j = 0
	// 	while (j < data.decorators[i].media.length) {
	// 		let id = data.decorators[i].media[j]
	// 		if (medias[id]) {
	// 			data.decorators[i].media[j] = medias[id]
	// 			j += 1
	// 		} else {
	// 			console.log('lost', data.decorators[i].media[j])
	// 			data.decorators[i].media.splice(j, 1)
	// 		}
	// 	}
	// }
	return data
}
$(document).ready(() => {
	if (window.location.hostname === '127.0.0.1') {
		// ở local tạm thời dùng dữ liệu cứng 
		//muốn update thì xóa file .trealet trong app trong nhom15 upload lại 
		//vào trag https://hcloud.trealet.com/apps_dev/btl/nhom15/app/ để lấy chuỗi mới nhất thay vào str_data
		;
		(async () => {
			try {
				let res = await fetch('streamline-example.trealet')
				let dt = await res.json()
				data = dt.trealet
				document.title = data.title
				console.log('media loi')
				// let media_ids = getListMediaId(data)
				let medias_res = await fetch('media.json')
				let medias = await medias_res.json()
				console.log(medias)
				data = filloutMediaData(medias, data)
				setup()
				if (data.features.includes(constants.zoom)) {
					document.getElementById('view').onwheel = function(e) {
						e.preventDefault()
						const pre_zoom_rate = zoom_rate
						let direction = e.deltaY < 0 ? 1 : -1
						zoom(direction, offset = 0.05)
						let view = document.getElementById('view')
						view.scrollLeft = view.scrollLeft + (zoom_rate - pre_zoom_rate) * (e.clientX);
						view.scrollTop = view.scrollTop + (zoom_rate - pre_zoom_rate) * (e.clientY);
						return false;
					}
				}
			} catch (error) {
				console.log(error)
				alert(error)
			}
		})()
	} else {
		// trên online thì gọi dữ liệu 
		let url = 'https://hcloud.trealet.com/apps_dev/btl/nhom15/app/streamline-example.trealet';
		(async () => {
			try {
				let res = await fetch(url)
				data = await res.json()
				data = data.trealet
				document.title = data.title
				let media_ids = getListMediaId(data)
				let medias = {}
				await Promise.all(media_ids.map(async (id) => {
					try {
						if (!medias[id]) {
							let mres = await fetch(`https://hcloud.trealet.com/tiny${id}?json`)
							let dt = await mres.json()
							if (dt && dt.image && dt.image.path) {
								dt = dt.image
								let type = dt.path.split('.')[1].toUpperCase()
								if (type === 'YTB' || type === 'TXT') {
									try {
										let code = await fetch(`https://hcloud.trealet.com${dt.url_full}`)
										let link = await code.text()
										medias[id] = {
											type: 'IFRAME',
											url: link.trim(),
											description: dt.desc,
											name: dt.title
										}
									} catch (error) {
										console.log(`id ${id} error ${type}`)
									}
								} else {
									medias[id] = {
										type: type,
										url: `https://hcloud.trealet.com/${dt.url_full}`,
										description: dt.desc,
										name: dt.title
									}
								}
							}
						}
					} catch (error) {
						console.log("Error ", id, error)
					}
				}))
				// console.log(medias)
				data = filloutMediaData(medias, data)
				// console.log(data)
				setup()
				if (data.features.includes(constants.zoom)) {
					// document.getElementById('view').onwheel = function(e) {
					// 	e.preventDefault()
					// 	const pre_zoom_rate = zoom_rate
					// 	let direction = e.deltaY < 0 ? 1 : -1
					// 	zoom(direction, offset = 0.05)
					// 	let view = document.getElementById('view')
					// 	view.scrollLeft = view.scrollLeft + (zoom_rate - pre_zoom_rate) * (e.clientX);
					// 	view.scrollTop = view.scrollTop + (zoom_rate - pre_zoom_rate) * (e.clientY);
					// 	return false;
					// }
					document.getElementById('view').addEventListener('wheel',function(e) {
						e.preventDefault()
						const pre_zoom_rate = zoom_rate
						let direction = e.deltaY < 0 ? 1 : -1
						zoom(direction, offset = 0.05)
						let view = document.getElementById('view')
						view.scrollLeft = view.scrollLeft + (zoom_rate - pre_zoom_rate) * (e.clientX);
						view.scrollTop = view.scrollTop + (zoom_rate - pre_zoom_rate) * (e.clientY);
						return false;
					})
				}
				console.log(JSON.stringify(data))
				console.log("abc",data)
			} catch (error) {
				console.log(error)
				alert('can not fetch data')
				// document.getElementById('#message').innerHTML = 'Can not fetch data'
			}
		})()
	}
})
const welcomeAnimation = () => {
	if (data.features.includes(constants.welcome_animation)) {
		$('#view').addClass('horizontal_center')
		let board_h = $('#board').height()
		let board_w = $('#board').width()
		let min_zoom_rate = $('#view').height() / board_h
		if ($('#view').width() / board_w < min_zoom_rate) {
			min_zoom_rate = $('#view').width() / board_w
			alert('width')
		}
		document.documentElement.style.setProperty('--min-zoom-rate', min_zoom_rate);
		
		let board = document.getElementById('board')
		let view = document.getElementById('view')
		let maxScrollTop = view.scrollHeight - view.clientHeight;
		view.scrollTop = maxScrollTop
		board.addEventListener('animationend', (e) => {
			if (e.animationName === 'welcome') {
				$('#view').removeClass('horizontal_center')
				let maxScrollLeft = view.scrollWidth - view.clientWidth;
				view.scrollLeft = maxScrollLeft / 2
				let toasts = document.getElementById('toasts')
				addToast(toasts, {
					type: 'success',
					title: 'Chào bạn!',
					message: data.greeting,
					duration: 2000
				})
			}
		})
		$('#board').css('animation-name', 'welcome')
	} else {
		let toasts = document.getElementById('toasts')
		addToast(toasts, {
			type: 'success',
			title: 'Chào bạn!',
			message: data.greeting,
			duration: 2000
		})
	}
}
const setup = () => {
	// render brick
	let brick = `
        <div class='brick' style ='--b_w: ${data.map.cell_width}'>
        </div>
    `
	let style = board_style()
	$('#view').empty()
	$('#view').css(style)
	$('#view').append(`
            <div id='board' class='board bg-image' ></div>
    `)
	$('#board').css(style)
	$('#board').append(brick.repeat(data.map.number_of_cells))
	//plots
	for (let i = 0; i < data.map.plots.length; i++) {
		let p = data.map.plots[i]
		//find location
		let b = $(`.brick:nth-child(${p.index+1})`) // b = brick
		if (p.item_id.startsWith('location')) {
			let index = data.locations.findIndex(item => item.id === p.item_id)
			if (index !== -1) { // find out
				b.append(presentItem(data.locations[index]))
			} else {
				b.append("cái này chưa có location đặt vào, vào trang admin để đặt")
			}
		} else if (p.item_id.startsWith('decorator')) {
			let index = data.decorators.findIndex(item => item.id === p.item_id)
			if (index !== -1) { // find out
				b.append(presentDecorator(data.decorators[index]))
			} else {
				b.append("cái này chưa có decorators đặt vào, vào trang admin để đặt")
			}
		}
		b.css({
			'--b_w': "auto",
			gridColumn: `${p.x} / span ${p.w}`,
			gridRow: `${p.y} / span ${p.h}`
		})
		b.addClass('plot')
	}
	
	//paths
	for (let i = 0; i < data.map.paths.length; i++) {
		let p = data.map.paths[i]
		let b = $(`.brick:nth-child(${p.index+1})`)
		b.css({
			backgroundImage: `url("${data.map.path_list.options[p.op_no]}")`,
			gridColumn: `${p.x} / span 1`,
			gridRow: `${p.y} / span 1`
		})
		b.addClass('path')
	}
	// alert($('#board').height())
	welcomeAnimation()
	$(window).resize((e) => {
		if (zoom_rate < 1) {
			zoom_rate = 1
			$('.brick').css('zoom', zoom_rate)
		}
	})
	$('#pre-loader').remove()
	// auto change slide
	let timer = setInterval(changeSimpleSlide, 5000)
	// let view = document.getElementById('view')
	// let maxScrollTop = view.scrollHeight - view.clientHeight;
	// view.scrollTop = maxScrollTop
	// let scroller = setTimeout(function () {
	//     $('#view').removeClass('horizontal_center')     
	//     let maxScrollLeft = view.scrollWidth - view.clientWidth;
	//     view.scrollLeft = maxScrollLeft/2   
	//     let toasts = document.getElementById('toasts')
	//     addToast(toasts, {type: 'success', title: 'Chào bạn!', message: 'Chúc bạn tham quan vui vẻ', duration: 2000})
	// }, animation_duration)
	// $('.brick:nth-child(1)').click(() => {
	// 	let maxScrollLeft = view.scrollWidth - view.clientWidth;
	// 	// let maxScrollTop = view.scrollHeight - view.clientHeight;
	// 	console.log(maxScrollLeft, view.scrollWidth, view.clientWidth)
	// })
}
const board_style = () => {
	let index = parseInt(data.map.background.selected)
	let style = {}
	let style_str = data.map.background.options[index].style
	if (style_str.startsWith('http')) {
		style = {
			backgroundImage: `url('${style_str}')`,
		}
	} else {
		// let st = "background-color: #000000; background-image: linear-gradient(315deg, #000000 0%, #7f8c8d 74%);"
		let l = style_str.split(';')
		// let res = {}
		for (let i = 0; i < l.length; i++) {
			if (l[i].trim()) {
				let t = l[i].trim().split(':')
				let attrs = t[0].split('-')
				if (attrs.length > 1) {
					for (let j = 1; j < attrs.length; j++) {
						attrs[j] = attrs[j].charAt(0).toUpperCase() + attrs[j].slice(1);
					}
					style[attrs.join('')] = t[1]
				} else {
					style[t[0]] = t[1]
				}
			}
		}
	}
	style.gridTemplateColumns = `repeat(${data.map.cells_per_row}, 1fr)`
	console.log(style)
	return style
}

function openModal(el) {
	$(el).next().addClass('open-modal')
}
const presentDecorator = (data) => {
	if (data.media.length > 0) {
		return `
            <div class='full bgc-image' style='background-image: url(${data.media[0]})'></div>
        `
	} else {
		return `Not decorator`
	}
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
		if (media.type === 'JPEG' || media.type === 'JPG' || media.type === 'image' || media.type === 'GIF' || media.type === 'PNG' || media.type === 'TIF' || media.type === 'TIFF') {
			slide_items += `
            <div class="${classs}" style="background-image: url('${data.media[i].url}')">
            
            </div>
           `
		}
	}
	return `    
        <div class="present-item" id="${data.id}" onclick="showPopup('${data.id}')">
           <div class="simple-slider">
            ${
                slide_items
            }
           </div>
           
           <div class="tooltip">
           ${data.name}
           </div>
           <div class="svg-location">
           <svg width="30" height="40" viewBox="0 0 40 60" fill="none" xmlns="http://www.w3.org/2000/svg">
           <g id="Flat_Navigation_Icon_SVG_pvywdq 1">
           <g id="Group">
           <g id="underLocIcon">
           <g id="Group_2">
           <path id="Vector" d="M20.0962 59.1919C30.2505 59.1919 38.4823 57.0141 38.4823 54.3273C38.4823 51.6407 30.2505 49.4628 20.0962 49.4628C9.94208 49.4628 1.71043 51.6407 1.71043 54.3273C1.71043 57.0141 9.94208 59.1919 20.0962 59.1919Z" fill="#1FDFAE"/>
           <path id="Vector_2" d="M20.0962 60C10.5362 60 0.858994 58.0525 0.858994 54.3273C0.858994 50.6024 10.5362 48.6547 20.0962 48.6547C29.6564 48.6547 39.3336 50.6024 39.3336 54.3273C39.3317 58.0525 29.6564 60 20.0962 60ZM20.0962 50.2691C9.39213 50.2691 2.55995 52.6719 2.55995 54.3273C2.55995 55.9811 9.39024 58.3858 20.0962 58.3858C30.8005 58.3858 37.6307 55.983 37.6307 54.3273C37.6307 52.6736 30.8005 50.2691 20.0962 50.2691Z" fill="#060504"/>
           </g>
           <g id="Group_3">
           <path id="Vector_3" d="M28.1272 53.4316C31.0873 53.7092 33.0187 54.1662 33.0187 54.6821C33.0187 54.8739 32.7544 55.0566 32.273 55.225" fill="#1FDFAE"/>
           <path id="Vector_4" d="M32.273 56.0331C31.9275 56.0331 31.6009 55.8307 31.4744 55.5045C31.3762 55.2519 31.4197 54.9814 31.567 54.7736C30.9099 54.6032 29.7923 54.3991 28.0423 54.236C27.5742 54.193 27.2323 53.7971 27.2797 53.3527C27.3249 52.9101 27.7439 52.5857 28.2103 52.6287C33.4321 53.1179 33.8681 53.9457 33.8681 54.684C33.8681 55.5278 32.8884 55.8719 32.5656 55.9847C32.4693 56.017 32.3693 56.0331 32.273 56.0331ZM32.3146 55.0476H32.3183H32.3146Z" fill="#060504"/>
           </g>
           </g>
           <g id="topLocIcon">
           <g id="Group_4">
           <g id="Group_5">
           <path id="Vector_5" d="M20 26.6718C14.9443 26.6718 10.8476 22.7818 10.8476 17.9854C10.8476 13.1889 14.9462 9.29898 20 9.29898C25.0538 9.29898 29.1523 13.1889 29.1523 17.9854C29.1523 22.7818 25.0557 26.6718 20 26.6718Z" fill="#008000"/>
           </g>
           </g>
           <g id="Group_6">
           <g id="Group_7">
           <path id="Vector_6" d="M19.647 55.2287C18.8066 55.2287 18.0407 54.8297 17.5935 54.1641L16.2544 52.1695C8.26166 40.2835 0 27.9934 0 19.0149C0 8.83962 8.81626 0.559662 19.6507 0.559662C30.4851 0.559662 39.3013 8.83962 39.3013 19.0149C39.3013 27.9081 31.5721 39.4404 23.3883 51.6487C22.8281 52.4831 22.2679 53.3193 21.7078 54.1572C21.2606 54.8278 20.491 55.2287 19.647 55.2287ZM19.6507 2.12925C9.7363 2.12925 1.67125 9.70367 1.67125 19.0149C1.67125 27.5388 9.80307 39.6338 17.6659 51.3316L19.007 53.328C19.2073 53.6276 19.5209 53.6607 19.647 53.6607C19.7731 53.6607 20.0903 53.6276 20.2924 53.3245C20.8526 52.4866 21.4128 51.6487 21.9729 50.8143C30.025 38.8029 37.63 27.4569 37.63 19.0167C37.63 9.70367 29.5651 2.12925 19.6507 2.12925ZM19.6599 28.2478C17.052 28.2478 14.559 27.2896 12.7004 25.544C10.6099 23.5808 9.57862 20.8579 9.8717 18.0778C10.3299 13.7313 14.0229 10.2629 18.6508 9.83258C21.6131 9.55734 24.5086 10.5259 26.6009 12.4892C28.6914 14.4525 29.7226 17.1752 29.4297 19.9556C28.9715 24.302 25.2784 27.7705 20.6505 28.2008C20.3203 28.232 19.9883 28.2478 19.6599 28.2478ZM19.6395 11.3569C19.3651 11.3569 19.0905 11.3691 18.8159 11.3952C14.9782 11.7523 11.9158 14.6284 11.5355 18.2327C11.2925 20.5444 12.1477 22.8039 13.8838 24.4344C15.62 26.0649 18.0276 26.868 20.4872 26.6398C24.3249 26.2828 27.3874 23.4066 27.7677 19.8024C28.0107 17.4906 27.1555 15.2312 25.4194 13.6006C23.8779 12.153 21.8079 11.3569 19.6395 11.3569Z" fill="#060504"/>
           </g>
           </g>
           <g id="Group 1">
           <path id="Vector_7" d="M19.6507 1.34532C9.2596 1.34532 0.836563 9.25595 0.836563 19.0149C0.836563 28.2651 10.0553 41.4525 18.3003 53.7461C18.9273 54.6798 20.3759 54.6763 21.0011 53.7409C29.578 40.9002 38.4666 28.2878 38.4666 19.0167C38.4666 9.25594 30.0418 1.34532 19.6507 1.34532ZM20.5689 27.4203C14.8818 27.9499 10.1407 23.4972 10.7045 18.1561C11.1219 14.2034 14.5256 11.0067 18.7343 10.6148C24.4215 10.0852 29.1625 14.5378 28.5986 19.879C28.1813 23.8317 24.7776 27.0283 20.5689 27.4203Z" fill="#FF6263"/>
           <g id="Group_8">
           <g id="Group_9">
           <path id="Vector_8" d="M25.6484 19.2036C25.1784 19.2036 24.797 18.8418 24.797 18.3956C24.797 15.8854 22.6449 13.8428 20 13.8428C19.53 13.8428 19.1485 13.4809 19.1485 13.0347C19.1485 12.5886 19.53 12.2266 20 12.2266C23.5832 12.2266 26.498 14.9931 26.498 18.3938C26.4999 18.8435 26.1186 19.2036 25.6484 19.2036Z" fill="#060504"/>
           </g>
           </g>
           </g>
           </g>
           </g>
           </g>
           </svg>
        </div>
        </div>
   `
}
const popUpContent = (data) => {
	let card = '';
	let sign = 0
	for (i = 1; i < data.media.length; i++) {
		if (data.media[i].type === 'IFRAME') {
			card += `<div style='margin-top: 4rem;'>
                ${mediaHtml(data.media[i], '', false)}
            </div>`
		} else {
			card += imageSection(data.media[i], sign)
			sign += 1
		}
	}
	return `
        ${data.media.length > 0 && data.media[0].type === 'IFRAME' ? `
        ${mediaHtml(data.media[0], '', true)}
        `:'<div></div>'}
        <p class="media-description">${data.description}</p>
       ${card}
        <div style="text-align: center">
        <br>
        <br>
        <p> HẾT </p>
        </div>
        `
}
const imageSection = (data, i) => {
	let modifed = 'image-section--even'
	let inner = `
    <div class='image-section__img'>
        <img
            src="${data.url}"
            alt=""
            draggable="false"
        />
    </div>
    <div class="image-section__text" >
        <h2 class="image-section__text__name">${data.name}</h2>
        <p class='image-section__text__description'>
        ${data.description !== undefined ? data.description : ''}
        </p>
    </div>
    `
	if (i % 2 !== 0) {
		modifed = 'image-section--odd'
		inner = `
        <div class="image-section__text" >
            <h2 class="image-section__text__name">${data.name}</h2>
            <p class='image-section__text__description'>
            ${data.description !== undefined ? data.description : ''}
           
             </p>
        </div>
        <div class='image-section__img'>
            <img
                src="${data.url}"
                alt=""
                draggable="false"
            />
        </div>
       
    `
	}
	return `
        <div class="grid image-section ${modifed}" >
            ${inner}
        </div>
    
    `;
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
              ${data.description !== undefined ? data.description : ''}
              ${data.description !== undefined ? data.description : ''}
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
	for (i = 0; i < slides_active.length; i++) {
		let s = $(slides_active[i])
		s.removeClass('simple-slide-item-active')
		if (s.next().length !== 0) { // not last slide
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

	if(!$(`#${item_id} .tooltip`).hasClass('tooltip-visited')) {
		$(`#${item_id} .tooltip`).addClass('tooltip-visited')
		$(`#${item_id} .tooltip`).append("<i class='bx bx-user-check'></i>")
	}
	
	if (index === -1) {
		alert("Location not found")
	} else {
		let location = data.locations[index]
		let header = `
            <p style='font-size: 1.5rem; font-weight: 560;'>${location.name}</p>
        `
		let popup_content = popUpContent(location)
		let popup_footer = popUpFooter(location)
		let md = modal(header, popup_content, popup_footer, popup_id, popup_id, true, 'medium')
		$('#container').prepend(md.getHtml())
		$(`#${popup_id}`).mousedown((e) => {
			if (e.target.classList.contains('modal')) {
				md.close()
			}
		})
		$(`#${popup_id} .modal-close`).click((e) => {
			md.close()
		})
	}
}
const zoom = (direction, offset = 0.05) => {
	let current_percent = parseFloat($('.brick').css('zoom'))
	if (direction === -1) { //descrease
		let view_w = $('#view').width()
		let b_w = $('#board').width()
		let view_h = $('#view').height()
		let b_h = $('#board').height()
		let rate = (zoom_rate - offset) / zoom_rate
		if (rate * b_w > view_w || rate * b_h > view_h) { //current_percent - offset >= min_percent
			zoom_rate = current_percent - offset
			$('.brick').css('zoom', zoom_rate)
		} else if (b_h > view_h) {
			// offset = zoom_rate * (1 - (view_h / board_h))
			zoom_rate = zoom_rate * view_h / b_h
			console.log("room rate", zoom_rate)
			$('.brick').css('zoom', zoom_rate)
		}
	} else {
		zoom_rate = current_percent + offset
		$('.brick').css('zoom', zoom_rate)
	}
	return true
}
const mediaHtml = (data = {
	type: "image",
	url: "",
	description: "",
	name: ""
}, id = "", only_media = true) => {
	let media = ''
	if (id.length > 0) {
		id = `id="${id}"`
	}
	if (data.type === 'image' || data.type === 'GIF' || data.type === 'JPEG' || data.type === 'JPG' || data.type === 'PNG' || data.type === 'TIF' || data.type === 'TIFF') {
		media = `<img class="media-image" ${id} src="${data.url}" draggable/>`
	} else if (data.type === 'IFRAME' || data.type === 'YTB') {
		media = `
            <div class="video">
                <iframe src="${data.url}" title="${data.name}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>   
            </div>
        `
	}
	if (only_media) {
		return media
	} else {
		return `
            <p class="media-name">${data.name}</p>
            ${media}
           ${data.description ?  `<p class="media-description">${data.description}</p>`:''}
        `
	}
}