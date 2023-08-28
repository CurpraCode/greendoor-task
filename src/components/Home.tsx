import React, { useState, useEffect } from 'react';
import { API } from 'aws-amplify';
import CreateCar from './CreateCar';
import { Button, Table, TableBody, TableCell, TableHead, TableRow } from '@aws-amplify/ui-react';

interface Car {
  id: string;
  name: string;
  color: string;
  description: string;
  code:''
}

const Home: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cars, setCars] = useState<Car[]>([]);
  const [carToUpdate, setCarToUpdate] = useState<Car | null>(null);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = () => {
    API.get('carhouse', '/cars/name', {})
  .then((response) => {
    // Process the retrieved data from the API response
    console.log(response);
  })
  .catch((error) => {
    // Handle error
    console.error('Error fetching data:', error);
  });
    // try {
    //   const response = await API.get('carhouse', '/cars/name', {headers: {}});
    //   setCars(response);
    //   console.log(response)
    // } catch (error) {
    //   console.error('Error fetching cars:', error);
    // }
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

  const deleteCar = async (id: string) => {
    try {
      await API.del('carhouse', `/cars/${id}`, {});
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
                <Button onClick={() => deleteCar(car.id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <CreateCar isOpen={isModalOpen} onClose={closeModal} carToUpdate={carToUpdate} />
    </div>
  );
};

export default Home;
