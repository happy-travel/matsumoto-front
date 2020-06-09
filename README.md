# Matsumoto
#### Happytravel.com
How to start this project **an easy guide**

`npm install`<br>
First step. Don't forget to install npm before.

`npm start`<br>
Last step. Runs the app in the development mode @ [http://localhost:4000](http://localhost:4000)

`npm run-script build`<br>
Builds the app for production to the __build__ folder (for production)<br><br>

### Stack
We mostly use React+Mobx.<br>
Also OIDC, Formik, i18next presented.

You can use component state for view-state variables.<br>
All persistent values should be stored in mobx stores.<br>
Most of stores are automatic cached, also forms are cached, use CachedForm.<br>
Don't write any complex logic into stores.<br>
All LTR to RTL transitions are automatic, but always keep internationalization in mind.<br> 
Avoid to inline css, neither use BEM — respect others.<br><br>

#### Remember that Identity is another project.
<br>
Don't hesitate to ask Alexander any questions.

![Matsumoto Castle](https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Matsumoto-Castle-night-view-2019-Luka-Peternel.jpg/327px-Matsumoto-Castle-night-view-2019-Luka-Peternel.jpg)