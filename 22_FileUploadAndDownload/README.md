# File upload and download : 

* When we use `app.use(express.urlencoded({ extended: true }))` think means that it can only parse the url encoded data which is basically text. It can handle data which is encoded in text. 

* Hence we cannot use this parser to handle text data which is binary data.

* So to handle image/binary data we need another middleware and for that we use `multer` package. 

* So multer parses incoming requests and it handle all the requests for files or mixed data.

* Also to handle files we switch our form's enctype to `multipart/form-data`. Which is simply the content type telling the server that this submission, that this request will not contain plaintext but will contain mixed data, text and binary.

* Mutler will be looking for request with mixed type of data and will then be able to parse both text and binary data.

* Once we upload the files to the server we need to server these files and here we server them statically by making the images folder public and then statically loading the images in HTML files.

## PDF generation :

* To create PDF we use a tool called PDFKit. It is super powerful but it is written in coffee script which is not supported by node.

* 