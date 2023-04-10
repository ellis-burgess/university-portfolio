from flask import Flask, render_template, url_for, request, jsonify, redirect, flash
from blog import app, db
from blog.models import Comments, User, Contact

@app.route('/comment/<comment_id>', methods=['GET', 'DELETE'])
def delete_comment(comment_id):
    if request.method == 'DELETE':
        comment = Comments.query.get_or_404(comment_id)
        db.session.delete(comment)
        db.session.commit()
        return jsonify(comment.to_json())

@app.route('/report-comment/<comment_id>/<user_id>', methods=['GET', 'POST'])
def report_comment(comment_id, user_id):
    if request.method == 'POST':
        comment = Comments.query.get_or_404(comment_id)
        reporter = User.query.get_or_404(user_id)
        report_content = f'I saw an inappropriate comment left by {comment.author}. It said:\n {comment.content}. It was left on portfolio item {comment.portfolio_id}. Please review this.'
        report = Contact(name=reporter.username, email=reporter.email, subject='Comment Report', message=report_content)
        db.session.add(report)
        db.session.commit()
        return jsonify(report.to_json())