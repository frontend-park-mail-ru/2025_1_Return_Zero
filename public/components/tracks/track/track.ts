import './track.scss';
import './track.precompiled.js';

import { convertDuration } from 'utils/durationConverter';

// @ts-ignore
Handlebars.registerPartial('track', Handlebars.templates['track.hbs']);
// @ts-ignore
Handlebars.registerHelper('add', (a, b) => a + b);
// @ts-ignore
Handlebars.registerHelper('convertDuration', (a) => convertDuration(a));
