interface IHeaderFile{
    'content-disposition': string,
    'content-type': string
}
export default interface IFile {
    'fieldName': string,
    'originalFilename': string,
    'path': string,
    'headers': IHeaderFile,
    'size': number,
    'name': string,
    'type': string
}
