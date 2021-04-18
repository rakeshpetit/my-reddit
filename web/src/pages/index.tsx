import { Link, Stack } from "@chakra-ui/layout";
import { withUrqlClient } from "next-urql";
import Layout from "../components/Layout";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import NextLink from "next/link";
import React, { useState } from "react";
import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 15,
    cursor: null as null | string,
  });
  const [{ data, fetching }] = usePostsQuery({
    variables,
  });


  if (!fetching && (!data?.posts)) {
    return <div>Your query failed for some reason</div>;
  }

  return (
    <Layout>
      <Flex mb="4" align="center">
        <Heading>My Reddit</Heading>
        <NextLink href="/create-post">
          <Link ml="auto">Create post</Link>
        </NextLink>
      </Flex>
      {!data && fetching ? (
        <div>Loading...</div>
      ) : (
        <Stack spacing={8}>
          {data!.posts.posts.map((p) => (
            <Flex p={5} key={p.id} shadow="md" borderWidth="1px">
              <Flex
                direction="column"
                justifyContent="center"
                alignItems="center"
                mr={4}
              >
                <ChevronUpIcon size="24px" />
                {p.points}
                <ChevronDownIcon size="24px" />
              </Flex>
              <Box>
                <Heading fontSize="xl">{p.title}</Heading>
                <Text>Posted by {p.creator.username}</Text>
                <Text mt={4}>{p.textSnippet}</Text>
              </Box>
            </Flex>
          ))}
        </Stack>
      )}
      {data && data.posts.hasMore && (
        <Flex mt="4">
          <Button
            onClick={() => {
              setVariables({
                limit: variables.limit,
                cursor: data.posts.posts[data.posts.posts.length - 1].createdAt,
              });
            }}
            backgroundColor="messenger.100"
            my={4}
            m="auto"
          >
            Load more...
          </Button>
        </Flex>
      )}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
