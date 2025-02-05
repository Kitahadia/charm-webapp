from flask import Flask, jsonify, request
from models import db, Skin

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///skins.db'
db.init_app(app)

@app.route('/skins', methods=['GET'])
def get_skins():
    skins = Skin.query.all()
    return jsonify([skin.to_dict() for skin in skins])

@app.route('/skins', methods=['POST'])
def add_skin():
    data = request.json
    new_skin = Skin(name=data['name'], description=data['description'], price=data['price'])
    db.session.add(new_skin)
    db.session.commit()
    return jsonify(new_skin.to_dict()), 201

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
