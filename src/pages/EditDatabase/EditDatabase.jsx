import { CategoriesList } from '../../components/CategoriesList/CategoriesList.jsx';
import { Paper } from '../../components/Paper/Paper.jsx';
import { useState } from 'react';
import { Button } from '../../components/Button/Button.jsx';
import { ModalWindow } from '../../components/ModalWindow/ModalWindow.jsx';
import { ENDPOINTS } from '../../api/endpoints.js';
import { EditableProductCard } from './components/EditableProductCard.jsx';
import { useForm } from 'react-hook-form';
import { Input } from '../../components/Input/Input.jsx';
import { OverlayLoader } from '../../components/OverlayLoader/OverlayLoader.jsx';
import { useMutation, useQueryClient } from 'react-query';
import { axiosInstance } from '../../api/axiosConfig.js';
import { SelectInput } from '../../components/SelectInput/SelectInput.jsx';
import { useCategoriesQuery, useProductsQuery } from '../../api/hooks.js';

export const EditDatabase = () => {
  const { register, handleSubmit } = useForm();
  const [productFilter, setProductFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [deletableProduct, setDeletableProduct] = useState(null);

  const { data: productsData } = useProductsQuery();
  const { data: categoriesData } = useCategoriesQuery();

  const client = useQueryClient();

  const { mutate: addProductMutation } = useMutation({
    mutationFn: (newProduct) => axiosInstance.post(ENDPOINTS.PRODUCTS, newProduct),
    onSuccess: () => client.invalidateQueries([ENDPOINTS.PRODUCTS])
  });

  const { mutate: deleteProductMutation } = useMutation({
    mutationFn: (_id) => axiosInstance.delete(ENDPOINTS.PRODUCTS, { data: { _id } }),
    onSuccess: () => client.invalidateQueries([ENDPOINTS.PRODUCTS]),
  });

  const categoriesOptions = categoriesData?.map(({ name, _id }) => ({ value: _id, label: name }));


  const openDeleteModalWindow = (product) => {
    if (!product) return;

    setDeletableProduct(product);
  };

  const addProduct = async (data) => {
    await addProductMutation(data);
    setIsAddProductModalOpen(false);
  };

  const deleteProduct = async () => {
    const { _id } = deletableProduct;

    if (!_id) return;

    await deleteProductMutation(_id);
    setDeletableProduct(null);
  };

  const filteredProducts = productsData?.filter(({ name }) => name.toLowerCase().includes(productFilter.toLowerCase()));

  return (
    <>
      <OverlayLoader show={false} />
      <h1>Edit database</h1>
      <div className="flex gap-10 mt-10 min-h-[500px]">
        <div className="flex flex-col gap-3">
          <Input onChange={(event) => setCategoryFilter(event.target.value)} />
          <Paper className="w-[200px] grow bg-primary p-4 shrink-0">
            <CategoriesList filter={categoryFilter} />
          </Paper>
        </div>
        <div className="flex flex-col gap-3 grow">
          <div className="flex gap-4">
            <Input className="grow" onChange={(event) => setProductFilter(event.target.value)} />
            <Button onClick={() => setIsAddProductModalOpen(true)}>Add product</Button>
          </div>
          <Paper className="grow">
            <ul
              className="w-full gap-2 grid 2xl:grid-cols-8 xl:grid-cols-6 lg:grid-cols-4 sm:grid-cols-3 bg-primary rounded-xl">
              {filteredProducts?.map((product) => (
                <EditableProductCard
                  name={product?.name}
                  img={product?.img}
                  key={product?._id}
                  openDeleteModalWindow={() => openDeleteModalWindow(product)}
                />
              ))}
            </ul>
          </Paper>
        </div>
      </div>
      <ModalWindow isOpen={isAddProductModalOpen}>
        <Paper className="w-[600px]">
          <form className="w-full flex flex-col gap-3" onSubmit={handleSubmit(addProduct)}>
            <h2>Add product</h2>
            <Input placeholder="Name" {...register('name', { required: true })} />
            <Input placeholder="Image" />
            <SelectInput options={categoriesOptions} />
            <div className="flex justify-center gap-4">
              <Button type="submit">Add product</Button>
              <Button onClick={() => setIsAddProductModalOpen(false)}>Cancel</Button>
            </div>
          </form>
        </Paper>
      </ModalWindow>
      <ModalWindow isOpen={!!deletableProduct}>
        <Paper className="w-[600px] flex flex-col gap-3 items-center">
          <h6>Do you really want to delete this product?</h6>
          <div className="flex gap-3">
            <Button onClick={deleteProduct}>Yep</Button>
            <Button onClick={() => setDeletableProduct(null)} color="error">Nope</Button>
          </div>
        </Paper>
      </ModalWindow>
    </>
  );
};