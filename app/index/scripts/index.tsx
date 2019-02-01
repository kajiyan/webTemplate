import * as React from 'react';
import * as ReactDOM from 'react-dom';
import styles from '../styles/index.pcss';

console.log(styles)

ReactDOM.render(
  <div className={styles.title}>test</div>,
  document.getElementById('root') as HTMLElement
);