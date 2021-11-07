$(document).ready(() => {
    renderLocationPage()
})
const renderLocationPage = () => {
    let body = ''
    for (i = 0; i < state.locations.length; i++) {
        body += `
            <tr id='${state.locations[i].id}'>

                <td>${state.locations[i].id}</td>
                <td>${state.locations[i].name}</td>
                <td>${state.locations[i].media}</td>
                <td>
                    ${dropdown("<i class='bx bx-dots-vertical-rounded circle-icon'></i>", `
                        <div class="btn-del" onclick="deleteLocation('${state.locations[i].id}')">Delete</div>
                    `).getHtml()}
                </td>
            </tr>
        `
    }

    const location_headers = ['Item id', 'Name', 'Media', '']
    $('#location-content').append(table(location_headers, body, 'locations-table', 'Locations', `There are ${state.locations.length} locations`))
    $('#locations-table tbody tr').dblclick((e) => {
        // console.log(e)
        if ($(e.target).is('td')) {
            let id = $(e.target).parent().attr('id');
            updateLocation(id)
        }
    } )
}




const location_form = (dt = {id: false, name:'', description: '', media: []}) => {
    let form = `
    
    <form>
        <div class="form-card">
            <div class="form-card-header">
            General information
            </div>
            <div class="form-card-body">
                <div class="textfield">
                    <input type="text" name="location_name" 
                        placeholder="enter your name" 
                        id="location_name" 
                    />
                    <label for="location_name">Name</label>
                    <p class='error-message'></p>
                </div>
                
                <div>
                    <label for="location_description">Description</label>
                    <textarea  id="location_description">

                    </textarea>
                </div>
            </div>
        </div>
        <div class="form-card">
            <div class="form-card-header">
                Media
            </div>
            <div class="form-card-body">
              
               <div id='medias' class='child_setparate'>
                <div class="textfield">
                    <input type="text" name="media-ids" 
                        placeholder="list integer setpate by a comma" 
                        id="media-ids" 
                    />
                    <label for="media-ids">Media ids</label>
                    <p class='error-message' ></p>
                </div>
               </div>
            </div>
        </div>
    </form>
    `
    return {
        getHtml: () => form,
        getData: () =>{
            return {
                name: $('#location_name').val(),
                description: $('#location_description').val().trim(),
                media: $('#media-ids').val().trim().split(',').map(item => parseInt(item.trim()))
            }
        },
        validate: () => {
            let failed = false;
            let name = $('#location_name').val().trim()
            if (!name) {
                $('#location_name').next().next().text('This field is required')
                $('#location_name').focus()
                failed = true
            }else {
                $('#location_name').next().next().empty()
            }

            
            let media =  $('#media-ids').val()
            if (!media) {
                $('#media-ids').next().next().text('This field must be fielded comma-separated integers')
                failed = true
                $('#media-ids').focus()
            } else {
                let medias = media.trim().split(',')
                let ok = true
                for (i = 0; i < medias.length; i++) {
                    let item = medias[i]
                    if (isNaN(item.trim())) {
                        failed = true
                        $('#media-ids').next().next().text('This field must be comma-separated integers')
                        
                        ok = false
                        break;
                    }
                }
                if (ok) {
                    $('#media-ids').next().next().empty()
                    
                    
                }
            }
            
            return failed
        },
        setup: () => {
            $('#location_description').richText().trigger('change');
            // fill data
            if (dt.id) {
                $('#location_name').val(dt.name)
                $('#media-ids').val(dt.media.join(','))
                $('#location_description').val(dt.description).trigger('change')
            }


            $('#location_name').focus();
            $('#location_name').change(() => {
                let name = $('#location_name').val().trim()
            
                if (!name) {
                    $('#location_name').next().next().text('This field is required')
                }else {
                    $('#location_name').next().next().empty()
                }
            })
            $('#media-ids').change(() => {
                let media =  $('#media-ids').val()
                if (!media) {
                    $('#media-ids').next().next().text('This field must be fielded comma-separated integers')
                } else {
                    let medias = media.trim().split(',')
                    let ok = true
                    for (i = 0; i < medias.length; i++) {
                        let item = medias[i]
                        if (isNaN(item.trim()) || item.trim() === '') {
                            console.log(item, 'is not number')
                            $('#media-ids').next().next().text('This field must be comma-separated integers')
                            
                            ok = false
                            break;
                        }
                    }
                    if (ok) {
                        $('#media-ids').next().next().empty()
                        
                    }
                }
            })
        }
    }
}

const media_form = (dt, type='image') => {
    let form = ''    
    switch (type) {
        case 'YTB':
        case '3d':
        case 'image':
            form = `
                <div class='media-form'>
                    <div class='media-form-header'>
                        <span>${type} form</span>
                        <span class='bx bx-time'></span>
                    </div>
                   <div class='child_setparate'>
                        <div class="textfield">
                            <input type="text" name="media_name" 
                                placeholder="name" 
                                class="media_name"
                            />
                            <label for="media_name">Name</label>
                        </div>
                        <div class="textfield">
                            <input type="text" name="media_url" 
                                placeholder="url" 
                                class="media_url" 
                            />
                            <label for="media_url">Url</label>
                        </div>
                   </div>
                </div>
            `
            break
        default: break
    }
    
    
    return {
        getHtml: () => {
            return form
        },
        getData: () => {
            return {
                name: $('.media_name').val(),
                url: $('.media_url').val(),
                description: $('.media-description').val().trim(),
                type: type
            }
        },
        setup: () => {
            // $(`.media-description`).richText()
        }
    }
}

const addMedia = (type) => {
    let form = media_form({}, type)
    
    // let m = modal(`Add new ${type}`, form.getHtml(), footer, 'media-form', 'media-form', false, 'medium')
    // $('#media-modal').empty()
    $('#medias').append(form.getHtml())
    console.log(form.getHtml())
    form.setup()
    $(`#add-media-${type}`).click(() => {
        console.log(form.getData())
    })
}

const deleteLocation = (id) => {
    let index = state.locations.findIndex(item => item.id === id)
    if (index === -1) {
        alert('not found')
        return
    }
    let body = `
        <div class="flex space-between">
            <button class="btn btn-light" id='no-delete'>No</button>
            <button class="btn btn-save" id='confirm-delete'>Yes</button>
        </div>
    `
    let m = modal(`Are you sure delete ${id}?`, body, '', 'confirm-delete-modal','confirm-delete-modal', false, 'small')
    $('#locations-page').prepend(m.getHtml())
    $('#no-delete').click(() => {
        m.close()
        m=null   
        $(`tr#${id} .dropdown-content`).removeClass('drop')
    })

    $('#confirm-delete').click(() => {
        state.locations.splice(index, 1)
        m.close()
        m = null
        $(`tr#${id}`).fadeOut()

    })
} 
const addLocation = () => {
    let form = location_form()
    let footer = `
        <div style="padding: .5rem 0">
            <span class='btn btn-light ' id='cancel-location-form' style ='margin-right: 0.5rem;'>Cancel</span>
            <span class='btn btn-save' id='add-location-btn'>Save</span>
        </div>
    `
    let m = modal(`Add new location`, form.getHtml(), footer, 'location-form', 'location-form', false, 'medium')
    $('#locations-page').prepend(m.getHtml())
    form.setup()
    $('#cancel-location-form').click(() => {
        m.close()
    })
    $(`#add-location-btn`).click(() => {
        if(!form.validate()) { // not fail
            let lastid = 1
            let l = state.locations.length 
            console.log(l)
            if (l > 0) {

                lastid = parseInt(state.locations[l - 1].id.split('_')[1])
            } 
            let new_id = `location_${lastid + 1}`
            let dt = form.getData()
            state.locations.push({...dt, id: new_id})
            $('#locations-table tbody').append(`
                <tr id='${new_id}'>
                    <td>${new_id}</td>
                    <td>${dt.name}</td>
                    <td>${dt.media}</td>
                    <td>
                        ${dropdown("<i class='bx bx-dots-vertical-rounded circle-icon'></i>", `
                            <div class="btn-del" onclick="deleteLocation('${new_id}')">Delete</div>
                        `).getHtml()}
                    </td>
                </tr>
            `)
            $('#locations-table tbody tr:last-child()').dblclick((e) => {
                // console.log(e)
                if ($(e.target).is('td')) {
                    let id = $(e.target).parent().attr('id');
                    updateLocation(id)
                }
            } )
            m.close()
        }
    })

}

const updateLocation = (location_id) => {
    let index = state.locations.findIndex(item => item.id === location_id)
    if (index === -1) {
        alert("Not found")
        return
    }
    let form = location_form(state.locations[index])
    let footer = `
        <div style="padding: .5rem 0">
            <span class='btn btn-light ' id='cancel-location-form' style ='margin-right: 0.5rem;'>Cancel</span>
            <span class='btn btn-save' id='update-location-btn'>Save</span>
        </div>
    `
    let m = modal(`Update location `, form.getHtml(), footer, 'location-update-form', 'location-update-form', false, 'medium')
    $('#locations-page').prepend(m.getHtml())
    form.setup()
    $('#cancel-location-form').click(() => {
        m.close()
    })
    $(`#update-location-btn`).click(() => {
        if(!form.validate()) { // not fail
            let dt = form.getData()
            state.locations[index] = {id: state.locations[index].id, ...dt}
            $(`#locations-table  tbody tr:nth-child(${index + 1})`).text('')
            $(`#locations-table > tbody > tr:nth-child(${index + 1})`).append(`
                <td>${state.locations[index].id}</td>
                <td>${dt.name}</td>
                <td>${state.locations[index].media}</td>
                <td>
                    ${dropdown("<i class='bx bx-dots-vertical-rounded circle-icon'></i>", `
                        <div class="btn-del" onclick="deleteLocation('${state.locations[index].id}')">Delete</div>
                    `).getHtml()}
                </td>
            `)
            
            m.close()
        }
    })

}