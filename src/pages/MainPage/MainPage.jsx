import { useProductsStore } from '../../store/useProductsStore.js';
import { ProductCard } from '../../components/ProductCard/ProductCard.jsx';
import { Basket } from '../../components/Basket/Basket.jsx';
import { useState } from 'react';
import { Button } from '../../components/Button/Button.jsx';
import { useQuery } from 'react-query';
import { axiosInstance } from '../../api/axiosConfig.js';
import { ENDPOINTS } from '../../constants/endpoints.js';
import { productsQueryKey } from '../EditDatabase/queries.js';

export const MainPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const selectedProducts = useProductsStore(state => state.selectedProducts);
  const toggleProduct = useProductsStore(state => state.toggleProduct);

  const { data: productsData } = useQuery({
    queryKey: productsQueryKey.all,
    queryFn: () => axiosInstance.get(ENDPOINTS.PRODUCTS),
  });

  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <Basket isModalOpen={isModalOpen} closeModal={closeModal} />
      <div className="relative">
        <div className="flex">
          <Button
            disabled={!selectedProducts.length}
            className="rounded-md px-3 py-1"
            onClick={() => setIsModalOpen(true)}>
            BASKET
          </Button>
        </div>
        <div className="grid 2xl:grid-cols-10 xl:grid-cols-8 lg:grid-cols-5 sm:grid-cols-3 gap-3 mt-5 mt">
          {productsData?.map((product) => (
            <ProductCard
              toggleProduct={() => toggleProduct(product)}
              key={product.id}
              name={product.name}
              img={product.img}
              isSelected={selectedProducts.find(({ id }) => id === product.id)}
            />
          ))}
        </div>
      </div>
    </>
  );
};