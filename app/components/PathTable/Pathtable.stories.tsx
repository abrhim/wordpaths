import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { PathTable } from "./PathTable";

export default {
  title: "PathTable",
  component: PathTable,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: "center",
  },
} as ComponentMeta<typeof PathTable>;

const Template: ComponentStory<typeof PathTable> = (args) => (
  <PathTable {...args} />
);

export const EmptyPath = Template.bind({});

export const SmallPath = Template.bind({});
SmallPath.args = {
  path: ["word", "word", "path", "path"],
};

export const LongPath = Template.bind({});
LongPath.args = {
  path: [
    "word",
    "word",
    "path",
    "path",
    "word",
    "word",
    "path",
    "word",
    "word",
    "path",
    "word",
    "word",
    "path",
    "word",
    "word",
    "path",
    "word",
    "word",
    "path",
    "word",
    "word",
    "path",
    "word",
    "word",
    "path",
    "word",
    "word",
    "path",
    "word",
    "word",
    "path",
    "word",
    "word",
    "path",
    "word",
    "word",
    "path",
  ],
};
