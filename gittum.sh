#!/bin/sh

# A git commit formatter and branch deleter CLI
# Dependencies: https://github.com/charmbracelet/gum

# check for dependencies
if ! $(command -v gum >/dev/null 2>&1); then
  echo "please install gum to use this script:\nbrew install gum"
  return
fi

set_prefix()
{
  NEW_PREFIX=$(gum input  --placeholder "choose a new prefix")

  if [ $NEW_PREFIX ]; then
    PREFIX=$NEW_PREFIX
    export GITTUM_PREFIX="$PREFIX"
  fi
}

set_id()
{
  NEW_ID=$(gum input --placeholder "choose a new id")

  if [ $NEW_ID ]; then
    ID=$NEW_ID
    export GITTUM_ID="$ID"
  fi
}

make_commit()
{
  COMMIT_MESSAGE="$(gum input --placeholder "enter commit message")"

  if [ $COMMIT_MESSAGE ]; then
    gum confirm "Commit with message: [$PREFIX-$ID] $COMMIT_MESSAGE" && git commit -m "[$PREFIX-$ID] $COMMIT_MESSAGE"
  fi
}

delete_branches()
{
  CURRENT_BRANCH=$(git branch --show-current)
  for branch in $(gum choose --cursor-prefix "[ ] " --selected-prefix "[✓] " --no-limit $(git for-each-ref --format='%(refname:short)' refs/heads)); do
    if [ $branch = $CURRENT_BRANCH ]; then
      echo "Cannot delete $branch as it is the current branch"
    else
      gum confirm "Delete branch: $branch" && git branch -D "$branch"
    fi
  done
}

# set constants
GUM_INPUT_CURSOR_FOREGROUND="#fb4f14"
GUM_INPUT_PROMPT_FOREGROUND="#002244"
GUM_INPUT_PROMPT="> "

ID=$GITTUM_ID
PREFIX=$GITTUM_PREFIX

SET_NEW_ID="set new id"
SET_NEW_PREFIX="set new prefix"
DELETE_BRANCHES="delete some branches"

# main
if [ -z $ID ]; then set_id; fi
if [ -z $ID ]; then return; fi

if [ -z $PREFIX ]; then set_prefix; fi
if [ -z $PREFIX ]; then return; fi

while [ true ]; do
  TYPE=$(gum choose "commit using [$PREFIX-$ID]" "$SET_NEW_ID" "$SET_NEW_PREFIX" "$DELETE_BRANCHES")

  if [ -z $TYPE ]; then break;
  elif [ $TYPE = $SET_NEW_ID ]; then set_id;
  elif [ $TYPE = $SET_NEW_PREFIX ]; then set_prefix;
  elif [ $TYPE = $DELETE_BRANCHES ]; then delete_branches;
  else make_commit; fi
done
