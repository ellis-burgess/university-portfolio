# c22025409 Personal Portfolio

This is a personal portfolio I created as part of the Cardiff University Computing MSc. It pulls information from a database I created to populate the portfolio and experience pages, and allows users to register or login so they can post comments on portfolio entries and see their high score in the Maths Challenge portfolio entry.
This website is built using Flask for its versatility with building pages dynamically, and the ability to use templates. It is deployed on OpenShift.
One difficulty I faced in creating this project was deciding how to add code for portfolio entries (e.g. Sunrise, Sunset or Maths Challenge). I initially thought of creating a backend admin panel where an administrator could upload HTML, CSS, and JS files, which would then be sent to an appropriate folder. However, I wasn't confident that I could do this in a secure enough way - if a malicious user managed to access the admin panel, they could cause enormous damage by injecting dangerous code into my site. While I'm not sure my current solution is the most streamlined (separately adding portfolio data to the database and manually adding files to the project), it is the safest method I found to implement.

## Running the project

In order to run the project locally, I'd recommend creating a virtual environment first, then installing the required packages. This can be done recursively from the command line using the command `npm install -r requirements.txt`. To deploy the project locally:
 1. Using your command line interface, navigate to the base directory for the local files
 2. Install all requirements using the command `npm install -r requirements.txt`.
 3. either `set` or `export` (depending on whether you're on a Windows or Unix Operating System) `flask_app=wsgi.py`
 4. `flask run`
 5. In your browser, go to the site the command line tells you the development server is on (for example, `127.0.0.1:5000` or `localhost:5000`).

You can register a user account to make comments and test the 'high score' feature on the Maths Challenge portfolio entry. Alternatively, you can use the test user:
 - Username: testuser
 - Password: test
This user has full administrative privileges, so when running on a local server, you can access the admin panel by navigating to '/admin'.

## OpenShift Deployments (and issues faced)

I have deployed this project using Cardiff University's OpenShift, however the deployment can only be viewed from within the university's network. I encountered issues in deployment with using Flask-Admin, and included a discussion of these issues for my lecturers in the assesment's readme file. I've also included this discussion here, in case anyone who looks at this code in the future knows what I could have done to fix the problem.

Unfortunately, I was unable to get the admin panel to work on the OpenShift deployment. I did some research and found that [this is a known problem with Flask-Admin](https://stackoverflow.com/questions/25626068/404-not-found-when-trying-to-access-flask-admin-on-uwsgi) (on [several production servers](https://stackoverflow.com/questions/26585050/flask-admin-pages-inaccessible-in-production)), and tried moving the Admin initialisation code away from the main app initialisation, as per the accepted solution on this Stackoverflow question, but that didn't fix the problem. I also tried using different versions of Flask-Admin, as I noticed that when importing the package, the log printed a message that it couldn't import a wheel, but that didn't solve the problem either.

## References
This project uses FontAwesome 6 under a Free license [available here](https://fontawesome.com/license/free). Code used to import the script for Fontawesome was copied from the [FontAwesome website](https://fontawesome.com/kits/3ca0e018ff/use). This link requires being logged in to my personal Fontawesome account to access. Here is a screenshot of the page while logged in:
[A screenshot of Fontawesome's kit page, showing the code to import the kit to your project](/fontawesome-screenshot.png)

The following packages are used for this project (links lead to their licenses):
 - [Click v.8.1.3](https://github.com/pallets/click/blob/main/LICENSE.rst)
 - [Flask v.2.2.2](https://flask.palletsprojects.com/en/2.2.x/license/)
 - [Flask-Admin v1.6.0](https://github.com/flask-admin/flask-admin/blob/master/LICENSE)
 - [Flask-login v.0.6.2](https://github.com/maxcountryman/flask-login/blob/main/LICENSE)
 - [Flask-SQLAlchemy v3.0.2](https://flask-sqlalchemy.palletsprojects.com/en/3.0.x/license/)
 - [Flask-WTF v1.0.1](https://flask-wtf.readthedocs.io/en/1.0.x/license/)
 - [greenlet v2.0.1](https://github.com/python-greenlet/greenlet/blob/master/LICENSE)
 - [gunicorn v20.1.0](https://github.com/benoitc/gunicorn/blob/master/LICENSE)
 - [itsdangerous v2.1.2](https://itsdangerous.palletsprojects.com/en/2.1.x/license/)
 - [Jinja2 v3.1.2](https://jinja.palletsprojects.com/en/3.1.x/license/)
 - [MarkupSafe v2.1.1](https://markupsafe.palletsprojects.com/en/2.1.x/license/)
 - [PyMySQL v1.0.2](https://github.com/PyMySQL/PyMySQL/blob/main/LICENSE)
 - [SQLAlchemy v1.4.46](https://docs.sqlalchemy.org/en/14/copyright.html)
 - [Werkzeug v2.2.2](https://werkzeug.palletsprojects.com/en/2.2.x/license/)
 - [WTForms v3.0.1](https://wtforms.readthedocs.io/en/3.0.x/license/)

Three of the four portfolio entries are based on code I worked on outside of university, two of which (Calculator and Rock, Paper, Scissors) while following [The Odin Project curriculum](https://www.theodinproject.com/). I uploaded previous versions to my personal Github. They can be viewed here:
 - [Calculator](https://github.com/ellis-burgess/calculator)
 - [Rock, Paper, Scissors](https://github.com/ellis-burgess/rock-paper-scissors)
 - [Maths Challenge](https://github.com/ellis-burgess/maths-challenge)

These items all have their own README docs in their 'static' subfolders including more details. There are some variances between the individual versions of these projects, and the versions included in this portfolio. Most significantly, the individual version of the maths challenge does not currently have a high score feature. This is something I intend to remedy.

The Sunrise, Sunset portfolio entry includes uses of [Geoapify API](https://www.geoapify.com/pricing) (used with a free account; for non-commercial uses, on-site attribution is not required), and [Sunrise Sunset API](https://sunrise-sunset.org/api) (requires attribution). The Geolocation API is used, however does not work on the OpenShift version as the OpenShift deployment does not use HTTPS protocol.

The Rock, Paper, Scissors portfolio entry uses three icons from Icons8. From their website:
"You may use our graphic assets without payment for personal or commercial purposes but only on the condition that you include a link to Icons8 in your work. Please note that free assets do come with limitations such as smaller sizes, select file types, and variety." [(source)](https://icons8.com/pricing)

I wanted the Flash messages to appear for 5 seconds, then set their own display to none. This is implemented in the project's javascript file, and based on code modified from [How To Wait One Second by Mastering JS, accessed 21 Jan 2023](https://masteringjs.io/tutorials/fundamentals/wait-1-second-then).

I wanted the user to be redirected to the page they were last on when they logged in. This is implemented in `routes.py`, and based on code modified from [a Stackoverflow post by nasirmustapha, made on 5 Oct 2017, accessed 20 Jan 2023](https://stackoverflow.com/questions/42284397/flask-how-to-redirect-to-previous-page-after-successful-login).

The favicon was generated using the [Favicon.io generator](https://favicon.io/favicon-generator/). It uses the same font and colour scheme as is used throughout the project.