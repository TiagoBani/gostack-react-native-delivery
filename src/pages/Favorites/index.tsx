import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { Image } from 'react-native';

import api from '../../services/api';
import formatValue from '../../utils/formatValue';

import {
  Container,
  Header,
  HeaderTitle,
  FoodsContainer,
  FoodList,
  Food,
  FoodImageContainer,
  FoodContent,
  FoodTitle,
  FoodDescription,
  FoodPricing,
} from './styles';

interface Food {
  id: number;
  name: string;
  description: string;
  price: number;
  thumbnail_url: string;
  formattedPrice: string;
}

const Favorites: React.FC = () => {
  const [favorites, setFavorites] = useState<Food[]>([]);
  const navigation = useNavigation();

  useEffect(() => {
    async function loadFavorites(): Promise<void> {
      const { data } = await api.get<Food[]>('favorites');
      data.map(favorite => {
        const formattedPrice = formatValue(favorite.price);
        Object.assign(favorite, { formattedPrice });
        return favorite;
      });
      setFavorites(data);
    }

    loadFavorites();
  }, []);

  const handleNavigateFood = useCallback(
    (id: number) => {
      navigation.navigate('FoodDetails', { id });
    },
    [navigation],
  );
  return (
    <Container>
      <Header>
        <HeaderTitle>Meus favoritos</HeaderTitle>
      </Header>

      <FoodsContainer>
        <FoodList
          data={favorites}
          keyExtractor={item => String(item.id)}
          renderItem={({ item }) => (
            <Food
              activeOpacity={0.6}
              onPress={() => handleNavigateFood(item.id)}
            >
              <FoodImageContainer>
                <Image
                  style={{ width: 88, height: 88 }}
                  source={{ uri: item.thumbnail_url }}
                />
              </FoodImageContainer>
              <FoodContent>
                <FoodTitle>{item.name}</FoodTitle>
                <FoodDescription>{item.description}</FoodDescription>
                <FoodPricing>{item.formattedPrice}</FoodPricing>
              </FoodContent>
            </Food>
          )}
        />
      </FoodsContainer>
    </Container>
  );
};

export default Favorites;
