import { Box, Flex, Link } from "@chakra-ui/layout";
import NextLink from "next/link";
import { useMeQuery } from "../generated/graphql";
interface NavBarProps {}

const NavBar: React.FC<NavBarProps> = ({}) => {
  const [{ data, fetching }] = useMeQuery();
  let body = null;
  if (fetching) {
  } else if (!data?.me?.user) {
    body = (
      <>
        <NextLink href="/login">
          <Link mr={2}>Login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link>Register</Link>
        </NextLink>
      </>
    );
  } else {
    body = <Box>{data.me.user?.username}</Box>;
  }

  return (
    <Flex bg="mediumturquoise" p={4}>
      <Box ml="auto">{body}</Box>
    </Flex>
  );
};

export default NavBar