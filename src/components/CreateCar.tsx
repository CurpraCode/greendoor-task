import React, { useState, useEffect } from 'react';
import {
  Button,
  SelectField,
  TextAreaField,
  TextField,
} from '@aws-amplify/ui-react';
import { API } from 'aws-amplify';

interface Car {
    id?: string;
    name: string;
    color: string;
    description: string;
    code:string
  }
  
  interface CreateCarProps {
    isOpen: boolean;
    onClose: () => void;
    carToUpdate?: Car | null;
  }

const CreateCar: React.FC<CreateCarProps> = ({ isOpen, onClose, carToUpdate }:any) => {
    const [car, setCar] = useState<Car>({
        name: '',
        color: '',
        description: '',
        code:''
      });
    
      useEffect(() => {
        if (carToUpdate) {
          setCar(carToUpdate);
        }
      }, [carToUpdate]);
    
      const colors = ['select','red', 'blue', 'green', 'white'];
      const carName = ['select','Audi', 'BMW', 'Vauxhal', 'Mercedes', 'Peugeot', 'Renault'];
    
      const handleChange = (field: keyof Car, value: string) => {
        setCar((prevCar) => ({ ...prevCar, [field]: value }));
        if (field === 'color' && value === 'red') {
          setCar((prevCar) => ({
            ...prevCar,
            description: 'the car is red',
          }));
        }
      };
    
      const handleSubmit = async () => {
        try {
          if (carToUpdate) {
            await API.put('carhouse', `/cars/${carToUpdate.id}`, {
              body: car,
            });
          } else {
            await API.post('carhouse', '/cars', {
              body: car,
            });
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
      ><h2>
        {carToUpdate ? 'Update Car' : 'Add a Car'}
      </h2>

      
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
            value={car.description}
            onChange={(e) => handleChange('description', e.target.value)}
          />
        )}
           <TextField
          label="Code"
          value={car.code}
          onChange={(e) => handleChange('code', e.target.value)}
        />
      
  
        <Button  onClick={handleSubmit}>
          {carToUpdate ? 'Update Car' : 'Create Car'}
        </Button>
        <Button onClick={onClose}>
          Cancel
        </Button>
     </div>
     </div>
           

  );
};

export default CreateCar;
