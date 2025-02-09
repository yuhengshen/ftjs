import { describe, expectTypeOf, it } from 'vitest';
import { defineFormComponent } from './tf-form';

describe('defineFormComponent', () => {
  describe('defineFormComponent', () => {
    it("props type", () => {
      expectTypeOf(defineFormComponent).toBeFunction();
    })
    it('should create a custom render component', () => {
      console.log('CustomComponent');
    });
  });
});
