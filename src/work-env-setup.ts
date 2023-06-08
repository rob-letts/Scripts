import { load } from "./deps.ts";

const env = await load();

type FileParameters = {
  path: string;
  target: string;
  patch: string;
};

async function patchFile({ path, target, patch }: FileParameters) {
  if (!path || !target || !patch) throw new Error(`Missing parameters`);

  const decoder = new TextDecoder(`utf-8`);
  const data = await Deno.readFile(path);
  const file = decoder.decode(data);
  await Deno.writeTextFile(path, file.replaceAll(target, patch));
}

[`FILE_ONE`, `FILE_TWO`].forEach((file) => {
  patchFile({
    path: env[`${file}_PATH`],
    target: env[`${file}_TARGET`],
    patch: env[`${file}_PATCH`],
  });
});
