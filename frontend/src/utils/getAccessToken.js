import { getAuth, GoogleAuthProvider, reauthenticateWithPopup } from "firebase/auth";

export const getGoogleAccessToken = async () => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) throw new Error("No user logged in");

  const provider = new GoogleAuthProvider();
  provider.addScope('https://www.googleapis.com/auth/calendar.events');

  const result = await reauthenticateWithPopup(user, provider);
  const credential = GoogleAuthProvider.credentialFromResult(result);
  return credential.accessToken;
};

