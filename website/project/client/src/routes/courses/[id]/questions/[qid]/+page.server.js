export const load = ({ locals }) => {
  if (!locals?.user) {
    console.log("no user");
  } else {
    console.log("yes user");
  }

  return locals;
};