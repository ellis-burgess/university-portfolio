from flask import Flask, render_template, url_for, request, redirect, flash, session
from blog import app, db
from blog.models import Portfolio, Comments, Experience, Contact, User
from blog.forms import RegistrationForm, LoginForm, ContactForm, CommentForm
from flask_login import login_user, logout_user, current_user, login_required

@app.route('/')
@app.route('/home')
def home():
    # Code to store current url in session object
    # Modified from Stackoverflow post by nasirmustapha 05/10/17
    # Accessed 20 Jan 2023
    # Available from:
    # https://stackoverflow.com/questions/42284397/flask-how-to-redirect-to-previous-page-after-successful-login
    session['url'] = url_for('home')
    # End of referenced code
    return render_template('index.html', title='Home')

@app.route('/portfolio')
def portfolio():
    # Code to store current url in session object
    # Modified from Stackoverflow post by nasirmustapha 05/10/17
    # Accessed 20 Jan 2023
    # Available from:
    # https://stackoverflow.com/questions/42284397/flask-how-to-redirect-to-previous-page-after-successful-login
    session['url'] = url_for('portfolio')
    # End of referenced code
    entries = Portfolio.query.all()
    return render_template('portfolio.html', title='Portfolio', entries=entries)

@app.route('/portfolio/<int:portfolio_id>', methods=['GET', 'POST'])
def portfolio_item(portfolio_id):
    # Code to store current url in session object
    # Modified from Stackoverflow post by nasirmustapha 05/10/17
    # Accessed 20 Jan 2023
    # Available from:
    # https://stackoverflow.com/questions/42284397/flask-how-to-redirect-to-previous-page-after-successful-login
    session['url'] = url_for('portfolio_item', portfolio_id=portfolio_id)
    # End of referenced code
    comments = Comments.query.all()
    form = CommentForm()
    if form.validate_on_submit():
        new_comment = Comments(portfolio_id=portfolio_id, author=current_user.username, content=form.comment.data)
        db.session.add(new_comment)
        db.session.commit()
        return redirect(url_for('portfolio_item', portfolio_id = portfolio_id))
    portfolio_item = Portfolio.query.get_or_404(portfolio_id)
    return render_template('portfolio-item.html', title=portfolio_item.title, portfolio_item=portfolio_item, comments=comments, form=form, demo_url=f'/portfolio/{portfolio_item.id}/live-demo')

@app.route('/portfolio/<int:portfolio_id>/live-demo')
def portfolio_demo(portfolio_id):
    # Code to store current url in session object
    # Modified from Stackoverflow post by nasirmustapha 05/10/17
    # Accessed 20 Jan 2023
    # Available from:
    # https://stackoverflow.com/questions/42284397/flask-how-to-redirect-to-previous-page-after-successful-login
    session['url'] = url_for('portfolio_demo', portfolio_id=portfolio_id)
    # End of referenced code
    portfolio = Portfolio.query.get_or_404(portfolio_id)
    return render_template(f'{portfolio.path_name}/index.html', title=portfolio.title)

@app.route('/experience')
def experience():
    # Code to store current url in session object
    # Modified from Stackoverflow post by nasirmustapha 05/10/17
    # Accessed 20 Jan 2023
    # Available from:
    # https://stackoverflow.com/questions/42284397/flask-how-to-redirect-to-previous-page-after-successful-login
    session['url'] = url_for('experience')
    # End of referenced code
    entries = Experience.query.all()
    return render_template('experience.html', title='Experience', entries=entries)

@app.route('/contact', methods=['GET','POST'])
def contact():
    # Code to store current url in session object
    # Modified from Stackoverflow post by nasirmustapha 05/10/17
    # Accessed 20 Jan 2023
    # Available from:
    # https://stackoverflow.com/questions/42284397/flask-how-to-redirect-to-previous-page-after-successful-login
    session['url'] = url_for('contact')
    # End of referenced code
    form = ContactForm()
    if request.method == 'POST':
        new_message = Contact(name=form.name.data, email=form.email.data, subject=form.subject.data, message=form.message.data)
        db.session.add(new_message)
        db.session.commit()
        return redirect(url_for('home'))
    return render_template('contact.html', title='Contact', form=form)

@app.route('/register', methods=['GET', 'POST'])
def register():
    form = RegistrationForm()
    if form.validate_on_submit():
        user = User(username = form.username.data, password = form.password.data, email = form.email.data)
        db.session.add(user)
        db.session.commit()
        flash('Registration successful!')
    return render_template('register.html', title='Register', form=form)

@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username = form.username_or_email.data).first()
        if user is None:
            user = User.query.filter_by(email = form.username_or_email.data).first()
        if user is None:
            flash('Invalid username or email.')
        elif not User.verify_password(user, form.password.data):
            flash('Incorrect password.')
        else:
            login_user(user)
            # Code to redirect to last page after login
            # Modified from Stackoverflow post by nasirmustapha 05/10/17
            # Accessed 20 Jan 2023
            # Available from:
            # https://stackoverflow.com/questions/42284397/flask-how-to-redirect-to-previous-page-after-successful-login
            if 'url' in session:
                return redirect(session['url'])
            return redirect(url_for('home'))
            # End of referenced code

    return render_template('login.html', title='Login', form=form)

@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash('You have successfully been logged out.')
    # Code to redirect to last page after login
    # Modified from Stackoverflow post by nasirmustapha 05/10/17
    # Accessed 20 Jan 2023
    # Available from:
    # https://stackoverflow.com/questions/42284397/flask-how-to-redirect-to-previous-page-after-successful-login
    if 'url' in session:
        return redirect(session['url'])
    return redirect(url_for('home'))
    # End of referenced code