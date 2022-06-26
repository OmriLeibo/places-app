import React from "react";
import SingleUser from "./SingleUser";
import "./UsersList.css";

const UsersList = (props) => {
  if (props.items.length === 0) {
    return (
      <div className="center">
        <h3>No Users Found</h3>
      </div>
    );
  }
  return (
    <ul className="users-list">
      {props.items.map((user) => (
        <SingleUser
          key={user.id}
          id={user.id}
          name={user.name}
          image={user.image}
          placeCount={user.places.length}
        />
      ))}
    </ul>
  );
};

export default UsersList;
