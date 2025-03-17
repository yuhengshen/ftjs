import { reactive } from "vue";
import { FtAntdFormColumn } from "@ftjs/antd";
import { UploadFile, UploadProps } from "ant-design-vue";
import { RecordPath } from "@ftjs/core";
import { delay, merge } from "es-toolkit";
import { PlusOutlined } from "@ant-design/icons-vue";

interface CreateUploadImageOptions<UploadData extends Record<string, any>> {
  props?: UploadProps;
  slots?: Record<string, any>;
  field?: RecordPath<UploadData>;
  fields?: RecordPath<UploadData>[];
  title: string;
  value?: string | string[];
}

interface UploadResponse {
  id: number;
  name: string;
  uri: string;
  url: string;
}

const mockUpload = async (_formData: FormData) => {
  await delay(1000);
  const now = Date.now();
  return {
    url: `https://placehold.co/400x400?text=${now}`,
  };
};

export default function createUploadImage<
  UploadData extends Record<string, any>,
>(options: CreateUploadImageOptions<UploadData>) {
  const maxCount = options.props?.maxCount ?? 1;

  const unResolvedMap = reactive(new Map<string, UploadFile<UploadResponse>>());

  const defaultProps: UploadProps = {
    accept: "image/*",
    name: "file",
    listType: "picture-card",
    maxCount,
    customRequest: options => {
      const { file, onSuccess, onError } = options;
      const formData = new FormData();
      formData.append("file", file);
      mockUpload(formData)
        .then(res => {
          onSuccess?.(res);
        })
        .catch(onError);
    },
  };

  const defaultSlots = {
    default: () => {
      return (
        <div>
          <PlusOutlined />
        </div>
      );
    },
  };

  const slots = merge(defaultSlots, options.slots ?? {});

  const props = merge(defaultProps, options.props ?? {});

  return {
    type: "upload",
    title: options.title,
    field: options.field,
    fields: options.fields,
    props,
    slots,
    value: options.value,
    valueGetter(v: string[]) {
      return (v || []).filter(Boolean).map(e => {
        const isUid = e.startsWith("uid:");
        const item = isUid
          ? unResolvedMap.get(e.slice(4))
          : {
              url: e,
              name: e,
              uid: e,
            };
        return item;
      });
    },
    valueSetter(val) {
      unResolvedMap.clear();
      const urls = val.map((e: UploadFile<UploadResponse>) => {
        const url = e.url ?? e.response?.url;
        if (!url) {
          unResolvedMap.set(e.uid, e);
        }
        return url ?? `uid:${e.uid}`;
      });
      return urls;
    },
  } satisfies FtAntdFormColumn<UploadData>;
}
