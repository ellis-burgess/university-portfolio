from flask_wtf import FlaskForm
from wtforms import StringField, EmailField, PasswordField, TextAreaField, SubmitField, HiddenField
from wtforms.validators import DataRequired, ValidationError, Regexp, EqualTo
from blog.models import User
from flask_login import current_user

class RegistrationForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired(), Regexp('([a-z]|[0-9]){5,15}', message = 'Your username should be between 5 and 15 characters long, and can only contain lower case letters or numbers.')])
    email = EmailField('Email Address', validators=[DataRequired(), EqualTo('confirm_email', message = 'Email addresses do not match. Please try again.')])
    confirm_email = EmailField('Confirm Email Address', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired(), EqualTo('confirm_password', message = 'Passwords do not match. Please try again.')])
    confirm_password = PasswordField('Confirm Password', validators=[DataRequired()])
    submit = SubmitField('Register')

    def validate_username(self, username):
        """Checks if input username already exists; if it does, asks new user to select a new username"""
        user = User.query.filter_by(username = username.data).first()
        if user is not None:
            raise ValidationError('Username already exists. Please choose a different one.')
    
    def validate_email(self, email):
        """Checks if input email is already associated to an account; if it does, asks user to log in instead."""
        user = User.query.filter_by(email = email.data).first()
        if user is not None:
            raise ValidationError('This email address is already associated with an account. Please log in instead.')

class LoginForm(FlaskForm):
    username_or_email = StringField('Username or Email', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])
    submit = SubmitField('Login')

class ContactForm(FlaskForm):
    name = StringField('Name', validators=[DataRequired()])
    email = EmailField('Email Address', validators=[DataRequired()])
    subject = StringField('Subject', validators=[DataRequired()])
    message = TextAreaField('Message', validators=[DataRequired()])
    submit = SubmitField('Send')

class CommentForm(FlaskForm):
    comment = TextAreaField('Comment', validators=[DataRequired()])
    submit = SubmitField('Comment')

    def validate_user():
        """Checks if there is currently a user logged in; if not, tell user they must be logged in to comment."""
        if not current_user.is_authenticated:
            raise ValidationError('You must be logged in to post a comment!')