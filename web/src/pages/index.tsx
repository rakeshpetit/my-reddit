import { Link, Stack } from "@chakra-ui/layout";
import { withUrqlClient } from "next-urql";
import Layout from "../components/Layout";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import NextLink from "next/link";
import React from "react";
import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";

const Index = () => {
  const [{ data, fetching }] = usePostsQuery({
    variables: {
      limit: 10,
    },
  });

  if(!fetching && !data) {
    return <div>Your query failed for some reason</div>
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
          {data!.posts.map((p) => (
            <Box p={5} key={p.id} shadow="md" borderWidth="1px">
              <Heading fontSize="xl">{p.title}</Heading>
              <Text mt={4}>{p.textSnippet}</Text>
            </Box>
          ))}
        </Stack>
      )}
      {data && (
        <Flex mt="4">
          <Button backgroundColor="messenger.100" my={4} m="auto">
            Load more...
          </Button>
        </Flex>
      )}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
