from datetime import datetime
from blog import db, login_manager
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash

class Portfolio(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.Text, nullable=False)
    path_name = db.Column(db.String(128), nullable=False, unique=True)
    short_description = db.Column(db.Text, nullable=False)
    description = db.Column(db.Text, nullable=False)
    comments = db.relationship('Comments', backref='portfolio', lazy=True)

class Comments(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    portfolio_id = db.Column(db.Integer, db.ForeignKey('portfolio.id'), nullable=False)
    author = db.Column(db.String(15), db.ForeignKey('user.username'), nullable=False)
    date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    content = db.Column(db.Text, nullable=False)

    def to_json(self):
        return {
            "comment_id": self.id,
            "content": self.content
        }

class Experience(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    start_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    end_date = db.Column(db.DateTime)
    is_professional = db.Column(db.Boolean, nullable=False, default=True)
    title = db.Column(db.String(128), nullable=False)
    company = db.Column(db.String(128))
    skills = db.Column(db.Text, nullable=False)

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(15), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    hashed_password = db.Column(db.String(128))
    comment = db.relationship('Comments', backref='user', lazy=True)
    highscore = db.Column(db.String(15), nullable=True);
    is_admin = db.Column(db.Boolean, nullable=False, default=False)

    def __repr__(self):
        return f"User('{self.username}', '{self.email}')"

    @property
    def password(self):
        """When anyone tries to call the password, an error is raised"""
        raise AttributeError('Password is not readable.')

    @password.setter
    def password(self, password):
        """Generates password hash when new user is created"""
        self.hashed_password = generate_password_hash(password)

    def verify_password(self, password):
        """Check password against password hash on login"""
        return check_password_hash(self.hashed_password, password)

    def to_json(self):
        return {
            "username": self.username,
            "highscore": self.highscore
        }

@login_manager.user_loader
def load_user(user_id):
    """Login user"""
    return User.query.get(int(user_id))

class Contact(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128), nullable=False)
    email = db.Column(db.String(128), nullable=False)
    subject = db.Column(db.String(128), nullable=False)
    message = db.Column(db.Text, nullable=False)

    def to_json(self):
        return {
            "name": self.name,
            "email": self.email,
            "subject": self.subject,
            "message": self.message
        }