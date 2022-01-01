
const getListMediaId = (data) => {
    let rs = []
    for(let i = 0; i < data.locations.length; i++) {
        rs.push(...data.locations[i].media)
    }
    return rs
}



const urlContentToDataUri = (url) => {
    return fetch(url)
    .then(response => response.blob())
    .then(imageBlob => {
      // Then create a local URL for that image and print it 
      const imageObjectURL = URL.createObjectURL(imageBlob);
      return imageObjectURL
  });
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
                                try {
                                    let dataUri = await urlContentToDataUri(`https://hcloud.trealet.com/${dt.url_full}`) ;
                                    console.log("🚀 ~ file: test.js ~ line 120 ~ awaitPromise.all ~ dataUri", dataUri)
                                    medias[id].url = dataUri
                                    img = document.createElement('img')
                                    img.src = dataUri
                                    document.body.appendChild(img)
                                } catch (error) {
                                    console.log(error.message)            
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
                        try {
                            let res = await fetch(url)
                            console.log(res)
                            if (res.status === 200) {
                                let data = await res.blob()
                               
                                let reader = new FileReader() ;
                                reader.readAsDataURL(data);
                                reader.onload = function(){
                                    medias[id].url = this.result
                                };
                            } else {
                                console.log(res.status)
                                console.log(`get file id ${id} error ${type}`)
                            }
                        } catch (error) {
                            console.log(error.message)            
                        }
                    }
                }
            }
        } catch (error) {
            console.log("Error ", id,  error)
        }
    })
}