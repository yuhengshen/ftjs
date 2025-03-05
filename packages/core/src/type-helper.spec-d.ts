import { describe, it, expectTypeOf } from "vitest";
import {
  RecordPath,
  Refs,
  SplitEventKeys,
  TupleKeys,
  Unref,
  Unrefs,
  ValueOf,
  WithLengthKeys,
} from "./type-helper";
import { ComputedRef, MaybeRef, Ref } from "vue";

describe("type-helper", () => {
  it("RecordPath", () => {
    type Obj = {
      a: number;
      b: {
        c: string;
        d: {
          e?: boolean;
        };
      };
    };

    expectTypeOf<RecordPath<Obj>>().toEqualTypeOf<
      "a" | "b" | "b.c" | "b.d" | "b.d.e"
    >();
  });

  it("ValueOf", () => {
    type Obj = {
      a: number;
      b: {
        c: string;
      };
    };

    expectTypeOf<ValueOf<Obj>>().toEqualTypeOf<number | { c: string }>();
  });

  it("Unref", () => {
    type T1 = Unref<Ref<number>>;
    type T2 = Unref<MaybeRef<number>>;

    expectTypeOf<T1>().toEqualTypeOf<number>();
    expectTypeOf<T2>().toEqualTypeOf<number>();
  });

  it("Unrefs", () => {
    type Obj = {
      a: Ref<number>;
      b: {
        c: Ref<string>;
      };
      d: number;
      e?: Ref<boolean>;
      f: MaybeRef<string>;
    };

    expectTypeOf<Unrefs<Obj>>().toEqualTypeOf<{
      a: number;
      b: { c: Ref<string> };
      d: number;
      e?: boolean;
      f: string;
    }>();
  });

  it("Refs", () => {
    type Obj = {
      a: Ref<number>;
      b: ComputedRef<string>;
      c: { c1: Ref<string> };
    };

    type T1 = Refs<Obj>;

    expectTypeOf<T1>().toEqualTypeOf<{
      a: Ref<number>;
      b: ComputedRef<string>;
      c: MaybeRef<{ c1: Ref<string> }>;
    }>();
  });

  it("TupleKeys", () => {
    type Obj = {
      a: number;
      b: { c: string };
    };

    expectTypeOf<TupleKeys<Obj>["length"]>().toEqualTypeOf<2>();
  });

  it("WithLengthKeys", () => {
    type Obj = {
      a: number;
      b: { c: string };
    };

    expectTypeOf<WithLengthKeys<Obj>>().toEqualTypeOf<
      ("a" | "b")[] & { length: 2 }
    >();
  });

  it("SplitEventKeys", () => {
    type Obj = {
      name: string;
      onClick: () => void;
    };
    expectTypeOf<SplitEventKeys<Obj>>().toEqualTypeOf<
      {
        onClick?: () => void;
      } & {
        name: ComputedRef<string>;
      }
    >();
  });
});
