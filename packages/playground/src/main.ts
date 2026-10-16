import { createApp } from 'vue';
import 'normalize.css';
import './assets/style.scss';

import '@opensig/opendesign/es/_styles/light.token.css';
import '@opensig/opendesign/es/_styles/dark.token.css';
import '@opensig/opendesign/es/_styles/media.token.scss';
import '@opensig/opendesign/es/index.scss';

import { router } from '@/router';
import './analytics';

import App from './App.vue';
import { useTheme } from '@opensig/opendesign';

const app = createApp(App);
useTheme();

app.use(router);

app.mount('#app');
