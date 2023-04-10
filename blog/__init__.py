from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView

import os

basedir = os.path.abspath(os.path.dirname(__file__))

app = Flask(__name__)
app.config['SECRET_KEY'] = '602e3b474f2ab75648812734b49179c61382dc8779fd984e'

# suppress SQLAlchemy warning
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'blog.db')

db = SQLAlchemy(app)

login_manager = LoginManager()
login_manager.init_app(app)

from blog.models import User, Experience, Comments, Contact
from blog.views import AdminView

admin = Admin(app, name='Admin panel', template_mode='bootstrap3')
admin.add_view(AdminView(User, db.session))
admin.add_view(AdminView(Experience, db.session))
admin.add_view(AdminView(Comments, db.session))
admin.add_view(AdminView(Contact, db.session))

from blog.routes import routes, highscores, comments