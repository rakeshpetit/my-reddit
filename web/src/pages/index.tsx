import { Link, Stack } from "@chakra-ui/layout";
import { withUrqlClient } from "next-urql";
import Layout from "../components/Layout";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import NextLink from "next/link";
import React from "react";
import { Box, Heading, Text } from "@chakra-ui/react";

const Index = () => {
  const [{ data }] = usePostsQuery({
    variables: {
      limit: 10,
    },
  });
  return (
    <Layout>
      <NextLink href="/create-post">
        <Link>Create post</Link>
      </NextLink>
      {!data ? (
        <div>Loading...</div>
      ) : (
        <Stack spacing={8}>
          {data.posts.map((p) => (
            <Box p={5} key={p.id} shadow="md" borderWidth="1px">
              <Heading fontSize="xl">{p.title}</Heading>
              <Text mt={4}>{p.text}</Text>
            </Box>
          ))}
        </Stack>
      )}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
