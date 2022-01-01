$(document).ready(() => {

    const fetchDt = async (url='../bg.png') => {
        // alert("fetch data")
        try {
            let res = await fetch(url)
            console.log(res)
            if (res.status === 200) {
                let data = await res.blob()
               
                let reader = new FileReader() ;
                reader.readAsDataURL(data);
                reader.onload = function(){
                    // console.log(this.result)
                    // let img = document.createElement('img')
                    // img.src  = this.result
                    // document.body.appendChild(img)
                };
                
            } else {
                console.log(res.status)
            }
            

        } catch (error) {
            console.log(error.message)            
        }
    }
    fetchDt()
    
})