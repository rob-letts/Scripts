import { load } from "https://deno.land/std@0.185.0/dotenv/mod.ts";
const env = await load();

type FileParameters = {
  path: string | undefined;
  target: string | undefined;
  patch: string | undefined;
};

async function patchFile({ path, target, patch }: FileParameters) {
  if (!path || !target || !patch) {
    throw new Error(`Missing parameters`);
  }

  const decoder = new TextDecoder(`utf-8`);
  const data = await Deno.readFile(path);
  const file = decoder.decode(data);
  await Deno.writeTextFile(path, file.replaceAll(target, patch));
}

patchFile({
  path: env[`FILE_ONE_PATH`],  
  target: env[`FILE_ONE_TARGET`],
  patch: env[`FILE_ONE_PATCH`]
});

patchFile({
  path: env[`FILE_TWO_PATH`],
  target: env[`FILE_TWO_TARGET`],
  patch: env[`FILE_TWO_PATCH`]
})
