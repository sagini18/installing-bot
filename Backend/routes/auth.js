import e, { Router } from "express";
import axios from "axios";

const auth = Router();
var token = null;
var owner;

//// if authorization is required from server side only
// auth.get("/authorize", (req, res) => {
//   const redirectURL = `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&scope=repo`;
//   res.redirect(redirectURL);
// });

auth.get("/callback", (req, res) => {
  const code = req?.query?.code;
  const tokenURL = `https://github.com/login/oauth/access_token?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&code=${code}`;
  axios
    .post(tokenURL, null, {
      headers: {
        accept: "application/json",
      },
    })
    .then((response) => {
      token = response?.data?.access_token;
      // get owner
      axios
        .get("https://api.github.com/user", {
          headers: {
            Authorization: `token ${token}`,
          },
        })
        .then((response) => {
          owner = response.data?.login;
        })
        .catch((error) => {
          console.log(error);
        });
      // end get owner
      if (token == null) {
        res.send("Token not found");
      } else {
        res.redirect(process.env.AFTER_AUTHORIZED_REDIRECT_URL);
      }
    })
    .catch((error) => {
      res.send(error);
    });
});

export { auth, token, owner };
