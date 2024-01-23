import * as yup from "yup";

const passwordRule = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

export const signUpSchema = yup.object().shape({
  username: yup.string().min(2).required("Required!"),
  email: yup
    .string()
    .email("Please, enter a valid email")
    .required("Required!"),
  password: yup
    .string()
    .min(6)
    .matches(passwordRule, {
      message:
        "Create a strong password(contained atleast one upper & lower case)",
    })
    .required("Required!"),
  confirmPassword: yup
    .string()
    .oneOf(
      [yup.ref("password"), null],
      "confirm password must match with password!"
    )
    .required("Required!"),
});
