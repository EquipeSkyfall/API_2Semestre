import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {z} from 'zod';
import FetchAllProducts from "../Hooks/Products/fetchAllProductsHook";
import { productSchema, ProductSchema } from "../components/ProductForm/ProductSchema/productSchema";
import Modal from "../components/Modal";
import { useState } from "react";

interface Product extends ProductSchema{
    id: number;
}


const schema = z.object({
    email:z.string().email(),
    name: z.string().min(1),
    age: z.preprocess(
        (age) => (age === "" ? undefined : Number(age)), // Ensure empty string becomes undefined and valid number
        z.number().min(1, "Age must be at least 1").optional() // Optional number validation
      ),

});

// type zodSchema = z.infer<typeof ProductSchema>; //this is for the TS intelisense

const ShowProducs: React.FC =() =>{
    const { data: products, isLoading, isError, error, refetch } = FetchAllProducts();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    

    const handleEdit = (product:Product) =>{
        setEditingProduct(product)
        setIsModalOpen(true);
    }
    
    
    
    return(
        <>
        <h1> TESTE DE FORMULÁRIO</h1>
        <ul className="flex flex-col">
        {products?.map((product:Product)=> (
            <li key={product.id}> 
                <span>{product.product_name}</span>
                <button onClick={() => handleEdit(product)}>        TESTE
                </button>
            </li>
        ))}


        </ul>
<Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        
{editingProduct ? (
    <div>
      <h2>Editing Product: {editingProduct.product_name}</h2>
      <ul>
        {Object.entries(editingProduct).map(([fieldName, fieldValue]) => (
          <li key={fieldName}>
            <strong>{fieldName}: </strong>  {String(fieldValue)}
          <input placeholder={fieldValue}/>
          </li>
        ))}
      </ul>
    </div>
  ) : (
    <p>No product selected</p>
  )}
</Modal>

        </>
    )
}




export default function Teste(){
    const {register,formState: {errors},handleSubmit,setValue} = useForm<Product>({resolver: zodResolver(productSchema),  defaultValues: product})
    const onSubmit = (data:Product) => console.log(data)

    useEffect(() => {
        for (const key in product) {
            setValue(key as keyof Product, product[key]); // Type assertion here
        }
    }, [product, setValue]);

    return(
        <div>
        <ShowProducs/>
        <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
            <input
            {...register('email')}
            placeholder="email"
            />
             {errors.email && <p style={{ color: 'red' }}>{errors.email.message}</p>}
            <input
            {...register('name')}
            placeholder="name"
            />
             {errors.name && <p style={{ color: 'red' }}>{errors.name.message}</p>}
            <input
            {...register('age')}
            placeholder="age"
            type='number'
            min='1'
            />
             {errors.age && <p style={{ color: 'red' }}>{errors.age.message}</p>}

<button className="border border-black" type="submit">HIHI</button>

        </form>

            </div>
    )
}
