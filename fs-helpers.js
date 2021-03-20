// ========================================
// taken from:
// https://github.com/GoogleChromeLabs/text-editor/blob/main/src/inline-scripts/fs-helpers.js
// ========================================


// ========================================
// this script doesn't depend on any other scripts
// ========================================


const getFileHandle = () => {
    if ('showOpenFilePicker' in window) {
        return window.showOpenFilePicker().then((handles) => handles[0]);
    }
}

const getNewFileHandle = () => {
    if ('showSaveFilePicker' in window) {
        const opts = {
            types: [{
                description: 'Text file',
                accept: { 'application/json': ['.json'] },
            }],
        };
        return window.showSaveFilePicker(opts);
    }
}

const readFile = (file) => {
    if (file.text) {
        return file.text();
    }
    return 'cannot read file'
}

const writeFile = async (fileHandle, contents) => {
    // Create a FileSystemWritableFileStream to write to.
    const writable = await fileHandle.createWritable();
    // Write the contents of the file to the stream.
    await writable.write(contents);
    // Close the file and write the contents to disk.
    await writable.close();
}

const verifyPermission = async (fileHandle, withWrite) => {
    const opts = {};
    if (withWrite) {
        opts.mode = 'readwrite';
    }
    // Check if we already have permission, if so, return true.
    if (await fileHandle.queryPermission(opts) === 'granted') {
        return true;
    }
    // Request permission to the file, if the user grants permission, return true.
    if (await fileHandle.requestPermission(opts) === 'granted') {
        return true;
    }
    // The user did nt grant permission, return false.
    return false;
}
