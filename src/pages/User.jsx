import { useParams } from "react-router-dom";

const User = () => {
  const { username } = useParams();
  return <div>{username}</div>;
};

export default User;
