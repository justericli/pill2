import { CognitoUserPool } from "amazon-cognito-identity-js";

const poolData = {
  UserPoolId: "us-east-1_va4DGpv2f",
  ClientId: "6ftt6df60pklceinstrrms16aq",
};

export default new CognitoUserPool(poolData);
