import { describe, it } from 'vitest';
import { defineCustomRender } from './defineFormComponent';
import { h } from 'vue';

describe('defineFormComponent', () => {
  describe('defineCustomRender', () => {
    it('should create a custom render component', () => {
      // const CustomComponent = defineCustomRender<{ test: string }>((props) => {
      //   return () => h('div', null, []);
      // });
      console.log('CustomComponent');
    });
  });
});
