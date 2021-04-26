import React from "react";
import { Flex, IconButton } from "@chakra-ui/react";
import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import Wrapper from "./Wrapper";
import { PostSnippetFragment } from "../generated/graphql";

interface UpdootSectionProps {
  post: PostSnippetFragment;
}

export const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
  return (
    <Flex direction="column" justifyContent="center" alignItems="center" mr={4}>
      <IconButton onClick={() => {}} aria-label="Upvote post">
        <ChevronUpIcon />
      </IconButton>
      {post.points}
      <IconButton onClick={() => {}} aria-label="Downvote post">
        <ChevronDownIcon />
      </IconButton>
    </Flex>
  );
};

export default Wrapper;
