import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { NextWordInput } from "./NextWordInput";

export default {
  title: "NextWordInput",
  component: NextWordInput,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: "center",
  },
} as ComponentMeta<typeof NextWordInput>;

const Template: ComponentStory<typeof NextWordInput> = (args) => (
  <NextWordInput {...args} />
);

export const Hidden = Template.bind({});
Hidden.args = {
  hidden: true,
};
export const Error = Template.bind({});
Error.args = {
  invalid: true,
};

export const AcceptsInput = Template.bind({});
AcceptsInput.args = {
  invalid: false,
  onChange: (value) => console.log(value),
};
