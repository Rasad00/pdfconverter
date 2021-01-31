import os, base64, zipfile, uuid, pythoncom
from flask.helpers import send_file
from flask_cors import CORS
from docx2pdf import convert
from flask_socketio import SocketIO
from flask import Flask, request, jsonify, Response, make_response


app: Flask = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = 'jksdabnfjkbfkjKJBKJFBDJKFBDFSFS'

io = SocketIO(app, cors_allowed_origins="*")

# Constants
ABS_PATH: str = os.path.join(os.path.abspath(os.path.dirname(__file__)), "data")
PDF_FILE_PATH: str = os.path.join(ABS_PATH, "PDF")
WORD_FILE_PATH: str = os.path.join(ABS_PATH, "WORD")
ZIP_FILE_PATH: str = os.path.join(ABS_PATH, "ZIP")


# Routes

@app.route("/")
def home():
    return make_response("Welcome", 200)


@io.on("connected")
def connect():
    print("User connected")

@app.route("/api/download/<path:filename>")
def downloadZIP(filename: str) -> Response:
    return send_file(
        os.path.join(ZIP_FILE_PATH, filename),
        as_attachment=True
    )

@app.route("/api/topdf", methods = [ "POST" ])
def ConvertToPDf() -> Response :

    if not os.path.exists(ABS_PATH):
        os.mkdir(ABS_PATH)
    if not os.path.exists(PDF_FILE_PATH):
        os.mkdir(PDF_FILE_PATH)
    if not os.path.exists(WORD_FILE_PATH):
        os.mkdir(WORD_FILE_PATH)
    if os.path.exists(ZIP_FILE_PATH):
        for filename in os.listdir(ZIP_FILE_PATH):
            os.remove(os.path.join( ZIP_FILE_PATH , filename))
    else: 
        os.mkdir(ZIP_FILE_PATH)

    if request.json:

        pythoncom.CoInitialize()
        
        ZIP_FILE_NAME = str(uuid.uuid4()) + ".zip"
        zip_file = zipfile.ZipFile( os.path.join(ZIP_FILE_PATH, ZIP_FILE_NAME), "w")

        for item in request.json:
            file: str =  base64.b64decode(item["file"].split(",")[1])
            fileName: str = ".".join(item['name'].split(".")[0: len(item['name'].split(".")) - 1])
            
            with open(os.path.join(WORD_FILE_PATH, item['name']), "wb") as f:
                f.write(file)
            
            convert(
                os.path.join(WORD_FILE_PATH, item['name']),
                os.path.join(PDF_FILE_PATH, f"${fileName}.pdf")
            )

            os.remove(os.path.join(WORD_FILE_PATH, item['name']))

            zip_file.write(
                os.path.join(PDF_FILE_PATH,f"${fileName}.pdf"),
                compress_type= zipfile.ZIP_DEFLATED,
                arcname= f"${fileName}.pdf"
            )

            os.remove(os.path.join(PDF_FILE_PATH, f"${fileName}.pdf"))

            io.emit("FileConverted")
            
                   
        zip_file.close()

            
        return make_response (
            jsonify({
                "process": "success",
                "zip_name": ZIP_FILE_NAME 
            }),
            200
        )


if __name__ == "__main__":
    io.run(app=app,  host='localhost', port=5000)