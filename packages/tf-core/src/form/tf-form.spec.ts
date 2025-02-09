import { describe, expect, expectTypeOf, it } from 'vitest';
import { defineFormComponent } from './tf-form';
import { TfFormColumnBase } from './types';
import { h } from 'vue';
import { mount } from '@vue/test-utils';
export interface TfFormColumnTest<T> extends TfFormColumnBase<T> {
  /**
   * 自定义渲染
   */
  type: "test";
  props?: {
    foo: string;
  }
}

declare module "./types" {
  export interface TfFormColumnMap<T> {
    test: TfFormColumnTest<T>;
  }
}
const Test = defineFormComponent<"test">((props, ctx) => {
  const isView = props.isView;
  const foo = props.column.props?.foo;
  return () => h("div", `${isView} ${foo}`);
});

describe('defineFormComponent', () => {
  it("it should define a vue component with correct props", () => {
    expectTypeOf(defineFormComponent).toBeFunction();
    const wrapper = mount(Test, {
      props: {
        column: {
          type: "test",
          props: {
            foo: "bar"
          }
        },
        isView: false
      }
    })

    expect(wrapper.html()).toBe("<div>false bar</div>");
  })
});
