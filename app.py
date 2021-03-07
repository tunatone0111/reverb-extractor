import os
from flask import Flask, jsonify, request, send_from_directory, redirect
from revbpm import Revbpm

base_dir = os.path.dirname(os.path.abspath(__file__))

def create_app(environment='dev'):
  app = Flask(__name__, static_url_path='', static_folder='static')
  revbpm = Revbpm()

  @app.after_request
  def add_header(response):
    response.headers['Cache-Control'] = 'no-store'
    return response

  @app.route('/')
  def index():
    return send_from_directory('static', 'index.html')
  
  @app.route('/<path:filename>')
  def serve_static(filename):
    return send_from_directory(base_dir+'/static', filename)

  @app.route('/api/musics')
  def musics():
    return jsonify(musics=sorted(os.listdir(base_dir+'/static/audio')))

  @app.route('/api/musics/<path:filename>')
  def music(filename):
    return send_from_directory(base_dir+'/static/audio', filename)

  @app.route('/api/upload', methods=['POST'])
  def upload():
    fs = request.files.getlist('newMusic')
    for f in fs: 
      f.save(base_dir+'/static/audio/'+f.filename)
    return redirect('/')

  @app.route('/api/musics/<path:filename>', methods=['DELETE'])
  def musicd(filename):
    if filename not in os.listdir(base_dir+'/static/audio'):
      return redirect('/', 404)
    os.remove(base_dir+'/static/audio/'+filename)
    return redirect('/')

  @app.route('/api/analyze')
  def analyze():
    filename = request.args.get('filename')
    rev, bpm = revbpm.analyze(filename)
    return jsonify(curMusic=filename, rev=rev, bpm=bpm)

  return app
