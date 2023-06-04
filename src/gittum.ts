const db = await Deno.openKv();

const { value: prefix } = await db.get(["gittum", "prefix"]);
if (!prefix) {
  const prefix = prompt("Enter a prefix for your commit messages");
  await db.set(["gittum", "prefix"], prefix);
}

const { value: id } = await db.get(["gittum", "id"]);
if (!id) {
  const id = prompt("Enter an id for your commit messages");
  await db.set(["gittum", "id"], id);
}

const { value: prefixValue } = prefix?.value
  ? prefix
  : await db.get(["gittum", "prefix"]);

const { value: idValue } = id?.value ? id : await db.get(["gittum", "id"]);

function validInput(input: string, options: string[]): boolean {
  const num = Number(input);
  return !isNaN(num) && num > 0 && num - 1 < options.length;
}

function formatInput(input: string) {
  return Number(input) - 1;
}

// TODO: add handler to call when option is chosen
const options = [
  "Update ID",
  "Update Prefix",
  "Make Commit",
  "Delete Branches",
].map((item, index) => `${index + 1}. ${item}`);

while (true) {
  console.log("%cLet's Gittum", "color: red");

  options.forEach((option) => console.log(option));
  const choice = prompt("");

  if (choice && validInput(choice, options)) {
    console.log(options[formatInput(choice)]);
  } else {
    console.error("Invalid input");
  }
}

function setNewId() {
  // 1. set new id
  // get id input
  // save id input
}

function setNewPrefix() {
  // 2. set new prefix
  // get prefix input
  // save prefix input
}

function makeCommit() {
  // 3. commit
  // get commit message
  // const commitMessage = prompt("Enter a commit message");
  // const commit = `[${prefixValue}-${idValue}] ${commitMessage}`;
  // concatenate prefix, id, and commit message
  // commit
  // exit
}

function deleteBranches() {
  // 4. delete branches
  // get current branch
  // get branches
  // offer selection of branches
  // for each selected branch
  // get confirmation
  // if confirmed
  // delete branch
}
