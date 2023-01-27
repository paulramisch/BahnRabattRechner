import { createRoot } from 'react-dom/client';
import React from 'react';

import Content from './content';
const title = 'React with Webpack and Babel';

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<Content />);
