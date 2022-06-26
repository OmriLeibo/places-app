import React from "react";


import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/FormElements/Button/Button/Button";
import PlaceItem from "./PlaceItem";
import "./PlaceList.css";

const PlaceList = (props) => {
  if (props.items.length === 0) {
    return (
      <div className="place-list center">
        <Card>
          <h2>No places found. Would like to create one?</h2>
          <Button to="/places/new">Add Place</Button>
        </Card>
      </div>
    );
  }
  return (
    <ul className="place-list">
      {props.items.map((place) => (
        <PlaceItem
          key={place.id}
          id={place.id}
          image={place.image}
          title={place.title}
          description={place.description}
          address={place.address}
          stars={place.stars}
          creatorId={place.creator}
          coordinates={place.location}
          onDelete={props.onPlaceDelete}
        />
      ))}
    </ul>
  );
};

export default PlaceList;
