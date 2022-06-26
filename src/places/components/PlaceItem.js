import React from 'react';
import { useState, useContext } from 'react';
import { Rating } from 'react-simple-star-rating';

import Button from '../../shared/FormElements/Button/Button/Button';
import Modal from '../../shared/components/UIElements/Modal';
import Card from '../../shared/components/UIElements/Card';
import Map from '../../shared/components/UIElements/Map';
import ErrorModal from '../../shared/FormElements/ErrorModal';
import LoadingSpinner from '../../shared/FormElements/LoadingSpinner';
import { AuthContext } from '../../shared/context/AuthContext';
import { useHttpClient } from '../../shared/hooks/http-hook';
import './PlaceItem.css';

const PlaceItem = (props) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const [rating, setRating] = useState(0);
  const [showMap, setShowMap] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const openMapHandler = () => setShowMap(true);

  const closeMapHandler = () => setShowMap(false);

  const ratingHandler = (rate) => {
    setRating(rate);
  };

  const showDeleteWarningHandler = () => {
    setShowDeleteModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowDeleteModal(false);
  };

  const confirmDeleteHandler = async () => {
    setShowDeleteModal(false);
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/places/${props.id}`,
        'DELETE',
        null,
        { Authorization: 'Bearer ' + auth.token } // Auth for deleting place
      );
      props.onDelete(props.id);
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={props.address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
      >
        <div className="map-container">
          <Map center={props.coordinates} zoom={16} />
        </div>
      </Modal>
      <Modal
        show={showDeleteModal}
        onCancel={cancelDeleteHandler}
        header={`Deleting ${props.title}?`}
        footerClass="place-item__modal-actions"
        footer={
          <React.Fragment>
            <Button primary onClick={cancelDeleteHandler}>
              CANCEL
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              DELETE
            </Button>
          </React.Fragment>
        }
      >
        <p>Are you sure you want to delete this place?</p>
      </Modal>
      <li className="place-item">
        <Card className="place-item__content">
          {isLoading && <LoadingSpinner asOverlay />}
          <div className="place-item__image">
            <img
              src={`${process.env.REACT_APP_ASSET_URL}/${props.image}`}
              alt={props.title}
            />
          </div>
          <div className="place-item__info">
            <h3>{props.title}</h3>
            <h4>{props.address}</h4>
            <p>{props.description}</p>
            <Rating onClick={ratingHandler} ratingValue={rating} />
          </div>
          <div className="place-item__actions">
            <Button onClick={openMapHandler}>
              VIEW ON MAP
            </Button>

            {auth.userId === props.creatorId && (
              <Button to={`/places/${props.id}`}>EDIT</Button>
            )}
            {auth.userId === props.creatorId && (
              <Button danger onClick={showDeleteWarningHandler}>
                DELETE
              </Button>
            )}
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default PlaceItem;
