import React, { useState, useEffect } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { Button, Table, TableBody, TableCell, TableHead, TableRow } from '@aws-amplify/ui-react';
import { listCars } from '../graphql/queries'; // Import the GraphQL query
import { deleteCar } from '../graphql/mutations'; // Import the GraphQL mutations
import CreateCar from './CreateCar';
import { GraphQLResult } from '@aws-amplify/api';

interface Car {
  id: string;
  name: string;
  color: string;
  description: string;
  code: string;
}

const Home: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cars, setCars] = useState<Car[]>([]);
  const [carToUpdate, setCarToUpdate] = useState<Car | null>(null);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const response = await API.graphql(graphqlOperation(listCars));
      const responseData = response as GraphQLResult<{ listCars: { items: Car[] } }>;
      setCars(responseData.data?.listCars.items || []);
    } catch (error) {
      console.error('Error fetching cars:', error);
    }
  };

  const openModal = (car: Car) => {
    setCarToUpdate(car);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setCarToUpdate(null);
    setIsModalOpen(false);
    fetchCars();
  };

  const handleDeleteCar = async (id: string) => {
    try {
      await API.graphql(graphqlOperation(deleteCar, { input: { id } }));
      fetchCars();
    } catch (error) {
      console.error('Error deleting car:', error);
    }
  };

  return (
    <div>
      Home
      <Button onClick={() => setIsModalOpen(true)}>Add Car</Button>

      <Table caption="" highlightOnHover={false}>
        <TableHead>
          <TableRow>
            <TableCell as="th">Name</TableCell>
            <TableCell as="th">Color</TableCell>
            <TableCell as="th">Description</TableCell>
            <TableCell as="th">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cars.map((car) => (
            <TableRow key={car.id}>
              <TableCell>{car.name}</TableCell>
              <TableCell>{car.color}</TableCell>
              <TableCell>{car.description}</TableCell>
              <TableCell>
                <Button onClick={() => openModal(car)}>Edit</Button>
                <Button onClick={() => handleDeleteCar(car.id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <CreateCar isOpen={isModalOpen} onClose={closeModal} carToUpdate={carToUpdate} />

      <div>
        
      </div>
    </div>
  );
};

export default Home;
