import { Table } from "https://deno.land/x/cliffy@v1.0.0-rc.2/table/mod.ts";
import { Command } from "https://deno.land/x/cliffy@v1.0.0-rc.2/command/mod.ts";
import { Input } from "https://deno.land/x/cliffy@v1.0.0-rc.2/prompt/mod.ts";
import { tty } from "https://deno.land/x/cliffy@v1.0.0-rc.2/ansi/tty.ts";
import { colors } from "https://deno.land/x/cliffy@v1.0.0-rc.2/ansi/colors.ts";
import bookmarks from "../data/bookmarks.json" assert { type: "json" };

const title = colors.bold.bgBrightGreen.black;

type Collection = { title: string; contents: Bookmark[] };
type Bookmark = { href: string; label: string };

await new Command()
  .name("Bookmarker")
  .version("0.1.0")
  .description("Recall your bookmarks from the command line.")
  .parse(Deno.args);

tty.cursorSave
  .cursorHide
  .cursorTo(0, 0)
  .eraseScreen();

const filterString: string = await Input.prompt({
  message: `Filter: `,
  suggestions: bookmarks.map((item: Collection) => item.title)
});


bookmarks.forEach((item: Collection) => {
  if (item.title.toLowerCase().includes(filterString.toLowerCase())) {
    console.log(title(item.title));

    new Table()
      .header(["Label", "URL"])
      .body(item.contents.map((bookmark: Bookmark) => [bookmark.label, bookmark.href]))
      .minColWidth([20, 30])
      .maxColWidth([20, 30])
      .padding(1)
      .indent(2)
      .border()
      .render();
  }
});