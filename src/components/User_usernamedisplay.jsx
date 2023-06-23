const UserNameDisplay = ({ userName }) => {
  return (
    <div>
      {userName ? <p>User name: {userName}</p> : <p>Loading user name...</p>}
    </div>
  );
};

export default UserNameDisplay;
