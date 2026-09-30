CartShare - Collaborative Shopping Ecosystem

Project Description- : CartShare is a collaborative, real-time web application designed to solve the problem of coordinating joint purchases in shared living or working environments such as student dorms, office teams, and travel groups. The application allows users to create or join a unique room using a code, add and remove items from a shared cart, view a real-time activity log of participant actions, and generate a printable receipt for the group. This project evolves a static frontend prototype into a functional web application that bridges the gap between design and active collaboration using browser-based technologies.

Features Implemented
· User login and room creation/joining using a unique room code
· Shared cart with real-time synchronization across browser tabs
· Add and remove items from the shared cart
· Real-time activity log showing participant actions
· Data persistence using browser storage (localStorage)
· Printable, audit-ready receipt using CSS print media rules
· Fully responsive UI built with Flexbox, Grid, and Bootstrap

Tech Stack
· HTML5
· CSS3 (Flexbox, Grid, Bootstrap)
· JavaScript (ES6+)
· Browser Storage API (localStorage)
· Git and GitHub
· Vercel / Netlify / GitHub Pages (for deployment)

Folder Structure
CartShare/
    index.html
    cart.html
css/
    style.css
    print.css
js/
    activity.js
    app.js
    cart.js
    room.js
    storage.js
assets/
    image
README.md


How to Run the Application Locally

1. Clone the repository:
   git clone https://github.com/your-username/CartShare.git
   
2. Navigate into the project folder:
   ```
   cd CartShare
   ```
3. Open index.html in your browser, or use a local server such as Live Server in VS Code.
4. To test the collaboration feature, open the application in two browser tabs or windows and join the same room code.

Live Deployment

```
Live URL: https://your-project-name.vercel.app
```

How to Test Collaboration

1. Open the live URL in two separate browser windows.
2. Create a room in the first window and note the room code.
3. Join the same room from the second window using the code.
4. Add or remove an item in one window and observe the update in the other.
5. Check the activity log to confirm actions are recorded.

Screenshots

Screenshots of the login screen, shared cart view, and printable receipt are available in the assets/images/ folder.

Known Limitations

· Real-time sync is implemented using browser storage events and works only across tabs on the same device.
· No backend server or database is used.

Author

```
Name: Your Full Name
Batch ID: Your Batch ID
Course: Internship Studio - Web Development
```

Acknowledgements

· Bootstrap Documentation
· MDN Web Docs
· Course Syllabus and Project Brief