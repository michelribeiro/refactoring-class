import { Header } from '../../components/Header';
import { Food } from '../../components/Food';
import { ModalAddFood } from '../../components/ModalAddFood';
import { ModalEditFood } from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

import api from '../../services/api';
import { useEffect, useState } from 'react';

interface FoodItem {
  id: number;
  name: string;
  description: string;
  price: string;
  available: boolean;
  image: string;
}

export function Dashboard() {

  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [editingFood, setEditingFood] = useState<FoodItem>({} as FoodItem);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    async function fetchApiFoods() {
      const response = await api.get('/foods');
      setFoods(response.data)
    }
    fetchApiFoods();
  }, [])

  async function handleAddFood(foodInput: FoodItem) {
    const response = await api.post('/foods', {
      ...foodInput,
      available: true,
    });

    const { food } = response.data;
    setFoods([
      ...foods,
      food
    ])


  }

  async function handleUpdateFood(foodInput: FoodItem) {

    const foodUpdated = await api.put(
      `/foods/${editingFood.id}`,
      { ...editingFood, ...foodInput },
    );

    const foodsUpdated = foods.map(f =>
      f.id !== foodUpdated.data.id ? f : foodUpdated.data,
    );

    setFoods(foodsUpdated);

  }

  async function handleDeleteFood(id: number) {
    await api.delete(`/foods/${id}`);
    const foodsFiltered = foods.filter(food => food.id !== id);
    setFoods(foodsFiltered);
  }

  function toggleModal() {
    setModalOpen(!modalOpen);
  }

  function toggleEditModal() {
    setEditModalOpen(!editModalOpen);
  }

  function handleEditFood(food: FoodItem) {
    setEditingFood(food);
    setEditModalOpen(true);
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  )
}
