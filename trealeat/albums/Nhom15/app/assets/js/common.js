const features = [
    {name: 'Zoom', key:'zoom'},
    {name: 'Hoạt hình chào mừng', key:'welcome_animation'}

]
const constants = {
    welcome_animation: 'welcome_animation',
    zoom: 'zoom'

}

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}

const loading = (id='', variant='medium',  full_page = true) => {
    if (id==='') {
        id = makeid(5)
    }
    let style = '';
    if (!full_page) {
        style = "style= 'width: 100%; height: auto; background-color: transparent; position: initial;'"
    }
    
    let html = `
       <div class="dashed-loader-wraper" id='${id}' ${style}>
            <div class="dashed-loading dashed-loading-${variant}"></div>
       </div>       
    `

    return {
        getHtml: () => {
            return html           
        },
        remove: () => {
            $(`#${id}`).remove()
        }
    }
}

function checkImgURL(url) {
    return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
}



const table = (headers, body, id ='table-location', name='Table name', footer ='...') => {
    let heads = ''
    for (i = 0; i < headers.length; i++) {
        heads += `<th>${headers[i]}</th>`
    }
    console.log(heads)

    return `
    <div class="table-admin-wraper">
        <div class="table-name">${name}</div>
        <table id='${id}' class='table-admin'>
            <thead>
                ${heads}
            </thead>
            <tbody>
                ${body}
            </tbody>
        </table>
        <div class="table-footer ">
            ${footer}
        </div>
    </div>
    `
}

const modal = (header='', body='', footer='', id='modal_id', name='set-feature-modal', close_icon = true, variant='main') => {
    if (footer) {
        footer = `<div class="modal-footer">${footer}</div>`
    }
    if (header) {
        header = `<div class='modal-header'>${header}</div>`
    }
   let html = `
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
    return {
        getHtml: () => html,
        close: () => {
            $(`#${id} .modal-content`).css({animationName:'closePopup'})
            $(`#${id}`).css({transition: 'opacity .5s ease', opacity: 0})
            setTimeout(() => {
                $(`#${id}`).remove()
            }, 500)
        }
    }
}

const dropdown = (toggle, content) => {
    let html = `
        <div class="dropdown">
            <span class='dropdown-toggle' onclick=(drop(this))>${toggle}</span>
            <div class="dropdown-content">
                ${content}
            </div>
        </div>
    
    `
    return {
        getHtml: () => html,
    }
}

const drop = (el) => {
    $(el).next().toggleClass('drop')
}

const fetchData = (url, func) => {
    let dt = null
    fetch(url).then((res) => res.json()).then((data) => func(data))
}

const addToast = (parentEl, toast= {type: 'success', title:'', message: '', duration: 3000}, close_icon = true) => {
    const icon = {
        success: 'bx bxs-check-circle',
        info: 'bx bxs-info-circle',
        warning: 'bx bxs-error-alt',
        error: 'bx bxs-error-alt'
    }

    let t = document.createElement('div')
    t.classList.add(`toast`)
    t.classList.add(`toast--${toast.type}`)
    t.style.setProperty('--main-duration', `${Math.round(toast.duration/1000).toFixed(2)}s`)

    t.innerHTML = `
            <div class="toast__icon">
                <i class='${icon[toast.type]}'></i>
            </div>
            <div class="toast__body">
                <div class="toast__title">
                    ${toast.title}
                </div>
                <div class="toast__message">
                    ${toast.message}
                </div>
            </div>
            <div class='toast__line'></div>
           ${close_icon? ` <div class="toast__close">
                                <i class='bx bx-x'></i>
                            </div>`: ''}
            
    `
    if (parentEl) {
        parentEl.appendChild(t)
    }
    t.addEventListener('animationend', (e) => {
        // console.log(e)
        if(e.animationName === 'toast_fadeout') {
            parentEl.removeChild(t)
        }
    });

    if(close_icon) {
        $(t).children('.toast__close').click(() =>{
            parentEl.removeChild(t)
        })
    }
}