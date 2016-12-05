# react-express-demo
# Express’s static module will automatically use index.html as the index file in static directories,
# webpack, a special plugin for it to compile babel javascript files and react.
# also need to run our node server as its serves webpack’s bundle for us.
# need one super-useful package called concurrently

```markdown

babel-register allows you to use babel in nodejs
babel-polyfill emulates full ES6 environment (includes core.js)
babel-preset-es2015, babel-preset-stage-0, babel-preset-react are presets to enable most of the ES6 features as well as some needed for react, and jsx.
babel-plugin-transform-runtime allows using async/await operators 
babel-plugin-transform-class-properties is for using static variables inside ES6 classes 

```


# npm run dev