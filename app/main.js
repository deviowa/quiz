var Vue = require('vue');

Vue.component('about', {
    template: require('./about.html')
});

Vue.component('welcome-screen', {
    template: require('./welcome.html')
});


window.app = new Vue({
    el: "#app",
    data: {
        currentScreen: 'welcome-screen',
        questions: require('./questions.json'),
    }
});