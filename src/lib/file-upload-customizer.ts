export async function onUploadFileCustomize(part: any) {
  const buff = await part.toBuffer();
  part.value = {
    _buf: buff,
    file: part.file,
    fieldname: part.fieldname,
    filename: part.filename,
    encoding: part.encoding,
    mimetype: part.mimetype,
  };
}
