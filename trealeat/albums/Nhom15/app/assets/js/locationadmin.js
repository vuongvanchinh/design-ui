$(document).ready(() => {
    renderLocationPage()
    changePage('locations-page')
})
const renderLocationPage = () => {
    let body = ''
    for (i = 0; i < state.locations.length; i++) {
        body += `
            <tr ondblclick="updateLocation('${state.locations[i].id}')">
                <td>${state.locations[i].id}</td>
                <td>${state.locations[i].name}</td>
            
            </tr>
        `
    }
    const location_headers = ['Item id', 'Name']
    $('#location-content').append(table(location_headers, body, 'locations-table'))
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
            $('#location_description').richText();
            // fill data
            if (dt.id) {
                $('#location_name').val(dt.name)
                $('#media-ids').val(dt.media.join(','))
                $('#location_description').val(dt.description)
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

const addLocation = () => {
    let form = location_form()
    let footer = `
        <div style="padding: .5rem 0">
            <span class='btn btn-light ' id='cancel-location-form'>Cancel</span>
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
            if (state.map.plots.length > 0) {
                lastid = parseInt(state.locations[state.locations.length - 1].id.split('_')[0])
            } 
            let new_id = `location_${lastid + 1}`
            let dt = form.getData()
            state.locations.push({...dt, id: new_id})
            $('#locations-table tbody').append(`
                <tr onclick="updateLocation('${new_id}')">
                    <td>${new_id}</td>
                    <td>${dt.name}</td>
                </tr>
            `)
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
            <span class='btn btn-light ' id='cancel-location-form'>Cancel</span>
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
            `)
            m.close()
        }
    })

}