
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

const callDataPromises = (media_ids) => {
    return media_ids.map(async (id) => {
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
    })
}


$(document).ready(() => {
    let data = null
    let url = 'https://hcloud.trealet.com/apps_dev/btl/nhom15/app/streamline-example.trealet'
    //https://hcloud.trealet.com/albums/Nhom15/app/streamline-example~.trealet
    ;(async () =>{
        let medias = {}
        try {
            let res = await fetch(url)
            data = await res.json()
            data = data.trealet
            document.title = data.title
            let media_ids = getListMediaId(data)
            
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

            document.getElementById('root').innerHTML = JSON.stringify(medias)
        
        } catch (error) {
            console.log("error", error)
            alert('can not fetch data')
        }
    })()

   
})


