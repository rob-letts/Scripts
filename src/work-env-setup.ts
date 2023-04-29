import { load } from "https://deno.land/std@0.185.0/dotenv/mod.ts";

const env = await load();
const fileOnePath = env[`FILE_ONE_PATH`];
const fileOneTarget = env[`FILE_ONE_TARGET`];
const fileOnePatch = env[`FILE_ONE_PATCH`];
const fileTwoPath = env[`FILE_TWO_PATH`];
const fileTwoTarget = env[`FILE_TWO_TARGET`];
const fileTwoPatch = env[`FILE_TWO_PATCH`];

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
  path: fileOnePath,
  target: fileOneTarget,
  patch: fileOnePatch
});

patchFile({
  path: fileTwoPath,
  target: fileTwoTarget,
  patch: fileTwoPatch
})
