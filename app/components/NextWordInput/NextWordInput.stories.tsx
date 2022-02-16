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

export const DefaultValue = Template.bind({});
DefaultValue.args = {
  defaultValue: "bell",
};
export const Hidden = Template.bind({});
DefaultValue.args = {
  hidden: true,
};
export const Error = Template.bind({});
Error.args = {
  invalid: true,
  defaultValue: "bads",
};

export const AcceptsInput = Template.bind({});
AcceptsInput.args = {
  invalid: false,
  defaultValue: "",
  onChange: (value) => console.log(value),
};
