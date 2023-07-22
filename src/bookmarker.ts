// This script is a work in progress

import bookmarks from "../data/bookmarks.json" assert { type: "json" };

type Collection = { title: string; contents: Bookmark[] };
type Bookmark = { href: string; label: string };

bookmarks.forEach((item: Collection) => {
  console.log(item.title);

  item.contents.forEach((bookmark: Bookmark) => {
    console.log(`${bookmark.label}\n`);
  });
});
