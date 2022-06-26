import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router';

import Input from '../../shared/FormElements/Input';
import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/FormElements/Button/Button/Button';
import ErrorModal from '../../shared/FormElements/ErrorModal';
import LoadingSpinner from '../../shared/FormElements/LoadingSpinner';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from '../../shared/util/validators (1)';
import { useForm } from '../../shared/hooks/useForm';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/AuthContext';
import './Places.css';

const UpdatePlace = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedPlaces, setLoadedPlaces] = useState();
  const [updateMessage, setUpdateMessage] = useState();
  const placeId = useParams().placeId;
  const navigate = useNavigate();

  const [formState, inputChangeHandler, setFormData] = useForm(
    {
      title: {
        value: '',
        isValid: false,
      },
      description: {
        value: '',
        isValid: false,
      },
    },
    false
  );

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`
        );
        setLoadedPlaces(responseData.place);
        setFormData(
          {
            title: {
              value: responseData.place.title,
              isValid: true,
            },
            description: {
              value: responseData.place.description,
              isValid: true,
            },
          },
          true
        );
      } catch (err) {}
    };
    fetchPlace();
  }, [sendRequest, placeId, setFormData]);

  const placeUpdateHandler = async (event) => {
    event.preventDefault();
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`,
        'PATCH',
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
        }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token,
          //Adding the auth for updating place
        }
      );
      setUpdateMessage(responseData.message);
      navigate('/' + auth.userId + '/places');
      console.log(formState);
    } catch (err) {}
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!loadedPlaces && !error) {
    return (
      <div className="center">
        <Card>
          <h3>Could not find place...</h3>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <h3>{updateMessage}</h3>
      {!isLoading && loadedPlaces && (
        <form className="place-form" onSubmit={placeUpdateHandler}>
          <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid title"
            onInput={inputChangeHandler}
            initialValue={loadedPlaces.title}
            initialValid={true}
          />
          <Input
            id="description"
            element="textarea"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorText="Please enter a valid description"
            onInput={inputChangeHandler}
            initialValue={loadedPlaces.description}
            initialValid={true}
          />
          <Button type="submit" disabled={!formState.isValid}>
            UPDATE PLACE
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default UpdatePlace;
