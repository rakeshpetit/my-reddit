import React, { useState } from "react";
import { Flex, IconButton } from "@chakra-ui/react";
import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import Wrapper from "./Wrapper";
import { PostSnippetFragment, useVoteMutation } from "../generated/graphql";

interface UpdootSectionProps {
  post: PostSnippetFragment;
}

export const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
  const [, vote] = useVoteMutation();
  const [loadingState, setLoadingState] = useState<
    "upvote-loading" | "downvote-loading" | "not-loading"
  >("not-loading");
  return (
    <Flex direction="column" justifyContent="center" alignItems="center" mr={4}>
      <IconButton
        onClick={async () => {
          if (post.voteStatus === 1) {
          } else {
            setLoadingState("upvote-loading");
            await vote({
              postId: post.id,
              value: 1,
            });
            setLoadingState("not-loading");
          }
        }}
        backgroundColor={post.voteStatus === 1 ? "green" : undefined}
        aria-label="Upvote post"
      >
        <ChevronUpIcon />
      </IconButton>
      {post.points}
      <IconButton
        onClick={async () => {
          if (post.voteStatus === -1) {
          } else {
            setLoadingState("downvote-loading");
            await vote({
              postId: post.id,
              value: -1,
            });
            setLoadingState("not-loading");
          }
        }}
        backgroundColor={post.voteStatus === -1 ? "red" : undefined}
        aria-label="Downvote post"
      >
        <ChevronDownIcon />
      </IconButton>
    </Flex>
  );
};

export default Wrapper;
