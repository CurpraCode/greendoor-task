import React, { useState, useEffect } from 'react';
import {
  Button,
  SelectField,
  TextAreaField,
  TextField,
} from '@aws-amplify/ui-react';
import { API, graphqlOperation } from 'aws-amplify'; // Import 'graphqlOperation' from AWS Amplify
import { createCar, updateCar } from '../graphql/mutations'; // Import the GraphQL mutations
import { CreateCarInput, UpdateCarInput } from '../API';

interface CreateCarProps {
  isOpen: boolean;
  onClose: () => void;
  carToUpdate?: CreateCarInput | null;
}

const CreateCar: React.FC<CreateCarProps> = ({ isOpen, onClose, carToUpdate }: any) => {
  const [car, setCar] = useState<CreateCarInput>({
    name: '',
    color: '',
    description: '',
    code: '',
  });

  useEffect(() => {
    if (carToUpdate) {
      setCar(carToUpdate);
      console.log(carToUpdate)
    }
  }, [carToUpdate]);

  const colors = ['select', 'red', 'blue', 'green', 'white'];
  const carName = ['select', 'Audi', 'BMW', 'Vauxhal', 'Mercedes', 'Peugeot', 'Renault'];

  const handleChange = (field: keyof CreateCarInput, value: string) => {
    if (field === 'color' && value !== 'red') {
      setCar((prevCar) => ({
        ...prevCar,
        [field]: value,
        description: '', // Clear description when color is not red
      }));
    } else {
      setCar((prevCar) => ({ ...prevCar, [field]: value }));
    }
  };
  

  const handleSubmit = async () => {
    try {
      if (carToUpdate) {
        const input: UpdateCarInput = {
          id: carToUpdate.id,
          name: car.name,
          color: car.color,
          description: car.description,
          code: car.code,
        };
        await API.graphql(graphqlOperation(updateCar, { input }));
      } else {
        const input: CreateCarInput = {
          name: car.name,
          color: car.color,
          description: car.description,
          code: car.code,
        };
        await API.graphql(graphqlOperation(createCar, { input }));
      }
      onClose();
    } catch (error) {
      console.error('Error creating/updating car:', error);
    }
  };
  

  return (
    <div
      style={{
        display: isOpen ? 'block' : 'none',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          padding: '20px',
          backgroundColor: '#fff',
          borderRadius: '5px',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h2>{carToUpdate ? 'Update Car' : 'Add a Car'}</h2>

        <SelectField
          label="Car Name"
          value={car.name}
          onChange={(e) => handleChange('name', e.target.value)}
        >
          {carName.map((carname) => (
            <option key={carname} value={carname}>
              {carname}
            </option>
          ))}
        </SelectField>
        <SelectField
          label="Car Color"
          value={car.color}
          onChange={(e) => handleChange('color', e.target.value)}
        >
          {colors.map((color) => (
            <option key={color} value={color}>
              {color}
            </option>
          ))}
        </SelectField>
        {car.color === 'red' && (
          <TextAreaField
            label="Description"
            value={car.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
          />
        )}
        <TextField
          label="Code"
          value={car.code}
          onChange={(e) => handleChange('code', e.target.value)}
        />

        <Button onClick={handleSubmit}>
          {carToUpdate ? 'Update Car' : 'Create Car'}
        </Button>
        <Button onClick={onClose}>Cancel</Button>
      </div>
    </div>
  );
};

export default CreateCar;
