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
  defaultBlockSpecs,
  insertOrUpdateBlock,
} from "@blocknote/core";
import {
  createReactInlineContentSpec,
  SuggestionMenuController,
  createReactBlockSpec,
} from "@blocknote/react";
import "mathlive";
import { useRef, useEffect, useState } from "react";
import { HiOutlineGlobeAlt } from "react-icons/hi";

// MathLive block component
function MathLiveBlock({ latexFormula, style, contentRef }) {
  const [value, setValue] = useState(latexFormula);

  return (
    <math-field
      onInput={(evt) => setValue(evt.target.value)}
      style={style}
      className={"inline-content"}
      ref={contentRef}
    >
      {value}
    </math-field>
  );
}

const mathLiveBlock = createReactBlockSpec(
  {
    type: "mathblock",
    propSchema: {
      textAlignment: "center",
      textColor: defaultProps.textColor,
      latexFormula: { default: "" },
      style: { default: "display: block" },
    },
    content: "inline",
  },
  {
    render: (props) => <MathLiveBlock {...props} />,
  }
);
const mathLiveInline = createReactInlineContentSpec(
  {
    type: "inlinemath",
    propSchema: {
      latexFormula: { default: "" },
      style: { default: "" },
    },
    content: "styled",
  },
  {
    render: (props) => <MathLiveBlock {...props} />,
  }
);

const getMathMenuItems = (editor) => {
  return [
    {
      title: "inline math",
      onItemClick: () => {
        editor.insertInlineContent([
          {
            type: "inlinemath",
          },
          " ", // add a space after mathlive block
        ]);
      },
      icon: <HiOutlineGlobeAlt size={18} />,
      subtext: "Used to insert a inline region to input math formula.",
    },
    {
      title: "math block",
      onItemClick: () => {
        insertOrUpdateBlock(editor, {
          type: "mathblock",
        });
      },
      aliases: ["mm", "mathblock"],
      icon: <HiOutlineGlobeAlt size={18} />,
      subtext: "Used to insert a block to input math formula.",
    },
  ];
};

// Create schema with custom MathLive block
const schema = BlockNoteSchema.create({
  inlineContentSpecs: {
    ...defaultInlineContentSpecs,
    inlinemath: mathLiveInline,
  },
  blockSpecs: {
    ...defaultBlockSpecs,
    mathblock: mathLiveBlock,
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
      {
        type: "mathblock",
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
