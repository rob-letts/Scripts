const db = await Deno.openKv();

async function main() {
  const runTimeData = await getInitialData();
  const options = getOptions();

  while (true) {
    console.log("\n%cLet's Gittum", "color: red");

    options.forEach((option) => console.log(option.name));
    const choice = promptUser("");

    if (isValidInput(choice, options)) {
      console.log(options[getFormattedInput(choice)].name);
      await options[getFormattedInput(choice)].fn(runTimeData);
    } else {
      console.error("Invalid input");
    }
  }
}

await main();

async function makeCommit(runTimeData: RunTimeData) {
  const commitMessage = getCommitMessage(
    promptUser("Enter your commit message: "),
    runTimeData,
  );

  const command = new Deno.Command("git", {
    args: [
      "commit",
      "-m",
      commitMessage,
    ],
    stdin: "piped",
    stdout: "piped",
  });

  const commandOutput = await command.spawn().output();
  console.log(new TextDecoder().decode(commandOutput.stdout));
}

async function deleteBranches() {
  await Promise.resolve();
  console.log("deleted some branches");
  // 4. delete branches
  // get current branch
  // get branches
  // offer selection of branches
  // for each selected branch
  // get confirmation
  // if confirmed
  // delete branch
}

async function setNewId(runTimeData: RunTimeData) {
  const id = promptUser("Enter an ID value for your commit messages");
  await db.set(getStoreKey(runTimeData, "id"), id);
  runTimeData.fields.id.value = id;
  return id;
}

async function setNewPrefix(runTimeData: RunTimeData) {
  const prefix = promptUser("Enter a prefix for your commit messages");
  await db.set(getStoreKey(runTimeData, "prefix"), prefix);
  runTimeData.fields.prefix.value = prefix;
}

function getFormattedInput(input: string) {
  return Number(input) - 1;
}

function getOptions(): Option[] {
  return [
    { name: "Update ID", fn: setNewId },
    { name: "Update Prefix", fn: setNewPrefix },
    { name: "Make Commit", fn: makeCommit },
    { name: "Delete Branches", fn: deleteBranches },
  ].map((item, index) => {
    return {
      ...item,
      name: `${index + 1}. ${item.name}`,
    };
  });
}

function getStoreKey(data: RunTimeData, field: Field) {
  return [data.libName, data.fields[field].key];
}

async function getInitialData(): Promise<RunTimeData> {
  const runTimeData: RunTimeData = {
    libName: "gittum",
    fields: {
      prefix: { value: "", key: "prefix" },
      id: { value: "", key: "id" },
    },
  };

  const { value: prefixValue } = await db.get(
    getStoreKey(runTimeData, "prefix"),
  );
  const { value: idValue } = await db.get(getStoreKey(runTimeData, "id"));

  if (!prefixValue || typeof prefixValue !== "string") {
    await setNewPrefix(runTimeData);
  } else {
    runTimeData.fields.prefix.value = prefixValue;
  }

  if (!idValue || typeof idValue !== "string") {
    await setNewId(runTimeData);
  } else {
    runTimeData.fields.id.value = idValue;
  }

  return runTimeData;
}

function promptUser(message: string): string {
  let value: string | null = "";
  while (!value) value = prompt(message);
  return value;
}

function isValidInput(input: string, options: unknown[]): boolean {
  const num = Number(input);
  return !isNaN(num) && num > 0 && num - 1 < options.length;
}

function getCommitMessage(message: string, runTimeData: RunTimeData) {
  return `[${runTimeData.fields.prefix.value}-${runTimeData.fields.id.value}] ${message}`;
}

type RunTimeData = {
  libName: string;
  fields: {
    prefix: { value: string; key: string };
    id: { value: string; key: string };
  };
};

type Option = {
  name: string;
  fn: (runTimeData: RunTimeData) => Promise<unknown> | unknown;
};

type Field = keyof RunTimeData["fields"];
