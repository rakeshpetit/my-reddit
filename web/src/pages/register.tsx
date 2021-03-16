import { Button } from "@chakra-ui/button";
import { FormErrorMessage } from "@chakra-ui/form-control";
import { FormLabel, FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Box } from "@chakra-ui/layout";
import { Formik, Form } from "formik";
import InputField from "../components/InputField";
import Wrapper from "../components/Wrapper";

interface RegisterProps {}

export const Register: React.FC<RegisterProps> = ({}) => {
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={(values) => {
          console.log(values);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="username"
              placeholder="username"
              label="Username"
            />
            <Box mt={4}>
              <InputField
                name="password"
                placeholder="password"
                type="password"
                label="Password"
              />
            </Box>
            <Button
              mt={4}
              isLoading={isSubmitting}
              backgroundColor="teal"
              type="submit"
            >
              Register
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default Register;
