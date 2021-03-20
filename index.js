// elements
const openButton = document.getElementById('open')
const saveButton = document.getElementById('save')
const fileName = document.getElementById('filename')
const sidebar = document.getElementById('sidebar')
const pic1 = document.getElementById('pic1')
const pic2 = document.getElementById('pic2')
const pic1name = document.getElementById('pic1name')
const pic2name = document.getElementById('pic2name')
const delete1 = document.getElementById('delete1')
const delete2 = document.getElementById('delete2')
const prevButton = document.getElementById('prev')
const keep = document.getElementById('keep')
const nextButton = document.getElementById('next')


// global vars
let handle = null
let value = null
let current = null
let update = {}
let key1 = null
let val1 = null
let key2 = null
let val2 = null


// validate file
const validate = (f) => {
    if (!f.matches) return 'no matches key'
    if ( !Array.isArray(f.matches) ) return 'matches must be array'
    if ( f.matches.length === 0 ) return 'matches is empty'

    const matches = f.matches
    for (const item of matches) {
        
        if ( typeof item !== 'object' ) return 'matches item must be object'

        const itemArr = Object.entries(item)
        if (itemArr.length !== 2) return 'matches item must have 2 keys'

        for ( const [key, val] of itemArr) {
            if (typeof val !== 'string') return 'matches item must have file path strings'
        }
    }
    return 'valid'
}


// generate html element
const genElement = (d, i) => {
    const p = document.createElement('p')
    p.className = `item item-${i}`
    p.innerHTML = d
    return p
}


// set active value background color in sidebar
const setActiveSidebar = (itemNo) => {
    const els = document.querySelectorAll('.item')
    
    els.forEach(el => {
        el.style.backgroundColor = 'lightgrey'
    })

    const elCurrent = document.querySelector(`.item-${itemNo}`)
    elCurrent.style.backgroundColor = 'grey'
}


// change backslash to forwardslash
const toForwardSlash = (p) => {
    return p.replaceAll('\\', '/')
}


//load images
const loadPics = (itemNo) => {
    setActiveSidebar(itemNo)

    key1 = null
    val1 = null
    key2 = null
    val2 = null
    
    for (const [key, val] of Object.entries(value[itemNo])) {
        key1 ? key2 = key : key1 = key
        val1 ? val2 = val : val1 = val
    }

    pic1.style.background = `url('file:///${ toForwardSlash(val1) }')`
    pic1.style.backgroundRepeat = 'no-repeat'
    pic1.style.backgroundSize = 'contain'
    pic1name.innerHTML = val1
    pic2.style.background = `url('file:///${ toForwardSlash(val2) }')`
    pic2.style.backgroundRepeat = 'no-repeat'
    pic2.style.backgroundSize = 'contain'
    pic2name.innerHTML = val2

}


// load json file
const load = (tmp) => {
    value = tmp.matches

    value.forEach( (item, i) => {
        let fnames = ''

        for (const [key, val] of Object.entries(item)) {
            fnames += `${key}: ${val}\n\n`
        }

        fnames = fnames.trim()

        const element = genElement(fnames, i)

        sidebar.appendChild(element)
    })

    current = 0
    loadPics(current)
}


// open json file
const openFile = async () => {
    const fileHandle = await getFileHandle()

    const file = await fileHandle.getFile()

    const contents = await readFile(file)
    const tmp = JSON.parse(contents)

    const msg = validate(tmp)

    if (msg === 'valid') {

        if (await verifyPermission(fileHandle, true)) {
            fileName.innerHTML = file.name
            handle = fileHandle
            load(tmp)
        } else {
            alert('permission denied')
        }
    } else {
        alert(msg)
    }
}


// save file
const saveFile = async () => {

    if (handle) {
        writeFile(handle, value)
        alert('saved')
    } else {
        alert('no file open')
    }
}


// go to previous item
const gotoPrev = () => {
    console.log('prev')
    if (value) {
        console.log('true')
        current -= 1
        if (current < 0) current = value.length - 1
        loadPics(current)
    }
}


// go to next item
const gotoNext = () => {
    console.log('next')
    if (value) {
        console.log('true')
        current += 1
        if (current >= value.length) current = 0
        loadPics(current)
    }
}


// write `delete key 1` to current item
const writeDelete1 = () => {
    if (value) update[`index${current}`] = `delete ${key1}`
}


// write `delete key 2` to current item
const writeDelete2 = () => {
    if (value) update[`index${current}`] = `delete ${key2}`
}


// write `keep` to current item
const writeKeep = () => {
    if (value) update[`index${current}`] = 'keep'
}


// event listeners
openButton.addEventListener('click', openFile)
saveButton.addEventListener('click', saveFile)
prevButton.addEventListener('click', gotoPrev)
nextButton.addEventListener('click', gotoNext)
delete1.addEventListener('click', writeDelete1)
delete2.addEventListener('click', writeDelete2)
keep.addEventListener('click', writeKeep)
