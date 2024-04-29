
const root = document.getElementById('root')
const $elements = createObjectElement( root.querySelectorAll('[id]'), 'id', true )

 
const files = []

const formDataTemp = new FormData()


if( !localStorage.getItem('fetch') ) {
    localStorage.setItem('fetch', '')
}

$elements.urlFetch.value = localStorage.getItem('fetch')

const renderImage =( src )=>{

    $elements.images.insertAdjacentHTML('beforeend', `
        <div class="div_j50RGkZ" data-item>
            <img src="${ src }" alt="">
        </div>
    `)

}

$elements.images.addEventListener('click', e => {
    e.preventDefault()

    const item = e.target.closest('[data-item]')

    if( item ) {

        const index = Array.from( $elements.images.querySelectorAll('[data-item]') ).findIndex( itm => itm === item )


        if( index != -1 ) {


            const confirmar = confirm('¿remove de la lista?')


            if( confirmar ) {

                files.splice(index, 1)
                item.remove()

            }

        }

    }
    

})

$elements.urlFetch.addEventListener('input', ()=> {

    localStorage.setItem('fetch', $elements.urlFetch.value)

})

$elements.subir.addEventListener('click', ()=> {
    if( !files.length ) return alert('no imagenes para subir')

    const fileUpload = files.splice(0, files.length)
    return fileUpload.length
    const formData = new FormData


    fileUpload.forEach((file, index) => {
        formData.append(`file_${ index }`, file)
    });


    fetch( $elements.urlFetch.value, { method : 'POST', body : formData })
        .then( res => res.json() )
        .then( files => {
          alert(files.length)
        })

})

$elements.urlImage.addEventListener('input', ()=> {
    if( URL.canParse ) {

        if( URL.canParse( $elements.urlImage.value.trim() ) ) {

            
            fetch( `https://url-image.victor01sp.com/index.php?url=${ $elements.urlImage.value.trim() }` )
                .then( res => res.blob() )
                .then( blob => {

                    
                    formDataTemp.set('image', blob, `${ Date.now() }.${ blob.type.split('/')[1] }`)
                    files.push( formDataTemp.get('image') )
                    renderImage( URL.createObjectURL( blob ) )

                })

        }

         
    }
})

$elements.file.addEventListener('input', e => {

    const filesInput = e.target.files

    if( filesInput.length > 0 ) {
 

        for (const file of filesInput) {
            files.push( file )
            renderImage( URL.createObjectURL( file ) )
        }

    }

})
 
let move = false
let coordenadaInicialX
let coordenadaInicialY
let scrollLeft
let scrollTop
 
const customEventInput = new CustomEvent('input')
 

document.addEventListener('paste', e => {
    // Obtiene el objeto del evento
    const items = (e.clipboardData || e.originalEvent.clipboardData).items;
    // Itera a través de los items del portapapeles
    for (let index in items) {
        const item = items[index];
        // Verifica si es una imagen
        if (item.kind === 'file' && item.type.includes('image')) {
            const blob = item.getAsFile();

            files.push( blob )
            renderImage( URL.createObjectURL( blob ) )
            // setTimeout(()=> $elements.image.children[0].setAttribute('src', URL.createObjectURL(blob))) 
        }
    }
});

addEventListener('contextmenu', e => e.preventDefault())
