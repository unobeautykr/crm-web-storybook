import FilterDramaRoundedIcon from "@mui/icons-material/FilterDramaRounded";
import { UnderlineButton } from "~/components/UnderlineButton";

export default {
  title: "Component/Button/UnderlineButton",
  component: UnderlineButton,
  parameters: {
    element: true,
  },
};

const Template = (args) => <UnderlineButton {...args} />;
export const Text = Template.bind();
Text.args = {
  type: "primary",
  size: "m",
  children: "버튼명",
};

export const IconText = Template.bind();
IconText.args = {
  icon: <FilterDramaRoundedIcon />,
  type: "primary",
  size: "m",
  children: "버튼명",
};
