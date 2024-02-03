import e, { Router } from "express";
import axios from "axios";

const auth = Router();

//// if authorization is required from server side only
// auth.get("/authorize", (req, res) => {
//   const redirectURL = `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&scope=repo`;
//   res.redirect(redirectURL);
// });

auth.get("/callback", (req, res) => {
  const tokenURL = `https://github.com/login/oauth/access_token?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&code=${req.query.code}`;
  axios
    .post(tokenURL, null, {
      headers: {
        accept: "application/json",
      },
    })
    .then((response) => {
      const token = response?.data?.access_token;
      if (!token) {
        res.send("Token not found");
      }else{
        res.redirect(process.env.AFTER_AUTHORIZED_REDIRECT_URL);
      }
    })
    .catch((error) => {
      res.send(error);
    });
});

export default auth;
