import { getField, Refs, useFormItem } from "@ftjs/core";
import { registerForm, defineFormItem, TdColumnBase } from "@ftjs/tdesign";
import {
  Upload,
  UploadProps,
  FormItem,
  ImageViewer,
  Button,
} from "tdesign-vue-next";
import { toValue } from "vue";

interface FtFormColumnUpload<_FormData extends Record<string, any>>
  extends TdColumnBase<_FormData> {
  /**
   * 文件上传
   */
  type: "upload";
  props?: Refs<UploadProps>;
}

declare module "@ftjs/tdesign" {
  export interface RegisterColumnMap<FormData extends Record<string, any>> {
    upload: FtFormColumnUpload<FormData>;
  }
}

let hasRegisterUpload = false;

export default function register() {
  if (hasRegisterUpload) {
    return;
  }
  hasRegisterUpload = true;
  registerForm(
    "upload",
    defineFormItem<FtFormColumnUpload<any>>(props => {
      const { valueComputed } = useFormItem({ props });
      return () => {
        return (
          <FormItem
            label={toValue(props.column.title)}
            name={getField(props.column)}
          >
            {props.isView ? (
              <div>
                {valueComputed.value?.length > 0 ? (
                  // 按照业务，自行实现预览
                  <ImageViewer
                    images={valueComputed.value.map(item => item.url)}
                  >
                    {{
                      trigger: ({ open }) => {
                        return (
                          <Button onClick={open}>
                            {valueComputed.value.length}个文件, 点击预览
                          </Button>
                        );
                      },
                    }}
                  </ImageViewer>
                ) : (
                  "-"
                )}
              </div>
            ) : (
              <Upload
                v-model:files={valueComputed.value}
                accept="image/*"
                action="https://service-bv448zsw-1257786608.gz.apigw.tencentcs.com/api/upload-demo"
                {...props.unrefsProps}
              />
            )}
          </FormItem>
        );
      };
    }),
  );
}
