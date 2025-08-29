"use client";

import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import {
  BlockNoteSchema,
  defaultProps,
  defaultInlineContentSpecs,
  filterSuggestionItems,
} from "@blocknote/core";
import {
  createReactInlineContentSpec,
  SuggestionMenuController,
} from "@blocknote/react";
import "mathlive";
import { useRef, useEffect, useState } from "react";

// MathLive block component
function MathLiveBlock({ latexFormula, style }) {
  const [value, setValue] = useState(latexFormula);

  return (
    <math-field onInput={(evt) => setValue(evt.target.value)} style={style}>
      {value}
    </math-field>
  );
}

// Create custom MathLive block spec
const mathLiveBlock = createReactInlineContentSpec(
  {
    type: "mathlive",
    propSchema: {
      latexFormula: {
        default: "",
      },
      style: {
        default: "display: inline",
      },
    },
    content: "none",
  },
  {
    render: (props) => <MathLiveBlock {...props} />,
  }
);

// Create schema with custom MathLive block
const schema = BlockNoteSchema.create({
  inlineContentSpecs: {
    ...defaultInlineContentSpecs,
    mathlive: mathLiveBlock,
  },
});

export default function Editor() {
  const editor = useCreateBlockNote({
    schema,
    initialContent: [
      {
        type: "paragraph",
        content:
          "Welcome to the editor! Try adding a math expression by typing '$'.",
      },
    ],
  });

  return (
    <BlockNoteView editor={editor}>
      <SuggestionMenuController
        triggerCharacter={"$"}
        getItems={async (query) =>
          // Gets the mentions menu items
          filterSuggestionItems(getMathMenuItems(editor), query)
        }
      />
    </BlockNoteView>
  );
}

const getMathMenuItems = (editor) => {
  return [
    {
      title: "inline math",
      onItemClick: () => {
        editor.insertInlineContent([
          {
            type: "mathlive",
          },
          " ", // add a space after mathlive block
        ]);
      },
    },
    {
      title: "math block",
      onItemClick: () => {
        editor.insertInlineContent([
          {
            type: "mathlive",
            props: {
              style: "display: block",
            },
          },
          " ", // add a space after mathlive block
        ]);
      },
    },
  ];
};
