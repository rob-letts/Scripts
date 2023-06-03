const db = await Deno.openKv();

const dbKeys = ["inclusive", "quotes"];
const dbData = await db.get(dbKeys);

if (!dbData.value) {
  const { default: data } = await import("../data/inclusive-design.json", {
    assert: { type: "json" },
  });
  await db.set(dbKeys, data);
}

const { value: quotes } = dbData.value ? dbData : await db.get(dbKeys);
if (!Array.isArray(quotes) || !quotes.length) Deno.exit(1);

const randomIndex = Math.floor(Math.random() * quotes?.length);
const randomQuote = quotes[randomIndex];
const catppuccinMauve = "hsl(267, 84%, 81%)";
console.log(`%c${randomQuote}`, `color: ${catppuccinMauve}`);
