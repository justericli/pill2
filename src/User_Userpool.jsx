import { CognitoUserPool } from "amazon-cognito-identity-js";

const poolData = {
  UserPoolId: "us-east-1_zBOyMr7hs",
  ClientId: "474p9bsq38phlbsk6rq0rak8d1",
};

export default new CognitoUserPool(poolData);
