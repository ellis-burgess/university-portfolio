from flask import Flask, render_template, url_for, request, jsonify, redirect, flash
from blog import app, db
from blog.models import User

@app.route('/highscores/<user_id>', methods=['GET', 'POST'])
def my_highscore(user_id):
    if request.method == 'GET':
        user = User.query.get_or_404(user_id)
        return jsonify([user.to_json()])
    elif request.method == 'POST':
        user = User.query.get_or_404(user_id)
        user.highscore = request.json['highscore']
        db.session.commit()
        return jsonify(user.to_json())
