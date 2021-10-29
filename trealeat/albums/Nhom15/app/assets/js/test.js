
const fetchItem = async (id) => {
    try {
        let res = await fetch(`https://hcloud.trealet.com/tiny${id}?json`)
        let data = await res.json()
        console.log(data)
        return data
    } catch (error) {
        return {}        
    }
}

$(document).ready(() => {
    let data = null
    let url = 'https://hcloud.trealet.com/albums/Nhom15/app/streamline-example.trealet'
    //https://hcloud.trealet.com/albums/Nhom15/app/streamline-example~.trealet
    ;(async () =>{
        let fetched = {}
        try {
            let res = await fetch(url)
            data = await res.json()
            data = data.trealet
            console.log(data)
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
            console.log(JSON.stringify(data))
            document.getElementById('root').innerHTML = JSON.stringify(data)
            // console.log(data)
        } catch (error) {
            console.log(error)
            alert('can not fetch data')
            // document.getElementById('#message').innerHTML = 'Can not fetch data'
        }
    })()

    console.log(data)
})


